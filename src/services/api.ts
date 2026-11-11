import type {
  AlertSubscription,
  Condolence,
  Database,
  Obituary,
  ObituaryFilters,
  ObituaryInput,
  PlatformTip,
  Vendor,
  VendorCategory,
} from '../types'

/**
 * Al-Baqaa data layer — two modes, one contract (public/api/v1/openapi.json):
 *
 * STATIC mode (default): the canonical dataset is the public JSON file at
 * data/database.json; visitor actions are LocalStorage overlays on top of it.
 *
 * SERVER mode: set VITE_API_URL at build time (e.g. http://localhost:8787)
 * and every read/write goes to that API instead — a zero-dependency
 * reference server ships in server/server.mjs. The UI never changes.
 */

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')
export const SERVER_MODE = API_BASE.length > 0

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`)
  return (await res.json()) as T
}

function adminHeaders(): Record<string, string> {
  try {
    return { 'x-admin-passcode': sessionStorage.getItem('albaqaa.adminCode') ?? '' }
  } catch {
    return {}
  }
}

const K = {
  myObituaries: 'albaqaa.v2.myObituaries',
  myCondolences: 'albaqaa.v2.myCondolences',
  duaDeltas: 'albaqaa.v2.duaDeltas',
  condolenceDuaDeltas: 'albaqaa.v2.condolenceDuaDeltas',
  deletedIds: 'albaqaa.v2.deletedIds',
  verifiedOverrides: 'albaqaa.v2.verifiedOverrides',
  importedDb: 'albaqaa.v2.importedDb',
  subscriptions: 'albaqaa.v2.subscriptions',
  tips: 'albaqaa.v2.tips',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — session still works */
  }
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

let dbPromise: Promise<Database> | null = null

/** Load the canonical shared dataset (server API, imported override, or the served file). */
export function loadDatabase(force = false): Promise<Database> {
  if (force) dbPromise = null
  if (SERVER_MODE) {
    if (!dbPromise) {
      dbPromise = apiFetch<Database>('/api/v1/database').catch(
        () => ({ version: 2, updatedAt: '', obituaries: [], condolences: [], vendors: [] }) as Database,
      )
    }
    return dbPromise
  }
  const imported = read<Database | null>(K.importedDb, null)
  if (imported) return Promise.resolve(imported)
  if (!dbPromise) {
    dbPromise = fetch('data/database.json', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`database.json ${r.status}`)
        return r.json() as Promise<Database>
      })
      .catch(() => ({ version: 2, updatedAt: '', obituaries: [], condolences: [], vendors: [] }) as Database)
  }
  return dbPromise
}

/**
 * Sample listings always showcase a live Janazah: if a sample's Janazah
 * time has passed, roll it to today (same time) or tomorrow, so the
 * upcoming-Janazah highlight, filters and .ics export always have a
 * working example. Real listings are never touched.
 */
function rollSampleJanazah(o: Obituary): Obituary {
  if (!o.id.startsWith('sample') || !o.janazah) return o
  const orig = new Date(o.janazah.datetime)
  if (isNaN(orig.getTime())) return o
  const now = new Date()
  if (orig.getTime() > now.getTime()) return o
  const target = new Date()
  target.setHours(orig.getHours(), orig.getMinutes(), 0, 0)
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  const local = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}:00`
  return { ...o, janazah: { ...o.janazah, datetime: local } }
}

function applyOverlays(db: Database): Obituary[] {
  if (SERVER_MODE) return db.obituaries.map(rollSampleJanazah)
  const deleted = new Set(read<string[]>(K.deletedIds, []))
  const overrides = read<Record<string, boolean>>(K.verifiedOverrides, {})
  const deltas = read<Record<string, number>>(K.duaDeltas, {})
  const mine = read<Obituary[]>(K.myObituaries, [])
  const canonical = db.obituaries
    .filter((o) => !deleted.has(o.id))
    .map((o) => ({
      ...o,
      verified: overrides[o.id] ?? o.verified,
      duaCount: o.duaCount + (deltas[o.id] ?? 0),
    }))
  const mineVisible = mine.filter((o) => !deleted.has(o.id))
  return [...mineVisible, ...canonical].map(rollSampleJanazah)
}

function mergedCondolences(db: Database): Condolence[] {
  if (SERVER_MODE) return [...db.condolences]
  const deltas = read<Record<string, number>>(K.condolenceDuaDeltas, {})
  const mine = read<Condolence[]>(K.myCondolences, [])
  const canonical = db.condolences.map((c) => ({ ...c, duaCount: c.duaCount + (deltas[c.id] ?? 0) }))
  return [...mine, ...canonical]
}

