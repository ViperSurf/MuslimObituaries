# Al-Baqaa — Muslim Obituaries & Janazah Notices

**Live:** https://vipersurf.github.io/MuslimObituaries/
**Repo:** https://github.com/ViperSurf/MuslimObituaries

A free Muslim obituary & memorial platform — V3 (Nov 2026) is the
grief-first release: prayer guide, photo intake, and reviewed
publishing, on the merged V2 foundation.

## V3 highlights
- **How to Pray Janazah** — animated step-by-step guide in all 6
  languages, with a school-of-thought selector (Hanafi · Shafi'i ·
  Maliki · Hanbali) and reduced-motion/keyboard/print support.
- **Separate public & admin UIs** — the public site links neither the
  admin panel nor any technical pages. The changelog lives only in
  `CHANGELOG.md`.
- **Admin workspace** (`#/admin`, direct address only — see "For
  admins" below): Review Queue, Photo Intake, Listings, Publish.
- **Photo-first submission** — OCR runs on the reviewer's own device
  (the photo is never uploaded) and drafts the fields; a human always
  checks before publishing.
- **Pending review + shared database** — public submissions start as
  `pending`, travel to an admin as a submission packet (WhatsApp /
  email / file), and are published by approving them and committing
  the exported `database.json`. Records carry a `status` field shaped
  for a future hosted backend.
- **Rich obituary profiles** — portraits, Arabic names, Hijri dates,
  Azza condolence windows, multiple Sadaqah Jariyah projects with
  donation links and progress trackers, Memory Wall with dua templates
  and per-message duas, Janazah Maps links + one-click .ics export,
  WhatsApp announcement builder + generated announcement image.
- **Verified notable passings** — a scholars collection (Sunni) with
  source-checked dates.
- **6 languages** (EN · AR · UR · BN · ES · HI, RTL for AR/UR),
  **3 themes** (Emerald · White · Black), A+ large-text mode, and
  **sharing** via Web Share API + copy-link per obituary, with Open
  Graph / Twitter preview cards.
- **Funeral-services directory** — verified listings with ratings,
  services, and Google Maps directions.

## For admins

The admin workspace is **not linked from the public site** — go to
`#/admin` directly and bookmark it. This is deliberate: grieving
visitors never need to see it, and a smaller public surface is calmer
and safer. (Hiding the link is not the security — the passcode gate
is, and a hosted backend with real logins remains the long-term plan.)

Inside: approve family submissions in the **Review Queue** (import the
packet they sent you), add an obituary from a photo of the notice in
**Photo Intake**, manage listings, then **Publish**: export
`database.json` and upload it to `public/data/database.json` in this
repository — the site redeploys itself.

## Stack
React + TypeScript + Vite + TailwindCSS v4 · GitHub Pages + GitHub
Actions CI/CD · OpenAPI 3.0 contract in `public/api/v1/openapi.json`
(the swap-in point for a future hosted backend) · service layer in
`src/services/api.ts` · canonical data in `public/data/database.json`.

## Develop
```bash
npm install
npm run dev     # local dev server
npm run build   # typecheck + production build
```

See `CHANGELOG.md` for version history.

## Server mode
The same frontend runs against a real API instead of the static
database file — the data layer (`src/services/api.ts`) switches on one
build-time variable:

```bash
npm run server                                  # reference API on http://localhost:8787
VITE_API_URL=http://localhost:8787 npm run dev  # frontend in server mode
```

`server/server.mjs` is a zero-dependency Node server implementing the
full OpenAPI contract (`public/api/v1/openapi.json`): obituaries,
condolences, duas, vendors, alert subscriptions, tips, and
passcode-gated admin operations (`x-admin-passcode` header, default
`albaqaa-admin`, override with the `ADMIN_PASSCODE` env var). Data
persists to `server/data.json`, seeded from
`public/data/database.json` on first run. Without `VITE_API_URL`, the
build stays in static mode (public database.json + browser overlays) —
which is how the GitHub Pages deployment runs.
