import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const collections = await storage.getCollections()
    return NextResponse.json(collections)
  } catch (error) {
    console.error('Collections API error:', error)
    return NextResponse.json({ message: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, description, imageUrl } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }

    // Create collection
    const collection = await storage.createCollection({
      name,
      description: description || '',
      imageUrl: imageUrl || '/placeholder-collection.jpg'
    })

    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    console.error('Create collection error:', error)
    return NextResponse.json({ message: 'Failed to create collection' }, { status: 500 })
  }
}