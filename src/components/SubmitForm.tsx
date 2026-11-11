import { useState } from 'react'
import type { ObituaryInput, SadaqahProject, Sect } from '../types'
import * as api from '../services/api'
import { ageFromDates } from '../lib/format'
import { useSettings } from '../context/settings'
import TipJar from './TipJar'

interface Props {
  onDone: (id: string) => void
}

const inputCls = 'th-input w-full rounded-xl px-3 py-2'
const labelCls = 'grid gap-1 text-sm font-medium'

export default function SubmitForm({ onDone }: Props) {
  const { t } = useSettings()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [arabicName, setArabicName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [dob, setDob] = useState('')
  const [dod, setDod] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [sect, setSect] = useState<Sect>('Sunni')
  const [biography, setBiography] = useState('')
  const [family, setFamily] = useState('')
  const [familyMembers, setFamilyMembers] = useState('')
  const [mosque, setMosque] = useState('')
  const [address, setAddress] = useState('')
  const [datetime, setDatetime] = useState('')
  const [afterPrayer, setAfterPrayer] = useState('')
  const [cemetery, setCemetery] = useState('')
  const [cemeteryAddress, setCemeteryAddress] = useState('')
  const [burialTime, setBurialTime] = useState('')
  const [notes, setNotes] = useState('')
  const [charityTitle, setCharityTitle] = useState('')
  const [charityOrg, setCharityOrg] = useState('')
  const [charityCategory, setCharityCategory] = useState<SadaqahProject['category']>('Water Well')
  const [charityGoal, setCharityGoal] = useState('')
  const [charityUrl, setCharityUrl] = useState('')
  const [charityDesc, setCharityDesc] = useState('')
  const [error, setError] = useState('')

  const step1Valid = name.trim() && dod && city.trim() && biography.trim()

  const publish = async () => {
    setError('')
    if (!step1Valid) {
      setError('Name, date of passing, city and biography are required.')
      setStep(1)
      return
    }
    const input: ObituaryInput = {
      name: name.trim(),
      arabicName: arabicName.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,
      dateOfBirth: dob || undefined,
      dateOfPassing: dod,
      age: dob ? ageFromDates(dob, dod) : undefined,
      city: city.trim(),
      state: stateName.trim(),
      biography: biography.trim(),
      sect,
      family: family.trim(),
      familyMembers: familyMembers.split('\n').map((s) => s.trim()).filter(Boolean),
      janazah: mosque.trim()
        ? {
            mosque: mosque.trim(),
            address: address.trim(),
            datetime: datetime || new Date().toISOString(),
            afterPrayer: afterPrayer.trim() || undefined,
            notes: notes.trim() || undefined,
            cemetery: cemetery.trim() || undefined,
            cemeteryAddress: cemeteryAddress.trim() || undefined,
            burialTime: burialTime.trim() || undefined,
          }
        : undefined,
      sadaqah: charityTitle.trim()
        ? [
            {
              id: `sj-${Date.now().toString(36)}`,
              title: charityTitle.trim(),
              organization: charityOrg.trim(),
              category: charityCategory,
              goal: Number(charityGoal) || 0,
              raised: 0,
              donationUrl: charityUrl.trim() || undefined,
              description: charityDesc.trim(),
            },
          ]
        : undefined,
    }
    const saved = await api.createObituary(input)
    onDone(saved.id)
  }

  const steps = ['step 1', 'step 2', 'step 3', 'step 4']
  void steps

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display text-3xl font-bold">{t('submit_title')}</h2>
      <p className="th-muted mt-2">{t('submit_sub')}</p>
      <div className="mt-5 flex gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-emerald-600' : 'th-surface2'}`} />
        ))}
      </div>
      <p className="th-muted mt-2 text-sm font-medium">
        Step {step} of 4: {step === 1 ? 'Deceased information' : step === 2 ? 'Janazah logistics' : step === 3 ? 'Sadaqah Jariyah' : 'Tip jar & publish'}
      </p>

      <div className="th-surface mt-4 grid gap-3 rounded-3xl p-6 shadow-sm">
        {step === 1 && (
          <>
            <label className={labelCls}>
              {t('f_name')} *
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                {t('f_arabic')}
                <input value={arabicName} onChange={(e) => setArabicName(e.target.value)} className={inputCls} dir="rtl" lang="ar" />
              </label>
              <label className={labelCls}>
                {t('f_photo')}
                <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://…" className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_dob')}
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_dod')} *
                <input type="date" value={dod} onChange={(e) => setDod(e.target.value)} required className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_city')} *
                <input value={city} onChange={(e) => setCity(e.target.value)} required className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_state')}
                <input value={stateName} onChange={(e) => setStateName(e.target.value)} className={inputCls} />
              </label>
            </div>
            <label className={labelCls}>
              {t('f_sect')}
              <select value={sect} onChange={(e) => setSect(e.target.value as Sect)} className={inputCls}>
                <option>Sunni</option>
                <option>Shia</option>
                <option>Non-denominational</option>
              </select>
            </label>
            <label className={labelCls}>
              {t('f_bio')} *
              <textarea value={biography} onChange={(e) => setBiography(e.target.value)} required rows={5} className={inputCls} />
            </label>
            <label className={labelCls}>
              {t('f_family')}
              <input value={family} onChange={(e) => setFamily(e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Family members (one per line)
              <textarea value={familyMembers} onChange={(e) => setFamilyMembers(e.target.value)} rows={3} className={inputCls} />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <label className={labelCls}>
              {t('f_mosque')}
              <input value={mosque} onChange={(e) => setMosque(e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              {t('f_address')}
              <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                {t('f_datetime')}
                <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_after')}
                <input value={afterPrayer} onChange={(e) => setAfterPrayer(e.target.value)} placeholder="After Dhuhr" className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_cemetery')}
                <input value={cemetery} onChange={(e) => setCemetery(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('cemetery_label')} {t('f_address')}
                <input value={cemeteryAddress} onChange={(e) => setCemeteryAddress(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('burial_label')}
                <input value={burialTime} onChange={(e) => setBurialTime(e.target.value)} placeholder="Immediately after Janazah" className={inputCls} />
              </label>
            </div>
            <label className={labelCls}>
              {t('f_notes')}
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputCls} />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <label className={labelCls}>
              {t('f_charity_title')}
              <input value={charityTitle} onChange={(e) => setCharityTitle(e.target.value)} className={inputCls} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                {t('f_charity_org')}
                <input value={charityOrg} onChange={(e) => setCharityOrg(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                Category
                <select value={charityCategory} onChange={(e) => setCharityCategory(e.target.value as SadaqahProject['category'])} className={inputCls}>
                  <option>Water Well</option>
                  <option>Mosque Construction</option>
                  <option>Orphan Care</option>
                  <option>Quran Distribution</option>
                  <option>Medical Relief</option>
                  <option>Other</option>
                </select>
              </label>
              <label className={labelCls}>
                {t('f_charity_goal')}
                <input type="number" min={0} value={charityGoal} onChange={(e) => setCharityGoal(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                Donation URL
                <input value={charityUrl} onChange={(e) => setCharityUrl(e.target.value)} placeholder="https://…" className={inputCls} />
              </label>
            </div>
            <label className={labelCls}>
              Description
              <textarea value={charityDesc} onChange={(e) => setCharityDesc(e.target.value)} rows={3} className={inputCls} />
            </label>
          </>
        )}

        {step === 4 && (
          <>
            <div className="th-surface2 th-border rounded-2xl border p-4 text-sm leading-relaxed">
              <strong>{name || '—'}</strong>
              {dod && <> · {t('passed')}: {dod}</>}
              {city && (
                <>
                  <br />
                  {city}
                  {stateName ? `, ${stateName}` : ''}
                </>
              )}
              {mosque && (
                <>
                  <br />
                  {t('janazah_prayer')}: {mosque}
                  {datetime ? ` · ${new Date(datetime).toLocaleString()}` : ''}
                </>
              )}
              {charityTitle && (
                <>
                  <br />
                  {t('sadaqah_title')}: {charityTitle}
                </>
              )}
            </div>
            <TipJar />
            {error && <p className="font-medium text-rose-700">{error}</p>}
            <button onClick={publish} className="th-primary rounded-xl px-5 py-3 font-semibold transition hover:opacity-90">
              {t('publish')}
            </button>
          </>
        )}

        <div className="mt-2 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="th-surface2 th-border rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            ← {t('back')}
          </button>
          {step < 4 && (
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="th-primary rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              {t('continue')} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
