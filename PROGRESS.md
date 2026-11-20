# #BuildHybridAI — PROGRESS

Terakhir diperbarui: 19 Nov 2026 ~23:30 WITA (oleh agen, pekerjaan lokal lanjutan)
Status keseluruhan: **TERDAFTAR DI DEVPOST (terverifikasi 18 Nov) — BUILD + TES HIJAU — DRAF SUBMISI & NASKAH VIDEO SELESAI — BELUM ADA SUBMISI (sesuai instruksi: jangan submit tanpa persetujuan eksplisit Mas)**

---

## 0. Pembaruan 19 Nov 2026 (pekerjaan lokal, tanpa login/kredensial)

- **Pendaftaran SUDAH selesai** (lihat §1 yang sudah dikoreksi): `masboyalexandria` terdaftar & terverifikasi di halaman Participants #BuildHybridAI sejak 18 Nov 04:15 WITA. Teks lama "BELUM TERDAFTAR / terhenti di gerbang login" di bawah sudah tidak berlaku.
- **Build diuji ulang: `npm run build` LULUS** — `tsc --noEmit` bersih, Vite build sukses, output identik: `dist/index.html` 0,58 kB + `dist/assets/index-*.js` 94,57 kB (gzip 21,35 kB). String `getGenerativeModel`, `PREFER_ON_DEVICE`, `ONLY_ON_DEVICE`, `ONLY_IN_CLOUD`, `initializeDeviceModel` terkonfirmasi ada di bundle produksi (`GoogleAIBackend` = 0 hit karena identifier kelas ter-minify — wajar, bukan tree-shaking).
- **Smoke test:** `vite preview` menyajikan `dist/` — `/` HTTP 200 (title benar), aset JS HTTP 200; server dimatikan sesudahnya.
- **Tes baru ditambahkan:** `test/hybrid.test.ts` (Vitest, devDependency baru) — 5 tes kebijakan routing `chooseMode`, **5/5 lulus** via `npm test`. Script `test` ditambahkan ke `package.json`. Build tetap hijau setelah penambahan.
- **Dokumen baru:** `SUBMISSION-DRAFT.md` (teks submisi Devpost lengkap berbahasa Inggris + checklist), `VIDEO-SCRIPT.md` (shot list + narasi ≤3 menit, target 2:35–2:50), `docs/FIREBASE-SETUP.md` (langkah Firebase khusus pemilik akun + peta placeholder config), `samples/` (3 catatan contoh terukur: 531 / 531 / 1.998 char — pas dengan tiga rute demo).
- **README dipoles:** bagian "For judges — try it in 60 seconds", peta repo, perintah tes.
- **Perbaikan badge rute 20 Nov ~06:40 WITA (sesuai perintah Mas 02:55 WITA):** `src/hybrid.ts` — badge tidak lagi mengklaim ON-DEVICE dari mode yang diminta. `PREFER_ON_DEVICE` kini dicek lewat `LanguageModel.availability()`: hanya `available` yang dilabeli on-device, sisanya jujur dilabeli cloud + alasan fallback ("Gemini Nano unavailable in this browser — fell back to cloud"). `ONLY_ON_DEVICE` tetap on-device (sukses di mode itu membuktikan on-device, cloud dilarang), `ONLY_IN_CLOUD` tetap cloud. Build hijau + tes 5/5 lulus setelah perbaikan; zip test di `~/workspace/hybridscribe-test.zip` sudah dibuat ulang dengan kode ini — Mas perlu unduh ulang sebelum rekam video demo.
- **Blocker tersisa (semua butuh tangan/akun Mas):** (1) buat Firebase project + isi `.env.local` (panduan: `docs/FIREBASE-SETUP.md`), (2) uji hybrid nyata di Chrome 139+, (3) buat repo GitHub publik, (4) rekam + upload video YouTube, (5) deploy Hosting (opsional), (6) submit final Devpost — hanya dengan persetujuan eksplisit Mas.

---

## 1. Status pendaftaran

