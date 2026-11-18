import { useEffect, useRef, useState } from 'react'
import type { Obituary, ObituaryInput } from '../types'
import * as api from '../services/api'
import { ageFromDates } from '../lib/format'
import type { NoticeFields } from '../lib/notice'
import { useSettings } from '../context/settings'
import PhotoIntake from './PhotoIntake'

/**
 * Admin workspace (V3) — its own shell, reached by direct address only
 * (#/admin); it is not linked from the public site. Passcode gate is a UI
 * gate for this static deployment; a hosted backend would use real logins.
 */
const ADMIN_PASSCODE = 'albaqaa-admin'

interface Props {
  onDataChanged: () => void
}

type Tab = 'queue' | 'photo' | 'listings' | 'publish'

const inputCls = 'th-input w-full rounded-xl px-3 py-2'
const labelCls = 'grid gap-1 text-sm font-medium'

export default function AdminView({ onDataChanged }: Props) {
  const { t } = useSettings()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('albaqaa.admin') === '1')
  const [code, setCode] = useState('')
  const [tab, setTab] = useState<Tab>('queue')
  const [stats, setStats] = useState<Awaited<ReturnType<typeof api.adminStats>> | null>(null)
  const [obits, setObits] = useState<Obituary[]>([])
  const [pending, setPending] = useState<Obituary[]>([])
  const [notice, setNotice] = useState('')
  const [packetText, setPacketText] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const packetFileRef = useRef<HTMLInputElement>(null)

  /* Photo-intake direct-publish form */
  const [f, setF] = useState({ name: '', dod: '', dob: '', city: '', state: '', mosque: '', address: '', datetime: '', afterPrayer: '', cemetery: '', biography: '' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((prev) => ({ ...prev, [k]: e.target.value }))

  const refresh = async () => {
    setStats(await api.adminStats())
    setObits(await api.adminListObituaries())
    setPending(api.listPendingSubmissions())
  }

  useEffect(() => {
    if (unlocked) void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked])

  const unlock = () => {
    if (code === ADMIN_PASSCODE) {
      sessionStorage.setItem('albaqaa.admin', '1')
      sessionStorage.setItem('albaqaa.adminCode', code)
      setUnlocked(true)
    } else {
      setNotice('Incorrect passcode.')
    }
  }

  const lock = () => {
    sessionStorage.removeItem('albaqaa.admin')
    sessionStorage.removeItem('albaqaa.adminCode')
    setUnlocked(false)
  }

  const doExport = async () => {
    const db = await api.exportDatabase()
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'database.json'
    a.click()
    URL.revokeObjectURL(url)
    setNotice('Exported database.json — see the Publish tab for how to put it live for everyone.')
  }

  const doImport = async (file: File) => {
    try {
      const text = await file.text()
      api.importDatabase(text)
      setNotice('Database imported on this device. Reloading data…')
      onDataChanged()
      await refresh()
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Import failed — that file is not a valid Al-Baqaa database.')
    }
  }

  const importPacket = (text: string) => {
    try {
      const saved = api.importSubmissionPacket(text)
      setNotice(`Imported the submission for ${saved.name} into the review queue.`)
      setPacketText('')
      void refresh()
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'That submission could not be imported.')
    }
  }

  const approve = async (o: Obituary) => {
    await api.approvePendingSubmission(o.id)
    setNotice(`${o.name} is now published on this device. Export from the Publish tab to put it live for everyone.`)
    onDataChanged()
    await refresh()
  }

  const reject = async (o: Obituary) => {
    if (!window.confirm(`Remove the pending submission for ${o.name}? This cannot be undone.`)) return
    api.rejectPendingSubmission(o.id)
    await refresh()
  }

  const toggleVerified = async (o: Obituary) => {
    await api.adminSetVerified(o.id, !o.verified)
    await refresh()
    onDataChanged()
  }

  const remove = async (o: Obituary) => {
    if (!window.confirm(`Delete the obituary for ${o.name}?`)) return
    await api.adminDeleteObituary(o.id)
    await refresh()
    onDataChanged()
  }

  const applyNotice = (nf: NoticeFields) => {
    setF((prev) => ({
      ...prev,
      name: nf.name ?? prev.name,
      dod: nf.dateOfPassing ?? prev.dod,
      dob: nf.dateOfBirth ?? prev.dob,
      city: nf.city ?? prev.city,
      state: nf.state ?? prev.state,
      mosque: nf.mosque ?? prev.mosque,
      address: nf.address ?? prev.address,
      datetime: nf.datetime ?? prev.datetime,
      afterPrayer: nf.afterPrayer ?? prev.afterPrayer,
      cemetery: nf.cemetery ?? prev.cemetery,
    }))
    setNotice('Photo read — check the fields against the photo, add a line or two of biography, then publish.')
  }

  const publishDirect = async () => {
    if (!f.name.trim() || !f.dod || !f.city.trim() || !f.biography.trim()) {
      setNotice('Name, date of passing, city and a short biography are required to publish.')
      return
    }
    const input: ObituaryInput = {
      name: f.name.trim(),
      dateOfBirth: f.dob || undefined,
      dateOfPassing: f.dod,
      age: f.dob ? ageFromDates(f.dob, f.dod) : undefined,
      city: f.city.trim(),
      state: f.state.trim(),
      biography: f.biography.trim(),
      sect: 'Sunni',
      family: '',
      verified: true,
      submittedVia: 'admin',
      janazah: f.mosque.trim()
        ? {
            mosque: f.mosque.trim(),
            address: f.address.trim(),
            datetime: f.datetime || new Date().toISOString(),
            afterPrayer: f.afterPrayer.trim() || undefined,
            cemetery: f.cemetery.trim() || undefined,
          }
        : undefined,
    }
    const saved = await api.createObituary(input)
    setNotice(`${saved.name} published on this device. Export from the Publish tab to put it live for everyone.`)
    setF({ name: '', dod: '', dob: '', city: '', state: '', mosque: '', address: '', datetime: '', afterPrayer: '', cemetery: '', biography: '' })
    onDataChanged()
    await refresh()
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl font-bold">🔐 {t('admin_title')}</h2>
        <p className="th-muted mt-2">{t('admin_locked')}</p>
        <div className="th-surface mt-6 grid gap-3 rounded-3xl p-6 shadow-sm">
          <label className="grid gap-1 text-sm font-medium">
            Passcode
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && unlock()}
              className="th-input rounded-xl px-3 py-2"
              autoComplete="current-password"
            />
          </label>
          <button onClick={unlock} className="th-primary rounded-xl px-5 py-2 font-semibold transition hover:opacity-90">
            {t('admin_unlock')}
          </button>
          <p className="th-muted text-xs leading-relaxed">
            Admins review submissions sent by families, add obituaries from a photo of the notice, verify or remove listings, and
            publish updates to the shared database.
          </p>
          {notice && (
            <p role="alert" className="text-sm font-medium text-rose-700">
              {notice}
            </p>
          )}
        </div>
      </div>
    )
  }

  const tabBtn = (id: Tab, label: string, badge?: number) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      aria-pressed={tab === id}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === id ? 'bg-white text-stone-900' : 'text-white/85 hover:bg-white/10'}`}
    >
      {label}
      {badge ? <span className="ms-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">{badge}</span> : null}
    </button>
  )

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-3xl font-bold">🔐 {t('admin_title')}</h2>
        <button onClick={lock} className="th-surface2 th-border rounded-xl border px-3 py-1.5 text-sm font-semibold">
          Lock
        </button>
      </div>

      <nav className="mt-4 flex flex-wrap gap-1 rounded-2xl bg-stone-900 p-1.5" aria-label="Admin sections">
        {tabBtn('queue', 'Review Queue', pending.length)}
        {tabBtn('photo', 'Photo Intake')}
        {tabBtn('listings', 'Listings')}
        {tabBtn('publish', 'Publish')}
      </nav>

      {stats && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['Obituaries', stats.obituaries],
            ['Pending review', stats.pending],
            ['Condolences', stats.condolences],
            ['Vendors', stats.vendors],
            ['Alert subs (device)', stats.subscriptions],
            ['My submissions', stats.mySubmissions],
          ].map(([label, value]) => (
            <div key={label as string} className="th-surface rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold">{value}</div>
              <div className="th-muted text-xs">{label}</div>
            </div>
          ))}
        </div>
      )}
      {notice && (
        <p role="status" className="mt-3 text-sm font-medium">
          {notice}
        </p>
      )}

      {tab === 'queue' && (
        <section className="mt-6">
          <div className="th-surface rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold">Import a submission from a family</h3>
            <p className="th-muted mt-1 text-sm leading-relaxed">
              Families send a submission file or the copied submission data (WhatsApp / email). Paste the data here or choose the
              file — it lands in the queue below for your review. Nothing goes public until you approve it.
            </p>
            <textarea
              value={packetText}
              onChange={(e) => setPacketText(e.target.value)}
              rows={4}
              placeholder="Paste submission data here…"
              className="th-input mt-3 w-full rounded-xl px-3 py-2 text-xs"
              aria-label="Paste submission data"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => packetText.trim() && importPacket(packetText)}
                className="th-primary rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
              >
                Import pasted submission
              </button>
              <button onClick={() => packetFileRef.current?.click()} className="th-surface2 th-border rounded-xl border px-4 py-2 text-sm font-semibold">
                ⬆️ Import submission file
              </button>
              <input
                ref={packetFileRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) importPacket(await file.text())
                  e.target.value = ''
                }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {pending.length === 0 && <p className="th-muted">The review queue is empty. New submissions you import will appear here.</p>}
            {pending.map((o) => (
              <article key={o.id} className="th-surface rounded-3xl p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold">{o.name}</h4>
                    <p className="th-muted text-sm">
                      Passed {o.dateOfPassing} · {o.city}
                      {o.state ? `, ${o.state}` : ''} · via {o.submittedVia ?? 'form'}
                    </p>
                    {o.janazah && (
                      <p className="text-sm">
                        Janazah: {o.janazah.mosque} — {new Date(o.janazah.datetime).toLocaleString()}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{o.biography}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => void approve(o)} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                      ✓ Approve & publish
                    </button>
                    <button onClick={() => void reject(o)} className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800">
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'photo' && (
        <section className="mt-6 grid gap-5">
          <PhotoIntake
            onFields={applyNotice}
            heading="Add an obituary from a photo"
            sub="For families in sorrow: they only send a photo of the notice — you do the rest. The photo is read on this device only and is never uploaded."
          />
          <div className="th-surface grid gap-3 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold">Check the details, then publish</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>Full name *<input value={f.name} onChange={set('name')} className={inputCls} /></label>
              <label className={labelCls}>Date of passing *<input type="date" value={f.dod} onChange={set('dod')} className={inputCls} /></label>
              <label className={labelCls}>Date of birth<input type="date" value={f.dob} onChange={set('dob')} className={inputCls} /></label>
              <label className={labelCls}>City *<input value={f.city} onChange={set('city')} className={inputCls} /></label>
              <label className={labelCls}>State / region<input value={f.state} onChange={set('state')} className={inputCls} /></label>
              <label className={labelCls}>Mosque / venue<input value={f.mosque} onChange={set('mosque')} className={inputCls} /></label>
              <label className={labelCls}>Address<input value={f.address} onChange={set('address')} className={inputCls} /></label>
              <label className={labelCls}>Janazah date & time<input type="datetime-local" value={f.datetime} onChange={set('datetime')} className={inputCls} /></label>
              <label className={labelCls}>Prayer timing<input value={f.afterPrayer} onChange={set('afterPrayer')} placeholder="After Dhuhr" className={inputCls} /></label>
              <label className={labelCls}>Cemetery<input value={f.cemetery} onChange={set('cemetery')} className={inputCls} /></label>
            </div>
            <label className={labelCls}>
              Biography *
              <textarea value={f.biography} onChange={set('biography')} rows={4} className={inputCls} placeholder="A few lines about them — the family can add more later." />
            </label>
            <button onClick={() => void publishDirect()} className="th-primary justify-self-start rounded-xl px-5 py-2.5 font-semibold transition hover:opacity-90">
              Publish obituary
            </button>
          </div>
        </section>
      )}

      {tab === 'listings' && (
        <section className="th-surface mt-6 overflow-hidden rounded-3xl shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="th-surface2 th-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Passed</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {obits.map((o) => (
                <tr key={o.id} className="th-border border-t">
                  <td className="px-4 py-3 font-medium">{o.name}</td>
                  <td className="px-4 py-3">{o.kind === 'scholar' ? '🎓 Scholar' : 'Community'}</td>
                  <td className="px-4 py-3">{o.dateOfPassing}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => void toggleVerified(o)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${o.verified ? 'bg-emerald-700' : 'bg-stone-500'}`}
                    >
                      {o.verified ? '✓ Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => void remove(o)} className="rounded-lg bg-rose-700 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'publish' && (
        <section className="th-surface mt-6 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold">Publish updates to everyone</h3>
          <p className="mt-1 text-sm leading-relaxed">
            This site runs on a shared database file. Publishing takes three short steps:
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm leading-relaxed">
            <li>Approve submissions in the Review Queue (or add them in Photo Intake).</li>
            <li>
              Click <strong>Export database.json</strong> below to download the updated shared database.
            </li>
            <li>
              Upload it to the site repository as <code>public/data/database.json</code> —{' '}
              <a
                className="underline"
                href="https://github.com/ViperSurf/MuslimObituaries/upload/main/public/data"
                target="_blank"
                rel="noreferrer"
              >
                open the upload page
              </a>{' '}
              and drop the file in. The site redeploys itself within a couple of minutes.
            </li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => void doExport()} className="th-primary rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90">
              ⬇️ {t('export_btn')}
            </button>
            <button onClick={() => fileRef.current?.click()} className="th-surface rounded-xl px-4 py-2 text-sm font-semibold shadow-sm">
              ⬆️ {t('import_btn')}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void doImport(file)
                e.target.value = ''
              }}
            />
          </div>
          <p className="th-muted mt-4 text-xs leading-relaxed">{t('admin_test_note')}</p>
        </section>
      )}
    </div>
  )
}
