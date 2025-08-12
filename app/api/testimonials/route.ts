import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { insertTestimonialSchema } from '@shared/schema'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const data = featured === 'true' ? await storage.getFeaturedTestimonials() : await storage.getTestimonials()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = insertTestimonialSchema.parse(body)
    const created = await storage.createTestimonial(validated)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid testimonial data', errors: e.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Failed to create testimonial' }, { status: 500 })
  }
}