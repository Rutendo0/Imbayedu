import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid collection id' }, { status: 400 })
  const collection = await storage.getCollection(id)
  if (!collection) return NextResponse.json({ message: 'Collection not found' }, { status: 404 })
  return NextResponse.json(collection)
}