/** GET /api/v1/obituaries */
export async function listObituaries(filters: ObituaryFilters = {}): Promise<Obituary[]> {
  const db = await loadDatabase()
  const now = new Date()
  const todayStr = now.toDateString()
  let list = applyOverlays(db)
  if (filters.q) {
    const q = filters.q.toLowerCase()
    list = list.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.arabicName ?? '').toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.biography.toLowerCase().includes(q) ||
        (o.janazah?.mosque ?? '').toLowerCase().includes(q),
    )
  }
  if (filters.city) {
    const c = filters.city.toLowerCase()
    list = list.filter((o) => `${o.city}, ${o.state}`.toLowerCase().includes(c) || o.city.toLowerCase().includes(c))
  }
  if (filters.sect) list = list.filter((o) => o.sect === filters.sect)
  if (filters.year) list = list.filter((o) => o.dateOfPassing.startsWith(filters.year!))
  if (filters.kind && filters.kind !== 'any') list = list.filter((o) => o.kind === filters.kind)
  if (filters.janazah === 'upcoming') {
    list = list.filter((o) => o.janazah && new Date(o.janazah.datetime).getTime() >= now.getTime())
  } else if (filters.janazah === 'today') {
    list = list.filter((o) => o.janazah && new Date(o.janazah.datetime).toDateString() === todayStr)
  } else if (filters.janazah === 'past') {
    list = list.filter((o) => !o.janazah || new Date(o.janazah.datetime).getTime() < now.getTime())
  }
  return list.sort((a, b) => +new Date(b.dateOfPassing) - +new Date(a.dateOfPassing))
}

export async function listYears(): Promise<string[]> {
  const db = await loadDatabase()
  const years = new Set(applyOverlays(db).map((o) => o.dateOfPassing.slice(0, 4)))
  return Array.from(years).sort((a, b) => Number(b) - Number(a))
}

export async function listRegions(): Promise<string[]> {
  const db = await loadDatabase()
  const regions = new Set(applyOverlays(db).map((o) => `${o.city}, ${o.state}`.replace(/, $/, '')))
  return Array.from(regions).sort()
}

/** GET /api/v1/obituaries/{id} */
export async function getObituary(id: string): Promise<Obituary | null> {
  if (SERVER_MODE) {
    try {
      const o = await apiFetch<Obituary>(`/api/v1/obituaries/${encodeURIComponent(id)}`)
      return rollSampleJanazah(o)
    } catch {
      return null
    }
  }
  const db = await loadDatabase()
  return applyOverlays(db).find((o) => o.id === id) ?? null
}

/** POST /api/v1/obituaries */
export async function createObituary(input: ObituaryInput): Promise<Obituary> {
  if (SERVER_MODE) {
    const saved = await apiFetch<Obituary>('/api/v1/obituaries', { method: 'POST', body: JSON.stringify(input) })
    dbPromise = null
    return saved
  }
  const obituary: Obituary = {
    ...input,
    id: uid('obit'),
    kind: input.kind ?? 'community',
    duaCount: 1,
    createdAt: new Date().toISOString(),
  }
  const mine = read<Obituary[]>(K.myObituaries, [])
  mine.unshift(obituary)
  write(K.myObituaries, mine)
  return obituary
}

/** POST /api/v1/obituaries/{id}/dua */
export async function incrementDua(id: string): Promise<number> {
  if (SERVER_MODE) {
    const r = await apiFetch<{ duaCount: number }>(`/api/v1/obituaries/${encodeURIComponent(id)}/dua`, { method: 'POST' })
    return r.duaCount
  }
  const deltas = read<Record<string, number>>(K.duaDeltas, {})
  deltas[id] = (deltas[id] ?? 0) + 1
  write(K.duaDeltas, deltas)
  const ob = await getObituary(id)
  return ob?.duaCount ?? 0
}

