import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Get real data from database
    const [orders, revenue, topArtworks] = await Promise.all([
      storage.getOrders(),
      storage.getRevenueByDay(days),
      storage.getTopArtworks(5)
    ])

    // Calculate metrics
    const paidOrders = orders.filter(o => o.status === 'paid')
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = paidOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate growth (compare with previous period)
    const previousDays = days * 2
    const previousRevenue = await storage.getRevenueByDay(previousDays)
    const currentPeriodRevenue = revenue.reduce((sum, r) => sum + r.total, 0)
    const previousPeriodRevenue = previousRevenue.slice(0, previousRevenue.length - revenue.length).reduce((sum, r) => sum + r.total, 0)
    const revenueGrowth = previousPeriodRevenue > 0 ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0

    const data = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      orderGrowth: 0, // Could be calculated similarly
      aovGrowth: 0, // Could be calculated similarly
      topSeller: topArtworks[0] || null,
      dailyRevenue: revenue.map(r => ({ date: r.date, revenue: r.total }))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Sales API error:', error)
    return NextResponse.json({ 
      message: 'Sales data unavailable',
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      orderGrowth: 0,
      aovGrowth: 0,
      topSeller: null,
      dailyRevenue: []
    }, { status: 200 })
  }
}
