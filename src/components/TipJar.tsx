import { useState } from 'react'
import * as api from '../services/api'
import { useSettings } from '../context/settings'

const AMOUNTS = [0, 5, 10, 25]

export default function TipJar() {
  const { t } = useSettings()
  const [amount, setAmount] = useState(0)
  const [name, setName] = useState('')
  const [done, setDone] = useState(false)

  const record = async () => {
    if (amount > 0) await api.submitTip(amount, name.trim() || undefined)
    setDone(true)
  }

  return (
    <div className="th-surface rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold">🫙 {t('tip_title')}</h3>
      <p className="th-muted mt-1 text-sm">{t('tip_sub')}</p>
      {done ? (
        <p className="mt-3 font-medium">{t('tip_thanks')}</p>
      ) : (
        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${amount === a ? 'th-primary' : 'th-surface2 th-border border'}`}
              >
                {a === 0 ? '$0' : `$${a}`}
              </button>
            ))}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('your_name')}
            className="th-input rounded-xl px-3 py-2"
          />
          <button onClick={record} className="th-primary justify-self-start rounded-xl px-5 py-2 font-semibold transition hover:opacity-90">
            {t('tip_record')}
          </button>
        </div>
      )}
    </div>
  )
}
