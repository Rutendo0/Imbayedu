import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr, 10)
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid collection id' }, { status: 400 })
    }
    const collection = await storage.getCollection(id)
    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 })
    }
    return NextResponse.json(collection)
  } catch (e) {
    console.error('Collection GET error:', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}