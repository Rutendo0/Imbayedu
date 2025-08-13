import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

// Ensure this route is always dynamic and runs on Node.js
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const idParam = params?.id
    const id = Number.parseInt(String(idParam), 10)
    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid artist id' }, { status: 400 })
    }
    const artist = await storage.getArtist(id)
    if (!artist) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 })
    }
    return NextResponse.json(artist)
  } catch (e) {
    console.error('Artist GET error:', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}