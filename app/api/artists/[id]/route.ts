import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid artist id' }, { status: 400 })
  const artist = await storage.getArtist(id)
  if (!artist) return NextResponse.json({ message: 'Artist not found' }, { status: 404 })
  return NextResponse.json(artist)
}