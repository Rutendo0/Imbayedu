import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid artwork id' }, { status: 400 })
  const artwork = await storage.getArtworkWithDetails(id)
  if (!artwork) return NextResponse.json({ message: 'Artwork not found' }, { status: 404 })
  return NextResponse.json(artwork)
}