import { useEffect, useRef, useState } from 'react'
import type { Obituary } from '../types'
import * as api from '../services/api'
import { useSettings } from '../context/settings'

/**
 * Demo admin passcode for this static build. It gates the panel UI only —
 * it is NOT real security (anyone can read the bundle). A production
 * deployment needs a real backend with authenticated admins; the data
 * contract is in public/api/v1/openapi.json.
 */
const ADMIN_PASSCODE = 'albaqaa-admin'

interface Props {
  onDataChanged: () => void
}

export default function AdminView({ onDataChanged }: Props) {
  const { t } = useSettings()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('albaqaa.admin') === '1')
  const [code, setCode] = useState('')
  const [stats, setStats] = useState<Awaited<ReturnType<typeof api.adminStats>> | null>(null)
  const [obits, setObits] = useState<Obituary[]>([])
  const [notice, setNotice] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = async () => {
    setStats(await api.adminStats())
    setObits(await api.listObituaries({}))
  }

  useEffect(() => {
    if (unlocked) void refresh()
  }, [unlocked])

  const unlock = () => {
    if (code === ADMIN_PASSCODE) {
      sessionStorage.setItem('albaqaa.admin', '1')
      setUnlocked(true)
    } else {
      setNotice('Incorrect passcode.')
    }
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
    setNotice('Exported. To publish to every visitor: commit this file as public/data/database.json in the GitHub repo and push — the next deploy updates the shared database.')
  }

  const doImport = async (file: File) => {
    try {
      const text = await file.text()
      api.importDatabase(text)
      setNotice('Database imported on this device. Reloading data…')
      onDataChanged()
      await refresh()
    } catch {
      setNotice('Import failed — that file is not a valid Al-Baqaa database.')
    }
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

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl font-bold">🔐 {t('admin_title')}</h2>
        <p className="th-muted mt-2">{t('admin_locked')}</p>
        <div className="th-surface mt-6 grid gap-3 rounded-3xl p-6 shadow-sm">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            placeholder="Passcode"
            className="th-input rounded-xl px-3 py-2"
          />
          <button onClick={unlock} className="th-primary rounded-xl px-5 py-2 font-semibold transition hover:opacity-90">
            {t('admin_unlock')}
          </button>
          <p className="th-muted text-xs leading-relaxed">
            Demo passcode for this static build: <code className="font-mono">albaqaa-admin</code>. It only hides this
            panel — it is not real security. Production needs an authenticated backend (see the OpenAPI contract).
          </p>
          {notice && <p className="text-sm font-medium text-rose-700">{notice}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="font-display text-3xl font-bold">🔐 {t('admin_title')}</h2>
      {stats && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['Obituaries', stats.obituaries],
            ['Condolences', stats.condolences],
            ['Vendors', stats.vendors],
            ['Alert subs (device)', stats.subscriptions],
            ['Tips total (device)', `$${stats.tipsTotal}`],
            ['My submissions', stats.mySubmissions],
          ].map(([label, value]) => (
            <div key={label as string} className="th-surface rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold">{value}</div>
              <div className="th-muted text-xs">{label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={doExport} className="th-primary rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90">
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
            const f = e.target.files?.[0]
            if (f) void doImport(f)
            e.target.value = ''
          }}
        />
      </div>
      {notice && <p className="mt-3 text-sm font-medium">{notice}</p>}
      <div className="th-surface mt-6 overflow-hidden rounded-3xl shadow-sm">
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
                    onClick={() => toggleVerified(o)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${o.verified ? 'bg-emerald-700' : 'bg-stone-500'}`}
                  >
                    {o.verified ? '✓ Verified' : 'Unverified'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(o)} className="rounded-lg bg-rose-700 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
