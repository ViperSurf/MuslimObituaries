import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Obituary, Sect } from './types'
import * as api from './services/api'
import ObituaryCard from './components/ObituaryCard'
import DetailView from './components/DetailView'
import SubmitForm from './components/SubmitForm'
import VendorDirectory from './components/VendorDirectory'
import AlertsForm from './components/AlertsForm'
import AdminView from './components/AdminView'
import ChangelogView from './components/ChangelogView'
import { LANGS } from './i18n'
import { THEMES, useSettings, type Theme } from './context/settings'

type Route =
  | { name: 'home' }
  | { name: 'detail'; id: string }
  | { name: 'submit' }
  | { name: 'vendors' }
  | { name: 'alerts' }
  | { name: 'admin' }
  | { name: 'changelog' }

function parseRoute(): Route {
  const h = window.location.hash.replace(/^#/, '')
  if (h.startsWith('/obituary/')) return { name: 'detail', id: decodeURIComponent(h.slice('/obituary/'.length)) }
  if (h === '/submit') return { name: 'submit' }
  if (h === '/vendors') return { name: 'vendors' }
  if (h === '/alerts') return { name: 'alerts' }
  if (h === '/admin') return { name: 'admin' }
  if (h === '/changelog') return { name: 'changelog' }
  return { name: 'home' }
}

function go(path: string) {
  window.location.hash = path
}

export default function App() {
  const { t, lang, setLang, theme, setTheme } = useSettings()
  const [route, setRoute] = useState<Route>(() => parseRoute())
  const [dataVersion, setDataVersion] = useState(0)

  const [community, setCommunity] = useState<Obituary[]>([])
  const [scholars, setScholars] = useState<Obituary[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Obituary | null>(null)
  const [duaGiven, setDuaGiven] = useState<Set<string>>(new Set())

  const [q, setQ] = useState('')
  const [region, setRegion] = useState('')
  const [sect, setSect] = useState<Sect | ''>('')
  const [year, setYear] = useState('')
  const [janazahMode, setJanazahMode] = useState<'any' | 'upcoming' | 'today'>('any')
  const [scholarsOnly, setScholarsOnly] = useState(false)

  useEffect(() => {
    const onHash = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const refreshHome = useCallback(async () => {
    setLoading(true)
    const [c, s, r, y] = await Promise.all([
      api.listObituaries({ kind: 'community' }),
      api.listObituaries({ kind: 'scholar' }),
      api.listRegions(),
      api.listYears(),
    ])
    setCommunity(c)
    setScholars(s)
    setRegions(r)
    setYears(y)
    setLoading(false)
  }, [])

  useEffect(() => {
    void refreshHome()
  }, [refreshHome, dataVersion])

  useEffect(() => {
    if (route.name !== 'detail') return
    let live = true
    api.getObituary(route.id).then((o) => {
      if (live) setSelected(o)
    })
    return () => {
      live = false
    }
  }, [route, dataVersion])

  const filteredCommunity = useMemo(() => {
    let list = community
    if (q) {
      const needle = q.toLowerCase()
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(needle) ||
          (o.arabicName ?? '').toLowerCase().includes(needle) ||
          o.city.toLowerCase().includes(needle) ||
          o.biography.toLowerCase().includes(needle) ||
          (o.janazah?.mosque ?? '').toLowerCase().includes(needle),
      )
    }
    if (region) list = list.filter((o) => `${o.city}, ${o.state}`.includes(region) || o.city === region)
    if (sect) list = list.filter((o) => o.sect === sect)
    if (year) list = list.filter((o) => o.dateOfPassing.startsWith(year))
    if (janazahMode === 'upcoming') list = list.filter((o) => o.janazah && new Date(o.janazah.datetime) >= new Date())
    if (janazahMode === 'today')
      list = list.filter((o) => o.janazah && new Date(o.janazah.datetime).toDateString() === new Date().toDateString())
    return list
  }, [community, q, region, sect, year, janazahMode])

  const filteredScholars = useMemo(() => {
    let list = scholars
    if (q) {
      const needle = q.toLowerCase()
      list = list.filter((o) => o.name.toLowerCase().includes(needle) || o.biography.toLowerCase().includes(needle))
    }
    if (sect) list = list.filter((o) => o.sect === sect)
    if (year) list = list.filter((o) => o.dateOfPassing.startsWith(year))
    return list
  }, [scholars, q, sect, year])

  const giveDua = async (id: string) => {
    if (duaGiven.has(id)) return
    const count = await api.incrementDua(id)
    setDuaGiven((prev) => new Set(prev).add(id))
    setCommunity((prev) => prev.map((o) => (o.id === id ? { ...o, duaCount: count } : o)))
    setScholars((prev) => prev.map((o) => (o.id === id ? { ...o, duaCount: count } : o)))
    setSelected((prev) => (prev && prev.id === id ? { ...prev, duaCount: count } : prev))
  }

  const navLink = (label: string, path: string, active: boolean) => (
    <button
      key={path}
      onClick={() => go(path)}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${active ? 'bg-white/15 underline underline-offset-4' : 'hover:bg-white/10'}`}
      style={theme === 'white' ? { color: 'inherit' } : undefined}
    >
      {label}
    </button>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="th-header sticky top-0 z-10 shadow-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <button onClick={() => go('/')} className="flex items-center gap-3 text-start">
            <img src="favicon.svg" alt="" className="h-10 w-10" />
            <span>
              <span className="font-display block text-xl leading-tight font-bold">
                Al-Baqaa <span className="font-arabic">البقاء</span>
              </span>
              <span className="block text-xs opacity-80">{t('tagline')}</span>
            </span>
          </button>
          <nav className="ms-auto flex flex-wrap items-center gap-1">
            {navLink(t('nav_obituaries'), '/', route.name === 'home' || route.name === 'detail')}
            {navLink(t('nav_vendors'), '/vendors', route.name === 'vendors')}
            {navLink(t('nav_alerts'), '/alerts', route.name === 'alerts')}
            {navLink(t('nav_changelog'), '/changelog', route.name === 'changelog')}
            {navLink(t('nav_admin'), '/admin', route.name === 'admin')}
            <button
              onClick={() => go('/submit')}
              className="ms-1 rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-400"
            >
              {t('nav_submit')}
            </button>
            <select
              aria-label={t('language')}
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
              className="th-input ms-2 rounded-lg px-2 py-1.5 text-sm"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <select
              aria-label={t('theme')}
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="th-input rounded-lg px-2 py-1.5 text-sm"
            >
              {THEMES.map((th) => (
                <option key={th} value={th}>
                  {th === 'emerald' ? `🟢 ${t('theme_emerald')}` : th === 'white' ? `⚪ ${t('theme_white')}` : `⚫ ${t('theme_black')}`}
                </option>
              ))}
            </select>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {route.name === 'home' && (
          <>
            <section className="th-hero rounded-3xl p-6 shadow-sm sm:p-10">
              <h1 className="font-display text-3xl font-bold sm:text-4xl">{t('hero_title')}</h1>
              <p className="mt-3 max-w-3xl leading-relaxed opacity-90">{t('hero_sub')}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('search_ph')}
                  className="th-input rounded-xl px-4 py-2.5"
                />
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="th-input rounded-xl px-4 py-2.5">
                  <option value="">{t('city_ph')}</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <select value={sect} onChange={(e) => setSect(e.target.value as Sect | '')} className="th-input rounded-xl px-3 py-2 text-sm">
                  <option value="">{t('all_traditions')}</option>
                  <option value="Sunni">Sunni</option>
                  <option value="Shia">Shia</option>
                  <option value="Non-denominational">Non-denominational</option>
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="th-input rounded-xl px-3 py-2 text-sm">
                  <option value="">{t('all_years')}</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setJanazahMode(janazahMode === 'upcoming' ? 'any' : 'upcoming')}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${janazahMode === 'upcoming' ? 'bg-rose-700 text-white' : 'th-input'}`}
                >
                  🕌 {t('upcoming_only')}
                </button>
                <button
                  onClick={() => setJanazahMode(janazahMode === 'today' ? 'any' : 'today')}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${janazahMode === 'today' ? 'bg-rose-700 text-white' : 'th-input'}`}
                >
                  📅 {t('today_only')}
                </button>
                <button
                  onClick={() => setScholarsOnly(!scholarsOnly)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${scholarsOnly ? 'bg-amber-500 text-emerald-950' : 'th-input'}`}
                >
                  🎓 {t('scholars_only')}
                </button>
              </div>
            </section>

            {loading ? (
              <p className="th-muted mt-10 text-center">{t('loading')}</p>
            ) : (
              <>
                {!scholarsOnly && (
                  <>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCommunity.map((o) => (
                        <ObituaryCard key={o.id} obituary={o} onOpen={(id) => go(`/obituary/${id}`)} onQuickDua={giveDua} duaGiven={duaGiven.has(o.id)} />
                      ))}
                    </div>
                    {filteredCommunity.length === 0 && <p className="th-muted mt-8 text-center">{t('no_results')}</p>}
                  </>
                )}
                {(scholarsOnly || (!q && !sect && !year)) && filteredScholars.length > 0 && (
                  <section className="mt-12">
                    <h2 className="font-display text-2xl font-bold">🎓 {t('notable_scholars')}</h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredScholars.map((o) => (
                        <ObituaryCard key={o.id} obituary={o} onOpen={(id) => go(`/obituary/${id}`)} onQuickDua={giveDua} duaGiven={duaGiven.has(o.id)} />
                      ))}
                    </div>
                  </section>
                )}
                {scholarsOnly && filteredScholars.length === 0 && <p className="th-muted mt-8 text-center">{t('no_results')}</p>}
              </>
            )}
          </>
        )}

        {route.name === 'detail' &&
          (selected ? (
            <DetailView obituary={selected} onBack={() => go('/')} onDua={giveDua} duaGiven={duaGiven.has(selected.id)} />
          ) : (
            <p className="th-muted text-center">{t('loading')}</p>
          ))}

        {route.name === 'submit' && <SubmitForm onDone={(id) => go(`/obituary/${id}`)} />}
        {route.name === 'vendors' && <VendorDirectory />}
        {route.name === 'alerts' && <AlertsForm />}
        {route.name === 'admin' && <AdminView onDataChanged={() => setDataVersion((v) => v + 1)} />}
        {route.name === 'changelog' && <ChangelogView />}
      </main>

      <footer className="th-header mt-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5 text-sm">
          <span className="font-arabic text-base" dir="rtl" lang="ar">
            إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
          </span>
          <span className="opacity-80">Al-Baqaa V2.0 · Free for families, always · Built by Bara Zalloum (ViperSurf)</span>
          <span className="ms-auto flex flex-wrap gap-4">
            <a className="underline" href="data/database.json" target="_blank" rel="noreferrer">
              {t('database_link')}
            </a>
            <a className="underline" href="api/v1/openapi.json" target="_blank" rel="noreferrer">
              API (OpenAPI)
            </a>
            <button className="underline" onClick={() => go('/changelog')}>
              {t('nav_changelog')}
            </button>
            <a className="underline" href="https://github.com/ViperSurf/MuslimObituaries" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
