import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    let artworks = await storage.getArtworksWithDetails()

    // Auto-seed once if database is empty
    if (!artworks || artworks.length === 0) {
      try {
        const seedModule = await import('../../admin/seed/route')
        if (typeof seedModule.POST === 'function') {
          await seedModule.POST()
          artworks = await storage.getArtworksWithDetails()
        }
      } catch (e) {
        console.warn('Auto-seed skipped/failed:', e)
      }
    }

    return NextResponse.json(artworks)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch artworks with details' }, { status: 500 })
  }
}