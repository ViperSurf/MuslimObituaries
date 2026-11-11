import type { Obituary } from '../types'
import { effectiveAge, formatDate, formatDateTime, locationLine } from '../lib/format'
import { useSettings } from '../context/settings'

interface Props {
  obituary: Obituary
  onOpen: (id: string) => void
  onQuickDua: (id: string) => void
  duaGiven: boolean
}

export default function ObituaryCard({ obituary: o, onOpen, onQuickDua, duaGiven }: Props) {
  const { t } = useSettings()
  const upcoming = o.janazah && new Date(o.janazah.datetime).getTime() >= Date.now()
  const age = effectiveAge(o)
  return (
    <article className="th-surface flex flex-col overflow-hidden rounded-2xl shadow-sm transition hover:shadow-md">
      {o.photoUrl && (
        <img src={o.photoUrl} alt="" className="h-44 w-full object-cover object-top" loading="lazy" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {o.verified && (
            <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-semibold text-white">
              ✓ {t('verified_badge')}
            </span>
          )}
          {o.kind === 'scholar' && (
            <span className="th-primary rounded-full px-2 py-0.5 text-[11px] font-semibold">
              🎓 {t('scholar_badge')}
            </span>
          )}
          {upcoming && (
            <span className="rounded-full bg-rose-700 px-2 py-0.5 text-[11px] font-semibold text-white">
              {t('janazah_label')} · {new Date(o.janazah!.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg leading-snug font-bold">{o.name}</h3>
        {o.arabicName && (
          <p className="font-arabic text-base leading-relaxed opacity-80" dir="rtl" lang="ar">
            {o.arabicName}
          </p>
        )}
        <p className="th-muted mt-1 text-sm">
          {locationLine(o)}
          {age !== undefined && <> · {t('age')} {age}</>}
        </p>
        <p className="th-muted text-sm">
          {t('passed')}: {formatDate(o.dateOfPassing)}
          {o.hijriPassingDate && <> · <span className="font-arabic">{o.hijriPassingDate}</span></>}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{o.biography}</p>
        {o.janazah && (
          <div className="th-surface2 th-border mt-3 rounded-xl border p-3 text-sm">
            <span className="font-semibold">{t('janazah_prayer')}:</span> {o.janazah.mosque}
            <br />
            <span className="th-muted">
              {formatDateTime(o.janazah.datetime)}
              {o.janazah.afterPrayer ? ` · ${o.janazah.afterPrayer}` : ''}
            </span>
          </div>
        )}
        <div className="mt-4 flex items-center gap-2 pt-1 mt-auto">
          <button
            onClick={() => onOpen(o.id)}
            className="th-primary flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition hover:opacity-90"
          >
            {t('view_dua')}
          </button>
          <button
            onClick={() => onQuickDua(o.id)}
            disabled={duaGiven}
            className="rounded-xl bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-default disabled:bg-rose-300"
            title={t('offer_dua')}
          >
            🤲 {o.duaCount.toLocaleString()}
          </button>
        </div>
        <p className="th-muted mt-2 text-center text-xs">{t('duas_offered')}</p>
      </div>
    </article>
  )
}
