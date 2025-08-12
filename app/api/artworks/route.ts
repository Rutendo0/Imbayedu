import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')
  const artistId = searchParams.get('artistId')
  const collectionId = searchParams.get('collectionId')
  const featured = searchParams.get('featured')

  let artworks = await storage.getArtworks()

  if (categoryId) {
    const id = parseInt(categoryId)
    artworks = artworks.filter(a => a.categoryId === id)
  }
  if (artistId) {
    const id = parseInt(artistId)
    artworks = artworks.filter(a => a.artistId === id)
  }
  if (collectionId) {
    const id = parseInt(collectionId)
    artworks = artworks.filter(a => a.collectionId === id)
  }
  if (featured === 'true') {
    artworks = artworks.filter(a => a.featured)
  }

  return NextResponse.json(artworks)
}