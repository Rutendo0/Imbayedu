import { NextRequest, NextResponse } from 'next/server'
import postgres from 'postgres'
import { storage } from '@/lib/storage'

// Ensure this route is always dynamic and uncached
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const DATABASE_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  ''

const TARGET_PATH = '/img/artwork/Tunga.jpg'

export async function GET() {
  try {
    const artists = await storage.getArtists()
    const tunga = artists.find(a => a.name.trim().toLowerCase() === 'tunga makoni')
    return NextResponse.json({ hasDb: !!DATABASE_URL, current: tunga ? { id: tunga.id, name: tunga.name, imageUrl: tunga.imageUrl } : null })
  } catch (e) {
    console.error('[admin/fix-tunga][GET] Failed:', e)
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // If DB is configured, update the row directly. Otherwise, nothing to do (in-memory already uses correct seed).
  if (!DATABASE_URL) {
    return NextResponse.json({ updated: 0, message: 'No database configured; in-memory storage already uses the correct image URL.' })
  }
  const sql = postgres(DATABASE_URL, { max: 1 })
  try {
    const result = await sql<{ id: number; name: string; image_url: string }[]>`
      UPDATE artists
      SET image_url = ${TARGET_PATH}
      WHERE lower(trim(name)) = 'tunga makoni'
      RETURNING id, name, image_url
    `

    return NextResponse.json({ updated: result.length, rows: result })
  } catch (e) {
    console.error('[admin/fix-tunga][POST] Failed:', e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  } finally {
    await sql.end({ timeout: 1 })
  }
}