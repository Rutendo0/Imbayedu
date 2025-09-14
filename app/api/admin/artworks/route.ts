import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const created = await storage.createArtwork(body)
  return NextResponse.json(created)
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id, ...patch } = await req.json()
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
  const updated = await storage.updateArtwork(Number(id), patch)
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
  const ok = await storage.deleteArtwork(Number(id))
  return NextResponse.json({ ok })
}