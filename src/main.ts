import "./style.css";
import { initFirebase } from "./firebase";
import { analyzeNote, type Analysis } from "./hybrid";

const status = initFirebase();

const appEl = document.querySelector<HTMLDivElement>("#app")!;
appEl.innerHTML = `
  <header>
    <h1>HybridScribe</h1>
    <p class="tagline">Private notes, summarised on-device first. Cloud only when it earns it.</p>
    <p class="mode">${status.configured ? "Firebase AI Logic: configured" : "DEMO MODE — add Firebase config in .env.local to use real Firebase AI Logic hybrid inference"}</p>
  </header>
  <main>
    <label for="note">Your note</label>
    <textarea id="note" rows="10" placeholder="Paste meeting notes, field notes, a study passage…"></textarea>
    <label class="lock"><input type="checkbox" id="privacyLock" /> Privacy Lock — on-device only, never upload this note</label>
    <button id="analyze">Analyse with hybrid AI</button>
    <section id="result" aria-live="polite"></section>
  </main>
  <footer><small>Built for #BuildHybridAI 2026 · Firebase AI Logic · Gemini Nano 4 (on-device) + Gemini Flash (cloud)</small></footer>
`;

const noteEl = document.querySelector<HTMLTextAreaElement>("#note")!;
const lockEl = document.querySelector<HTMLInputElement>("#privacyLock")!;
const resultEl = document.querySelector<HTMLElement>("#result")!;

document.querySelector("#analyze")!.addEventListener("click", async () => {
  const text = noteEl.value.trim();
  if (!text) { resultEl.textContent = "Paste a note first."; return; }
  resultEl.textContent = "Thinking — on-device first…";
  try {
    const a: Analysis = await analyzeNote(status.app, text, lockEl.checked);
    resultEl.innerHTML = `
      <div class="badge badge-${a.route}">${a.route === "demo" ? "DEMO (local mock)" : a.route === "on-device" ? "Ran ON-DEVICE" : "Ran in CLOUD"} · ${a.latencyMs} ms</div>
      <p class="reason">${escapeHtml(a.reason)}</p>
      <h2>Summary</h2><p>${escapeHtml(a.summary)}</p>
      ${a.actionItems.length ? `<h2>Action items</h2><ul>${a.actionItems.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : ""}
      ${a.tags.length ? `<p class="tags">${a.tags.map((t) => `#${escapeHtml(t)}`).join(" ")}</p>` : ""}
    `;
  } catch (err) {
    resultEl.textContent = `Could not analyse: ${err instanceof Error ? err.message : String(err)}. If Privacy Lock is on and Gemini Nano is unavailable on this device, turn it off to allow cloud fallback.`;
  }
});

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
