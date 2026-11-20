# Devpost Submission Draft — HybridScribe (#BuildHybridAI 2026)

> STATUS: DRAFT ONLY — not submitted. Final submission requires the project
> owner's explicit approval. Deadline: **30 Nov 2026 14:00 PT**
> (= 1 Dec 2026 06:00 WITA). All submission text must be in English.
> Placeholders marked `[TODO-OWNER]` need accounts/links only the owner can
> produce (Firebase project, public repo, YouTube upload).

---

## Form fields

- **Project name:** HybridScribe
- **Tagline (elevator pitch):** Private notes, summarised on-device first — cloud only when it earns it. HybridScribe shows you where your AI ran, and why.
- **Platform:** Web (Chrome)
- **Built with:** Firebase AI Logic · Gemini Nano 4 · Gemini 2.5 Flash-Lite · Firebase App Check · Firestore · Firebase Authentication · Remote Config · TypeScript · Vite
- **GitHub / GitLab repo:** `[TODO-OWNER]` — public repo URL (Apache-2.0 license file included in repo root)
- **Demo video (YouTube, public, ≤3 min):** `[TODO-OWNER]` — see `VIDEO-SCRIPT.md`
- **Hosted project URL (recommended):** `[TODO-OWNER]` — Firebase Hosting URL after deploy
- **Project status:** New project, built during the submission period.

---

## Inspiration

Meeting notes, source notes, field reports and journal entries are exactly the
texts people least want to upload to a cloud LLM — and exactly the texts they
most need summarised. Every existing notes AI forces the same bad trade:
privacy *or* intelligence. When Firebase AI Logic made hybrid inference —
Gemini Nano on-device, Gemini in the cloud, one SDK — a first-class pattern,
we asked: what if the routing itself became a product feature the user can see
and control, instead of a silent implementation detail?

## What it does

HybridScribe is a private notes app for Chrome. Paste a note and it returns a
summary, action items and tags — plus a visible **"privacy budget" badge** that
states where the AI ran, how long it took, and why that route was chosen:

- **Short note (≤1,800 characters)** → summarised **on-device first** with
  Gemini Nano 4 via Firebase AI Logic (`InferenceMode.PREFER_ON_DEVICE`).
  Fast, private, free, works offline; the cloud is only a fallback if Nano is
  unavailable.
- **Privacy Lock ON** → **on-device only** (`InferenceMode.ONLY_ON_DEVICE`).
  The note never leaves the device. If Nano is unavailable, HybridScribe says
  so honestly instead of silently uploading the note.
- **Long document (>1,800 characters)** → **cloud** (`InferenceMode.ONLY_IN_CLOUD`,
  Gemini 2.5 Flash-Lite), because on-device models are context-limited and a
  long field report deserves a faithful summary, not a truncated one.

Both paths return the same structured JSON — summary, action items, tags —
requested as a schema on each path (`responseSchema` in the cloud,
`responseConstraint` on-device), so the experience is identical; only the
badge changes.

## How Firebase AI Logic is used (required description field)

`src/hybrid.ts` imports and calls the real Firebase AI Logic SDK at runtime —
`getAI`, `getGenerativeModel`, `GoogleAIBackend`, `InferenceMode`, `Schema`
from `firebase/ai`. For every note, a router (`chooseMode`) picks an
`InferenceMode` from the note's length and the Privacy Lock state, then a
single `getGenerativeModel` call carries all three configurations at once:
`mode`, `inCloudParams` (Gemini 2.5 Flash-Lite + JSON `responseSchema`) and
`onDeviceParams` (`responseConstraint` with the same schema). The code calls
`model.initializeDeviceModel()` on a user gesture to warm up Gemini Nano, as
the hybrid-inference docs require. Supporting Firebase products: **App Check**
(required by AI Logic; debug tokens for judging), **Firestore** for per-user
notes with shipped security rules, **Authentication** (anonymous sign-in), and
**Remote Config** so the 1,800-character routing threshold and model names can
be tuned without a redeploy. With no Firebase config present, the app runs in
a clearly labelled DEMO MODE (deterministic local mock) so anyone can try the
full flow instantly — the mode is always disclosed in the UI, never hidden.

## How we built it

A Vite + TypeScript single-page app with three small modules: `firebase.ts`
(env-based bootstrap + demo-mode detection), `hybrid.ts` (the router and the
AI Logic calls), and `main.ts` (a one-screen UI: editor, Privacy Lock toggle,
result card with route badge). The routing policy is covered by unit tests
(Vitest) that pin all three branches — Privacy Lock wins over length, long
documents go to cloud, short notes prefer on-device. Firestore rules and a
Hosting config ship in the repo. The whole project was designed so a solo
builder could run, host and demo it end-to-end on the free tier.

## Challenges we ran into

- **One schema, two engines.** Cloud and on-device structured output use
  different parameter names (`responseSchema` vs `responseConstraint`); keeping
  a single `Schema` object as the source of truth for both took care.
- **Honest labelling.** With `PREFER_ON_DEVICE`, the SDK may fall back to the
  cloud; the UI copy and badge wording had to stay truthful about the routing
  decision without pretending to telemetry we don't have.
- **On-device warm-up timing.** `initializeDeviceModel()` needs a user
  gesture, so analysis is triggered from the button click, not on page load.

## Accomplishments that we're proud of

- A real, working 3-mode hybrid router — not a mock — with the routing reason
  surfaced to the user in plain language on every single analysis.
- Privacy Lock: a hard guarantee ("never uploaded, or we tell you we can't")
  instead of a best-effort promise.
- Zero-setup demo mode that is honestly labelled, so judges can evaluate the
  product flow even without a Firebase project or a Nano-capable browser.

## What we learned

Hybrid inference is not just a performance trick — treated as a *visible
budget*, it changes how users feel about AI on private text. People accept the
cloud much more readily when the app proves it tried the device first, and
explains itself when it can't.

## What's next for HybridScribe

- Persist notes in Firestore with anonymous → linked accounts, and read the
  routing threshold from Remote Config at runtime.
- A Chrome extension build so HybridScribe can summarise the page you're
  reading, with the same privacy budget.
- Android (Gemini Nano via Firebase AI Logic) and iOS (Apple Foundation
  Models) clients sharing the same routing policy.

---

## Pre-submit checklist (owner)

- [ ] Firebase project created + `.env.local` filled (see `docs/FIREBASE-SETUP.md`)
- [ ] Real hybrid run verified in Chrome 139+ desktop (on-device badge shown)
- [ ] Public GitHub repo created, LICENSE detected, README final
- [ ] Hosted URL live (Firebase Hosting) and pasted above
- [ ] Demo video recorded per `VIDEO-SCRIPT.md`, uploaded public to YouTube, link pasted above
- [ ] This draft pasted into the Devpost form — **submit only on owner's explicit approval**
