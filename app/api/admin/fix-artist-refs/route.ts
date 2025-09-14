import { NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { artists, artworks } from '@shared/schema'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const norm = (s: string) => s.trim().toLowerCase()

export async function POST() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED
    if (!connectionString) {
      return NextResponse.json({ message: 'Database URL not configured' }, { status: 500 })
    }

    const client = postgres(connectionString, { max: 1 })
    const db = drizzle(client)

    // 1) Fetch artists and build canonical map by normalized name (lowest id wins)
    const allArtists = (await db.select().from(artists)) as { id: number; name: string }[]
    const byName = new Map<string, number>()
    for (const a of allArtists) {
      const key = norm(a.name)
      const current = byName.get(key)
      if (current == null || a.id < current) byName.set(key, a.id)
    }

    // 2) Fetch artworks and find those with invalid or duplicate artistId
    const allArtworks = (await db.select().from(artworks)) as { id: number; title: string; artistId: number | null }[]

    let fixed = 0
    let orphan = 0

    for (const aw of allArtworks) {
      if (!aw.artistId) {
        orphan++
        continue
      }
      // if artistId does not exist in artists table, mark as orphan
      if (!allArtists.some(a => a.id === aw.artistId)) {
        orphan++
        continue
      }

      // If this artist has duplicates, reassign to canonical id
      const artistRow = allArtists.find(a => a.id === aw.artistId)!
      const canonicalId = byName.get(norm(artistRow.name))!
      if (canonicalId !== aw.artistId) {
        await client`
          UPDATE artworks
          SET artist_id = ${canonicalId}
          WHERE id = ${aw.id}
        `
        fixed++
      }
    }

    await client.end()

    return NextResponse.json({ message: 'Artist references fixed', fixed, orphan })
  } catch (e) {
    console.error('[admin/fix-artist-refs] failed:', e)
    return NextResponse.json({ message: 'Failed to fix artist refs' }, { status: 500 })
  }
}