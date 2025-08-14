import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const data = await storage.getFeaturedTestimonials()

    // Server-side de-duplication by content to prevent repeated testimonials
    const normalize = (s: string | null | undefined) => (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
    const map = new Map<string, any>()
    for (const t of data ?? []) {
      const key = `${normalize(t.name)}|${normalize(t.location)}|${normalize(t.comment)}|${t.rating ?? ''}`
      if (!map.has(key)) map.set(key, t)
    }
    const unique = Array.from(map.values())

    return NextResponse.json(unique)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch featured testimonials' }, { status: 500 })
  }
}