import type { Janazah, Obituary } from '../types'

export function formatDate(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ageFromDates(birthIso: string, deathIso: string): number {
  const b = new Date(`${birthIso.slice(0, 10)}T12:00:00`)
  const d = new Date(`${deathIso.slice(0, 10)}T12:00:00`)
  let age = d.getFullYear() - b.getFullYear()
  const m = d.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && d.getDate() < b.getDate())) age--
  return age
}

export function effectiveAge(o: Obituary): number | undefined {
  if (typeof o.age === 'number') return o.age
  if (o.dateOfBirth) return ageFromDates(o.dateOfBirth, o.dateOfPassing)
  return undefined
}

export function locationLine(o: Obituary): string {
  return [o.city, o.state, o.country].filter(Boolean).join(', ')
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function money(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function icsUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** One-click Janazah calendar export (.ics) — Apple/Google/Outlook compatible. */
export function downloadIcs(obituary: Obituary, janazah: Janazah): void {
  const start = new Date(janazah.datetime)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Al-Baqaa//MuslimObituaries//EN',
    'BEGIN:VEVENT',
    `UID:${obituary.id}@al-baqaa`,
    `DTSTAMP:${icsUtc(new Date())}`,
    `DTSTART:${icsUtc(start)}`,
    `DTEND:${icsUtc(end)}`,
    `SUMMARY:${icsEscape(`Janazah for ${obituary.name}`)}`,
    `LOCATION:${icsEscape(`${janazah.mosque}, ${janazah.address}`)}`,
    `DESCRIPTION:${icsEscape(
      [
        `Janazah (funeral) prayer for ${obituary.name}.`,
        janazah.afterPrayer ? `Timing: ${janazah.afterPrayer}.` : '',
        janazah.cemetery ? `Burial at ${janazah.cemetery}${janazah.burialTime ? ` — ${janazah.burialTime}` : ''}.` : '',
        janazah.notes ?? '',
      ]
        .filter(Boolean)
        .join(' '),
    )}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Janazah_${obituary.name.replace(/\s+/g, '_')}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Share text/link helpers: Web Share API where available, else clipboard. */
export function obituaryShareUrl(id: string): string {
  return `${window.location.origin}${window.location.pathname}#/obituary/${id}`
}

export async function shareObituary(obituary: Obituary): Promise<'shared' | 'copied'> {
  const url = obituaryShareUrl(obituary.id)
  const text = `Janazah & obituary for ${obituary.name} — Al-Baqaa`
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Al-Baqaa', text, url })
      return 'shared'
    } catch {
      /* user cancelled or share failed — fall through to copy */
    }
  }
  await navigator.clipboard.writeText(url)
  return 'copied'
}
