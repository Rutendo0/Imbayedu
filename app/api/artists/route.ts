import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  let artists = await storage.getArtists()

  // Auto-seed if empty (works for both local and production DBs). In-memory storage is already seeded.
  if (!artists || artists.length === 0) {
    try {
      await storage.createArtist({
        name: "Tunga Makoni",
        bio: "Contemporary painter specializing in portrait art that captures the essence of African identity and heritage through vibrant colors and expressive brushwork. Her work celebrates cultural pride and explores themes of tradition in modern contexts.",
        imageUrl: "/img/artwork/Tunga.jpg?v=" + Date.now(),
        featured: true,
        location: "Harare, Zimbabwe",
      })
      await storage.createArtist({
        name: "O'Neal Tanaka Maisiri ",
        bio: "O'Neal Tanaka Maisiri is a Zimbabwean artist whose abstract paintings reflect a deep connection to his environment. Using bold colors and dynamic compositions, he conveys the energy and emotions of his surroundings.",
        imageUrl: "/img/artwork/artist.png",
        featured: true,
        location: "Harare, Zimbabwe",
      })
      artists = await storage.getArtists()
    } catch (e) {
      console.error("Seed artists failed:", e)
    }
  }

  // Normalize name for deduplication (trim + lower)
  const norm = (s: string) => s.trim().toLowerCase()

  // Group by normalized name and pick a single representative
  const byName = new Map<string, typeof artists[number][]>();
  for (const a of artists) {
    const k = norm(a.name)
    const list = byName.get(k) || []
    list.push(a)
    byName.set(k, list)
  }

  // For each group, choose the artist id with most artworks; fallback to lowest id
  const result: typeof artists = []
  for (const [, group] of byName) {
    try {
      const counts = await Promise.all(group.map(g => storage.getArtworksByArtist(g.id).then(xs => ({ id: g.id, count: xs.length }))))
      const best = counts.sort((a,b) => b.count - a.count || a.id - b.id)[0]
      const chosen = group.find(g => g.id === best.id)!
      result.push(chosen)
    } catch {
      // Fallback: pick lowest id if counting failed
      const chosen = group.sort((a,b) => a.id - b.id)[0]
      result.push(chosen)
    }
  }

  console.log('Returning', result.length, 'deduped artists from API')
  return NextResponse.json(result)
}