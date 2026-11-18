import { useRef, useState } from 'react'
import { parseNoticeText, type NoticeFields } from '../lib/notice'

interface Props {
  /** Called with the parsed draft fields once OCR finishes. */
  onFields: (fields: NoticeFields, rawText: string) => void
  heading?: string
  sub?: string
}

/**
 * Photo-first intake. The photo is read by OCR **on this device**
 * (tesseract.js is loaded on demand only when this component is used, so
 * ordinary visitors never download it). The image itself is never uploaded
 * anywhere — only the text the reviewer confirms becomes data.
 */
export default function PhotoIntake({ onFields, heading, sub }: Props) {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState('')
  const [raw, setRaw] = useState('')
  const [found, setFound] = useState<string[]>([])
  const [missing, setMissing] = useState<string[]>([])
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const run = async (file: File) => {
    setError('')
    setBusy(true)
    setProgress(0)
    setPreview(URL.createObjectURL(file))
    try {
      const Tesseract = (await import('tesseract.js')).default
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100))
        },
      })
      const text = result.data.text
      setRaw(text)
      const fields = parseNoticeText(text)
      const labels: [keyof NoticeFields, string][] = [
        ['name', 'Name'],
        ['dateOfPassing', 'Date of passing'],
        ['dateOfBirth', 'Date of birth'],
        ['city', 'City'],
        ['mosque', 'Mosque / venue'],
        ['datetime', 'Janazah time'],
        ['afterPrayer', 'Prayer timing'],
        ['cemetery', 'Cemetery'],
        ['address', 'Address'],
      ]
      setFound(labels.filter(([k]) => fields[k]).map(([, l]) => l))
      setMissing(labels.filter(([k]) => !fields[k]).map(([, l]) => l))
      onFields(fields, text)
    } catch {
      setError('The photo could not be read on this device. You can still fill the details in by hand below.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="th-surface2 th-border rounded-2xl border p-4">
      <h3 className="font-bold">📷 {heading ?? 'Start with a photo of the notice'}</h3>
      <p className="th-muted mt-1 text-sm leading-relaxed">
        {sub ??
          'A funeral-home notice, mosque announcement or flyer photo is enough. The photo is read on this device only — it is never uploaded — and you check every detail before anything is saved.'}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="th-primary rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? `Reading photo… ${progress}%` : 'Choose a photo'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void run(f)
            e.target.value = ''
          }}
        />
        {preview && <img src={preview} alt="Notice you selected" className="h-20 w-20 rounded-xl object-cover" />}
      </div>
      {busy && (
        <div className="th-surface mt-3 h-2 overflow-hidden rounded-full" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
      {found.length > 0 && (
        <div className="mt-3 text-sm leading-relaxed">
          <p>
            <strong>Found:</strong> {found.join(' · ')}
          </p>
          {missing.length > 0 && (
            <p className="th-muted">
              <strong>Please add by hand:</strong> {missing.join(' · ')} — the reader never guesses.
            </p>
          )}
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">See the text that was read</summary>
            <pre className="th-surface mt-2 max-h-48 overflow-auto rounded-xl p-3 text-xs whitespace-pre-wrap">{raw}</pre>
          </details>
        </div>
      )}
      <p className="th-muted mt-3 text-xs leading-relaxed">
        Printed notices read best. Handwriting and decorative Arabic calligraphy may need more hand-checking — a person always reviews
        before publishing.
      </p>
    </div>
  )
}
