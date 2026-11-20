# Firebase Setup — Owner Steps (needs the owner's Google account)

> The agent cannot do these steps: creating a Firebase project requires
> signing in to the Firebase Console with the **project owner's Google
> account**. Nothing here costs money — everything is on the free (Spark)
> tier, and HybridScribe is designed to stay inside AI Logic's free quota.
> Estimated total time: **10–15 minutes**.

## Config placeholder structure (already in the repo)

- `.env.example` — the template. Copy it to `.env.local` and fill the values
  from Step 2 below. `.env.local` is git-ignored; never commit it.
- `src/firebase.ts` — reads exactly these env vars at runtime:
  `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
  `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`,
  `VITE_FIREBASE_MESSAGING_SENDER_ID`.
- `VITE_APPCHECK_DEBUG_TOKEN` — App Check debug token (Step 4).
- `firebase.json` — Hosting already points at `dist/`; `firestore.rules`
  already restricts notes to their owner. Both ship in the repo as-is.

## Step 1 — Create the project (≈3 min)

1. Go to https://console.firebase.google.com → **Add project**.
2. Name it e.g. `hybridscribe` (note the generated project ID).
3. Google Analytics: can be disabled for this project (keeps setup shorter).
4. Create project → wait for provisioning.

## Step 2 — Register the web app & get the config (≈2 min)

1. In the project overview, click the web icon **`</>`** ("Add an app → Web").
2. App nickname: `HybridScribe Web`. Tick "Also set up Firebase Hosting" if
   you want the hosted judging URL (recommended).
3. Firebase shows a `firebaseConfig` object. Copy each value into `.env.local`:

   | firebaseConfig field | .env.local variable |
   |---|---|
   | `apiKey` | `VITE_FIREBASE_API_KEY` |
   | `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `VITE_FIREBASE_PROJECT_ID` |
   | `appId` | `VITE_FIREBASE_APP_ID` |
   | `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |

   (The web config is not a secret, but keep it out of the public repo
   anyway — judges get a hosted URL, not the raw config.)

## Step 3 — Enable AI Logic (≈3 min)

1. Console → **Build → AI Logic** → Get started.
2. Choose the **Gemini Developer API** backend (free tier; no billing
   account needed for the quota HybridScribe uses).
3. This enables the APIs AI Logic needs; wait for it to finish.

## Step 4 — App Check with a debug token (≈3 min)

AI Logic requires App Check. For a hackathon submission, debug tokens are
explicitly accepted by the official rules.

1. Console → **Build → App Check** → register the web app (reCAPTCHA
   provider is fine).
2. Locally: run `npm run dev`, open the app, and in DevTools console set
   `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true` before the app loads — the
   SDK prints a debug token in the console.
   (Simpler: put any UUID in `VITE_APPCHECK_DEBUG_TOKEN` and register that
   exact value in the console under App Check → Manage debug tokens.)
3. Paste the token into `.env.local` as `VITE_APPCHECK_DEBUG_TOKEN`.

## Step 5 — Firestore + Auth (≈2 min, optional for the demo, planned features)

1. Console → **Build → Firestore Database** → Create database (production
   mode). Deploy the shipped rules: `firebase deploy --only firestore:rules`
   (needs the Firebase CLI + `firebase login` with the owner's account).
2. Console → **Build → Authentication** → enable the **Anonymous** provider.

## Step 6 — Remote Config (optional, 1 min)

Create parameters `long_doc_threshold` (default `1800`) and
`cloud_model` (default `gemini-2.5-flash-lite`) so the routing policy can be
tuned without a redeploy. The app currently ships with these defaults
hard-coded; wiring the fetch is a small follow-up in `src/hybrid.ts`.

## Step 7 — Verify the real hybrid run (owner + agent)

1. `npm run dev` in **Chrome 139+ desktop**.
2. The header must read "Firebase AI Logic: configured" (not DEMO MODE).
3. Paste `samples/01-short-meeting-note.txt` → Analyse → badge should read
   **Ran ON-DEVICE**. Then follow `VIDEO-SCRIPT.md` shots 3–4 for the
   Privacy Lock and cloud routes.

## Step 8 — Hosting (optional, for the judging URL)

```bash
npm run build
firebase deploy --only hosting
```

(`firebase login` and project selection are owner-account actions.)

---

**What stays agent-side:** all code, tests, README, submission draft, video
script, and the final Devpost form preparation. **Owner-only:** every step
above that touches the Google/Firebase account, creating the public GitHub
repo, uploading the video to YouTube, and pressing Submit on Devpost.
