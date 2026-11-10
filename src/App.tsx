import { useEffect, useMemo, useState } from 'react'
import { Bell, Building2, MoonStar, PenLine, Search } from 'lucide-react'
import type { Obituary, Sect, Vendor, VendorCategory } from './types'
import { listObituaries, listVendors, subscribeAlerts } from './services/api'
import ObituaryCard from './components/ObituaryCard'
import DetailView from './components/DetailView'
import SubmitForm from './components/SubmitForm'

type Route =
  | { name: 'home' }
  | { name: 'detail'; id: string }
  | { name: 'submit' }
  | { name: 'vendors' }
  | { name: 'alerts' }

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/'
  if (hash === '/' || hash === '') return { name: 'home' }
  if (hash === '/submit') return { name: 'submit' }
  if (hash === '/vendors') return { name: 'vendors' }
  if (hash === '/alerts') return { name: 'alerts' }
  const m = hash.match(/^\/obituary\/(.+)$/)
  if (m) return { name: 'detail', id: decodeURIComponent(m[1]) }
  return { name: 'home' }
}

function go(path: string) {
  window.location.hash = path
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash())

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-emerald-950 text-emerald-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <button onClick={() => go('/')} className="flex items-center gap-2 text-left">
            <MoonStar className="h-7 w-7 text-amber-300" />
            <span>
              <span className="font-display block text-xl font-bold leading-none">
                Al-Baqaa <span className="font-arabic font-normal">البقاء</span>
              </span>
              <span className="text-xs text-emerald-300">Muslim Obituaries &amp; Janazah Announcements</span>
            </span>
          </button>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <button onClick={() => go('/')} className="rounded-full px-3 py-1.5 hover:bg-emerald-900">
              Obituaries
            </button>
            <button
              onClick={() => go('/vendors')}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-emerald-900"
            >
              <Building2 className="h-4 w-4" /> Funeral Services
            </button>
            <button
              onClick={() => go('/alerts')}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-emerald-900"
            >
              <Bell className="h-4 w-4" /> Janazah Alerts
            </button>
            <button
              onClick={() => go('/submit')}
              className="flex items-center gap-1 rounded-full bg-amber-500 px-4 py-1.5 text-emerald-950 hover:bg-amber-400"
            >
              <PenLine className="h-4 w-4" /> Submit Obituary
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {route.name === 'home' && <HomeView onOpen={(id) => go(`/obituary/${id}`)} />}
        {route.name === 'detail' && (
          <DetailView id={route.id} onBack={() => go('/')} />
        )}
        {route.name === 'submit' && <SubmitForm onDone={(id) => go(`/obituary/${id}`)} />}
        {route.name === 'vendors' && <VendorsView />}
        {route.name === 'alerts' && <AlertsView />}
      </main>

      <footer className="border-t border-emerald-950/10 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-stone-500">
          <p className="font-arabic text-lg text-emerald-900">كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ</p>
          <p className="mt-1 italic">&ldquo;Every soul shall taste death.&rdquo; — Surah Ali &lsquo;Imran 3:185</p>
          <p className="mt-3">
            Al-Baqaa is a free, open-source community platform, built Fi Sabilillah. API spec:{' '}
            <a className="font-semibold text-emerald-900 underline" href="./api/v1/openapi.json" target="_blank" rel="noreferrer">
              /api/v1/openapi.json
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

