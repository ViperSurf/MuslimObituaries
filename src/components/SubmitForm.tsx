import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { Sect } from '../types'
import { createObituary } from '../services/api'

const inputCls =
  'w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-700 bg-white'
const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1'

export default function SubmitForm({ onDone }: { onDone: (id: string) => void }) {
  const [step, setStep] = useState(1)
  const [tip, setTip] = useState(0)
  const [form, setForm] = useState({
    name: '',
    arabicName: '',
    age: '',
    city: '',
    state: '',
    biography: '',
    sect: 'Sunni' as Sect,
    dateOfDeath: '',
    mosque: '',
    janazahAddress: '',
    janazahDate: '',
    janazahTime: '',
    afterPrayer: '',
    janazahNotes: '',
    cemetery: '',
    burialAddress: '',
    family: '',
    charityName: '',
    charityGoal: '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const canContinue =
    step === 1 ? form.name.trim() && form.city.trim() && form.dateOfDeath : step === 2 ? form.mosque.trim() : true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const created = await createObituary({
      name: form.name.trim(),
      arabicName: form.arabicName.trim() || undefined,
      age: form.age ? Number(form.age) : undefined,
      city: form.city.trim(),
      state: form.state.trim().toUpperCase() || '—',
      biography: form.biography.trim(),
      sect: form.sect,
      dateOfDeath: form.dateOfDeath,
      janazah: form.mosque.trim()
        ? {
            mosque: form.mosque.trim(),
            address: form.janazahAddress.trim(),
            datetime: new Date(
              `${form.janazahDate || form.dateOfDeath}T${form.janazahTime || '13:30'}`,
            ).toISOString(),
            afterPrayer: form.afterPrayer.trim() || undefined,
            notes: form.janazahNotes.trim() || undefined,
          }
        : undefined,
      burial: form.cemetery.trim()
        ? { cemetery: form.cemetery.trim(), address: form.burialAddress.trim() }
        : undefined,
      family: form.family.trim(),
      charity: form.charityName.trim()
        ? { name: form.charityName.trim(), goal: Number(form.charityGoal) || 1000, raised: 0 }
        : undefined,
    })
    onDone(created.id)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-emerald-950">Submit an obituary</h1>
      <p className="mt-1 text-sm text-stone-600">
        Free, always. Submissions appear immediately in this V1 demo — in production they would be
        reviewed by a community admin before publishing.
      </p>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-emerald-800' : 'bg-stone-200'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-emerald-950/10 bg-white p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-emerald-950">Step 1 — The deceased</h2>
            <div>
              <label className={labelCls}>Full name *</label>
              <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Hajjah Maryam Abdullah" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Name in Arabic</label>
                <input className={inputCls} value={form.arabicName} onChange={set('arabicName')} dir="rtl" />
              </div>
              <div>
                <label className={labelCls}>Age</label>
                <input className={inputCls} type="number" min={0} max={130} value={form.age} onChange={set('age')} />
              </div>
              <div>
                <label className={labelCls}>City *</label>
                <input className={inputCls} value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className={labelCls}>State</label>
                <input className={inputCls} value={form.state} onChange={set('state')} placeholder="IL" maxLength={2} />
              </div>
              <div>
                <label className={labelCls}>Date of death *</label>
                <input className={inputCls} type="date" value={form.dateOfDeath} onChange={set('dateOfDeath')} />
              </div>
              <div>
                <label className={labelCls}>Tradition</label>
                <select className={inputCls} value={form.sect} onChange={set('sect')}>
                  <option>Sunni</option>
                  <option>Shia</option>
                  <option>Non-denominational</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Biography &amp; remembrance</label>
              <textarea className={inputCls} rows={4} value={form.biography} onChange={set('biography')} placeholder="Their life, work, and what the community will remember…" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-emerald-950">Step 2 — Janazah &amp; burial</h2>
            <div>
              <label className={labelCls}>Mosque / location *</label>
              <input className={inputCls} value={form.mosque} onChange={set('mosque')} placeholder="e.g. Central Illinois Mosque & Islamic Center (CIMIC)" />
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input className={inputCls} value={form.janazahAddress} onChange={set('janazahAddress')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Janazah date</label>
                <input className={inputCls} type="date" value={form.janazahDate} onChange={set('janazahDate')} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input className={inputCls} type="time" value={form.janazahTime} onChange={set('janazahTime')} />
              </div>
              <div>
                <label className={labelCls}>Or after prayer</label>
                <input className={inputCls} value={form.afterPrayer} onChange={set('afterPrayer')} placeholder="After Dhuhr" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Special instructions</label>
              <input className={inputCls} value={form.janazahNotes} onChange={set('janazahNotes')} placeholder="Parking, Ghusl arrangements, Azza details…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Cemetery</label>
                <input className={inputCls} value={form.cemetery} onChange={set('cemetery')} />
              </div>
              <div>
                <label className={labelCls}>Cemetery address</label>
                <input className={inputCls} value={form.burialAddress} onChange={set('burialAddress')} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-emerald-950">Step 3 — Family &amp; charity</h2>
            <div>
              <label className={labelCls}>Surviving family</label>
              <textarea className={inputCls} rows={2} value={form.family} onChange={set('family')} placeholder="Survived by…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Sadaqah Jariyah cause (optional)</label>
                <input className={inputCls} value={form.charityName} onChange={set('charityName')} placeholder="e.g. Water well in their name" />
              </div>
              <div>
                <label className={labelCls}>Goal ($)</label>
                <input className={inputCls} type="number" min={0} value={form.charityGoal} onChange={set('charityGoal')} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Support Al-Baqaa (optional tip — keeps hosting free for grieving families)</label>
              <div className="flex gap-2">
                {[0, 5, 10, 25].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTip(amount)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                      tip === amount ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-stone-400">Demo only — no payment is processed in V1.</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-stone-500 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <CheckCircle2 className="h-4 w-4" /> Publish obituary
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
