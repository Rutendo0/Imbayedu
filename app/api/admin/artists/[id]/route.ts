import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const artistId = parseInt(params.id)
    const body = await request.json()

    const updated = await storage.updateArtist(artistId, {
      name: body.name,
      bio: body.bio,
      imageUrl: body.imageUrl,
      featured: body.featured,
      location: body.location,
    })

    if (!updated) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update artist error:', error)
    return NextResponse.json({ message: 'Failed to update artist' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const artistId = parseInt(params.id)
    
    // Delete artist
    const success = await storage.deleteArtist(artistId)
    
    if (!success) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Artist deleted successfully' })
  } catch (error) {
    console.error('Delete artist error:', error)
    return NextResponse.json({ message: 'Failed to delete artist' }, { status: 500 })
  }
}
