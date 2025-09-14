import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const [orders, revenue, tops] = await Promise.all([
    storage.getOrders(),
    storage.getRevenueByDay(30),
    storage.getTopArtworks(5),
  ])
  return NextResponse.json({
    ordersCount: orders.length,
    revenue,
    topArtworks: tops,
  })
}