**TERDAFTAR — `masboyalexandria` terdaftar & terverifikasi di halaman Participants #BuildHybridAI pada 18 Nov 2026 04:15 WITA (solo).** Dikonfirmasi oleh agen utama; tidak ada KYC/verifikasi apa pun diminta saat pendaftaran.

<details><summary>Catatan lama (sudah teratasi — disimpan untuk jejak audit)</summary>

- Aturan resmi §5: peserta **wajib punya akun Devpost** (gratis) untuk register, lalu klik join di halaman kontes. Devpost Help Center mengonfirmasi dua langkah terpisah: (1) sign up akun Devpost, (2) register/"Join hackathon" untuk hackathon spesifik.
- Sign up Devpost tersedia via Google / GitHub / Facebook / LinkedIn / email. Jalur yang dipakai: **"Continue with GitHub" memakai akun GitHub `masboyalexandria`**.
- Saat scaffold dibuat (18 Nov dini hari) langkah ini sempat tercatat sebagai gerbang login interaktif; pendaftaran kemudian diselesaikan dan terverifikasi pada 18 Nov 04:15 WITA.

</details>

- **Tidak ada KYC/verifikasi identitas di muka** — terkonfirmasi dari teks resmi (lihat §2 di bawah). Sesuai persetujuan Mas: pendaftaran & pembangunan jalan sekarang; verifikasi hanya bila menang, dan itu langkah Mas sendiri nanti.

## 2. Ringkasan aturan resmi (dari teks Official Rules)

Sumber resmi:
- Halaman kontes: https://firebasehybridaihackathon.devpost.com/?ref_content=default&ref_feature=challenge&ref_medium=portfolio
- Official Rules: https://firebasehybridaihackathon.devpost.com/rules
- Firebase AI Logic hybrid docs: https://firebase.google.com/docs/ai-logic/hybrid-on-device-inference
- Devpost Help (beda sign-up vs register): https://help.devpost.com/article/119-registering-for-a-hackathon

Fakta kunci:
- **Sponsor/Administrator:** Google LLC (sponsor), Devpost, Inc. (administrator). Online, skill contest.
- **Pool $30.000:** Grand Prize $10.000 (1), 1st Runner Up $7.000 (1), 2nd Runner Up $4.000 (1), Best iOS $3.000, Best Android $3.000, Best Web/Chrome $3.000. Satu submisi bisa menang Grand Prize + maks. 1 kategori "Best of". Pemenang Grand/Runner-Up juga dapat interview + featured blog post.
- **Timeline persis (PT):** Submission Period **11 Nov 2026 13:30 PT – 30 Nov 2026 14:00 PT**. Judging 10 Des 09:00 PT – 16 Des 14:00 PT. Pemenang diumumkan ~21 Des 2026 12:00 PT.
  - Deadline dalam zona Mas: **30 Nov 2026 14:00 PT = 22:00 UTC = 1 Des 2026 06:00 WITA**.
- **Eligibilitas:** di atas usia mayoritas di negara domisili (20 th khusus Taiwan); **Indonesia TIDAK termasuk negara terlarang** (yang dilarang: Brazil, Italia, Quebec, Crimea, Kuba, Iran, Suriah, Korea Utara, Sudan, Belarus, Rusia + negara sanksi OFAC). Bukan karyawan Google/Devpost & keluarga intinya. Individu, tim, atau organisasi boleh.
- **Tech stack WAJIB — hybrid AI yang sesungguhnya:**
  - Aplikasi Gen AI memakai **Firebase AI Logic** (+ produk pendukung yang dianjurkan: App Check — **wajib untuk AI Logic, debug token diterima**, Remote Config, Firestore, Authentication).
  - Minimal 1 platform: **Web (Chrome): Gemini Nano 4 via Firebase AI Logic** (web app / Chrome extension) · Android: Gemini Nano 4 via Firebase AI Logic · iOS: Apple Foundation Models API via Firebase AI Logic. Multi-platform *diutamakan* untuk Grand Prize, tapi single-platform yang outstanding tetap bisa menang.
  - Boleh pakai coding tool/agent apa pun (Antigravity, Claude Code, Codex, Cursor, dll.) — aturan secara eksplisit mendorong coding agents + Firebase Agent Skills.
  - Proyek baru ATAU proyek lama yang di-update signifikan selama periode submisi (wajib ringkasan perubahan).
