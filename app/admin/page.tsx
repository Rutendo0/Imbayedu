"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Force refresh to prevent caching
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
  })
}

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table'
import Link from 'next/link'
import { Settings, UserPlus, Key, LogOut, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
// Lightweight inline chart components
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

function CreateUserForm() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const onSubmit = async () => {
    setMsg(null); setBusy(true)
    try {
      const res = await fetch('/api/auth/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName, username, email, password }) })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || 'Failed to create user')
      setMsg('User created')
      setFullName(''); setUsername(''); setEmail(''); setPassword('')
    } catch (e:any) { setMsg(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="grid gap-3">
      <Input placeholder="Full name (optional)" value={fullName} onChange={e=>setFullName(e.target.value)} />
      <Input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {msg && <div className="text-xs text-neutral-600">{msg}</div>}
      <div>
        <Button onClick={onSubmit} disabled={busy}>Create User</Button>
      </div>
    </div>
  )
}

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const onSubmit = async () => {
    setMsg(null); setBusy(true)
    try {
      const res = await fetch('/api/auth/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword }) })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || 'Failed to update password')
      setMsg('Password updated')
      setNewPassword('')
    } catch (e:any) { setMsg(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="grid gap-3">
      <Input placeholder="New password" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
      {msg && <div className="text-xs text-neutral-600">{msg}</div>}
      <div>
        <Button onClick={onSubmit} disabled={busy}>Update Password</Button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState<{ status: string; paymentMethod: string; days: number }>({ status: '', paymentMethod: '', days: 30 })
  const [showSettings, setShowSettings] = useState(false)
  const [settingsView, setSettingsView] = useState<'create' | 'password' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [version] = useState(() => Date.now()) // Force refresh

  // Theme
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  useEffect(() => {
    try {
      const stored = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as 'light'|'dark'|null
      const next = stored || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      setTheme(next)
      if (next === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch {}
  }, [])
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    try { localStorage.setItem('theme', next) } catch {}
  }

  // Fallback auth check and load stats
  useEffect(() => {
    const checkAuthAndLoadStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/dashboard', {
          credentials: 'include',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        if (!response.ok) {
          router.push('/login')
          return
        }
        
        const json = await response.json()
        setStats(json)
        setIsLoading(false)
      } catch (error) {
        router.push('/login')
      }
    }
    
    checkAuthAndLoadStats()
  }, [router])

  // Load orders when stats available
  useEffect(() => {
    if (!stats) return
    const params = new URLSearchParams()
    if (filter.status) params.set('status', filter.status)
    if (filter.paymentMethod) params.set('paymentMethod', filter.paymentMethod)
    if (filter.days) params.set('days', String(filter.days))
    fetch(`/api/admin/orders?${params.toString()}`)
      .then(r=>r.json())
      .then(setOrders)
      .catch(()=>setOrders([]))
  }, [stats, filter])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">Version: {version}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-[#E3D3BD] bg-[#F3E6D3]/90 backdrop-blur supports-[backdrop-filter]:bg-[#F3E6D3]/80 text-[#5E4B3C] dark:bg-neutral-950/80">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Image src="/img/artwork/WhatsApp Image 2025-06-24 at 02.31.06.jpg" alt="Imbayedu" width={28} height={28} className="rounded-sm object-cover" />
            <div className="font-semibold tracking-tight">Dashboard v{version}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="text-[#5E4B3C] hover:bg-[#DFC8A9]">
              {theme==='dark' ? <Sun size={18}/> : <Moon size={18}/>}
            </Button>
            <Button 
              variant="outline" 
              className="border-[#CBB89E] text-[#5E4B3C] hover:bg-[#DFC8A9]"
              onClick={()=>{ setSettingsView('create'); setShowSettings(true) }} 
              aria-label="Open settings"
            >
              <Settings size={16} className="mr-2" />Settings
            </Button>
            <Link href="/admin/inventory"><Button variant="outline" className="border-[#CBB89E] text-[#5E4B3C] hover:bg-[#DFC8A9]">Inventory</Button></Link>
            <Link href="/admin/sales"><Button variant="outline" className="border-[#CBB89E] text-[#5E4B3C] hover:bg-[#DFC8A9]">Sales</Button></Link>
            <Button variant="ghost" className="text-[#5E4B3C] hover:bg-[#DFC8A9]" onClick={logout}><LogOut size={16} className="mr-2" />Logout</Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-5 border-[#E3D3BD] bg-[#FFF9F2] text-[#5E4B3C]">
              <div className="text-xs uppercase tracking-wide text-[#7B6756]">Orders</div>
              <div className="text-3xl font-semibold">{stats.ordersCount}</div>
            </Card>
            <Card className="p-5 border-[#E3D3BD] bg-[#FFF9F2] text-[#5E4B3C]">
              <div className="text-xs uppercase tracking-wide text-[#7B6756]">Last 30d Revenue</div>
              <div className="text-3xl font-semibold">${stats.revenue.reduce((s:any,r:any)=>s+r.total,0).toFixed(2)}</div>
            </Card>
            <Card className="p-5 border-[#E3D3BD] bg-[#FFF9F2] text-[#5E4B3C]">
              <div className="text-xs uppercase tracking-wide text-[#7B6756]">Top Artwork</div>
              <div className="text-lg font-medium">{stats.topArtworks?.[0]?.title || '-'}</div>
            </Card>
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="p-5 xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-[#5E4B3C]">Revenue Trends</div>
              <div className="space-x-2 text-sm text-[#7B6756]">
                <a href="/api/admin/sales?days=30&group=day" target="_blank" className="underline">30d/day</a>
                <a href="/api/admin/sales?days=90&group=week" target="_blank" className="underline">90d/week</a>
                <a href="/api/admin/sales?days=365&group=month" target="_blank" className="underline">1y/month</a>
              </div>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={stats?.revenue || []} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={false} interval="preserveStartEnd" stroke="#7B6756"/>
                  <YAxis width={48} tickFormatter={(v:any)=>`$${Number(v).toFixed(0)}`} stroke="#7B6756"/>
                  <Tooltip formatter={(v:any)=>[`$${Number(v).toFixed(2)}`, 'Revenue']} labelFormatter={(l:any)=>String(l)} contentStyle={{ borderRadius: 8 }}/>
                  <Line type="monotone" dataKey="total" stroke="#5E4B3C" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ul className="text-sm space-y-1 max-h-48 overflow-auto pr-1 mt-3 text-[#5E4B3C]">
              {stats?.revenue?.map((r:any)=> (
                <li key={r.date} className="flex justify-between"><span>{r.date}</span><span>${r.total.toFixed(2)}</span></li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 border-[#E3D3BD] bg-[#FFF9F2] text-[#5E4B3C]">
            <div className="font-medium mb-2">Top Artworks</div>
            <ul className="text-sm space-y-1">
              {stats?.topArtworks?.map((t:any)=> (
                <li key={t.title} className="flex justify-between"><span>{t.title}</span><span>${t.revenue.toFixed(2)} · {t.qty} sold</span></li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex items-end justify-between mb-3">
            <div className="space-y-1">
              <div className="text-base font-medium text-[#5E4B3C]">Recent Orders</div>
              <div className="text-xs text-[#7B6756]">Filter and review latest orders</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[160px]">
                <Select onValueChange={(v)=>setFilter(f=>({...f, status: v === 'all' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Select onValueChange={(v)=>setFilter(f=>({...f, paymentMethod: v === 'all' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Payment method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All methods</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[120px]">
                <Select onValueChange={(v)=>setFilter(f=>({...f, days: Number(v) }))}>
                  <SelectTrigger><SelectValue placeholder="Range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last 1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Card className="p-0 border-[#E3D3BD] bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#EBD9C2]">
                  <TableHead className="w-[100px] text-[#5E4B3C]">Order #</TableHead>
                  <TableHead className="text-[#5E4B3C]">Date</TableHead>
                  <TableHead className="text-[#5E4B3C]">Status</TableHead>
                  <TableHead className="text-[#5E4B3C]">Method</TableHead>
                  <TableHead className="text-right text-[#5E4B3C]">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o)=> (
                  <TableRow key={o.id} className="hover:bg-[#FFF9F2]">
                    <TableCell>#{o.id}</TableCell>
                    <TableCell>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${o.status==='paid'?'bg-green-100 text-green-800':o.status==='pending'?'bg-yellow-100 text-yellow-800':o.status==='failed'?'bg-red-100 text-red-800':'bg-[#EBD9C2] text-[#5E4B3C]'}`}>{o.status}</span>
                    </TableCell>
                    <TableCell className="capitalize">{o.paymentMethod}</TableCell>
                    <TableCell className="text-right">${Number(o.total||0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {orders.length===0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-[#7B6756] py-6">No orders match current filters.</TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption className="px-4 pb-3 text-[#7B6756]">Showing latest {orders.length} orders.</TableCaption>
            </Table>
          </Card>
        </div>

        {/* Admin Settings Drawer */}
        <Sheet open={showSettings} onOpenChange={(o)=>{ setShowSettings(o); if(!o) setSettingsView(null) }}>
          <SheetContent side="left" className="p-0 bg-[#F3E6D3] text-[#5E4B3C] w-[90vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
            <div className="flex h-full">
              {/* Left menu */}
              <div className="w-64 border-r border-[#E3D3BD] p-4 space-y-2 bg-[#EBD9C2]">
                <div className="font-medium mb-3 tracking-wide">Settings</div>
                <button
                  className={cn("w-full flex items-center gap-2 text-left px-3 py-2 rounded-md hover:bg-[#DFC8A9] transition", settingsView==='create' && 'bg-[#DFC8A9]')}
                  onClick={()=>setSettingsView('create')}
                >
                  <UserPlus size={16} /> Create User
                </button>
                <button
                  className={cn("w-full flex items-center gap-2 text-left px-3 py-2 rounded-md hover:bg-[#DFC8A9] transition", settingsView==='password' && 'bg-[#DFC8A9]')}
                  onClick={()=>setSettingsView('password')}
                >
                  <Key size={16} /> Change Password
                </button>
                <div className="pt-3 mt-3 border-t border-[#E3D3BD]" />
                <button className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md hover:bg-[#DFC8A9] transition" onClick={logout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>

              {/* Right content */}
              <div className="flex-1 min-w-0 p-6 overflow-auto">
                {settingsView === 'create' && (
                  <div className="max-w-2xl mx-auto">
                    <Card className="p-6 bg-white/90 backdrop-blur border-[#E3D3BD]">
                      <div className="mb-4">
                        <div className="font-medium">Create User</div>
                        <div className="text-xs text-neutral-600">Admin-only. Creates non-admin by default.</div>
                      </div>
                      <CreateUserForm />
                    </Card>
                  </div>
                )}
                {settingsView === 'password' && (
                  <div className="max-w-2xl mx-auto">
                    <Card className="p-6 bg-white/90 backdrop-blur border-[#E3D3BD]">
                      <div className="mb-4">
                        <div className="font-medium">Change Password</div>
                        <div className="text-xs text-neutral-600">Updates the current DB admin password.</div>
                      </div>
                      <ChangePasswordForm />
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}