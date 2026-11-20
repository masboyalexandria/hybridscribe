# HybridScribe — Architecture (short)

```
User (Chrome desktop)
  └─ Vite + TypeScript web app (this repo)
       ├─ src/firebase.ts  — Firebase app bootstrap from env config;
       │                     no config → DEMO MODE (labelled local mock)
       ├─ src/hybrid.ts    — ROUTER + Firebase AI Logic calls
       │     chooseMode(text, privacyLock):
       │       privacyLock        → InferenceMode.ONLY_ON_DEVICE
       │       len > threshold    → InferenceMode.ONLY_IN_CLOUD
       │       otherwise          → InferenceMode.PREFER_ON_DEVICE
       │     getGenerativeModel(ai, { mode, inCloudParams, onDeviceParams })
       │     structured output: responseSchema (cloud) /
       │                        responseConstraint (on-device), same Schema
       └─ src/main.ts      — UI: note editor, Privacy Lock toggle,
                             result + route badge (where / why / latency)

Firebase project (to be created by owner, free tier):
  AI Logic (Gemini Developer API backend) · App Check (required; debug
  token for judging) · Firestore (users/{uid}/notes, rules shipped) ·
  Auth (anonymous) · Remote Config (threshold + model names) ·
  Hosting (firebase.json shipped, serves dist/)
```

Design choices:
- **Web/Chrome first**: only platform an agent can build, host and demo
  end-to-end solo before 30 Nov; Android/iOS are stretch goals, not required
  (rules: at least one platform; multi-platform only *preferred* for Grand Prize).
- **One schema, two engines**: identical JSON contract on-device and in cloud
  keeps UI code path single and makes the route invisible except for the badge.
- **Honesty by default**: demo mode and routing reasons are surfaced in the UI;
  no silent cloud upload when Privacy Lock is on.