- **Syarat submisi (semua wajib):**
  1. Proyek berfungsi sesuai deskripsi/video, bisa diinstal & dijalankan konsisten di platformnya, tersedia **gratis** untuk judging sampai Judging Period berakhir.
  2. Pilih ≥1 platform.
  3. Deskripsi teks: cara pemakaian Firebase AI Logic + fitur/fungsi + value proposition (semua materi dalam Bahasa Inggris).
  4. **Repo publik GitHub/GitLab** berisi semua source + instruksi; **Firebase AI Logic harus benar-benar diimpor & dipanggil di runtime** (bukan cuma disebut di README); **wajib ada file lisensi open-source yang terdeteksi** di halaman repo (Apache diutamakan, lisensi OSS lain boleh).
  5. **Video demo ≤3 menit**, publik di **YouTube**, link di form submisi, Bahasa Inggris / subtitle Inggris, menampilkan proyek berfungsi di platformnya.
  6. Sangat dianjurkan (tidak wajib): URL proyek ter-hosting untuk judging/testing.
  7. Dilarang memasukkan production API keys / secrets / PII ke repo atau form.
- **Kriteria judging:** Stage 1 pass/fail kelayakan & kelengkapan. Stage 2 — 4 kriteria **bobot sama rata**, skor 1–5 per kriteria, dirata-rata:
  1. **Technological Implementation** — kualitas build & efektivitas pemakaian Firebase AI Logic hybrid inference.
  2. **Design** — pengalaman produk yang utuh & koheren, bukan sekadar PoC teknis.
  3. **Potential Impact** — kasus nyata & spesifik untuk audiens nyata, terbukti dari demo.
  4. **Quality of the Idea** — pemakaian Firebase AI Logic yang kreatif & non-obvious, pemahaman problem space.
- **Klausa pemenang — VERIFIKASI HANYA BILA MENANG (terkonfirmasi verbatim dari teks resmi):**
  - §8: *"The award of a prize to a potential winner is subject to verification of the identity, qualifications and role of the potential winner"* + **Winner Verification Requirement**: tidak ada yang resmi jadi pemenang sampai **post-competition prize affidavits** selesai & terverifikasi. Calon pemenang dinotifikasi via email, wajib merespons dalam **3 hari kerja**, dan mengembalikan Declaration of Eligibility & Liability/Publicity Release (bila diminta) dalam **10 hari kerja** atau hadiah hangus ke alternate.
  - §9C: uang hadiah dikirim (pos ke alamat / elektronik ke bank) **hanya setelah** Required Forms lengkap diterima; pengiriman ≤60 hari setelah forms diterima.
  - §10 (Fees & Taxes): pemenang wajib menyerahkan dokumentasi pajak — **IRS Form W-9 (residen AS) atau Form W-8BEN (non-AS, berlaku untuk Mas)** — pembayaran hadiah bersifat net of withholding yang diwajibkan hukum; gagal menyerahkan dokumen pajak tepat waktu = hadiah hangus.
  - **Kesimpulan: TIDAK ADA KYC, affidavit, W-8BEN, atau verifikasi identitas apa pun pada saat daftar / bangun / submit. Semua itu hanya muncul SETELAH terpilih sebagai calon pemenang.** Ini persis model "verify-only-if-you-win" yang Mas setujui. Agen tidak melakukan langkah verifikasi apa pun.
- **Google Account Quota (opsional):** kuota gratis tambahan untuk model berbilling (mis. image generation), berlaku 4 hari, 1 per entrant/project/sprint. Sprint tersisa: Sprint 2 — request s.d. **18 Nov 2026 10:00 PT**; Sprint 3 (final) — request s.d. **25 Nov 2026 10:00 PT**, akun dikirim 27 Nov. Proyek ini dirancang **tidak bergantung** pada kuota ini (text inference free tier cukup).
- **Biaya yang dikeluarkan sejauh ini: $0.** Tidak ada pembelian apa pun.

## 3. Konsep proyek: HybridScribe

