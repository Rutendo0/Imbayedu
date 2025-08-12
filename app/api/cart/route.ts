import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { insertCartItemSchema } from '@shared/schema'
import { z } from 'zod'

// POST /api/cart - add item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = insertCartItemSchema.parse(body)
    const created = await storage.createCartItem(validated)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid cart item data', errors: e.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Failed to add item to cart' }, { status: 500 })
  }
}

// GET /api/cart?userId=1 - list items for user
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
    const items = await storage.getCartItems(userId)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch cart items' }, { status: 500 })
  }
}

// DELETE /api/cart?userId=1 - clear cart for user
export async function DELETE(request: NextRequest) {
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
    await storage.clearCart(userId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Failed to clear cart' }, { status: 500 })
  }
}