import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

function startOfWeek(d: Date) {
  const date = new Date(d)
  const day = date.getUTCDay() // 0-6, Sun=0
  const diff = (day + 6) % 7 // make Monday start
  date.setUTCDate(date.getUTCDate() - diff)
  date.setUTCHours(0,0,0,0)
  return date
}

function startOfMonth(d: Date) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
  return date
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = Math.max(1, Math.min(365, Number(searchParams.get('days')) || 30))
  const group = (searchParams.get('group') || 'day').toLowerCase() as 'day'|'week'|'month'

  // day grouping can use existing helper
  if (group === 'day') {
    const revenue = await storage.getRevenueByDay(days)
    return NextResponse.json({ group: 'day', days, revenue })
  }

  // For week/month, derive from orders
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const orders = await storage.getOrders()
  const filtered = orders.filter(o => o.createdAt && o.createdAt >= since && o.status === 'paid')

  const map = new Map<string, number>()
  for (const o of filtered) {
    const created = o.createdAt as Date
    let key: string
    if (group === 'week') {
      const sow = startOfWeek(created)
      key = formatDate(sow)
    } else {
      // month
      const som = startOfMonth(created)
      key = `${som.getUTCFullYear()}-${String(som.getUTCMonth()+1).padStart(2, '0')}`
    }
    map.set(key, (map.get(key) || 0) + (o.total || 0))
  }

  const revenue = Array.from(map.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a,b)=> a.date.localeCompare(b.date))

  return NextResponse.json({ group, days, revenue })
}