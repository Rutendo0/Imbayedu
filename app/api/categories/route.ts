import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { insertCategorySchema } from '@shared/schema'
import { z } from 'zod'

export async function GET() {
  try {
    const categories = await storage.getCategories()
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = insertCategorySchema.parse(body)
    const created = await storage.createCategory(validated)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid category data', errors: e.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 })
  }
}