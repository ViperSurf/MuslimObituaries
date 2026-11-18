import { useEffect, useRef, useState } from 'react'
import { PRAYER, SCHOOLS, type Pose, type School } from '../data/prayer'
import { useSettings } from '../context/settings'

/** Simple faceless figure whose pose follows the current step. All motion is
 *  CSS transitions on SVG geometry — no video, no assets — and the global
 *  prefers-reduced-motion rule freezes it. The text always carries the full
 *  information; the figure is a visual aid only. */
function Figure({ pose, small = false }: { pose: Pose; small?: boolean }) {
  const arms: Record<Pose, { l: [number, number, number, number]; r: [number, number, number, number] }> = {
    rows: { l: [92, 68, 106, 94], r: [108, 68, 94, 94] },
    folded: { l: [92, 68, 106, 94], r: [108, 68, 94, 94] },
    takbir: { l: [92, 68, 70, 32], r: [108, 68, 130, 32] },
    'salam-right': { l: [92, 68, 106, 94], r: [108, 68, 94, 94] },
    'salam-left': { l: [92, 68, 106, 94], r: [108, 68, 94, 94] },
  }
  const a = arms[pose]
  const headTransform =
    pose === 'salam-right' ? 'translate(7px, 0px) rotate(10deg)' : pose === 'salam-left' ? 'translate(-7px, 0px) rotate(-10deg)' : 'none'
  const line = (pts: [number, number, number, number], key: string) => (
    <line
      key={key}
      x1={pts[0]}
      y1={pts[1]}
      x2={pts[2]}
      y2={pts[3]}
      stroke="var(--primary)"
      strokeWidth={10}
      strokeLinecap="round"
      style={{ transition: 'all 0.8s ease' }}
    />
  )
  return (
    <svg
      viewBox="0 0 200 220"
      role="img"
      aria-hidden="true"
      className={small ? 'h-28 w-24' : 'mx-auto h-72 w-60 max-w-full'}
    >
      {pose === 'rows' && (
        <g opacity={0.25} fill="var(--muted)">
          <circle cx={42} cy={70} r={10} />
          <path d="M30 190 L36 84 Q42 78 48 84 L54 190 Z" />
          <circle cx={158} cy={70} r={10} />
          <path d="M146 190 L152 84 Q158 78 164 84 L170 190 Z" />
          <rect x={70} y={118} width={60} height={16} rx={4} />
        </g>
      )}
      <g style={{ transform: headTransform, transformOrigin: '100px 52px', transition: 'all 0.8s ease' }}>
        <circle cx={100} cy={36} r={15} fill="var(--primary)" />
        <path d="M86 30 Q100 12 114 30 Q100 24 86 30 Z" fill="var(--surface)" opacity={0.85} />
      </g>
      <path d="M82 212 L91 62 Q100 54 109 62 L118 212 Z" fill="var(--primary)" opacity={0.92} />
      {line(a.l, 'l')}
      {line(a.r, 'r')}
      <line x1={40} y1={212} x2={160} y2={212} stroke="var(--border)" strokeWidth={3} strokeLinecap="round" />
      {(pose === 'salam-right' || pose === 'salam-left') && (
        <text x={pose === 'salam-right' ? 150 : 50} y={36} fontSize={22} fill="var(--accent)" textAnchor="middle">
          {pose === 'salam-right' ? '↪' : '↩'}
        </text>
      )}
    </svg>
  )
}

