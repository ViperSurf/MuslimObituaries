import { CHECKLIST } from '../data/checklist'
import { useSettings } from '../context/settings'

export default function ChecklistView() {
  const { lang } = useSettings()
  const c = CHECKLIST[lang]
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="font-display text-3xl font-bold">🤲 {c.heading}</h2>
      <p className="mt-3 leading-relaxed">{c.intro}</p>
      <ol className="mt-6 space-y-3">
        {c.items.map((item, i) => (
          <li key={item.title} className="th-surface flex gap-4 rounded-3xl p-5 shadow-sm">
            <span className="th-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold">{i + 1}</span>
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-1 leading-relaxed">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="th-muted mt-5 text-sm leading-relaxed">{c.note}</p>
    </div>
  )
}
