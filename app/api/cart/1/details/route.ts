import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const items = await storage.getCartItemsWithDetails(1)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch cart items with details' }, { status: 500 })
  }
}