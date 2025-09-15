import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const artworkId = parseInt(params.id)
    const body = await request.json()
    const { title, description, price, imageUrl, inStock, dimensions, medium } = body

    // Update artwork
    const updatedArtwork = await storage.updateArtwork(artworkId, {
      title,
      description,
      price: price ? parseFloat(price) : undefined,
      imageUrl,
      inStock: inStock !== undefined ? Boolean(inStock) : undefined,
      dimensions,
      medium
    })

    if (!updatedArtwork) {
      return NextResponse.json({ message: 'Artwork not found' }, { status: 404 })
    }

    return NextResponse.json(updatedArtwork)
  } catch (error) {
    console.error('Update artwork error:', error)
    return NextResponse.json({ message: 'Failed to update artwork' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const artworkId = parseInt(params.id)
    
    // Delete artwork
    const success = await storage.deleteArtwork(artworkId)
    
    if (!success) {
      return NextResponse.json({ message: 'Artwork not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Artwork deleted successfully' })
  } catch (error) {
    console.error('Delete artwork error:', error)
    return NextResponse.json({ message: 'Failed to delete artwork' }, { status: 500 })
  }
}
