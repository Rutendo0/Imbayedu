import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = (searchParams.get('status') || '').toLowerCase() // pending|paid|failed|refunded
  const paymentMethod = (searchParams.get('paymentMethod') || '').toLowerCase() // credit-card|paypal|bank-transfer
  const days = Number(searchParams.get('days') || '')
  const since = Number.isFinite(days) && days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null

  let orders = await storage.getOrders()
  if (since) orders = orders.filter(o => o.createdAt && o.createdAt >= since)
  if (status) orders = orders.filter(o => (o.status || '').toLowerCase() === status)
  if (paymentMethod) orders = orders.filter(o => (o.paymentMethod || '').toLowerCase() === paymentMethod)
  orders.sort((a,b)=> (b.createdAt?.getTime?.()||0) - (a.createdAt?.getTime?.()||0))

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { status, paymentMethod, customerName, customerEmail, total, items } = body

    const order = await storage.createOrder({
      status,
      paymentMethod,
      customerName,
      customerEmail,
      total,
    })

    if (Array.isArray(items)) {
      for (const it of items) {
        await storage.addOrderItem({
          orderId: order.id,
          artworkId: it.artworkId,
          title: it.title,
          price: it.price,
          quantity: it.quantity,
        })
      }
    }

    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to create order' }, { status: 400 })
  }
}