export default function PrayerGuide() {
  const { lang } = useSettings()
  const c = PRAYER[lang]
  const [step, setStep] = useState(0)
  const [school, setSchool] = useState<School>('shafii')
  const [playing, setPlaying] = useState(false)
  const [allSteps, setAllSteps] = useState(false)
  const [bigText, setBigText] = useState(false)
  const total = c.steps.length
  const current = c.steps[step]
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!playing || allSteps) return
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= total - 1) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, 7000)
    return () => clearInterval(id)
  }, [playing, allSteps, total])

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [lang])

  const saidFor = (s: (typeof c.steps)[number]) => s.saidBySchool?.[school] ?? s.said

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setStep((s) => Math.min(total - 1, s + 1))
    if (e.key === 'ArrowLeft') setStep((s) => Math.max(0, s - 1))
  }

  return (
    <div className={`mx-auto max-w-3xl ${bigText ? 'text-lg' : ''}`}>
      <h2 className="font-display text-3xl font-bold">🕌 {c.heading}</h2>
      <p className="mt-3 leading-relaxed">{c.intro}</p>
      <p className="th-muted mt-2 text-sm leading-relaxed">{c.reviewNote}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium">
          {c.schoolLabel}
          <select
            value={school}
            onChange={(e) => setSchool(e.target.value as School)}
            className="th-input ms-2 rounded-lg px-2 py-1.5 text-sm"
          >
            {SCHOOLS.map((s) => (
              <option key={s} value={s}>
                {c.schools[s]}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => setAllSteps(!allSteps)}
          className="th-surface2 th-border rounded-xl border px-3 py-1.5 text-sm font-semibold"
          aria-pressed={allSteps}
        >
          {allSteps ? c.stepByStep : c.allSteps}
        </button>
        <button
          onClick={() => setBigText(!bigText)}
          className="th-surface2 th-border rounded-xl border px-3 py-1.5 text-sm font-semibold"
          aria-pressed={bigText}
        >
          A+
        </button>
        <button onClick={() => window.print()} className="th-surface2 th-border rounded-xl border px-3 py-1.5 text-sm font-semibold">
          🖨️ {c.print}
        </button>
      </div>
      <p className="th-surface2 mt-3 rounded-2xl px-4 py-3 text-sm leading-relaxed">{c.schoolNotes[school]}</p>

      {!allSteps ? (
        <section
          ref={sectionRef}
          tabIndex={0}
          onKeyDown={onKey}
          aria-label={c.heading}
          className="th-surface mt-5 rounded-3xl p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-2" aria-hidden="true">
            {c.steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-emerald-600' : 'th-surface2'}`} />
            ))}
          </div>
          <p className="th-muted mt-3 text-sm font-medium" aria-live="polite">
            {c.stepOf(step + 1, total)} — {current.title}
          </p>
          <Figure pose={current.pose} />
          <h3 className="font-display mt-2 text-2xl font-bold">{current.title}</h3>
          <p className="mt-2 leading-relaxed">{current.action}</p>
          {current.said && (
            <div className="th-surface2 mt-4 rounded-2xl p-4">
              {current.saidLabel && <p className="text-xs font-bold tracking-wide uppercase opacity-70">{current.saidLabel}</p>}
              {current.arabic && (
                <p className="font-arabic mt-2 text-2xl leading-relaxed" dir="rtl" lang="ar">
                  {school === 'hanafi' && step === 1 ? THANA_DISPLAY : current.arabic}
                </p>
              )}
              {current.translit && <p className="mt-2 text-sm italic opacity-80">{current.translit}</p>}
              <p className="mt-2 leading-relaxed">{saidFor(current)}</p>
            </div>
          )}
          <div className="mt-6 flex items-center justify-between gap-2">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="th-surface2 th-border rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              ← {c.back}
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="th-surface2 th-border rounded-xl border px-4 py-2 text-sm font-semibold"
              aria-pressed={playing}
            >
              {playing ? `⏸ ${c.pause}` : `▶ ${c.play}`}
            </button>
            <button
              onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
              disabled={step === total - 1}
              className="th-primary rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              {c.next} →
            </button>
          </div>
          <p className="th-muted mt-4 text-center text-sm">{c.followImam}</p>
        </section>
      ) : (
        <div className="mt-5 space-y-4">
          {c.steps.map((s, i) => (
            <section key={i} className="th-surface flex gap-4 rounded-3xl p-5 shadow-sm">
              <Figure pose={s.pose} small />
              <div>
                <h3 className="font-display text-lg font-bold">
                  {c.stepOf(i + 1, total)} — {s.title}
                </h3>
                <p className="mt-1 leading-relaxed">{s.action}</p>
                {s.arabic && (
                  <p className="font-arabic mt-2 text-xl" dir="rtl" lang="ar">
                    {s.arabic}
                  </p>
                )}
                {s.said && <p className="mt-1 leading-relaxed">{saidFor(s)}</p>}
              </div>
            </section>
          ))}
          <p className="th-muted text-center text-sm">{c.followImam}</p>
        </div>
      )}
    </div>
  )
}

const THANA_DISPLAY = 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ'
