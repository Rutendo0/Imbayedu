import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

// Ensure this route is always dynamic and runs on Node.js
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await ctx.params
    const id = Number.parseInt(idStr, 10)
    if (!idStr || Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid artist id' }, { status: 400 })
    }

    console.time(`[artist-artworks] id=${id}`)

    // Load the canonical artist and unify duplicates by normalized name
    const artist = await storage.getArtist(id)
    if (!artist) {
      console.timeEnd(`[artist-artworks] id=${id}`)
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 })
    }

    const norm = (s: string) => s.trim().toLowerCase()
    const allArtists = await storage.getArtists()
    const siblingIds = allArtists
      .filter(a => norm(a.name) === norm(artist.name))
      .map(a => a.id)

    // Gather artworks across all sibling IDs (handles duplicates created by name variants)
    const lists = await Promise.all(siblingIds.map(aid => storage.getArtworksByArtist(aid)))
    let merged = lists.flat()

    // If still none found, try auto-seed in dev once then refetch
    if (!merged || merged.length === 0) {
      try {
        const seedModule = await import('../../../admin/seed/route')
        if (typeof seedModule.POST === 'function') {
          await seedModule.POST()
          const relists = await Promise.all(siblingIds.map(aid => storage.getArtworksByArtist(aid)))
          merged = relists.flat()
        }
      } catch (e) {
        console.warn('Auto-seed in artist route skipped/failed:', e)
      }
    }

    // De-dupe by artwork id
    const seen = new Set<number>()
    const unique = merged.filter(a => (seen.has(a.id) ? false : (seen.add(a.id), true)))

    // Hydrate with details for each artwork
    const detailed = await Promise.all(unique.map(async (a) => await storage.getArtworkWithDetails(a.id)))
    const result = (detailed || []).filter(Boolean)

    console.log(`[artist-artworks] id=${id} siblings=${siblingIds.length} base=${unique.length} result=${result.length}`)
    console.timeEnd(`[artist-artworks] id=${id}`)
    return NextResponse.json(result)
  } catch (e) {
    console.error('Artist artworks GET error:', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}