**Satu kalimat:** Aplikasi web catatan privat yang meringkas **di perangkat dulu** (Gemini Nano 4, offline, gratis, tidak meninggalkan perangkat) dan hanya naik ke cloud (Gemini Flash) bila dokumennya panjang — dengan lencana transparan yang menunjukkan *di mana* AI berjalan dan *kenapa*, plus **Privacy Lock** yang melarang upload sama sekali.

**Kenapa konsep ini:**
- Menjawab contoh resmi di halaman kontes ("a notes app that summarizes on-device offline and hands long documents to the cloud") tapi menaikkan taruhannya: routing bukan otomatis-bisu, melainkan **fitur produk yang terlihat & dikontrol user** ("privacy budget").
- Audiens nyata & spesifik (Impact): jurnalis dengan catatan narasumber, pekerja lapangan/kesehatan dengan koneksi buruk, pelajar — kelompok yang catatannya sensitif *dan* sering offline (relevan untuk Indonesia).
- Realistis dibangun agen solo sebelum deadline: 1 platform (Web/Chrome), tanpa Android Studio / perangkat fisik / akun berbayar. Android/iOS = stretch, bukan syarat.

**Arsitektur singkat** (detail: `docs/ARCHITECTURE.md`):
- Vite + TypeScript web app. `src/firebase.ts` bootstrap Firebase dari env (tanpa config → DEMO MODE berlabel jelas, mock lokal deterministik).
- `src/hybrid.ts` = router + panggilan Firebase AI Logic yang sesungguhnya:
  - Privacy Lock ON → `InferenceMode.ONLY_ON_DEVICE`
  - Teks > 1.800 char (threshold Remote-Config-ready) → `InferenceMode.ONLY_IN_CLOUD` (`gemini-2.5-flash-lite`)
  - Selain itu → `InferenceMode.PREFER_ON_DEVICE`
  - Output terstruktur satu skema JSON untuk dua jalur: `responseSchema` (cloud) + `responseConstraint` (on-device) → `{summary, actionItems[], tags[]}`.
- Firebase pendukung: App Check (wajib AI Logic; debug token untuk judging), Firestore per-user (`firestore.rules` sudah ditulis), Auth anonim, Remote Config untuk threshold/model, Hosting (`firebase.json` sudah ditulis).

**Peta ke kriteria judging:** Technological Implementation = router 3-mode nyata + structured output ganda + App Check/Firestore/Remote Config · Design = badge rute + alasan + latensi sebagai UX inti, alur 1-layar yang utuh · Potential Impact = narasi privasi/offline untuk audiens bernama · Quality of Idea = "privacy budget" yang terlihat — pemakaian hybrid yang non-obvious, bukan sekadar fallback teknis.

## 4. Yang sudah dibangun (terverifikasi)

Di `~/workspace/buildhybridai/`:
- `package.json` (firebase ^12, vite ^6, typescript ^5.6; scripts dev/build/preview), `tsconfig.json`, `vite.config.ts`, `index.html`
- `src/firebase.ts` — bootstrap + deteksi DEMO MODE; `src/vite-env.d.ts` — tipe Vite env
- `src/hybrid.ts` — **impor & panggilan runtime Firebase AI Logic** (`getAI`, `getGenerativeModel`, `GoogleAIBackend`, `InferenceMode`, `Schema`), router 3-mode, `initializeDeviceModel()`, parsing aman, mock demo
- `src/main.ts` + `src/style.css` — UI berfungsi: editor catatan, toggle Privacy Lock, hasil + badge rute/alasan/latensi, escaping HTML
- `README.md` (termasuk potongan kode pemakaian AI Logic + cara run), `docs/ARCHITECTURE.md`
- `LICENSE` — **teks penuh Apache-2.0 resmi** (terunduh dari apache.org, 11.358 byte) agar terdeteksi GitHub
- `firebase.json` (Hosting → `dist/`), `firestore.rules` (per-user), `.env.example`, `.gitignore`
- **Verifikasi build (diuji ulang langsung, 18 Nov 2026): `npm run build` LULUS** — `tsc --noEmit` bersih, Vite build sukses, output `dist/index.html` (0,58 kB) + `dist/assets/index-*.js` (94,57 kB, gzip 21,35 kB). String `getGenerativeModel`, `PREFER_ON_DEVICE`, `initializeDeviceModel` terkonfirmasi ada di bundle produksi (kode AI Logic tidak ter-tree-shake). Smoke test dev server: `vite` jalan, `/` dan `/src/main.ts` membalas HTTP 200. Tanpa config Firebase, aplikasi jalan dalam DEMO MODE. (Catatan kejujuran: percobaan build pertama sempat gagal karena `node_modules` korup akibat dua instalasi bersamaan + tipe `import.meta.env` belum dideklarasikan; keduanya diperbaiki — clean reinstall + `src/vite-env.d.ts` — dan build final di atas adalah hasil verifikasi ulang dari nol.)

