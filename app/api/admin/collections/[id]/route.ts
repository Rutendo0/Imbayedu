import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const collectionId = parseInt(params.id)
    
    // Delete collection
    const success = await storage.deleteCollection(collectionId)
    
    if (!success) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Collection deleted successfully' })
  } catch (error) {
    console.error('Delete collection error:', error)
    return NextResponse.json({ message: 'Failed to delete collection' }, { status: 500 })
  }
}
