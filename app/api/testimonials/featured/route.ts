import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const data = await storage.getFeaturedTestimonials()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch featured testimonials' }, { status: 500 })
  }
}