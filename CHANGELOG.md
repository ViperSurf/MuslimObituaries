# Changelog — Al-Baqaa (Muslim Obituaries)

## V3.0.2 — 2026-11-17 · Submit section fully translated

- **The Submit an obituary section (`#/submit`) is now fully translated
  in all six languages.** Root cause: every form field label existed
  only in the English dictionary (all other languages fell back to
  English), and the V3 form/photo-intake/success-panel copy was
  hard-coded English. All field labels, the photo-intake panel, the
  essentials/optional sections, error messages, the success panel, and
  even the WhatsApp/email submission message now use the language
  dictionaries — verified: every language now has all 167 keys, zero
  fallbacks. The stale pre-V3 `submit_sub` translations (which claimed
  submissions "appear immediately on this device") were also corrected
  to describe the review flow.

## V3.0.1 — 2026-11-17 · Checklist correction: debts come early

- **"When a loved one passes" checklist (`#/checklist`):** settling the
  deceased's debts and obligations is now its own early step — before
  the Janazah prayer step (before the funeral prayer if possible; some
  scholars say before the washing, at the latest before the burial),
  including the bridge of an heir or another person taking
  responsibility for / guaranteeing the debt when the estate is not
  immediately available. The closing "Afterwards" item no longer lists
  debts; it now covers the wasiyyah and estate distribution, which come
  after debts. Corrected in all six languages, per the source the owner
  supplied (ash-Shafi'i, Ahmad, at-Tirmidhi from Abu Hurayrah). The
  ordering rule is recorded in a comment at the top of
  `src/data/checklist.ts`.

## V3.0 — 2026-11-16 · Grief-first: prayer guide, photo intake, review queue

- **How to Pray Janazah** (`#/pray`): animated step-by-step guide (SVG
  figure, play/pause, keyboard, all-steps and print views) in all six
  site languages, with a school-of-thought selector (Hanafi, Shafi'i,
  Maliki, Hanbali) that adjusts the differing points, and a standing
  "follow the imam" note. Linked from every obituary page.
- **Separate public and admin UIs:** the public site no longer links the
  admin panel, the changelog, the database file or the API anywhere.
  The admin workspace (`#/admin`, direct address only — see README)
  has its own shell and four sections: Review Queue, Photo Intake,
  Listings, Publish.
- **Changelog is this file only.** The in-app changelog page, its route
  and its links are removed.
- **Photo-first submission:** a photo of a notice/flyer is read by OCR
  on the reviewer's own device (tesseract.js, loaded on demand; the
  image is never uploaded) and drafted into fields — name, dates,
  Janazah time, mosque, cemetery — with anything unread left blank for
  a human, never guessed. Admins publish from the photo in Photo
  Intake; the public submit form offers the same pre-fill.
- **Pending review + Option A publishing:** public submissions are
  `pending`, never live directly. The submitter receives a submission
  packet (WhatsApp / email / file / copy) to send to an admin; the
  admin imports it into the Review Queue, approves it, exports the
  updated `database.json` and publishes it by committing the file.
  Records gained a `status` field (pending/published/rejected) in the
  data model and the OpenAPI contract, shaped for a future hosted
  backend.
- **Submit form cut to five essentials** with everything else optional,
  on-device draft autosave, and portrait upload (downscaled on device).
- **Announcement builder:** every obituary can copy a ready-made
  WhatsApp announcement and download a generated announcement image.
- **"When a loved one passes"** (`#/checklist`): a calm first-24-hours
  checklist in all six languages.
- **Accessibility:** skip-to-content link, visible keyboard focus,
  darker muted text (WCAG AA), A+ large-text toggle, reduced-motion
  support, announced form errors, ≥44px targets, sticky mobile Janazah
  bar (time · directions · calendar) on upcoming obituaries, and a
  per-obituary "report an error / request removal" link.

## V2.0.2 — 2026-11-11 · Server-ready data layer
- Scholars collection narrowed to one verified passing: Sheikh Abdul
  Aziz ibn Baz (d. 13 May 1999).
- The sample obituary's Janazah rolls forward daily, so the
  upcoming-Janazah features always have a live example.
- Server mode: build with `VITE_API_URL` to run the same frontend
  against a real API; a zero-dependency reference server ships in
  `server/server.mjs` implementing the full OpenAPI contract.
- Admin panel shows a short test-deployment note about the
  database-file backend and the server option.


## V2.0.1 — 2026-11-11 · Polish
- Community listings replaced with clearly anonymized sample
  placeholders (no photographs, no fictional people as real passings).
- New emblem: gold crescent and star on deep emerald (site icon,
  header mark, share-preview image).
- Admin panel copy rewritten in product wording; changelog entry
  titles made consistent.


## V2.0 — 2026-11-11 · The merge
The two Al-Baqaa builds finished together: the original feature-rich
August 2026 build merged into the deployed codebase.

- **Merged features from the original build:** portrait photos, Hijri
  passing dates, Azza condolence windows with visitation details,
  multiple Sadaqah Jariyah projects per obituary with direct donation
  links, condolences with relationship + Arabic dua snippets +
  per-message dua counts, rich dua templates (Arabic / transliteration
  / English), vendor ratings, reviews, services and verified badges,
  region + year filters, quick-dua from the feed, 4-step submission
  wizard with tip jar.
- **Shared dynamic database:** all records live in one public
  `public/data/database.json` loaded by every visitor (footer links to
  it). Updates are published by committing a new file.
- **Admin panel** (`#/admin`): demo passcode gate, moderation
  (verify/delete), stats, database export/import.
- **Six languages:** English, العربية, اردو, বাংলা, Español, हिन्दी,
  with RTL layout for Arabic/Urdu.
- **Three themes:** Emerald (original), White, Black.
- **Sharing:** Web Share API + copy-link per obituary; Open Graph /
  Twitter preview cards.
- **Verified notable passings (Sunni scholars):** Ibn Baz (d. 1999),
  al-Albani (d. 1999), Ibn Uthaymeen (d. 2001), Muqbil al-Wadi'i
  (d. 2001), Wahbah al-Zuhayli (d. 2015), Saleh al-Luhaydan (d. 2022),
  Yusuf al-Qaradawi (d. 2022) — dates checked against published sources.
- **Directory:** Google Maps direction links on every listing.
- Changelog page in-app (`#/changelog`).

## V1.1 — 2026-11-10 · First deployed build
React 18 + TypeScript + Vite + TailwindCSS v4 on GitHub Pages (Actions
CI/CD). Listings + filters, 3-step submission portal, Janazah Maps
links + .ics export, Memory Wall, dua counter, Sadaqah tracker, Janazah
alerts, vendor directory, OpenAPI 3.0 contract served from the app.

## V1.0 — 2026-08-09 · Original build
Initial platform from the original spec: rich obituary profiles,
tip jar, Janazah logistics with Maps + .ics, Memory Wall, Sadaqah
Jariyah causes, Janazah alerts, verified funeral-services directory.
