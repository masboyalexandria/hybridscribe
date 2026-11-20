# Demo Video Script — HybridScribe (#BuildHybridAI)

> Hard limit: **≤ 3:00 minutes**, public on YouTube, English narration or
> English subtitles (official rules). Target runtime: **2:35–2:50**.
> Record at 1080p, browser zoom 110–125% so the route badge is readable.
> Sample texts live in `samples/` — paste them, don't type.

## Setup before recording (owner/account steps)

1. Chrome **139+ on desktop** (required for Gemini Nano via Firebase AI Logic).
2. Firebase project configured (`.env.local` filled — see
   `docs/FIREBASE-SETUP.md`), App Check debug token registered.
3. Run `npm run dev` (or open the hosted URL). Do one warm-up analysis off
   camera so Gemini Nano is already downloaded/warm — the first-ever
   on-device call can spend time downloading the model, which would eat the
   3-minute budget.
4. Have the three files in `samples/` open in a text editor for fast pasting.
5. Optional but strong: open DevTools → Network, filtered, in a corner —
   the Privacy Lock shot lands harder when viewers can see *no request
   leaves* during on-device analysis. Keep it small; the badge is the star.

## Shot list + narration

| # | Time | Screen action | Narration (voice-over / subtitle text) |
|---|------|---------------|------------------------------------------|
| 1 | 0:00–0:15 | Title card over the app: "HybridScribe — private notes, summarised on-device first." | "Your most sensitive notes are the ones you most need summarised — and the ones you least want to upload. HybridScribe removes that trade-off." |
| 2 | 0:15–0:50 | Paste `samples/01-short-meeting-note.txt`. Click **Analyse**. Result appears with badge **Ran ON-DEVICE**. Zoom on badge + reason + latency. | "A short meeting note. HybridScribe tries Gemini Nano on-device first — through Firebase AI Logic — and the badge proves it: ran on-device, this fast, and here's why. Summary, action items, tags — structured output, no cloud round-trip." |
| 3 | 0:50–1:35 | Clear. Paste `samples/02-sensitive-note.txt`. Tick **Privacy Lock**. Click **Analyse**. Badge: **Ran ON-DEVICE**; point at the Privacy Lock reason line (and Network panel if shown). | "Now a confidential source note. With Privacy Lock on, HybridScribe is forbidden from uploading — on-device only, guaranteed by the inference mode itself. If Nano weren't available, it would refuse rather than silently send your note to the cloud." |
| 4 | 1:35–2:15 | Clear. Paste `samples/03-long-document.txt` (1,998 chars). Click **Analyse**. Badge: **Ran in CLOUD**; read the reason line aloud via subtitle highlight. | "A long field report — over the routing threshold. On-device models are context-limited, so HybridScribe deliberately hands this one to Gemini in the cloud, and tells you exactly why. Same structured result — only the route changed." |
| 5 | 2:15–2:40 | Quick montage: the three badges side by side (scroll results / cut between shots). Show the mode line "Firebase AI Logic: configured". | "One SDK — Firebase AI Logic. Three inference modes, chosen per note. The routing isn't a silent detail; it's a privacy budget you can see and control." |
| 6 | 2:40–2:55 | End card: HybridScribe logo/title, repo URL, "Built for #BuildHybridAI". | "HybridScribe: on-device first. Cloud only when it earns it. Thank you." |

Total narration ≈ 165 words ≈ 1:10–1:20 of speech — leaves comfortable
pauses for clicks, results rendering and badge zooms inside the 3:00 cap.

## Recording notes

- If a real on-device run is not possible on recording day (no Nano-capable
  Chrome), record with DEMO MODE but **say so on screen** — the app already
  labels it; never present the mock as a real inference run.
- Keep the cursor slow and deliberate; judges scrub these videos.
- No production keys, tokens or personal data on screen. Use only the
  fictional samples in `samples/`.
- Export/upload: public (not unlisted-only if the form requires public),
  title: "HybridScribe — On-Device First Notes AI | #BuildHybridAI".
