import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function POST(req: NextRequest) {
  try {
    let { identifier, password } = await req.json()
    if (!identifier || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 })
    }
    identifier = String(identifier).trim()
    password = String(password).trim()

    // Option 1: ENV-based admin (recommended quick secure setup)
    const envUser = process.env.ADMIN_USER
    const envPass = process.env.ADMIN_PASS
    if (envUser && envPass && identifier === envUser && password === envPass) {
      const res = NextResponse.json({ id: 'env', username: envUser, isAdmin: true })
      res.cookies.set('admin_user', 'envadmin', { httpOnly: true, sameSite: 'lax', path: '/' })
      return res
    }

    // Option 2: DB-based admin (password plain compare for now; can switch to bcrypt later)
    const user = await storage.getUserByUsername(identifier)
    if (!user || user.password !== password || !user.isAdmin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const res = NextResponse.json({ id: user.id, username: user.username, isAdmin: user.isAdmin })
    res.cookies.set('admin_user', String(user.id), { httpOnly: true, sameSite: 'lax', path: '/' })
    return res
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Login failed' }, { status: 400 })
  }
}