import { CalendarClock, Heart, MapPin } from 'lucide-react'
import type { Obituary } from '../types'

function fmtDate(iso: string): string {
  return new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function ObituaryCard({
  obituary,
  onOpen,
}: {
  obituary: Obituary
  onOpen: (id: string) => void
}) {
  const janazahUpcoming =
    obituary.janazah && new Date(obituary.janazah.datetime).getTime() >= Date.now()
  const charityPct = obituary.charity
    ? Math.min(100, Math.round((obituary.charity.raised / obituary.charity.goal) * 100))
    : 0

  return (
    <article className="flex flex-col rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-emerald-950">{obituary.name}</h3>
          {obituary.arabicName && (
            <p className="font-arabic text-xl leading-relaxed text-emerald-900/70">{obituary.arabicName}</p>
          )}
        </div>
        {typeof obituary.age === 'number' && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
            Age {obituary.age}
          </span>
        )}
      </div>

      <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
        <MapPin className="h-4 w-4" /> {obituary.city}, {obituary.state} · Died {fmtDate(obituary.dateOfDeath)}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">{obituary.biography}</p>

      {obituary.janazah && (
        <div
          className={`mt-4 rounded-xl px-3 py-2 text-sm ${
            janazahUpcoming ? 'bg-emerald-900 text-emerald-50' : 'bg-stone-100 text-stone-600'
          }`}
        >
          <p className="flex items-center gap-2 font-semibold">
            <CalendarClock className="h-4 w-4" />
            Janazah: {fmtDateTime(obituary.janazah.datetime)}
            {obituary.janazah.afterPrayer ? ` (${obituary.janazah.afterPrayer})` : ''}
          </p>
          <p className="mt-0.5 truncate text-xs opacity-80">{obituary.janazah.mosque}</p>
        </div>
      )}

      {obituary.charity && (
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium text-stone-500">
            <span className="truncate pr-2">Sadaqah Jariyah: {obituary.charity.name}</span>
            <span>
              ${obituary.charity.raised.toLocaleString()} / ${obituary.charity.goal.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-emerald-100">
            <div className="h-full rounded-full bg-emerald-700" style={{ width: `${charityPct}%` }} />
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
        <span className="flex items-center gap-1.5 text-sm font-medium text-rose-700">
          <Heart className="h-4 w-4 fill-current" /> {obituary.duaCount} duas offered
        </span>
        <button
          onClick={() => onOpen(obituary.id)}
          className="rounded-full bg-emerald-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          View &amp; offer dua
        </button>
      </div>
    </article>
  )
}