Belum ada: proyek Firebase nyata (butuh akun Google Mas — lihat milestone), repo GitHub publik, hosting live, video demo, submisi Devpost. **Tidak ada satu pun yang disubmit ke Devpost.**

Ditambahkan 19 Nov 2026: `test/hybrid.test.ts` (5 tes routing, lulus), `SUBMISSION-DRAFT.md`, `VIDEO-SCRIPT.md`, `docs/FIREBASE-SETUP.md`, `samples/` (3 catatan demo terukur), README dipoles (bagian judges + peta repo). Build + tes diuji ulang dan hijau (detail di §0).

## 5. Milestone menuju submisi

| Tanggal | Milestone | Pemilik |
|---|---|---|
| 18 Nov 2026 | Riset aturan + scaffold + build lulus | Agen ✅ selesai |
| 18 Nov 2026 | **Join hackathon di Devpost** — SELESAI, terverifikasi di halaman Participants 18 Nov 04:15 WITA | ✅ selesai |
| 19 Nov 2026 | Verifikasi ulang build + smoke test preview + tes unit routing (5/5) + `SUBMISSION-DRAFT.md` + `VIDEO-SCRIPT.md` + `docs/FIREBASE-SETUP.md` + `samples/` | Agen ✅ selesai |
| 19 Nov 2026 | (Opsional) Request Google Account Quota Sprint 2 — deadline 18 Nov 10:00 PT kemungkinan terlewat; tidak kritis, proyek tidak bergantung padanya | Agen (form Google) |
| 19–21 Nov 2026 | Buat Firebase project (free tier) di akun Google Mas, enable AI Logic + App Check (debug token), isi `.env.local`, uji hybrid nyata di Chrome 139+ desktop (Gemini Nano) | Agen + akses akun Google dari Mas bila diminta login |
| 21–24 Nov 2026 | Fitur lengkap: simpan catatan ke Firestore + Auth anonim, Remote Config threshold, polish UI/Design, mode Chrome-extension sebagai bonus bila waktu cukup | Agen |
| 24–25 Nov 2026 | (Opsional) Request Quota Sprint 3 — deadline 25 Nov 10:00 PT, akun dikirim 27 Nov | Agen |
| 25–27 Nov 2026 | Deploy ke Firebase Hosting (URL publik untuk judges), buat repo GitHub publik `masboyalexandria/hybridscribe` + lisensi terdeteksi, README final | Agen |
| 27–28 Nov 2026 | Rekam video demo ≤3 menit (Inggris) yang menampilkan badge ON-DEVICE vs CLOUD + Privacy Lock, upload publik ke YouTube | Agen (rekaman layar); akun YouTube Mas bila upload butuh login |
| 28–29 Nov 2026 | Draft submisi Devpost lengkap (deskripsi, link repo, link video, platform Web/Chrome) — **disimpan sebagai DRAFT** | Agen |
| **29 Nov 2026** | **LAPOR ke Mas & TUNGGU PERSETUJUAN EKSPLISIT sebelum menekan Submit** (instruksi tetap: jangan submit final tanpa melapor dulu). Buffer 1 hari penuh sebelum deadline | Agen → Mas |
| **1 Des 2026 06:00 WITA** | **DEADLINE KERAS** — 30 Nov 2026 14:00 PT | — |
| ~21 Des 2026 | Pengumuman pemenang. Bila menang: affidavit + W-8BEN + verifikasi identitas = **langkah Mas sendiri**, agen hanya menyiapkan checklist | Mas |

