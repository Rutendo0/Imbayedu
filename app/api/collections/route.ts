import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { insertCollectionSchema } from '@shared/schema'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get('featured')
  try {
    const data = featured === 'true'
      ? await storage.getFeaturedCollections()
      : await storage.getCollections()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ message: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = insertCollectionSchema.parse(body)
    const created = await storage.createCollection(validated)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid collection data', errors: e.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Failed to create collection' }, { status: 500 })
  }
}