function HomeView({ onOpen }: { onOpen: (id: string) => void }) {
  const [obituaries, setObituaries] = useState<Obituary[]>([])
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [sect, setSect] = useState<Sect | ''>('')
  const [upcomingOnly, setUpcomingOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const list = await listObituaries({
        q,
        city,
        sect,
        janazah: upcomingOnly ? 'upcoming' : 'any',
      })
      if (!active) return
      setObituaries(list)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [q, city, sect, upcomingOnly])

  const upcomingCount = useMemo(
    () => obituaries.filter((o) => o.janazah && new Date(o.janazah.datetime).getTime() >= Date.now()).length,
    [obituaries],
  )

  return (
    <div>
      <div className="rounded-3xl bg-emerald-950 px-6 py-10 text-center text-emerald-50">
        <p className="font-arabic text-3xl leading-relaxed text-amber-200">إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
        <h1 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
          Honouring those who returned to their Lord
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-emerald-200">
          Janazah announcements, funeral logistics, a Memory Wall for condolences and duas, and
          Sadaqah Jariyah in their name — free for every family, forever.
        </p>
        {upcomingCount > 0 && (
          <p className="mt-4 inline-block rounded-full bg-amber-500/15 px-4 py-1 text-sm font-semibold text-amber-300">
            {upcomingCount} upcoming Janazah prayer{upcomingCount === 1 ? '' : 's'} listed
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-950/10 bg-white p-4">
        <label className="flex min-w-52 flex-1 items-center gap-2 rounded-xl bg-stone-100 px-3 py-2">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-32 rounded-xl bg-stone-100 px-3 py-2 text-sm outline-none"
        />
        <select
          value={sect}
          onChange={(e) => setSect(e.target.value as Sect | '')}
          className="rounded-xl bg-stone-100 px-3 py-2 text-sm outline-none"
        >
          <option value="">All traditions</option>
          <option value="Sunni">Sunni</option>
          <option value="Shia">Shia</option>
          <option value="Non-denominational">Non-denominational</option>
        </select>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-600">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => setUpcomingOnly(e.target.checked)}
            className="h-4 w-4 accent-emerald-800"
          />
          Upcoming Janazah only
        </label>
      </div>

      {loading ? (
        <p className="py-16 text-center text-stone-500">Loading obituaries…</p>
      ) : obituaries.length === 0 ? (
        <p className="py-16 text-center text-stone-500">
          No obituaries match your filters. May Allah bless the deceased of this community.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {obituaries.map((o) => (
            <ObituaryCard key={o.id} obituary={o} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  )
}

const VENDOR_CATEGORIES: Array<VendorCategory | ''> = [
  '',
  'Funeral Home',
  'Mosque / Ghusl',
  'Cemetery',
  'Legal / Wasiyyah',
]

function VendorsView() {
  const [category, setCategory] = useState<VendorCategory | ''>('')
  const [vendors, setVendors] = useState<Vendor[]>([])

  useEffect(() => {
    let active = true
    ;(async () => {
      const list = await listVendors(category)
      if (active) setVendors(list)
    })()
    return () => {
      active = false
    }
  }, [category])

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-emerald-950">Funeral services directory</h1>
      <p className="mt-1 text-sm text-stone-600">
        Verified Muslim funeral homes, mosques with Ghusl facilities, cemeteries, and Wasiyyah
        advisors. Listings marked &ldquo;sample&rdquo; are placeholders pending verification.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {VENDOR_CATEGORIES.map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              category === c ? 'bg-emerald-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {c || 'All'}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {vendors.map((v) => (
          <div key={v.id} className="rounded-2xl border border-emerald-950/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">{v.category}</p>
            <h3 className="font-display mt-1 font-semibold text-emerald-950">{v.name}</h3>
            <p className="mt-1 text-sm text-stone-500">
              {v.city}, {v.state} · {v.phone}
            </p>
            <p className="text-sm text-stone-500">{v.address}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{v.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertsView() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState(25)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !city.trim()) return
    await subscribeAlerts({ email: email.trim(), phone: phone.trim() || undefined, city: city.trim(), radiusMiles: radius })
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-bold text-emerald-950">Janazah alerts</h1>
      <p className="mt-1 text-sm leading-relaxed text-stone-600">
        Attending a Janazah is a communal obligation (Fard Kifayah) and a great reward. Subscribe
        to be notified when a Janazah is announced near you. V1 stores your subscription locally;
        V2 will send real email/SMS alerts.
      </p>
      {done ? (
        <div className="mt-6 rounded-2xl bg-emerald-900 p-6 text-center text-emerald-50">
          <p className="font-display text-lg font-semibold">Subscribed — Jazakum Allahu khayran</p>
          <p className="mt-1 text-sm text-emerald-200">
            You&apos;ll be alerted for Janazah prayers within {radius} miles of {city}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-emerald-950/10 bg-white p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">Email *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-700" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">Phone (for SMS, optional)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-700" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">City *</label>
              <input required value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-700" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">Radius: {radius} miles</label>
              <input type="range" min={5} max={100} step={5} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-emerald-800" />
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            <Bell className="h-4 w-4" /> Subscribe to alerts
          </button>
        </form>
      )}
    </div>
  )
}
