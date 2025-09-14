import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DEFAULT_ORIGIN = process.env.ORIGIN_ADDRESS || 'Pro Flora Farm, Concession, Zimbabwe'
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY

function priceFromDistanceKm(km: number): number {
  // Simple tiered pricing in USD; adjust as needed
  if (km <= 10) return 5
  if (km <= 30) return 15
  if (km <= 80) return 35
  if (km <= 150) return 60
  return 90
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const shipping = body?.shipping
    if (!shipping?.address || !shipping?.city) {
      return NextResponse.json({ message: 'shipping address and city required' }, { status: 400 })
    }

    const destination = `${shipping.address}, ${shipping.city}${shipping.state ? ', ' + shipping.state : ''}${shipping.country ? ', ' + shipping.country : ''}`

    let distanceKm: number | null = null

    if (GOOGLE_KEY) {
      const params = new URLSearchParams({
        origins: DEFAULT_ORIGIN,
        destinations: destination,
        key: GOOGLE_KEY,
        units: 'metric',
      })
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`
      const res = await fetch(url)
      const data = await res.json()
      const element = data?.rows?.[0]?.elements?.[0]
      const meters = element?.distance?.value
      if (meters && typeof meters === 'number') {
        distanceKm = meters / 1000
      }
    }

    // Fallback: if distance not computed, assume local 8km
    if (distanceKm == null) distanceKm = 8

    const feeUsd = priceFromDistanceKm(distanceKm)
    const feeCents = Math.round(feeUsd * 100)

    return NextResponse.json({ distanceKm, feeCents })
  } catch (e) {
    console.error('calc-delivery failed', e)
    return NextResponse.json({ message: 'Failed to calculate delivery fee' }, { status: 500 })
  }
}