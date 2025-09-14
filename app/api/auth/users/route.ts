import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth'

// Create a new user (admin only)
export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { username, password, email, fullName } = body || {}
    if (!username || !password || !email) {
      return NextResponse.json({ message: 'username, email, password required' }, { status: 400 })
    }
    // Basic duplicate check when using DB impl
    const existing = await storage.getUserByUsername(username)
    if (existing) return NextResponse.json({ message: 'Username already exists' }, { status: 409 })

    const user = await storage.createUser({ username, password, email, fullName })
    return NextResponse.json({ id: user.id, username: user.username, email: user.email, fullName: user.fullName })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to create user' }, { status: 400 })
  }
}

// Change password for current admin or target user (admin only)
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { userId, newPassword } = body || {}
    const targetId = Number(userId ?? (admin.id === -1 ? NaN : admin.id))
    if (!newPassword || (!Number.isFinite(targetId) && admin.id === -1)) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
    }
    const ok = await storage.updateUserPassword(targetId, String(newPassword))
    if (!ok) return NextResponse.json({ message: 'User not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to update password' }, { status: 400 })
  }
}