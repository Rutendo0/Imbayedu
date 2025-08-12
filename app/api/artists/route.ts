import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  let artists = await storage.getArtists()

  // Auto-seed if empty (works for both local and production DBs). In-memory storage is already seeded.
  if (!artists || artists.length === 0) {
    try {
      await storage.createArtist({
        name: "Tunga Makoni",
        bio: "Contemporary painter specializing in portrait art that captures the essence of African identity and heritage through vibrant colors and expressive brushwork. Her work celebrates cultural pride and explores themes of tradition in modern contexts.",
        imageUrl: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.33_a0ff7f2e.jpg",
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

  return NextResponse.json(artists)
}