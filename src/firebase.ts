// Firebase bootstrap for HybridScribe.
// Config comes from Vite env vars (see .env.example). When no config is
// present the app runs in DEMO MODE with a local mock — this lets judges
// and developers run the UI immediately, and is clearly labelled in the UI.
// Real submissions must provide a real Firebase project with AI Logic +
// App Check enabled (debug tokens are accepted per #BuildHybridAI rules).
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

export interface FirebaseStatus {
  configured: boolean;
  app: FirebaseApp | null;
}

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined,
};

export function initFirebase(): FirebaseStatus {
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) {
    return { configured: false, app: null };
  }
  const app = initializeApp(cfg);
  initAppCheck(app);
  return { configured: true, app };
}

// App Check protects the AI Logic (cloud) calls. Uses the reCAPTCHA
// Enterprise provider with the site key from env; a registered debug token
// (accepted for hackathon submissions) can be supplied via env for local
// and judging runs. Failure here must never break app startup — the
// on-device path does not depend on App Check at all.
function initAppCheck(app: FirebaseApp): void {
  const siteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY as
    | string
    | undefined;
  const debugToken = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN as
    | string
    | undefined;
  if (debugToken) {
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string })[
      "FIREBASE_APPCHECK_DEBUG_TOKEN"
    ] = debugToken;
  }
  if (!siteKey) return;
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    // App Check unavailable (e.g. blocked script) — cloud calls may fail,
    // but the app and its on-device mode keep working.
  }
}
