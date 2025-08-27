import { NextRequest, NextResponse } from 'next/server'
import postgres from 'postgres'

// Uses the same env vars as storage.ts
const DATABASE_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  ''

// Patterns for duplicate titles (case-insensitive). Flexible with suffixes and typos provided.
const TITLE_PATTERNS = [
  'sunset%reflect%','cultural heritage 2%','cultural heritage 3%',
  'colourful absraction%','absract patterns%','unity in diversity%',
  'soulful potrait%','vibrant abstraction%','expressionist landscape%'
]

if (!DATABASE_URL) {
  console.warn('[admin/cleanup] No DATABASE_URL/POSTGRES_URL configured; endpoint will fail.')
}

export async function GET() {
  if (!DATABASE_URL) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const sql = postgres(DATABASE_URL, { max: 1 })
  try {
    const whereFrag = TITLE_PATTERNS.reduce((frag, p) => (
      frag ? sql`${frag} OR title ILIKE ${p}` : sql`title ILIKE ${p}`
    ), null as any)
    const rows = await sql<{ id: number; title: string }[]>`
      SELECT id, title FROM artworks
      WHERE ${whereFrag}
      ORDER BY title ASC
    `
    return NextResponse.json({ matches: rows })
  } catch (e) {
    console.error('[admin/cleanup][GET] Failed:', e)
    return NextResponse.json({ error: 'Failed to query matches' }, { status: 500 })
  } finally {
    await sql.end({ timeout: 1 })
  }
}

export async function POST(request: NextRequest) {
  if (!DATABASE_URL) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  // Optional: allow custom list via JSON body { patterns: string[] }
  let patterns = TITLE_PATTERNS
  try {
    const body = await request.json().catch(() => null)
    if (body && Array.isArray(body.patterns) && body.patterns.length) {
      patterns = body.patterns
    }
  } catch {}

  const sql = postgres(DATABASE_URL, { max: 1 })
  try {
    const result = await sql.begin(async (trx) => {
      const whereFrag = patterns.reduce((frag, p) => (
        frag ? trx`${frag} OR title ILIKE ${p}` : trx`title ILIKE ${p}`
      ), null as any)
      const idsRows = await trx<{ id: number }[]>`
        SELECT id FROM artworks WHERE ${whereFrag}
      `
      const ids = idsRows.map(r => r.id)
      if (ids.length === 0) {
        return { matched: 0, deletedArtworks: 0, deletedCartItems: 0 }
      }

      const cartDel = await trx<{ id: number }[]>`
        DELETE FROM cart_items WHERE artwork_id IN ${trx(ids)} RETURNING id
      `
      const artDel = await trx<{ id: number }[]>`
        DELETE FROM artworks WHERE id IN ${trx(ids)} RETURNING id
      `
      return { matched: ids.length, deletedArtworks: artDel.length, deletedCartItems: cartDel.length }
    })

    return NextResponse.json(result)
  } catch (e) {
    console.error('[admin/cleanup][POST] Failed:', e)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  } finally {
    await sql.end({ timeout: 1 })
  }
}