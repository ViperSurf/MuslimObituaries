import { useEffect, useState } from 'react'
import type { Condolence, Obituary } from '../types'
import * as api from '../services/api'
import { DUA_TEMPLATES } from '../data/templates'
import {
  downloadIcs,
  effectiveAge,
  formatDate,
  formatDateTime,
  locationLine,
  mapsUrl,
  money,
  shareObituary,
} from '../lib/format'
import { useSettings } from '../context/settings'

interface Props {
  obituary: Obituary
  onBack: () => void
  onDua: (id: string) => void
  duaGiven: boolean
}

export default function DetailView({ obituary, onBack, onDua, duaGiven }: Props) {
  const { t } = useSettings()
  const [wall, setWall] = useState<Condolence[]>([])
  const [author, setAuthor] = useState('')
  const [relationship, setRelationship] = useState('')
  const [message, setMessage] = useState('')
  const [arabicDua, setArabicDua] = useState('')
  const [wallDuas, setWallDuas] = useState<Set<string>>(new Set())
  const [shareState, setShareState] = useState<'idle' | 'done'>('idle')
  const o = obituary
  const age = effectiveAge(o)

  useEffect(() => {
    let live = true
    api.listCondolences(o.id).then((list) => {
      if (live) setWall(list)
    })
    return () => {
      live = false
    }
  }, [o.id])

  const postWall = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !message.trim()) return
    const saved = await api.addCondolence(o.id, author.trim(), message.trim(), relationship.trim() || undefined, arabicDua || undefined)
    setWall((prev) => [saved, ...prev])
    setAuthor('')
    setRelationship('')
    setMessage('')
    setArabicDua('')
  }

  const giveWallDua = async (id: string) => {
    if (wallDuas.has(id)) return
    const count = await api.incrementCondolenceDua(id)
    setWall((prev) => prev.map((c) => (c.id === id ? { ...c, duaCount: count } : c)))
    setWallDuas((prev) => new Set(prev).add(id))
  }

  const onShare = async () => {
    const result = await shareObituary(o)
    if (result === 'copied') {
      setShareState('done')
      setTimeout(() => setShareState('idle'), 2000)
    }
  }

  const windowOpen =
    o.condolenceWindow &&
    new Date(`${o.condolenceWindow.startDate}T00:00:00`) <= new Date() &&
    new Date() <= new Date(`${o.condolenceWindow.endDate}T23:59:59`)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-semibold underline">
          ← {t('nav_obituaries')}
        </button>
        <button
          onClick={onShare}
          className="th-surface rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm transition hover:shadow"
        >
          🔗 {shareState === 'done' ? t('link_copied') : t('share')}
        </button>
      </div>

      <div className="th-surface overflow-hidden rounded-3xl shadow-sm">
        {o.photoUrl && <img src={o.photoUrl} alt="" className="h-64 w-full object-cover object-top" />}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {o.verified && (
              <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold text-white">✓ {t('verified_badge')}</span>
            )}
            {o.kind === 'scholar' && (
              <span className="th-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">🎓 {t('notable_scholars')}</span>
            )}
            <span className="th-surface2 rounded-full px-2.5 py-0.5 text-xs font-semibold">{o.sect}</span>
          </div>
          <h2 className="font-display mt-3 text-3xl font-bold">{o.name}</h2>
          {o.arabicName && (
            <p className="font-arabic mt-1 text-2xl opacity-80" dir="rtl" lang="ar">
              {o.arabicName}
            </p>
          )}
          <p className="th-muted mt-2">
            {o.dateOfBirth && <>{formatDate(o.dateOfBirth)} — </>}
            {formatDate(o.dateOfPassing)}
            {o.hijriPassingDate && <> · <span className="font-arabic">{o.hijriPassingDate}</span></>}
            {age !== undefined && <> · {t('age')} {age}</>}
          </p>
          <p className="th-muted">{locationLine(o)}</p>
          <p className="font-arabic mt-4 text-xl" dir="rtl" lang="ar">
            إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
          </p>

          <button
            onClick={() => onDua(o.id)}
            disabled={duaGiven}
            className="mt-5 w-full rounded-2xl bg-rose-700 px-4 py-3 font-semibold text-white transition hover:bg-rose-800 disabled:cursor-default disabled:bg-rose-300 sm:w-auto"
          >
            🤲 {duaGiven ? t('dua_offered_btn') : t('offer_dua')} · {o.duaCount.toLocaleString()} {t('duas_offered')}
          </button>

          <h3 className="mt-8 text-lg font-bold">{t('about')}</h3>
          <p className="mt-2 leading-relaxed whitespace-pre-line">{o.biography}</p>

          {(o.family || (o.familyMembers && o.familyMembers.length > 0)) && (
            <>
              <h3 className="mt-6 text-lg font-bold">{t('family')}</h3>
              {o.family && <p className="mt-2 leading-relaxed">{o.family}</p>}
              {o.familyMembers && o.familyMembers.length > 0 && (
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {o.familyMembers.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {o.janazah && (
        <section className="th-surface mt-6 rounded-3xl p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold">🕌 {t('janazah_prayer')}</h3>
          <p className="mt-3">
            <span className="font-semibold">{o.janazah.mosque}</span>
            <br />
            {o.janazah.address}
          </p>
          <p className="th-muted mt-1">
            {formatDateTime(o.janazah.datetime)}
            {o.janazah.afterPrayer ? ` · ${o.janazah.afterPrayer}` : ''}
          </p>
          {o.janazah.notes && <p className="mt-2 text-sm leading-relaxed">{o.janazah.notes}</p>}
          {o.janazah.cemetery && (
            <p className="mt-3 text-sm">
              <span className="font-semibold">{t('burial_label')}:</span> {o.janazah.cemetery}
              {o.janazah.cemeteryAddress ? ` — ${o.janazah.cemeteryAddress}` : ''}
              {o.janazah.burialTime ? ` · ${o.janazah.burialTime}` : ''}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={mapsUrl(`${o.janazah.mosque} ${o.janazah.address}`)}
              target="_blank"
              rel="noreferrer"
              className="th-primary rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              🧭 {t('directions')}
            </a>
            <button
              onClick={() => downloadIcs(o, o.janazah!)}
              className="th-surface2 th-border rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-80"
            >
              📅 {t('add_calendar')}
            </button>
            {o.janazah.cemeteryAddress && (
              <a
                href={mapsUrl(o.janazah.cemeteryAddress)}
                target="_blank"
                rel="noreferrer"
                className="th-surface2 th-border rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-80"
              >
                🪦 {t('cemetery_label')} — {t('directions')}
              </a>
            )}
          </div>
        </section>
      )}

      {o.condolenceWindow && (
        <section className="th-surface mt-6 rounded-3xl p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold">
            🤝 {t('condolence_window')}{' '}
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${windowOpen ? 'bg-emerald-700' : 'bg-stone-500'}`}>
              {windowOpen ? 'Open' : 'Closed'}
            </span>
          </h3>
          <p className="mt-2">
            {formatDate(o.condolenceWindow.startDate)} — {formatDate(o.condolenceWindow.endDate)}
          </p>
          {o.condolenceWindow.visitationAddress && (
            <p className="th-muted mt-1 text-sm">
              {t('visitation')}: {o.condolenceWindow.visitationAddress}
              {o.condolenceWindow.visitationHours ? ` · ${o.condolenceWindow.visitationHours}` : ''}
            </p>
          )}
        </section>
      )}

      {o.sadaqah && o.sadaqah.length > 0 && (
        <section className="mt-6 rounded-3xl border border-amber-600/30 bg-amber-500/10 p-6 sm:p-8">
          <h3 className="text-lg font-bold">💧 {t('sadaqah_title')}</h3>
          <div className="mt-4 space-y-5">
            {o.sadaqah.map((p) => {
              const pct = Math.min(100, Math.round((p.raised / Math.max(1, p.goal)) * 100))
              return (
                <div key={p.id} className="th-surface rounded-2xl p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{p.title}</span>
                    <span className="th-surface2 rounded-full px-2 py-0.5 text-[11px] font-semibold">{p.category}</span>
                  </div>
                  <p className="th-muted text-sm">{p.organization}</p>
                  <p className="mt-1 text-sm leading-relaxed">{p.description}</p>
                  <div className="th-surface2 mt-3 h-2.5 overflow-hidden rounded-full">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {money(p.raised)} {t('raised_of')} {money(p.goal)} · {pct}%
                      {pct >= 100 && <> · 🎉 {t('goal_reached')}</>}
                    </p>
                    {p.donationUrl && (
                      <a
                        href={p.donationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                      >
                        {t('donate_btn')} →
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="th-surface mt-6 rounded-3xl p-6 shadow-sm sm:p-8" id="memory-wall">
        <h3 className="text-lg font-bold">🕯️ {t('memory_wall')}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {DUA_TEMPLATES.map((tpl) => (
            <button
              key={tpl.arabic}
              onClick={() => {
                setMessage(tpl.english)
                setArabicDua(tpl.arabic)
              }}
              className="th-surface2 th-border rounded-full border px-3 py-1.5 text-xs transition hover:opacity-80"
              title={tpl.transliteration}
            >
              <span className="font-arabic text-sm">{tpl.arabic}</span>
            </button>
          ))}
        </div>
        <form onSubmit={postWall} className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={t('your_name')}
              required
              className="th-input rounded-xl px-3 py-2"
            />
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder={t('relationship_ph')}
              className="th-input rounded-xl px-3 py-2"
            />
          </div>
          {arabicDua && (
            <p className="font-arabic th-surface2 rounded-xl px-3 py-2 text-lg" dir="rtl" lang="ar">
              {arabicDua}
            </p>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('condolence_ph')}
            required
            rows={3}
            className="th-input rounded-xl px-3 py-2"
          />
          <button className="th-primary justify-self-start rounded-xl px-5 py-2 font-semibold transition hover:opacity-90">
            {t('post_wall')}
          </button>
        </form>
        <div className="mt-6 space-y-4">
          {wall.length === 0 && <p className="th-muted text-sm">{t('no_messages')}</p>}
          {wall.map((c) => (
            <article key={c.id} className="th-surface2 th-border rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold">{c.author}</span>
                  {c.relationship && <span className="th-muted text-sm"> · {c.relationship}</span>}
                  <span className="th-muted block text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => giveWallDua(c.id)}
                  disabled={wallDuas.has(c.id)}
                  className="shrink-0 rounded-full bg-rose-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-800 disabled:bg-rose-300"
                  title={t('offer_dua')}
                >
                  🤲 {c.duaCount}
                </button>
              </div>
              {c.arabicDua && (
                <p className="font-arabic mt-2 text-lg" dir="rtl" lang="ar">
                  {c.arabicDua}
                </p>
              )}
              <p className="mt-1 leading-relaxed whitespace-pre-line">{c.message}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
