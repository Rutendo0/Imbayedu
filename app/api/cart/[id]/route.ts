import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// PATCH /api/cart/[id] - update quantity
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr, 10)
    if (Number.isNaN(id)) return NextResponse.json({ message: 'Invalid cart item ID' }, { status: 400 })
    const body = await request.json()
    const quantity = Number(body?.quantity)
    if (!Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ message: 'Invalid quantity' }, { status: 400 })
    }
    const updated = await storage.updateCartItemQuantity(id, quantity)
    if (!updated) return NextResponse.json({ message: 'Cart item not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ message: 'Failed to update cart item' }, { status: 500 })
  }
}

// DELETE /api/cart/[id] - remove item
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr, 10)
    if (Number.isNaN(id)) return NextResponse.json({ message: 'Invalid cart item ID' }, { status: 400 })
    const ok = await storage.removeCartItem(id)
    if (!ok) return NextResponse.json({ message: 'Cart item not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Failed to remove cart item' }, { status: 500 })
  }
}