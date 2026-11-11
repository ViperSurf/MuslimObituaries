/**
 * Al-Baqaa reference API server — zero dependencies (Node 18+).
 *
 * Implements the contract in public/api/v1/openapi.json so the exact same
 * frontend can run against a real server instead of the static
 * database.json file:
 *
 *   npm run server                      # http://localhost:8787
 *   PORT=9000 ADMIN_PASSCODE=secret npm run server
 *
 * Data persists to server/data.json (created on first run, seeded from
 * public/data/database.json). Point the frontend at it by building with
 * VITE_API_URL=http://localhost:8787.
 */
import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_FILE = join(root, 'server', 'data.json')
const SEED_FILE = join(root, 'public', 'data', 'database.json')
const PORT = Number(process.env.PORT || 8787)
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'albaqaa-admin'

function loadData() {
  if (!existsSync(DATA_FILE)) {
    const seed = JSON.parse(readFileSync(SEED_FILE, 'utf8'))
    seed.subscriptions = []
    seed.tips = []
    saveData(seed)
    return seed
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'))
}

function saveData(db) {
  const tmp = `${DATA_FILE}.tmp`
  writeFileSync(tmp, JSON.stringify(db, null, 2))
  renameSync(tmp, DATA_FILE)
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-passcode',
  })
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        resolve({})
      }
    })
  })
}

function isAdmin(req) {
  return req.headers['x-admin-passcode'] === ADMIN_PASSCODE
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname
  if (req.method === 'OPTIONS') return send(res, 204, {})

  const db = loadData()
  const obitMatch = path.match(/^\/api\/v1\/obituaries\/([^/]+)$/)
  const obitDuaMatch = path.match(/^\/api\/v1\/obituaries\/([^/]+)\/dua$/)
  const obitCondMatch = path.match(/^\/api\/v1\/obituaries\/([^/]+)\/condolences$/)
  const obitVerifiedMatch = path.match(/^\/api\/v1\/obituaries\/([^/]+)\/verified$/)
  const condDuaMatch = path.match(/^\/api\/v1\/condolences\/([^/]+)\/dua$/)

  try {
    if (req.method === 'GET' && path === '/api/v1/database') {
      return send(res, 200, db)
    }
    if (req.method === 'GET' && path === '/api/v1/obituaries') {
      const kind = url.searchParams.get('kind')
      const list = kind ? db.obituaries.filter((o) => o.kind === kind) : db.obituaries
      return send(res, 200, list)
    }
    if (req.method === 'POST' && path === '/api/v1/obituaries') {
      const input = await readBody(req)
      const obituary = {
        ...input,
        id: uid('obit'),
        kind: input.kind ?? 'community',
        duaCount: 1,
        createdAt: new Date().toISOString(),
      }
      db.obituaries.unshift(obituary)
      saveData(db)
      return send(res, 201, obituary)
    }
    if (req.method === 'GET' && obitMatch) {
      const found = db.obituaries.find((o) => o.id === obitMatch[1])
      return found ? send(res, 200, found) : send(res, 404, { error: 'Obituary not found' })
    }
    if (req.method === 'DELETE' && obitMatch) {
      if (!isAdmin(req)) return send(res, 401, { error: 'Admin passcode required' })
      db.obituaries = db.obituaries.filter((o) => o.id !== obitMatch[1])
      db.condolences = db.condolences.filter((c) => c.obituaryId !== obitMatch[1])
      saveData(db)
      return send(res, 200, { deleted: obitMatch[1] })
    }
    if (req.method === 'PATCH' && obitVerifiedMatch) {
      if (!isAdmin(req)) return send(res, 401, { error: 'Admin passcode required' })
      const found = db.obituaries.find((o) => o.id === obitVerifiedMatch[1])
      if (!found) return send(res, 404, { error: 'Obituary not found' })
      const { verified } = await readBody(req)
      found.verified = Boolean(verified)
      saveData(db)
      return send(res, 200, found)
    }
    if (req.method === 'POST' && obitDuaMatch) {
      const found = db.obituaries.find((o) => o.id === obitDuaMatch[1])
      if (!found) return send(res, 404, { error: 'Obituary not found' })
      found.duaCount += 1
      saveData(db)
      return send(res, 200, { duaCount: found.duaCount })
    }
    if (req.method === 'GET' && obitCondMatch) {
      return send(res, 200, db.condolences.filter((c) => c.obituaryId === obitCondMatch[1]))
    }
    if (req.method === 'POST' && obitCondMatch) {
      const input = await readBody(req)
      const condolence = {
        id: uid('cond'),
        obituaryId: obitCondMatch[1],
        author: input.author,
        relationship: input.relationship,
        message: input.message,
        arabicDua: input.arabicDua,
        duaCount: 1,
        createdAt: new Date().toISOString(),
      }
      db.condolences.push(condolence)
      saveData(db)
      return send(res, 201, condolence)
    }
    if (req.method === 'POST' && condDuaMatch) {
      const found = db.condolences.find((c) => c.id === condDuaMatch[1])
      if (!found) return send(res, 404, { error: 'Condolence not found' })
      found.duaCount += 1
      saveData(db)
      return send(res, 200, { duaCount: found.duaCount })
    }
    if (req.method === 'GET' && path === '/api/v1/vendors') {
      return send(res, 200, db.vendors)
    }
    if (req.method === 'POST' && path === '/api/v1/janazah-alerts/subscribe') {
      const input = await readBody(req)
      const sub = { ...input, id: uid('alert'), createdAt: new Date().toISOString() }
      db.subscriptions = db.subscriptions ?? []
      db.subscriptions.push(sub)
      saveData(db)
      return send(res, 201, sub)
    }
    if (req.method === 'POST' && path === '/api/v1/tips') {
      const input = await readBody(req)
      const tip = { id: uid('tip'), amount: Number(input.amount) || 0, donorName: input.donorName, createdAt: new Date().toISOString() }
      db.tips = db.tips ?? []
      db.tips.push(tip)
      saveData(db)
      return send(res, 201, tip)
    }
    if (req.method === 'GET' && path === '/api/v1/admin/stats') {
      if (!isAdmin(req)) return send(res, 401, { error: 'Admin passcode required' })
      return send(res, 200, {
        obituaries: db.obituaries.length,
        condolences: db.condolences.length,
        vendors: db.vendors.length,
        subscriptions: (db.subscriptions ?? []).length,
        tipsTotal: (db.tips ?? []).reduce((s, t) => s + (t.amount || 0), 0),
      })
    }
    return send(res, 404, { error: 'Not found' })
  } catch (err) {
    return send(res, 500, { error: String(err) })
  }
})

server.listen(PORT, () => {
  console.log(`Al-Baqaa API server listening on http://localhost:${PORT}`)
  console.log(`Data file: ${DATA_FILE}`)
})
