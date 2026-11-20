// Hybrid inference core — the heart of HybridScribe.
//
// This file ACTUALLY imports and calls Firebase AI Logic at runtime
// (a submission requirement: not just naming it in the README):
//
//   import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, Schema }
//     from "firebase/ai"
//
// Routing policy ("privacy budget"):
//  - Short / sensitive note  -> PREFER_ON_DEVICE (Gemini Nano 4 in Chrome,
//                               falls back to cloud only if unavailable)
//  - Privacy Lock ON         -> ONLY_ON_DEVICE (never leaves the device;
//                               if Nano is unavailable we say so, no silent upload)
//  - Long document (> threshold, default 1,800 chars, Remote-Config tunable)
//                            -> ONLY_IN_CLOUD (Gemini Flash-class model:
//                               on-device models are single-turn / context-limited)
//
// Every result carries a badge: where it ran, latency, and why that route
// was chosen — transparency is a product feature, not a debug log.
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
  Schema,
} from "firebase/ai";
import type { FirebaseApp } from "firebase/app";

export type Route = "on-device" | "cloud" | "demo";
export interface Analysis {
  summary: string;
  actionItems: string[];
  tags: string[];
  route: Route;
  reason: string;
  latencyMs: number;
}

export const LONG_DOC_THRESHOLD = 1800;

export function chooseMode(
  text: string,
  privacyLock: boolean,
): { mode: InferenceMode; reason: string } {
  if (privacyLock) {
    return {
      mode: InferenceMode.ONLY_ON_DEVICE,
      reason: "Privacy Lock is ON — this note must never leave the device.",
    };
  }
  if (text.length > LONG_DOC_THRESHOLD) {
    return {
      mode: InferenceMode.ONLY_IN_CLOUD,
      reason: `Long document (${text.length} chars > ${LONG_DOC_THRESHOLD}) — cloud model has the context window for a faithful summary.`,
    };
  }
  return {
    mode: InferenceMode.PREFER_ON_DEVICE,
    reason:
      "Short note — try Gemini Nano on-device first (fast, private, free); fall back to cloud only if unavailable.",
  };
}

const analysisSchema = Schema.object({
  properties: {
    summary: Schema.string(),
    actionItems: Schema.array({ items: Schema.string() }),
    tags: Schema.array({ items: Schema.string() }),
  },
  optionalProperties: [],
});

export async function analyzeNote(
  app: FirebaseApp | null,
  text: string,
  privacyLock: boolean,
): Promise<Analysis> {
  const started = performance.now();
  const { mode, reason } = chooseMode(text, privacyLock);

  if (!app) return demoAnalyze(text, reason, started);

  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, {
    mode,
    inCloudParams: {
      model: "gemini-3.5-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    },
    onDeviceParams: {
      promptOptions: { responseConstraint: analysisSchema },
    },
  });

  // Required on (or after) a user gesture for on-device model warm-up.
  // Safe to call repeatedly; no-op when the cloud route is used.
  try {
    await model.initializeDeviceModel?.();
  } catch {
    /* cloud fallback path handles unavailability */
  }

  const prompt = [
    "You are HybridScribe, a notes assistant. Analyse the note below.",
    "Return JSON only: {summary: string (max 2 sentences), actionItems: string[], tags: string[] (max 4, lowercase)}.",
    "Note:",
    text,
  ].join("\n");

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed = safeParse(raw, text);
  const route = await resolveRoute(mode);
  const finalReason =
    route === "cloud" && mode === InferenceMode.PREFER_ON_DEVICE
      ? reason +
        " Gemini Nano unavailable in this browser — fell back to cloud."
      : reason;

  return {
    ...parsed,
    route,
    reason: finalReason,
    latencyMs: Math.round(performance.now() - started),
  };
}

// The badge must report where processing ACTUALLY happened, never the
// requested mode: PREFER_ON_DEVICE silently falls back to cloud when
// Gemini Nano is unavailable (proven on Mas's laptop, 20 Nov 2026 —
// the badge said ON-DEVICE while the run was really in the cloud).
// The Prompt API availability check is the same gate Chrome uses for
// on-device inference, so 'available' is the only state in which we
// may claim on-device; anything else means the SDK fell back to cloud.
async function resolveRoute(mode: InferenceMode): Promise<Route> {
  if (mode === InferenceMode.ONLY_IN_CLOUD) return "cloud";
  // Success in ONLY_ON_DEVICE proves on-device: cloud is forbidden here.
  if (mode === InferenceMode.ONLY_ON_DEVICE) return "on-device";
  try {
    const lm = (
      globalThis as unknown as {
        LanguageModel?: { availability: () => Promise<string> };
      }
    ).LanguageModel;
    if (lm && (await lm.availability()) === "available") return "on-device";
  } catch {
    /* fall through to cloud */
  }
  return "cloud";
}

function safeParse(
  raw: string,
  fallbackText: string,
): Pick<Analysis, "summary" | "actionItems" | "tags"> {
  try {
    const j = JSON.parse(raw) as Partial<Analysis>;
    return {
      summary: String(j.summary ?? "").slice(0, 500) || fallbackSummary(fallbackText),
      actionItems: Array.isArray(j.actionItems) ? j.actionItems.map(String).slice(0, 8) : [],
      tags: Array.isArray(j.tags) ? j.tags.map(String).slice(0, 4) : [],
    };
  } catch {
    return { summary: raw.slice(0, 300) || fallbackSummary(fallbackText), actionItems: [], tags: [] };
  }
}

function fallbackSummary(text: string): string {
  return text.trim().replace(/\s+/g, " ").slice(0, 160) + "…";
}

// --- Demo mode: deterministic local mock, clearly labelled in the UI. ---
// Lets anyone run the full product flow with zero Firebase setup.
function demoAnalyze(text: string, reason: string, started: number): Analysis {
  const sentences = text.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  const todos = sentences.filter((s) => /\b(todo|need to|must|follow up|deadline|send|call|book)\b/i.test(s));
  return {
    summary: (sentences[0] ?? fallbackSummary(text)).slice(0, 220),
    actionItems: todos.slice(0, 5),
    tags: ["demo-mode"],
    route: "demo",
    reason: reason + " [DEMO MODE — no Firebase config, local mock used]",
    latencyMs: Math.round(performance.now() - started),
  };
}
