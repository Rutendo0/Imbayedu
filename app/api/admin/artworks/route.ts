import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const artworks = await storage.getArtworks()
    return NextResponse.json(artworks)
  } catch (error) {
    console.error('Artworks API error:', error)
    return NextResponse.json({ message: 'Failed to fetch artworks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, price, imageUrl, artistId, categoryId, collectionId, dimensions, medium, year, inStock, featured } = body

    if (!title || price == null || artistId == null || categoryId == null) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const artwork = await storage.createArtwork({
      title,
      description: description || '',
      price: Number(price),
      imageUrl: imageUrl || '/placeholder-artwork.jpg',
      artistId: Number(artistId),
      categoryId: Number(categoryId),
      collectionId: collectionId != null ? Number(collectionId) : undefined,
      dimensions: dimensions || undefined,
      medium: medium || undefined,
      year: year || undefined,
      inStock: inStock != null ? Boolean(inStock) : undefined,
      featured: featured != null ? Boolean(featured) : undefined,
    })

    return NextResponse.json(artwork, { status: 201 })
  } catch (error) {
    console.error('Create artwork error:', error)
    return NextResponse.json({ message: 'Failed to create artwork' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, ...patch } = body || {}
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })

    const conv: any = {}
    if ('title' in patch) conv.title = patch.title
    if ('description' in patch) conv.description = patch.description
    if ('price' in patch) conv.price = patch.price != null ? Number(patch.price) : undefined
    if ('imageUrl' in patch) conv.imageUrl = patch.imageUrl
    if ('artistId' in patch) conv.artistId = patch.artistId != null ? Number(patch.artistId) : null
    if ('categoryId' in patch) conv.categoryId = patch.categoryId != null ? Number(patch.categoryId) : undefined
    if ('collectionId' in patch) conv.collectionId = patch.collectionId != null ? Number(patch.collectionId) : null
    if ('dimensions' in patch) conv.dimensions = patch.dimensions
    if ('medium' in patch) conv.medium = patch.medium
    if ('year' in patch) conv.year = patch.year
    if ('inStock' in patch) conv.inStock = Boolean(patch.inStock)
    if ('featured' in patch) conv.featured = Boolean(patch.featured)

    const updated = await storage.updateArtwork(Number(id), conv)
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update artwork error:', error)
    return NextResponse.json({ message: 'Failed to update artwork' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })

    const ok = await storage.deleteArtwork(Number(id))
    return NextResponse.json({ ok })
  } catch (error) {
    console.error('Delete artwork error:', error)
    return NextResponse.json({ message: 'Failed to delete artwork' }, { status: 500 })
  }
}