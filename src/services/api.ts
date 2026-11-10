import type {
  AlertSubscription,
  Condolence,
  Obituary,
  ObituaryFilters,
  ObituaryInput,
  Vendor,
  VendorCategory,
} from '../types'
import { seedObituaries, seedVendors } from '../data/seed'

/**
 * API service layer — implements the public contract in
 * public/api/v1/openapi.json.
 *
 * V1 persistence is LocalStorage (zero-server, GitHub Pages friendly).
 * Every function is async and mirrors a REST endpoint, so swapping this
 * file for real fetch() calls against a hosted backend in V2 does not
 * change any UI code.
 */

const KEYS = {
  obituaries: 'albaqaa.obituaries.v1',
  condolences: 'albaqaa.condolences.v1',
  subscriptions: 'albaqaa.subscriptions.v1',
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
    // storage full / unavailable — UI still works for the session
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

function getAllObituaries(): Obituary[] {
  const stored = read<Obituary[] | null>(KEYS.obituaries, null)
  if (stored === null) {
    write(KEYS.obituaries, seedObituaries)
    return [...seedObituaries]
  }
  return stored
}

function saveObituaries(list: Obituary[]): void {
  write(KEYS.obituaries, list)
}

/** GET /api/v1/obituaries */
export async function listObituaries(filters: ObituaryFilters = {}): Promise<Obituary[]> {
  const now = Date.now()
  let list = getAllObituaries()
  if (filters.q) {
    const q = filters.q.toLowerCase()
    list = list.filter((o) => o.name.toLowerCase().includes(q))
  }
  if (filters.city) {
    const c = filters.city.toLowerCase()
    list = list.filter((o) => o.city.toLowerCase().includes(c))
  }
  if (filters.sect) {
    list = list.filter((o) => o.sect === filters.sect)
  }
  if (filters.janazah === 'upcoming') {
    list = list.filter((o) => o.janazah && new Date(o.janazah.datetime).getTime() >= now)
  } else if (filters.janazah === 'past') {
    list = list.filter((o) => !o.janazah || new Date(o.janazah.datetime).getTime() < now)
  }
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

/** GET /api/v1/obituaries/{id} */
export async function getObituary(id: string): Promise<Obituary | null> {
  return getAllObituaries().find((o) => o.id === id) ?? null
}

/** POST /api/v1/obituaries */
export async function createObituary(input: ObituaryInput): Promise<Obituary> {
  const obituary: Obituary = {
    ...input,
    id: uid(),
    duaCount: 0,
    createdAt: new Date().toISOString(),
  }
  const list = getAllObituaries()
  list.unshift(obituary)
  saveObituaries(list)
  return obituary
}

/** POST /api/v1/obituaries/{id}/dua */
export async function incrementDua(id: string): Promise<number> {
  const list = getAllObituaries()
  const target = list.find((o) => o.id === id)
  if (!target) return 0
  target.duaCount += 1
  saveObituaries(list)
  return target.duaCount
}

/** GET /api/v1/obituaries/{id}/condolences */
export async function listCondolences(obituaryId: string): Promise<Condolence[]> {
  const all = read<Condolence[]>(KEYS.condolences, [])
  return all
    .filter((c) => c.obituaryId === obituaryId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

/** POST /api/v1/obituaries/{id}/condolences */
export async function addCondolence(
  obituaryId: string,
  author: string,
  message: string,
): Promise<Condolence> {
  const condolence: Condolence = {
    id: uid(),
    obituaryId,
    author,
    message,
    createdAt: new Date().toISOString(),
  }
  const all = read<Condolence[]>(KEYS.condolences, [])
  all.push(condolence)
  write(KEYS.condolences, all)
  return condolence
}

/** GET /api/v1/vendors */
export async function listVendors(category?: VendorCategory | ''): Promise<Vendor[]> {
  if (!category) return [...seedVendors]
  return seedVendors.filter((v) => v.category === category)
}

/** POST /api/v1/janazah-alerts/subscribe */
export async function subscribeAlerts(
  input: Omit<AlertSubscription, 'id' | 'createdAt'>,
): Promise<AlertSubscription> {
  const sub: AlertSubscription = { ...input, id: uid(), createdAt: new Date().toISOString() }
  const all = read<AlertSubscription[]>(KEYS.subscriptions, [])
  all.push(sub)
  write(KEYS.subscriptions, all)
  return sub
}
