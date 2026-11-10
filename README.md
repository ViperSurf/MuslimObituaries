# Al-Baqaa (البقاء) — Muslim Community Obituary & Memorial Platform

> **"كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ"** — *"Every soul shall taste death."* [Surah Ali 'Imran 3:185]

**Al-Baqaa** is a centralized, community-driven, shareable web platform tailored to Islamic faith, traditions, and community needs. It connects Muslim families, local mosques, funeral service providers, and community members to honour deceased loved ones with dignity, facilitate Janazah prayer attendance, establish continuous charity (Sadaqah Jariyah), and preserve memories.

Built *Fi Sabilillah* as an open-source community platform for the global Ummah. Contributions, bug reports, and pull requests are warmly welcomed.

## Features

1. **100% free obituary submissions** — a multi-step portal for families: deceased information, biography, surviving family, and optional tradition tags (Sunni, Shia, Non-denominational). An optional tip jar ($0/$5/$10/$25) helps cover hosting for grieving families.
2. **Real-time Janazah logistics & calendar sync** — mosque details, prayer timing (e.g. *After Dhuhr*), cemetery information, Google Maps directions, and one-click **.ics calendar export** (Apple Calendar, Google Calendar, Outlook).
3. **Islamic templates & Memory Wall** — pre-populated duas and Qur'anic phrases, an interactive Memory Wall for condolences and memories, and a live **"Offer Rahmah / Say Dua"** counter.
4. **Sadaqah Jariyah integration** — charity causes established in the deceased's name (wells, mosque expansion, orphan care, Qur'an distribution) with a real-time fundraising tracker.
5. **Local Janazah alerts** — community members subscribe by email/phone and location radius to be notified of nearby Janazah prayers (subscription in V1; real sending is V2).
6. **Vendor & partner directory** — licensed Muslim funeral homes, mosques with Ghusl facilities, Muslim cemeteries, and Sharia-compliant Wasiyyah (will & estate) advisors.

## Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS v4, Lucide icons, Google Fonts (Amiri, Reem Kufi, Plus Jakarta Sans)
- **Hosting target:** GitHub Pages static hosting with zero server maintenance (hash-based routing, portable `base: './'`)
- **Data & API abstraction:** an async service layer (`src/services/api.ts`) implements the public API contract with LocalStorage persistence and instant UI reflection — the UI never talks to storage directly, so a hosted backend can replace the service layer without UI changes
- **Public API:** full OpenAPI 3.0 specification at [`public/api/v1/openapi.json`](public/api/v1/openapi.json) (served at `/api/v1/openapi.json` once deployed) for mobile apps and third-party integrations
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`

Example endpoints: `GET /api/v1/obituaries` (filters: location, tradition, Janazah status) · `POST /api/v1/obituaries` · `GET|POST /api/v1/obituaries/{id}/condolences` · `POST /api/v1/obituaries/{id}/dua` · `POST /api/v1/janazah-alerts/subscribe` · `GET /api/v1/vendors`

## Quick Start

Prerequisites: Node.js v20+ and npm v10+.

```bash
git clone https://github.com/<your-username>/MuslimObituaries.git
cd MuslimObituaries
npm install --legacy-peer-deps

npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The app seeds three clearly-labelled sample obituaries and four sample vendor listings on first run so every feature is visible immediately. Your own submissions are stored locally in your browser (LocalStorage).

## Project Structure

```
src/
  types.ts              Domain types (Obituary, Condolence, Vendor, …)
  data/seed.ts          Sample seed data
  services/api.ts       API service layer (LocalStorage implementation of the OpenAPI contract)
  lib/ics.ts            Janazah .ics calendar generation + Google Maps links
  components/
    ObituaryCard.tsx    Listing card with Janazah badge & charity tracker
    DetailView.tsx      Obituary page: Janazah logistics, dua counter, Memory Wall
    SubmitForm.tsx      3-step submission portal (deceased → Janazah → family/charity)
  App.tsx               Hash routing, home + filters, vendors, alerts
public/api/v1/openapi.json   OpenAPI 3.0 specification
.github/workflows/deploy.yml GitHub Pages CI/CD
```

## Roadmap (V2)

- Real database + accounts/admin (moderation queue for submissions, admin panel)
- Real email/SMS Janazah alert delivery
- Localisation: Arabic, English, Urdu, Bengali, Spanish, Hindi
- Share cards with rich previews in other apps
- Additional black & white themes alongside the current theme
- Playwright end-to-end tests for the submission and Memory Wall flows

## License & Community

Open source, built for the sake of Allah and the benefit of the community. See the issue tracker to contribute features, translations, or verified vendor listings for your city.
