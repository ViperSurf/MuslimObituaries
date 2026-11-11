# Changelog — Al-Baqaa (Muslim Obituaries)

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
