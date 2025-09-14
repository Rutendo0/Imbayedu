import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const artists = await storage.getArtists()
    return NextResponse.json(artists)
  } catch (error) {
    console.error('Artists API error:', error)
    return NextResponse.json({ message: 'Failed to fetch artists' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, bio, imageUrl, website, socialMedia } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }

    // Create artist
    const artist = await storage.createArtist({
      name,
      bio: bio || '',
      imageUrl: imageUrl || '/placeholder-artist.jpg',
      website: website || null,
      socialMedia: socialMedia || null,
      isFeatured: false
    })

    return NextResponse.json(artist, { status: 201 })
  } catch (error) {
    console.error('Create artist error:', error)
    return NextResponse.json({ message: 'Failed to create artist' }, { status: 500 })
  }
}