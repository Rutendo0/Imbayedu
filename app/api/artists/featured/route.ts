import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  const artists = await storage.getFeaturedArtists()
  return NextResponse.json(artists)
}