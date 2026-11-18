/**
 * Notice parsing — turns OCR text from a funeral notice / flyer photo into
 * draft obituary fields. Heuristic by design: it drafts, a human reviews.
 * Fields it cannot find are left undefined — never guessed.
 */

export interface NoticeFields {
  name?: string
  dateOfBirth?: string
  dateOfPassing?: string
  city?: string
  state?: string
  mosque?: string
  address?: string
  datetime?: string
  afterPrayer?: string
  cemetery?: string
}

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7,
  august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
}

function iso(y: number, m: number, d: number): string | undefined {
  if (m < 1 || m > 12 || d < 1 || d > 31) return undefined
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}`
}

interface FoundDate { iso: string; index: number; context: string }

function findDates(text: string): FoundDate[] {
  const out: FoundDate[] = []
  const push = (value: string | undefined, index: number) => {
    if (!value) return
    const start = Math.max(0, index - 60)
    out.push({ iso: value, index, context: text.slice(start, index + 12).toLowerCase() })
  }
  const monthRe = /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi
  for (const m of text.matchAll(monthRe)) push(iso(Number(m[3]), MONTHS[m[1].toLowerCase()], Number(m[2])), m.index ?? 0)
  const numRe = /\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/g
  for (const m of text.matchAll(numRe)) push(iso(Number(m[3]), Number(m[1]), Number(m[2])), m.index ?? 0)
  const isoRe = /\b(\d{4})-(\d{2})-(\d{2})\b/g
  for (const m of text.matchAll(isoRe)) push(iso(Number(m[1]), Number(m[2]), Number(m[3])), m.index ?? 0)
  return out.sort((a, b) => a.index - b.index)
}

function cleanLine(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

export function parseNoticeText(raw: string): NoticeFields {
  const text = raw.replace(/\r/g, '')
  const lines = text.split('\n').map(cleanLine).filter(Boolean)
  const fields: NoticeFields = {}

  /* ---- dates: labelled first, then order ---- */
  const dates = findDates(text)
  const birth = dates.find((d) => /born|birth|b\./.test(d.context))
  const passing = dates.find((d) => /passed|passing|died|death|departed|returned to|وفاة|انتقل/.test(d.context))
  if (birth) fields.dateOfBirth = birth.iso
  if (passing) fields.dateOfPassing = passing.iso
  if (!fields.dateOfPassing && dates.length > 0) {
    const rest = dates.filter((d) => d.iso !== fields.dateOfBirth)
    if (rest.length > 0) fields.dateOfPassing = rest[rest.length - 1].iso
  }
  if (!fields.dateOfBirth && dates.length >= 2 && fields.dateOfPassing) {
    const earlier = dates.map((d) => d.iso).filter((d) => d < fields.dateOfPassing!).sort()[0]
    if (earlier && earlier !== fields.dateOfPassing) fields.dateOfBirth = earlier
  }

  /* ---- Janazah datetime: a date with a clock time near "janazah/funeral" ---- */
  const timeRe = /(\d{1,2}):(\d{2})\s*([AaPp])\.?[Mm]\.?/
  const timeMatch = text.match(timeRe)
  if (timeMatch && fields.dateOfPassing) {
    // The Janazah date is the date closest before the clock time in the
    // notice (e.g. "held on November 16, 2026 at 1:30 PM").
    const timeIdx = timeMatch.index ?? 0
    const windowStart = Math.max(0, timeIdx - 300)
    const nearDates = findDates(text.slice(windowStart, timeIdx + 10))
      .map((d) => ({ ...d, index: d.index + windowStart }))
      .filter((d) => d.index <= timeIdx)
    const datePart = nearDates.length > 0 ? nearDates[nearDates.length - 1].iso : fields.dateOfPassing
    let hh = Number(timeMatch[1]) % 12
    if (/p/i.test(timeMatch[3])) hh += 12
    const pad = (n: number) => String(n).padStart(2, '0')
    fields.datetime = `${datePart}T${pad(hh)}:${timeMatch[2]}`
  }
  const after = text.match(/after\s+(the\s+)?(Dhuhr|Zuhr|Duhr|Asr|Maghrib|Isha|Fajr|Jumu'?ah|Jumma|Friday)[^\n.,]*/i)
  if (after) fields.afterPrayer = cleanLine(after[0])

  /* ---- venue / cemetery / address ---- */
  const mosqueLine = lines.find((l) => /mosque|masjid|islamic (center|centre|foundation|society)|مسجد/i.test(l))
  if (mosqueLine) fields.mosque = mosqueLine.replace(/^(at|@)\s+/i, '')
  const cemLine = lines.find((l) => /cemetery|burial (at|will|in)|buried at/i.test(l))
  if (cemLine) fields.cemetery = cemLine.replace(/^burial\s+(at|will be at|in)\s*/i, '').replace(/\s+following.*$/i, '').replace(/\s+after.*$/i, '')
  const addrLine = lines.find((l) => /\d{1,6}\s+[\w.' ]+\s(St|Street|Ave|Avenue|Rd|Road|Blvd|Dr|Drive|Ln|Lane|Ct|Court|Way|Hwy)\b/i.test(l))
  if (addrLine) fields.address = addrLine
  const cityState = (fields.address ?? mosqueLine ?? '').match(/,\s*([A-Z][a-zA-Z.' ]+?),\s*([A-Z]{2})\b/)
  if (cityState) {
    fields.city = cleanLine(cityState[1])
    fields.state = cityState[2]
  }

  /* ---- name ---- */
  for (const line of lines) {
    const forMatch = line.match(/(?:janazah|funeral prayer|salat(?:ul)?\s*janazah)\s+(?:prayer\s+)?for\s+([A-Z][A-Za-z.'-]+(?:[ \t]+[A-Z][A-Za-z.'-]+){0,3})/i)
    if (forMatch) {
      fields.name = cleanLine(forMatch[1])
      break
    }
  }
  if (!fields.name) {
    const skip = /janazah|funeral|mosque|masjid|inna lillahi|prayer|cemetery|burial|visitation|condolence|azza|service|announcement|ﷺ|الله/i
    const candidate = lines.find(
      (l) => !skip.test(l) && /^[A-Z][A-Za-z.'-]+(\s+[A-Z][A-Za-z.'-]+){1,3}$/.test(l) && l.length <= 48,
    )
    if (candidate) fields.name = candidate
  }

  return fields
}

/** Read a portrait image file and downscale it to a data URL suitable for
 *  storing with a listing (max ~900px, JPEG). */
export async function fileToPortraitDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Image processing is not available in this browser.')
  ctx.drawImage(bitmap, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.85)
}
