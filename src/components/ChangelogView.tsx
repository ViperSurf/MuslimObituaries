import { useSettings } from '../context/settings'

export const CHANGELOG = [
  {
    version: 'V2.0',
    date: '2026-11-11',
    title: 'The merge — both original builds, finished together',
    items: [
      'Merged the two Al-Baqaa builds: the original feature-rich August 2026 build (portraits, Hijri dates, Azza condolence windows, multiple Sadaqah projects with donation links, per-message duas, vendor ratings) now runs on the deployed codebase with shareable per-obituary pages.',
      'Shared dynamic database: all obituaries, condolences and vendors live in one public database.json that every visitor loads — viewable by anyone, updated by committing a new file.',
      'Admin panel: passcode-gated moderation (verify/delete), dataset statistics, and database export/import.',
      'Six languages: English, العربية, اردو, বাংলা, Español, हिन्दी — with right-to-left layout for Arabic and Urdu.',
      'Three themes: Emerald (original), White, and Black.',
      'Sharing: Web Share API + copy-link on every obituary, with Open Graph / Twitter preview cards for the app.',
      'Verified notable passings: a scholars collection (Ibn Baz, al-Albani, Ibn Uthaymeen, Muqbil al-Wadi’i, Wahbah al-Zuhayli, Saleh al-Luhaydan, Yusuf al-Qaradawi) with dates checked against published sources.',
      'Funeral-services directory gained Google Maps direction links on every listing.',
      'Changelog page (this page) and CHANGELOG.md in the repository.',
    ],
  },
  {
    version: 'V1.1',
    date: '2026-11-10',
    title: 'First deployed build',
    items: [
      'React 18 + TypeScript + Vite + TailwindCSS, deployed to GitHub Pages with a GitHub Actions CI/CD workflow.',
      'Obituary listings with search and filters, 3-step submission portal, Janazah details with Google Maps links and one-click .ics calendar export, Memory Wall, live dua counter, Sadaqah Jariyah tracker, Janazah-alert subscriptions, vendor directory.',
      'OpenAPI 3.0 contract served from the app at /api/v1/openapi.json, implemented by a swappable service layer.',
    ],
  },
  {
    version: 'V1.0',
    date: '2026-08-09',
    title: 'Original build (Bara Zalloum)',
    items: [
      'Initial Al-Baqaa platform: rich obituary profiles with portraits, biographies, family members and sect tags; tip jar; Janazah logistics with Maps and .ics export; Memory Wall; Sadaqah Jariyah causes with fundraising trackers; Janazah alerts; verified funeral-services directory.',
    ],
  },
]

export default function ChangelogView() {
  const { t } = useSettings()
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="font-display text-3xl font-bold">📜 {t('changelog_title')}</h2>
      <div className="mt-6 space-y-6">
        {CHANGELOG.map((entry) => (
          <section key={entry.version} className="th-surface rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="th-primary rounded-full px-3 py-0.5 text-sm font-bold">{entry.version}</span>
              <span className="th-muted text-sm">{entry.date}</span>
              <h3 className="text-lg font-bold">{entry.title}</h3>
            </div>
            <ul className="mt-3 list-inside list-disc space-y-1.5 leading-relaxed">
              {entry.items.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
