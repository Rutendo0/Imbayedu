import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  const artists = await storage.getFeaturedArtists()
  
  // Remove any potential duplicates based on artist ID
  const uniqueArtists = artists.filter((artist, index, self) => 
    index === self.findIndex(a => a.id === artist.id)
  )
  
  console.log('Returning', uniqueArtists?.length || 0, 'featured artists from API')
  return NextResponse.json(uniqueArtists)
}