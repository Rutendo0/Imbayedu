import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

// Ensure this route is always dynamic and uncached
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const artists = await storage.getFeaturedArtists()

  // Stronger de-duplication: by ID and by normalized name
  const seenIds = new Set<number | string>()
  const seenNames = new Set<string>()
  const uniqueArtists = [] as typeof artists

  for (const a of artists) {
    const normalizedName = (a.name || '').trim().toLowerCase()
    const hasId = seenIds.has(a.id as any)
    const hasName = normalizedName ? seenNames.has(normalizedName) : false

    if (!hasId && !hasName) {
      seenIds.add(a.id as any)
      if (normalizedName) seenNames.add(normalizedName)
      uniqueArtists.push(a)
    }
  }

  console.log('Returning', uniqueArtists?.length || 0, 'featured artists from API')
  return NextResponse.json(uniqueArtists)
}