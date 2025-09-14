import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    
    // Handle missing data gracefully
    let orders = []
    let revenue = []
    let topArtworks = []
    
    try {
      orders = await storage.getOrders()
    } catch (e) {
      console.log('Orders table not found, using empty array')
    }
    
    try {
      revenue = await storage.getRevenueByDay(30)
    } catch (e) {
      console.log('Revenue data not available, using empty array')
    }
    
    try {
      topArtworks = await storage.getTopArtworks(5)
    } catch (e) {
      console.log('Top artworks not available, using empty array')
    }
    
    return NextResponse.json({
      ordersCount: orders.length,
      revenue: revenue || [],
      topArtworks: topArtworks || [],
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ 
      message: 'Dashboard data unavailable', 
      ordersCount: 0,
      revenue: [],
      topArtworks: []
    }, { status: 200 })
  }
}