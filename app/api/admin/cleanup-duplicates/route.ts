import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { drizzle } from 'drizzle-orm/postgres-js'
import { artists, collections } from '@shared/schema'
import postgres from 'postgres'

export async function POST() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      return NextResponse.json({ message: 'Database URL not configured' }, { status: 500 })
    }

    const client = postgres(connectionString)
    const db = drizzle(client)

    // Clean up duplicate artists (keep the one with the lowest ID)
    const duplicateArtistsQuery = `
      DELETE FROM artists 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM artists 
        GROUP BY name
      )
    `
    
    const duplicateCollectionsQuery = `
      DELETE FROM collections 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM collections 
        GROUP BY name
      )
    `

    await client.unsafe(duplicateArtistsQuery)
    await client.unsafe(duplicateCollectionsQuery)

    // Get counts after cleanup
    const artistCount = await db.select().from(artists)
    const collectionCount = await db.select().from(collections)

    await client.end()

    return NextResponse.json({ 
      message: 'Duplicates cleaned up successfully',
      artistsRemaining: artistCount.length,
      collectionsRemaining: collectionCount.length
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ message: 'Failed to cleanup duplicates' }, { status: 500 })
  }
}
