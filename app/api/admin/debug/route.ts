import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const [categories, collections, artists, artworks, testimonials] = await Promise.all([
      storage.getCategories(),
      storage.getCollections(),
      storage.getArtists(),
      storage.getArtworks(),
      storage.getTestimonials(),
    ])

    const sample = artworks.slice(0, 3).map(a => ({ id: a.id, title: a.title, artistId: a.artistId }))

    return NextResponse.json({
      env: {
        DISABLE_DB: process.env.DISABLE_DB ?? null,
        has_POSTGRES_URL: !!process.env.POSTGRES_URL,
        has_DATABASE_URL: !!process.env.DATABASE_URL,
        has_POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      },
      counts: {
        categories: categories.length,
        collections: collections.length,
        artists: artists.length,
        artworks: artworks.length,
        testimonials: testimonials.length,
      },
      sampleArtworks: sample,
    })
  } catch (e) {
    console.error('Admin debug error', e)
    return NextResponse.json({ message: 'Debug failed' }, { status: 500 })
  }
}