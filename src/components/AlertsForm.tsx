import { useState } from 'react'
import * as api from '../services/api'
import { useSettings } from '../context/settings'

export default function AlertsForm() {
  const { t } = useSettings()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState(25)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.subscribeAlerts({ email: email.trim(), phone: phone.trim() || undefined, city: city.trim(), radiusMiles: radius })
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="font-display text-3xl font-bold">🔔 {t('alerts_title')}</h2>
      <p className="th-muted mt-2">{t('alerts_sub')}</p>
      {done ? (
        <div className="mt-6 rounded-2xl border border-emerald-600/40 bg-emerald-600/10 p-5 font-medium">{t('subscribed_msg')}</div>
      ) : (
        <form onSubmit={submit} className="th-surface mt-6 grid gap-3 rounded-3xl p-6 shadow-sm">
          <label className="grid gap-1 text-sm font-medium">
            {t('email')}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="th-input rounded-xl px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {t('phone_opt')}
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="th-input rounded-xl px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {t('city_label')}
            <input required value={city} onChange={(e) => setCity(e.target.value)} className="th-input rounded-xl px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {t('radius_label')}: {radius}
            <input type="range" min={5} max={100} step={5} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
          </label>
          <button className="th-primary mt-2 rounded-xl px-5 py-2.5 font-semibold transition hover:opacity-90">{t('subscribe_btn')}</button>
        </form>
      )}
    </div>
  )
}
