import type { Obituary } from '../types'

function icsDate(iso: string): string {
  // YYYYMMDDTHHMMSSZ in UTC
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/** Build an .ics calendar event for a Janazah prayer (Apple/Google/Outlook compatible). */
export function buildJanazahIcs(obituary: Obituary): string | null {
  if (!obituary.janazah) return null
  const start = new Date(obituary.janazah.datetime)
  const end = new Date(start.getTime() + 60 * 60 * 1000) // 1 hour
  const location = `${obituary.janazah.mosque}, ${obituary.janazah.address}`
  const description = [
    `Janazah prayer for ${obituary.name}.`,
    obituary.janazah.afterPrayer ? `Timing: ${obituary.janazah.afterPrayer}.` : '',
    obituary.janazah.notes ?? '',
    'Inna lillahi wa inna ilayhi raji\'un — From Allah we come, and to Him we return.',
  ]
    .filter(Boolean)
    .join(' ')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Al-Baqaa//Janazah//EN',
    'BEGIN:VEVENT',
    `UID:${obituary.id}@al-baqaa`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(start.toISOString())}`,
    `DTEND:${icsDate(end.toISOString())}`,
    `SUMMARY:${escapeText(`Janazah — ${obituary.name}`)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadJanazahIcs(obituary: Obituary): void {
  const ics = buildJanazahIcs(obituary)
  if (!ics) return
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `janazah-${obituary.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
