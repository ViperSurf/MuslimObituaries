import { useEffect, useState } from 'react'
import type { Obituary, ObituaryInput, SadaqahProject, Sect } from '../types'
import * as api from '../services/api'
import { ageFromDates } from '../lib/format'
import { fileToPortraitDataUrl, type NoticeFields } from '../lib/notice'
import { useSettings } from '../context/settings'
import PhotoIntake from './PhotoIntake'

const inputCls = 'th-input w-full rounded-xl px-3 py-2'
const labelCls = 'grid gap-1 text-sm font-medium'
const DRAFT_KEY = 'albaqaa.v3.submitDraft'

interface Draft {
  [k: string]: string
}

function loadDraft(): Draft {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}') as Draft
  } catch {
    return {}
  }
}

/**
 * V3 submit — grief-first. Five essentials, everything else optional and
 * tucked away. A photo of the notice can pre-fill the form. Submissions go
 * to a pending queue, never straight to public: the submitter gets a
 * submission packet to send to an admin (Option A), who reviews and
 * publishes it. The draft autosaves on this device so an interrupted
 * family loses nothing.
 */
export default function SubmitForm() {
  const { t } = useSettings()
  const [draft0] = useState<Draft>(loadDraft)
  const [name, setName] = useState(draft0.name ?? '')
  const [arabicName, setArabicName] = useState(draft0.arabicName ?? '')
  const [photoUrl, setPhotoUrl] = useState(draft0.photoUrl ?? '')
  const [dob, setDob] = useState(draft0.dob ?? '')
  const [dod, setDod] = useState(draft0.dod ?? '')
  const [city, setCity] = useState(draft0.city ?? '')
  const [stateName, setStateName] = useState(draft0.stateName ?? '')
  const [sect, setSect] = useState<Sect>((draft0.sect as Sect) || 'Sunni')
  const [biography, setBiography] = useState(draft0.biography ?? '')
  const [family, setFamily] = useState(draft0.family ?? '')
  const [familyMembers, setFamilyMembers] = useState(draft0.familyMembers ?? '')
  const [mosque, setMosque] = useState(draft0.mosque ?? '')
  const [address, setAddress] = useState(draft0.address ?? '')
  const [datetime, setDatetime] = useState(draft0.datetime ?? '')
  const [afterPrayer, setAfterPrayer] = useState(draft0.afterPrayer ?? '')
  const [cemetery, setCemetery] = useState(draft0.cemetery ?? '')
  const [cemeteryAddress, setCemeteryAddress] = useState(draft0.cemeteryAddress ?? '')
  const [burialTime, setBurialTime] = useState(draft0.burialTime ?? '')
  const [notes, setNotes] = useState(draft0.notes ?? '')
  const [charityTitle, setCharityTitle] = useState(draft0.charityTitle ?? '')
  const [charityOrg, setCharityOrg] = useState(draft0.charityOrg ?? '')
  const [charityUrl, setCharityUrl] = useState(draft0.charityUrl ?? '')
  const [via, setVia] = useState<'form' | 'photo'>('form')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<Obituary | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (saved) return
    const draft: Draft = {
      name, arabicName, photoUrl: photoUrl.startsWith('data:') ? '' : photoUrl, dob, dod, city, stateName,
      sect, biography, family, familyMembers, mosque, address, datetime, afterPrayer, cemetery,
      cemeteryAddress, burialTime, notes, charityTitle, charityOrg, charityUrl,
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      /* storage unavailable */
    }
  }, [name, arabicName, photoUrl, dob, dod, city, stateName, sect, biography, family, familyMembers, mosque, address, datetime, afterPrayer, cemetery, cemeteryAddress, burialTime, notes, charityTitle, charityOrg, charityUrl, saved])

  const applyNotice = (f: NoticeFields) => {
    setVia('photo')
    if (f.name) setName(f.name)
    if (f.dateOfPassing) setDod(f.dateOfPassing)
    if (f.dateOfBirth) setDob(f.dateOfBirth)
    if (f.city) setCity(f.city)
    if (f.state) setStateName(f.state)
    if (f.mosque) setMosque(f.mosque)
    if (f.address) setAddress(f.address)
    if (f.datetime) setDatetime(f.datetime)
    if (f.afterPrayer) setAfterPrayer(f.afterPrayer)
    if (f.cemetery) setCemetery(f.cemetery)
  }

  const onPortrait = async (file: File) => {
    try {
      setPhotoUrl(await fileToPortraitDataUrl(file))
    } catch {
      setError(t('sf_err_portrait'))
    }
  }

  const essentialsValid = name.trim() && dod && city.trim() && biography.trim()

  const submit = async () => {
    setError('')
    if (!essentialsValid) {
      setError(t('sf_err_required'))
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
              category: 'Other' as SadaqahProject['category'],
              goal: 0,
              raised: 0,
              donationUrl: charityUrl.trim() || undefined,
              description: '',
            },
          ]
        : undefined,
    }
    const pending = api.createPendingSubmission(input, via)
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
    setSaved(pending)
  }

  if (saved) {
    const packetObit: Obituary = {
      ...saved,
      photoUrl: saved.photoUrl?.startsWith('data:') ? undefined : saved.photoUrl,
    }
    const packet = api.buildSubmissionPacket(packetObit)
    const packetText = api.packetToText(packet)
    const summary = [
      t('sf_msg_intro'),
      ``,
      `${t('sf_msg_name')} ${saved.name}`,
      `${t('sf_msg_passed')} ${saved.dateOfPassing}`,
      `${t('sf_msg_city')} ${saved.city}${saved.state ? `, ${saved.state}` : ''}`,
      saved.janazah ? `${t('sf_msg_janazah')} ${saved.janazah.mosque} — ${new Date(saved.janazah.datetime).toLocaleString()}` : '',
      saved.photoUrl?.startsWith('data:') ? t('sf_msg_photo') : '',
      ``,
      t('sf_msg_instructions'),
      packetText,
    ]
      .filter((l) => l !== '')
      .join('\n')
    const downloadPacket = () => {
      const blob = new Blob([packetText], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `al-baqaa-submission-${saved.name.replace(/\s+/g, '-').toLowerCase()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
    return (
      <div className="mx-auto max-w-2xl">
        <div className="th-surface rounded-3xl p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-3xl font-bold">{t('sf_received')} {saved.name}</h2>
          <p className="mt-3 leading-relaxed">
            {t('sf_pending_a')} <strong>{t('sf_pending_b')}</strong>{t('sf_pending_c')}
          </p>
          <p className="mt-2 leading-relaxed">
            <strong>{t('sf_last_a')}</strong>{t('sf_last_b')}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(summary)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {t('sf_send_whatsapp')}
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(`${t('sf_msg_subject')} ${saved.name}`)}&body=${encodeURIComponent(summary)}`}
              className="th-primary rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
            >
              {t('sf_send_email')}
            </a>
            <button onClick={downloadPacket} className="th-surface2 th-border rounded-xl border px-4 py-2.5 text-sm font-semibold">
              {t('sf_download')}
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(packetText)
                setCopied(true)
                setTimeout(() => setCopied(false), 2500)
              }}
              className="th-surface2 th-border rounded-xl border px-4 py-2.5 text-sm font-semibold"
            >
              {copied ? t('sf_copied') : t('sf_copy')}
            </button>
          </div>
          <p className="th-muted mt-4 text-sm leading-relaxed">
            {t('sf_admin_a')}<code>#/admin</code>{t('sf_admin_b')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display text-3xl font-bold">{t('submit_title')}</h2>
      <p className="th-muted mt-2">{t('submit_sub')}</p>
      <p className="th-muted mt-1 text-sm">{t('sf_autosave')}</p>

      <div className="mt-5">
        <PhotoIntake onFields={applyNotice} />
      </div>

      <form
        className="th-surface mt-4 grid gap-3 rounded-3xl p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
      >
        <h3 className="font-bold">{t('sf_essentials')}</h3>
        <label className={labelCls}>
          {t('f_name')} *
          <input value={name} onChange={(e) => setName(e.target.value)} required aria-required="true" className={inputCls} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={labelCls}>
            {t('f_dod')} *
            <input type="date" value={dod} onChange={(e) => setDod(e.target.value)} required aria-required="true" className={inputCls} />
          </label>
          <label className={labelCls}>
            {t('f_city')} *
            <input value={city} onChange={(e) => setCity(e.target.value)} required aria-required="true" className={inputCls} />
          </label>
          <label className={labelCls}>
            {t('f_mosque')}
            <input value={mosque} onChange={(e) => setMosque(e.target.value)} className={inputCls} />
          </label>
          <label className={labelCls}>
            {t('f_datetime')}
            <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className={inputCls} />
          </label>
        </div>
        <label className={labelCls}>
          {t('f_bio')} *
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            required
            aria-required="true"
            rows={4}
            placeholder={t('sf_bio_ph')}
            className={inputCls}
          />
        </label>

        <details className="th-surface2 th-border rounded-2xl border p-4">
          <summary className="cursor-pointer font-semibold">{t('sf_more')}</summary>
          <div className="mt-3 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                {t('f_arabic')}
                <input value={arabicName} onChange={(e) => setArabicName(e.target.value)} className={inputCls} dir="rtl" lang="ar" />
              </label>
              <label className={labelCls}>
                {t('f_state')}
                <input value={stateName} onChange={(e) => setStateName(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_dob')}
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_sect')}
                <select value={sect} onChange={(e) => setSect(e.target.value as Sect)} className={inputCls}>
                  <option value="Sunni">{t('sf_sect_sunni')}</option>
                  <option value="Shia">{t('sf_sect_shia')}</option>
                  <option value="Non-denominational">{t('sf_sect_nondenom')}</option>
                </select>
              </label>
            </div>
            <label className={labelCls}>
              {t('sf_portrait')}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void onPortrait(f)
                  e.target.value = ''
                }}
                className={inputCls}
              />
            </label>
            {photoUrl && <img src={photoUrl} alt={t('sf_portrait_alt')} className="h-28 w-28 rounded-2xl object-cover" />}
            <label className={labelCls}>
              {t('f_family')}
              <input value={family} onChange={(e) => setFamily(e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              {t('sf_family_members')}
              <textarea value={familyMembers} onChange={(e) => setFamilyMembers(e.target.value)} rows={3} className={inputCls} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                {t('f_address')}
                <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_after')}
                <input value={afterPrayer} onChange={(e) => setAfterPrayer(e.target.value)} placeholder={t('sf_after_ph')} className={inputCls} />
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
                <input value={burialTime} onChange={(e) => setBurialTime(e.target.value)} placeholder={t('sf_burial_ph')} className={inputCls} />
              </label>
            </div>
            <label className={labelCls}>
              {t('f_notes')}
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputCls} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                {t('f_charity_title')}
                <input value={charityTitle} onChange={(e) => setCharityTitle(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('f_charity_org')}
                <input value={charityOrg} onChange={(e) => setCharityOrg(e.target.value)} className={inputCls} />
              </label>
              <label className={labelCls}>
                {t('sf_donation_url')}
                <input value={charityUrl} onChange={(e) => setCharityUrl(e.target.value)} placeholder="https://…" className={inputCls} />
              </label>
            </div>
          </div>
        </details>

        {error && (
          <p role="alert" className="font-medium text-rose-700">
            {error}
          </p>
        )}
        <button type="submit" className="th-primary rounded-xl px-5 py-3 font-semibold transition hover:opacity-90">
          {t('sf_submit_btn')}
        </button>
        <p className="th-muted text-sm leading-relaxed">
          {t('sf_review_note')}
        </p>
      </form>
    </div>
  )
}
