import { useEffect, useState } from 'react'
import type { Vendor, VendorCategory } from '../types'
import * as api from '../services/api'
import { mapsUrl } from '../lib/format'
import { useSettings } from '../context/settings'

export const CATEGORIES: VendorCategory[] = [
  'Licensed Funeral Home',
  'Local Mosque',
  'Muslim Cemetery',
  'Ghusl & Preparation',
  'Legal & Wasiyyah',
]

function stars(rating: number): string {
  const full = Math.round(rating)
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full))
}

export default function VendorDirectory() {
  const { t } = useSettings()
  const [category, setCategory] = useState<VendorCategory | ''>('')
  const [vendors, setVendors] = useState<Vendor[]>([])

  useEffect(() => {
    let live = true
    api.listVendors(category).then((v) => {
      if (live) setVendors(v)
    })
    return () => {
      live = false
    }
  }, [category])

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="font-display text-3xl font-bold">{t('vendors_title')}</h2>
      <p className="th-muted mt-2 max-w-2xl">{t('vendors_sub')}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${category === '' ? 'th-primary' : 'th-surface shadow-sm'}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? '' : c)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${category === c ? 'th-primary' : 'th-surface shadow-sm'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {vendors.map((v) => (
          <article key={v.id} className="th-surface rounded-2xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="th-surface2 rounded-full px-2.5 py-0.5 text-xs font-semibold">{v.category}</span>
              {v.verified && (
                <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold text-white">✓ {t('verified_badge')}</span>
              )}
              {typeof v.rating === 'number' && (
                <span className="text-sm text-amber-500" title={`${v.rating} / 5`}>
                  {stars(v.rating)} <span className="th-muted text-xs">({v.reviewCount ?? 0})</span>
                </span>
              )}
            </div>
            <h3 className="mt-2 text-lg font-bold">{v.name}</h3>
            <p className="th-muted text-sm">
              {v.city}, {v.state} · {v.address}
            </p>
            <p className="mt-1 text-sm">
              📞 <a className="underline" href={`tel:${v.phone}`}>{v.phone}</a>
              {v.email && (
                <>
                  {' '}· ✉️ <a className="underline" href={`mailto:${v.email}`}>{v.email}</a>
                </>
              )}
            </p>
            {v.services.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {v.services.map((s) => (
                  <span key={s} className="th-surface2 th-border rounded-full border px-2 py-0.5 text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {v.notes && <p className="mt-2 text-sm leading-relaxed">{v.notes}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={mapsUrl(`${v.name} ${v.address}`)}
                target="_blank"
                rel="noreferrer"
                className="th-primary rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
              >
                🧭 {t('directions')}
              </a>
              {v.website && (
                <a
                  href={v.website}
                  target="_blank"
                  rel="noreferrer"
                  className="th-surface2 th-border rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-80"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </article>
        ))}
        {vendors.length === 0 && <p className="th-muted">{t('no_results')}</p>}
      </div>
    </div>
  )
}
