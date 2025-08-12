import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

// GET /api/cart/details?userId=1 - list cart items with artwork details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    if (!userIdParam) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 })
    }
    const userId = parseInt(userIdParam)
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 })
    }
    const items = await storage.getCartItemsWithDetails(userId)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch cart items with details' }, { status: 500 })
  }
}