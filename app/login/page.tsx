"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Sun, Moon } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [tab] = useState<'login'>('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [busy, setBusy] = useState(false)
  // Theme
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  
  // Initialize theme and attach to html
  useState(() => {
    try {
      const stored = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as 'light'|'dark'|null
      const next = stored || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      setTheme(next)
      if (next === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch {}
  })
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    try { localStorage.setItem('theme', next) } catch {}
  }

  const doLogin = async () => {
    setError(null); setBusy(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) })
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed')
      // ensure cookie applied, then redirect robustly
      await new Promise((r)=>setTimeout(r, 200))
      router.push('/admin')
      // fallback: hard redirect if SPA navigation fails
      setTimeout(()=>{ if (typeof window !== 'undefined') window.location.href = '/admin' }, 500)
    } catch (e:any) { setError(e.message) } finally { setBusy(false) }
  }



  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-neutral-950">
      <Card className="w-full max-w-md p-8 border shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/img/artwork/WhatsApp Image 2025-06-24 at 02.31.06.jpg" alt="Imbayedu" width={28} height={28} className="rounded-sm object-cover" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-neutral-500 mt-1">Access the admin dashboard</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme==='dark' ? <Sun size={18}/> : <Moon size={18}/>}
          </Button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded p-2">{error}</div>
        )}

        {tab === 'login' && (
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-neutral-700">Username</label>
              <Input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="admin" />
            </div>
            <div>
              <label className="text-sm text-neutral-700">Password</label>
              <div className="relative">
                <Input type={show ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
                <button
                  type="button"
                  onClick={() => setShow(s=>!s)}
                  className="absolute inset-y-0 right-2 flex items-center text-neutral-500 hover:text-neutral-800"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="w-full" onClick={doLogin} disabled={busy}>Login</Button>
              <Button variant="outline" onClick={()=>router.push('/')} disabled={busy}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}