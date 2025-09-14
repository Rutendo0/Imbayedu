import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { storage } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = Number(body?.userId)
    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 })
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      return NextResponse.json({ message: 'Server misconfigured: STRIPE_SECRET_KEY missing' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' as any })

    const items = await storage.getCartItemsWithDetails(userId)
    const subtotal = items.reduce((sum, ci) => sum + ci.artwork.price * ci.quantity, 0)

    // Delivery fee: dynamic, sent from client in cents if using delivery
    const deliveryFee = body?.deliveryMethod === 'deliver' ? Math.max(0, Number(body?.deliveryFeeCents) || 0) / 100 : 0
    const currency = 'usd'
    const amount = Math.round((subtotal + deliveryFee) * 100) // cents

    const shipping = body?.shipping
      ? {
          name: `${body.shipping.firstName || ''} ${body.shipping.lastName || ''}`.trim(),
          address: {
            line1: body.shipping.address || undefined,
            line2: undefined,
            city: body.shipping.city || undefined,
            state: body.shipping.state || undefined,
            postal_code: body.shipping.zipCode || undefined,
            country: (body.shipping.country || 'US').toUpperCase(),
          },
          phone: body.shipping.phone || undefined,
        }
      : undefined

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      shipping,
      metadata: {
        userId: String(userId),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (e) {
    console.error('Create intent failed:', e)
    return NextResponse.json({ message: 'Failed to create payment intent' }, { status: 500 })
  }
}