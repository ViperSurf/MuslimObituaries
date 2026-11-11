# Al-Baqaa — Muslim Obituaries & Janazah Notices

**Live:** https://vipersurf.github.io/MuslimObituaries/
**Repo:** https://github.com/ViperSurf/MuslimObituaries

A free Muslim obituary & memorial platform — V2 merges the original
feature-rich build (Aug 2026) with the deployed codebase (Nov 2026).

## V2 highlights
- **Shared dynamic database** — every visitor loads the same public
  `public/data/database.json` (obituaries, condolences, vendors);
  admins export an updated file from the Admin panel and publish it by
  committing it. Visitor actions (submissions, duas, wall posts, alert
  subscriptions, tips) are LocalStorage overlays via the service layer.
- **Rich obituary profiles** — portraits, Arabic names, Hijri dates,
  Azza condolence windows, multiple Sadaqah Jariyah projects with
  donation links and progress trackers, Memory Wall with dua templates
  and per-message duas, Janazah Maps links + one-click .ics export.
- **Verified notable passings** — a scholars collection (Sunni) with
  source-checked dates.
- **Admin panel** (`#/admin`, demo passcode `albaqaa-admin`) —
  moderation, stats, database export/import.
- **6 languages** (EN · AR · UR · BN · ES · HI, RTL for AR/UR) and
  **3 themes** (Emerald · White · Black).
- **Sharing** — Web Share API + copy link per obituary, Open Graph /
  Twitter preview cards.
- **Funeral-services directory** — verified listings with ratings,
  services, and Google Maps directions.

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
