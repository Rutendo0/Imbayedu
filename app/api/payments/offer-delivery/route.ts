import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DEFAULT_ORIGIN = process.env.ORIGIN_ADDRESS || 'Pro Flora Farm, Concession, Zimbabwe'
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY

function priceFromDistanceKm(km: number): number {
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
    const offeredFeeCents = Number(body?.offeredFeeCents)

    if (!shipping?.address || !shipping?.city) {
      return NextResponse.json({ message: 'shipping address and city required' }, { status: 400 })
    }
    if (!Number.isFinite(offeredFeeCents) || offeredFeeCents <= 0) {
      return NextResponse.json({ message: 'offeredFeeCents must be > 0' }, { status: 400 })
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

    if (distanceKm == null) distanceKm = 8

    const baseFeeUsd = priceFromDistanceKm(distanceKm)
    const baseFeeCents = Math.round(baseFeeUsd * 100)

    const minFeeCents = Math.max(Math.round(baseFeeCents * 0.8), 300) // at least $3

    if (offeredFeeCents >= baseFeeCents) {
      return NextResponse.json({
        status: 'accepted',
        distanceKm,
        baseFeeCents,
        minFeeCents,
        acceptedFeeCents: Math.round(offeredFeeCents),
      })
    }

    if (offeredFeeCents >= minFeeCents) {
      // Counter with base fee
      return NextResponse.json({
        status: 'counter',
        distanceKm,
        baseFeeCents,
        minFeeCents,
        counterFeeCents: baseFeeCents,
      })
    }

    // Too low, counter with min acceptable
    return NextResponse.json({
      status: 'counter',
      distanceKm,
      baseFeeCents,
      minFeeCents,
      counterFeeCents: minFeeCents,
    })
  } catch (e) {
    console.error('offer-delivery failed', e)
    return NextResponse.json({ message: 'Failed to evaluate offer' }, { status: 500 })
  }
}