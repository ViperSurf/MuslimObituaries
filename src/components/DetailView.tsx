import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CalendarPlus,
  Heart,
  MapPin,
  Navigation,
  Send,
} from 'lucide-react'
import type { Condolence, Obituary } from '../types'
import { addCondolence, getObituary, incrementDua, listCondolences } from '../services/api'
import { downloadJanazahIcs, mapsUrl } from '../lib/ics'

const DUA_TEMPLATES = [
  'Allahumma-ghfir lahu warhamhu — O Allah, forgive them and have mercy on them.',
  'May Allah grant them Jannat al-Firdaws and give the family patience and strength.',
  'Inna lillahi wa inna ilayhi raji\'un. May Allah illuminate their grave and expand it for them.',
]

export default function DetailView({ id, onBack }: { id: string; onBack: () => void }) {
  const [obituary, setObituary] = useState<Obituary | null>(null)
  const [condolences, setCondolences] = useState<Condolence[]>([])
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [duaGiven, setDuaGiven] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const [ob, cs] = await Promise.all([getObituary(id), listCondolences(id)])
      if (!active) return
      setObituary(ob)
      setCondolences(cs)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <p className="py-16 text-center text-stone-500">Loading…</p>
  if (!obituary)
    return (
      <div className="py-16 text-center">
        <p className="text-stone-600">This obituary could not be found.</p>
        <button onClick={onBack} className="mt-4 font-semibold text-emerald-900 underline">
          Back to all obituaries
        </button>
      </div>
    )

  const handleDua = async () => {
    if (duaGiven) return
    const count = await incrementDua(obituary.id)
    setObituary({ ...obituary, duaCount: count })
    setDuaGiven(true)
  }

  const handleCondolence = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !message.trim()) return
    const created = await addCondolence(obituary.id, author.trim(), message.trim())
    setCondolences([created, ...condolences])
    setAuthor('')
    setMessage('')
  }

  const charityPct = obituary.charity
    ? Math.min(100, Math.round((obituary.charity.raised / obituary.charity.goal) * 100))
    : 0

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1 text-sm font-semibold text-emerald-900 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> All obituaries
      </button>

      <header className="rounded-3xl bg-emerald-950 px-6 py-8 text-center text-emerald-50 sm:px-10">
        <p className="font-arabic text-2xl leading-relaxed text-amber-200">
          إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
        </p>
        <p className="mt-1 text-xs tracking-wide text-emerald-200/80">
          Inna lillahi wa inna ilayhi raji&apos;un — To Allah we belong, and to Him we return
        </p>
        <h1 className="font-display mt-5 text-3xl font-bold">{obituary.name}</h1>
        {obituary.arabicName && <p className="font-arabic mt-1 text-2xl text-emerald-100">{obituary.arabicName}</p>}
        <p className="mt-2 text-sm text-emerald-200">
          {obituary.city}, {obituary.state}
          {typeof obituary.age === 'number' ? ` · Age ${obituary.age}` : ''} · {obituary.sect}
        </p>
      </header>

      <section className="mt-6 rounded-2xl border border-emerald-950/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-emerald-950">About</h2>
        <p className="mt-2 leading-relaxed text-stone-700">{obituary.biography}</p>
        <p className="mt-4 text-sm text-stone-600">
          <span className="font-semibold text-stone-800">Family:</span> {obituary.family}
        </p>

        <button
          onClick={handleDua}
          disabled={duaGiven}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold transition ${
            duaGiven
              ? 'bg-rose-50 text-rose-700'
              : 'bg-rose-600 text-white hover:bg-rose-500'
          }`}
        >
          <Heart className="h-5 w-5 fill-current" />
          {duaGiven ? `Dua offered — ${obituary.duaCount} total` : `Offer Rahmah / Say Dua (${obituary.duaCount})`}
        </button>
      </section>

      {obituary.janazah && (
        <section className="mt-6 rounded-2xl border border-emerald-950/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-emerald-950">Janazah Prayer</h2>
          <div className="mt-3 space-y-2 text-stone-700">
            <p className="font-semibold">
              {new Date(obituary.janazah.datetime).toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
              {obituary.janazah.afterPrayer ? ` · ${obituary.janazah.afterPrayer}` : ''}
            </p>
            <p>{obituary.janazah.mosque}</p>
            <p className="flex items-center gap-1 text-sm text-stone-500">
              <MapPin className="h-4 w-4" /> {obituary.janazah.address}
            </p>
            {obituary.janazah.notes && <p className="text-sm text-stone-500">{obituary.janazah.notes}</p>}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => downloadJanazahIcs(obituary)}
              className="flex items-center gap-2 rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <CalendarPlus className="h-4 w-4" /> Add to calendar (.ics)
            </button>
            <a
              href={mapsUrl(`${obituary.janazah.mosque}, ${obituary.janazah.address}`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            >
              <Navigation className="h-4 w-4" /> Directions
            </a>
          </div>
          {obituary.burial && (
            <p className="mt-4 border-t border-stone-100 pt-3 text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Burial:</span> {obituary.burial.cemetery} —{' '}
              {obituary.burial.address}
            </p>
          )}
        </section>
      )}

      {obituary.charity && (
        <section className="mt-6 rounded-2xl border border-amber-600/20 bg-amber-50 p-6">
          <h2 className="font-display text-lg font-semibold text-amber-900">Sadaqah Jariyah in their name</h2>
          <p className="mt-1 text-stone-700">{obituary.charity.name}</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-amber-200/60">
            <div className="h-full rounded-full bg-amber-600" style={{ width: `${charityPct}%` }} />
          </div>
          <p className="mt-2 text-sm font-medium text-amber-900">
            ${obituary.charity.raised.toLocaleString()} raised of ${obituary.charity.goal.toLocaleString()} goal
          </p>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-emerald-950/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-emerald-950">Memory Wall</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {DUA_TEMPLATES.map((t) => (
            <button
              key={t}
              onClick={() => setMessage(t)}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-100"
            >
              {t.slice(0, 42)}…
            </button>
          ))}
        </div>
        <form onSubmit={handleCondolence} className="mt-4 space-y-3">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-700"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share a memory, a condolence, or a dua…"
            rows={3}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-700"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <Send className="h-4 w-4" /> Post to Memory Wall
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {condolences.length === 0 && (
            <p className="text-sm text-stone-500">No messages yet — be the first to leave a dua for the family.</p>
          )}
          {condolences.map((c) => (
            <div key={c.id} className="rounded-xl bg-stone-50 p-4">
              <p className="text-sm leading-relaxed text-stone-700">{c.message}</p>
              <p className="mt-2 text-xs font-semibold text-stone-500">
                {c.author} ·{' '}
                {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
