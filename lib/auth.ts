import { cookies } from 'next/headers'
import { storage } from './storage'

export async function requireAdmin() {
  const cookieStore = await cookies()
  const id = cookieStore.get('admin_user')?.value
  
  if (!id) return null

  // Accept env-based admin cookie
  if (id === 'envadmin' && process.env.ADMIN_USER && process.env.ADMIN_PASS) {
    return { id: -1, username: process.env.ADMIN_USER, isAdmin: true } as any
  }

  // Fall back to DB user
  const num = Number(id)
  if (!Number.isFinite(num)) return null
  
  const user = await storage.getUser(num)
  if (!user || !user.isAdmin) return null
  
  return user
}