import { NextResponse } from 'next/server'
import postgres from 'postgres'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const TARGET_TUNGA_TITLES = new Set<string>([
  'Cultural Heritage',
  'Blending Colours',
])

export async function POST() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED
    if (!DATABASE_URL) {
      return NextResponse.json({ message: 'Database URL not configured' }, { status: 500 })
    }

    const sql = postgres(DATABASE_URL, { max: 1 })
    try {
      // Lookup canonical artist ids by normalized name
      const artists = await sql<{ id: number; name: string }[]>`SELECT id, name FROM artists`
      const norm = (s: string) => s.trim().toLowerCase()
      const tunga = artists.find(a => norm(a.name) === norm('Tunga Makoni'))
      const oneal = artists.find(a => norm(a.name) === norm("O'Neal Tanaka Maisiri"))

      if (!tunga || !oneal) {
        return NextResponse.json({ message: 'Required artists not found' }, { status: 500 })
      }

      // Get all sold-out artworks
      const soldOut = await sql<{ id: number; title: string; artist_id: number | null }[]>`
        SELECT id, title, artist_id FROM artworks WHERE in_stock = false
      `

      let toTunga = 0
      let toOneal = 0

      for (const aw of soldOut) {
        const assignToTunga = TARGET_TUNGA_TITLES.has(aw.title)
        const targetId = assignToTunga ? tunga.id : oneal.id
        if (aw.artist_id !== targetId) {
          await sql`UPDATE artworks SET artist_id = ${targetId} WHERE id = ${aw.id}`
          if (assignToTunga) toTunga++
          else toOneal++
        }
      }

      return NextResponse.json({ message: 'Assignments updated', tunga: toTunga, oneal: toOneal, totalProcessed: soldOut.length })
    } finally {
      await sql.end({ timeout: 1 })
    }
  } catch (e) {
    console.error('[admin/fix-soldout-artist-assign] failed:', e)
    return NextResponse.json({ message: 'Failed to assign artists for sold-out artworks' }, { status: 500 })
  }
}