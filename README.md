# HybridScribe

**Private notes, summarised on-device first. Cloud only when it earns it.**

Built for **#BuildHybridAI 2026** (Google / Firebase on Devpost) — Web (Chrome) platform.

## The problem

Meeting notes, field notes, medical-adjacent notes, journal entries and source
notes are exactly the texts people least want to upload to a cloud LLM — and
exactly the texts they most need summarised. Today they must choose: privacy
*or* intelligence. Hybrid inference removes that choice.

## What it does

Paste a note and HybridScribe returns a summary, action items and tags —
and tells you **where the AI ran and why**:

| Situation | Route | Why |
|---|---|---|
| Short note (≤1,800 chars) | **On-device first** — Gemini Nano 4 via Firebase AI Logic (`PREFER_ON_DEVICE`), cloud fallback only if Nano is unavailable | Fast, private, free, works offline |
| **Privacy Lock ON** | **On-device only** (`ONLY_ON_DEVICE`) — never uploaded; if Nano is unavailable the app says so instead of silently sending it | Sensitive notes (sources, health, legal) |
| Long document (>1,800 chars) | **Cloud** (`ONLY_IN_CLOUD`, Gemini Flash-class model) | On-device models are single-turn and context-limited; long docs need the cloud context window |

That visible "privacy budget" — a badge showing `ON-DEVICE` / `CLOUD`,
latency, and the routing reason — is the product's core idea: hybrid
inference the user can *see and control*, not a silent implementation detail.

## How Firebase AI Logic is used (at runtime, not just in this README)

`src/hybrid.ts` imports and calls the real SDK:

```ts
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, Schema } from "firebase/ai";

const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, {
  mode, // PREFER_ON_DEVICE | ONLY_ON_DEVICE | ONLY_IN_CLOUD — chosen per note
  inCloudParams: { model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json", responseSchema: analysisSchema } },
  onDeviceParams: { promptOptions: { responseConstraint: analysisSchema } },
});
await model.initializeDeviceModel?.();
const result = await model.generateContent(prompt);
```

Structured output (summary / actionItems / tags) is requested as a JSON
schema on **both** paths — `responseSchema` in cloud, `responseConstraint`
on-device — so the UI never has to parse free-form text.

Also used / planned: **App Check** (required by AI Logic; debug tokens are
accepted for submissions), **Firestore** (per-user notes, rules in
`firestore.rules`), **Authentication** (anonymous → linked), **Remote Config**
(the 1,800-char routing threshold and model names are tunable without a redeploy).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the routing policy (Vitest)
npm run build      # type-check + production build to dist/
```

- **No Firebase config?** The app runs in clearly-labelled **DEMO MODE**
  (deterministic local mock) so the full flow can be tried instantly.
- **Real hybrid inference:** create a Firebase project, enable AI Logic +
  App Check, copy `.env.example` to `.env.local`, fill in the web config,
  then run in **Chrome 139+ on desktop** (required for Gemini Nano on-device).
  Step-by-step owner guide: [`docs/FIREBASE-SETUP.md`](docs/FIREBASE-SETUP.md).

### For judges — try it in 60 seconds

1. `npm install && npm run dev`, open the app (DEMO MODE is fine for the flow).
2. Paste [`samples/01-short-meeting-note.txt`](samples/01-short-meeting-note.txt) → **Analyse** → short notes prefer the on-device route.
3. Paste [`samples/02-sensitive-note.txt`](samples/02-sensitive-note.txt), tick **Privacy Lock** → on-device only, never uploaded.
4. Paste [`samples/03-long-document.txt`](samples/03-long-document.txt) (1,998 chars) → deliberately routed to the cloud, with the reason shown.

Every result shows the route badge, the routing reason, and latency — the
"privacy budget" is the feature, not a footnote.

## Repository map

```
src/firebase.ts       Firebase bootstrap from env; DEMO MODE when unconfigured
src/hybrid.ts         Router + real Firebase AI Logic calls (3 InferenceModes)
src/main.ts           One-screen UI: editor, Privacy Lock, badge + results
test/hybrid.test.ts   Routing-policy unit tests (5, all passing)
samples/              The three demo notes used above and in the video
docs/ARCHITECTURE.md  Short architecture note
docs/FIREBASE-SETUP.md  Owner steps for the real Firebase project
firestore.rules       Per-user notes rules · firebase.json — Hosting (dist/)
SUBMISSION-DRAFT.md   Devpost submission text (draft)
VIDEO-SCRIPT.md       ≤3-minute demo video shot list + narration
```

## Status

Scaffold v0.1, build + tests green — see `PROGRESS.md` for hackathon status,
official-rules summary and the milestone plan to the 30 Nov 2026 deadline.
**Not yet submitted to Devpost** (submission is a separate, owner-approved step).

## License

Apache-2.0 — see `LICENSE`.
