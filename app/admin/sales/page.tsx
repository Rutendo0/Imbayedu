"use client"

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function SalesPage(){
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [group, setGroup] = useState<'day'|'week'|'month'>('day')
  const [days, setDays] = useState<number>(30)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
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
  // KPI metrics
  const [ordersCount, setOrdersCount] = useState<number>(0)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [aov, setAov] = useState<number>(0)

  async function load(){
    setLoading(true)
    // sales series
    const seriesParams = new URLSearchParams()
    seriesParams.set('days', String(days))
    seriesParams.set('group', group)
    const [seriesRes, ordersRes, dashboardRes] = await Promise.all([
      fetch(`/api/admin/sales?${seriesParams.toString()}`),
      fetch(`/api/admin/orders?days=${days}&status=paid`),
      fetch(`/api/admin/dashboard`),
    ])
    const seriesJson = await seriesRes.json()
    const ordersJson = await ordersRes.json()
    setData(seriesJson?.revenue || seriesJson || [])
    // KPI derivation
    const paidOrders = Array.isArray(ordersJson) ? ordersJson : []
    setOrdersCount(paidOrders.length)
    const total = paidOrders.reduce((sum: number, o: any)=> sum + (Number(o.total)||0), 0)
    setTotalRevenue(total)
    setAov(paidOrders.length ? total / paidOrders.length : 0)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [group, days])

  function exportCsv(){
    const headers = ['date,total']
    const rows = data.map(d=>`${d.date},${d.total}`)
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales_${group}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-950/80">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Image src="/img/artwork/WhatsApp Image 2025-06-24 at 02.31.06.jpg" alt="Imbayedu" width={28} height={28} className="rounded-sm object-cover" style={{ width: 'auto', height: 'auto' }} />
            <div className="font-semibold tracking-tight">Sales</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme==='dark' ? <Sun size={18}/> : <Moon size={18}/>}
            </Button>
            <Link href="/admin"><Button variant="ghost">Back</Button></Link>
          </div>
        </div>
      </div>

      <div className="container py-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Card className="p-5"><div className="text-xs text-neutral-500">Revenue</div><div className="text-2xl font-semibold">${totalRevenue.toFixed(2)}</div></Card>
        <Card className="p-5"><div className="text-xs text-neutral-500">Orders</div><div className="text-2xl font-semibold">{ordersCount}</div></Card>
        <Card className="p-5"><div className="text-xs text-neutral-500">Avg. Order Value</div><div className="text-2xl font-semibold">${aov.toFixed(2)}</div></Card>
      </div>

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick ranges */}
          <div className="inline-flex rounded-md border p-1 bg-white">
            {[7,30,90,365].map(d => (
              <button key={d} className={`${days===d?'bg-neutral-100 text-neutral-900':'text-neutral-600 hover:text-neutral-900'} px-3 py-1.5 rounded-md`} onClick={()=>setDays(d)}>{d===365?'1y':`${d}d`}</button>
            ))}
          </div>

          <select className="border rounded-md px-2 py-1 text-sm" value={group} onChange={e=>setGroup(e.target.value as any)}>
            <option value="day">By day</option>
            <option value="week">By week</option>
            <option value="month">By month</option>
          </select>
          <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
          <Button onClick={exportCsv} disabled={!data.length}>Export CSV</Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="font-medium mb-2">Revenue Trends</div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={false} interval="preserveStartEnd" stroke="#999"/>
              <YAxis width={56} tickFormatter={(v:any)=>`$${Number(v).toFixed(0)}`} stroke="#999"/>
              <Tooltip formatter={(v:any)=>[`$${Number(v).toFixed(2)}`, 'Revenue']} labelFormatter={(l:any)=>String(l)} contentStyle={{ borderRadius: 8 }}/>
              <Line type="monotone" dataKey="total" stroke="#111" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
    </div>
  )
}