## 6. Risiko & catatan jujur

- Peserta terdaftar saat halaman dicek: **±2.737 participants** — kompetisi besar; proyek ini mengejar Best Web/Chrome ($3.000) sebagai target realistis, Grand Prize sebagai upside.
- Gemini Nano on-device hanya jalan di **Chrome desktop 139+**; judges yang tidak punya Nano akan melihat jalur cloud fallback — karena itu badge + Privacy Lock harus tetap meyakinkan lewat video demo.
- Pembuatan Firebase project & upload YouTube mungkin memunculkan gerbang login Google tambahan; keduanya dicatat sebagai langkah tangan Mas bila muncul, bukan alasan menghentikan build.
- $0 telah dibelanjakan; tidak ada rencana belanja. Free tier Firebase AI Logic cukup untuk cakupan proyek ini.

## 20 Nov 2026 ~01:09 WITA — Firebase console setup COMPLETE (Mas, guided)
- Project `hybridscribe` created under Mas's laptop account cryptoramone01@gmail.com; web app registered; firebaseConfig in .env.local; build green, config embedded.
- AI Logic enabled (Gemini Developer API; AI monitoring left OFF).
- reCAPTCHA Enterprise key `hybridscribe-web` created in GCP (domains: localhost, hybridscribe.web.app, hybridscribe.firebaseapp.com); site key wired into code (VITE_RECAPTCHA_ENTERPRISE_SITE_KEY) + initializeAppCheck(ReCaptchaEnterpriseProvider) added in src/firebase.ts; rebuild green (118.83 kB).
- App Check registered (Fraud Defense provider, TTL 1h) and debug token [redacted — stored in .env.local] registered in console by Mas.
- REMAINING: real hybrid test in Chrome on Mas's laptop; public GitHub repo; demo video; optional Hosting deploy; Devpost submit only with Mas's explicit approval (deadline 1 Dec 06:00 WITA).

## 20 Nov 2026 ~01:54 WITA — HYBRID TEST PASSED on Mas's laptop
- Node.js LTS installed by Mas; app running at localhost:5173, header "Firebase AI Logic: configured".
- First attempt errored: cloud model gemini-2.5-flash-lite retired for new users (404) → fixed in code to gemini-3.5-flash-lite (per the API error text), build+tests green, updated zip re-delivered.
- Second attempt: badge "Ran ON-DEVICE · 2990 ms", correct summary + 5 action items + tags for sample 01 — Gemini Nano on-device path WORKS on Mas's Chrome.
- Remaining tests: Privacy Lock sample (02) and long-document cloud sample (03).

## 20 Nov 2026 ~02:21 WITA — Hybrid test session COMPLETE (Mas's laptop)
- Sample 03 (long doc, 1,995 chars): badge "Ran in CLOUD · 2968 ms", correct summary/action items/tags — ONLY_IN_CLOUD route verified with gemini-3.5-flash-lite.
- Sample 02 (Privacy Lock, ONLY_ON_DEVICE): correctly REFUSED — "Local LanguageModel API not available in this environment (AI/api-not-enabled)". Privacy Lock never uploads: behavior proven.
- Console check by Mas: `await LanguageModel.availability()` → 'unavailable'. Gemini Nano CANNOT run on Mas's laptop (2020-era Win10 hardware). Therefore sample 01's earlier success was the CLOUD fallback, NOT on-device — the badge logic labels PREFER_ON_DEVICE runs as on-device by mode, which is misleading.
- App Check debug token confirmed live in console log.
- TODO (Maya): (1) honest badge — pre-check LanguageModel.availability(); label PREFER runs by actual route (on-device only when availability is 'available', else cloud-fallback label). (2) Public GitHub repo. (3) Demo video plan must account for no-Nano on Mas's laptop (show availability check + cloud + Privacy Lock refusal honestly, or find a Nano-capable device). (4) Submit 28–29 Nov only with Mas's approval.