/** GET /api/v1/obituaries/{id}/condolences */
export async function listCondolences(obituaryId: string): Promise<Condolence[]> {
  if (SERVER_MODE) {
    const list = await apiFetch<Condolence[]>(`/api/v1/obituaries/${encodeURIComponent(obituaryId)}/condolences`)
    return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }
  const db = await loadDatabase()
  return mergedCondolences(db)
    .filter((c) => c.obituaryId === obituaryId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

/** POST /api/v1/obituaries/{id}/condolences */
export async function addCondolence(
  obituaryId: string,
  author: string,
  message: string,
  relationship?: string,
  arabicDua?: string,
): Promise<Condolence> {
  if (SERVER_MODE) {
    return apiFetch<Condolence>(`/api/v1/obituaries/${encodeURIComponent(obituaryId)}/condolences`, {
      method: 'POST',
      body: JSON.stringify({ author, message, relationship, arabicDua }),
    })
  }
  const condolence: Condolence = {
    id: uid('cond'),
    obituaryId,
    author,
    relationship,
    message,
    arabicDua,
    duaCount: 1,
    createdAt: new Date().toISOString(),
  }
  const mine = read<Condolence[]>(K.myCondolences, [])
  mine.push(condolence)
  write(K.myCondolences, mine)
  return condolence
}

/** POST /api/v1/condolences/{id}/dua */
export async function incrementCondolenceDua(id: string): Promise<number> {
  if (SERVER_MODE) {
    const r = await apiFetch<{ duaCount: number }>(`/api/v1/condolences/${encodeURIComponent(id)}/dua`, { method: 'POST' })
    return r.duaCount
  }
  const deltas = read<Record<string, number>>(K.condolenceDuaDeltas, {})
  deltas[id] = (deltas[id] ?? 0) + 1
  write(K.condolenceDuaDeltas, deltas)
  const db = await loadDatabase()
  return mergedCondolences(db).find((c) => c.id === id)?.duaCount ?? 0
}

/** GET /api/v1/vendors */
export async function listVendors(category?: VendorCategory | ''): Promise<Vendor[]> {
  const db = await loadDatabase()
  if (!category) return [...db.vendors]
  return db.vendors.filter((v) => v.category === category)
}

/** POST /api/v1/janazah-alerts/subscribe */
export async function subscribeAlerts(
  input: Omit<AlertSubscription, 'id' | 'createdAt'>,
): Promise<AlertSubscription> {
  if (SERVER_MODE) {
    return apiFetch<AlertSubscription>('/api/v1/janazah-alerts/subscribe', { method: 'POST', body: JSON.stringify(input) })
  }
  const sub: AlertSubscription = { ...input, id: uid('alert'), createdAt: new Date().toISOString() }
  const all = read<AlertSubscription[]>(K.subscriptions, [])
  all.push(sub)
  write(K.subscriptions, all)
  return sub
}

/** POST /api/v1/tips */
export async function submitTip(amount: number, donorName?: string): Promise<PlatformTip> {
  if (SERVER_MODE) {
    return apiFetch<PlatformTip>('/api/v1/tips', { method: 'POST', body: JSON.stringify({ amount, donorName }) })
  }
  const tip: PlatformTip = { id: uid('tip'), amount, donorName, createdAt: new Date().toISOString() }
  const all = read<PlatformTip[]>(K.tips, [])
  all.push(tip)
  write(K.tips, all)
  return tip
}

/* ---------------- Admin operations ---------------- */

export async function adminDeleteObituary(id: string): Promise<void> {
  if (SERVER_MODE) {
    await apiFetch(`/api/v1/obituaries/${encodeURIComponent(id)}`, { method: 'DELETE', headers: adminHeaders() })
    dbPromise = null
    return
  }
  const mine = read<Obituary[]>(K.myObituaries, [])
  if (mine.some((o) => o.id === id)) {
    write(K.myObituaries, mine.filter((o) => o.id !== id))
    return
  }
  const deleted = read<string[]>(K.deletedIds, [])
  if (!deleted.includes(id)) write(K.deletedIds, [...deleted, id])
}

export async function adminSetVerified(id: string, verified: boolean): Promise<void> {
  if (SERVER_MODE) {
    await apiFetch(`/api/v1/obituaries/${encodeURIComponent(id)}/verified`, {
      method: 'PATCH',
      headers: adminHeaders(),
      body: JSON.stringify({ verified }),
    })
    dbPromise = null
    return
  }
  const overrides = read<Record<string, boolean>>(K.verifiedOverrides, {})
  overrides[id] = verified
  write(K.verifiedOverrides, overrides)
}

/** Build the next shared database.json (static mode) or fetch the server's
 *  current database (server mode). Publishing in static mode = commit the
 *  exported file as public/data/database.json. */
export async function exportDatabase(): Promise<Database> {
  if (SERVER_MODE) return loadDatabase(true)
  const db = await loadDatabase()
  return {
    version: db.version + 1,
    updatedAt: new Date().toISOString(),
    obituaries: applyOverlays(db),
    condolences: mergedCondolences(db),
    vendors: db.vendors,
  }
}

export function importDatabase(jsonText: string): Database {
  if (SERVER_MODE) throw new Error('Import is only available in static (file) mode — in server mode the server owns the data.')
  const parsed = JSON.parse(jsonText) as Database
  if (!Array.isArray(parsed.obituaries) || !Array.isArray(parsed.vendors)) {
    throw new Error('Not an Al-Baqaa database file')
  }
  write(K.importedDb, parsed)
  dbPromise = null
  return parsed
}

export async function adminStats(): Promise<{
  obituaries: number
  condolences: number
  vendors: number
  subscriptions: number
  tipsTotal: number
  mySubmissions: number
}> {
  if (SERVER_MODE) {
    const s = await apiFetch<{
      obituaries: number
      condolences: number
      vendors: number
      subscriptions: number
      tipsTotal: number
    }>('/api/v1/admin/stats', { headers: adminHeaders() })
    return { ...s, mySubmissions: 0 }
  }
  const db = await loadDatabase()
  const tips = read<PlatformTip[]>(K.tips, [])
  return {
    obituaries: applyOverlays(db).length,
    condolences: mergedCondolences(db).length,
    vendors: db.vendors.length,
    subscriptions: read<AlertSubscription[]>(K.subscriptions, []).length,
    tipsTotal: tips.reduce((sum, tip) => sum + tip.amount, 0),
    mySubmissions: read<Obituary[]>(K.myObituaries, []).length,
  }
}
