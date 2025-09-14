"use client"

import { useEffect, useMemo, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useToast } from '@/components/hooks/use-toast'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ChevronsUpDown, Check, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function InventoryPage() {
  const [tab, setTab] = useState<'artworks'|'categories'|'collections'|'artists'>('artworks')
  const [data, setData] = useState<any[]>([])
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any | null>(null)
  const { toast } = useToast()

  // Filters & pagination
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState<{ categoryId: string | number | ''; minPrice: string; maxPrice: string }>({ categoryId: '', minPrice: '', maxPrice: '' })
  const [page, setPage] = useState(1)
  const pageSize = 10

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

  // Cache lists per tab for instant switching
  const [cache, setCache] = useState<Record<string, any[]>>({})

  // Derived data for pagination/search/filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((row:any) => {
      const matchesSearch = !q || String(row.id).includes(q) || row.title?.toLowerCase?.().includes(q) || row.name?.toLowerCase?.().includes(q) || row.description?.toLowerCase?.().includes(q)
      if (!matchesSearch) return false
      if (tab==='artworks') {
        const cid = filters.categoryId ? Number(filters.categoryId) : null
        const min = filters.minPrice ? Number(filters.minPrice) : null
        const max = filters.maxPrice ? Number(filters.maxPrice) : null
        if (cid && row.categoryId !== cid) return false
        if (min!=null && Number.isFinite(min) && typeof row.price==='number' && row.price < min) return false
        if (max!=null && Number.isFinite(max) && typeof row.price==='number' && row.price > max) return false
      }
      return true
    })
  }, [data, search, filters, tab])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  // Success banner + upload state
  const [success, setSuccess] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Searchable pickers data & popover state
  const [artists, setArtists] = useState<any[]>([])
  const [artistOpen, setArtistOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  // When switching tabs: clear form/image and show cached data instantly, then refresh in background
  useEffect(()=>{
    // reset form, file, preview, filters, pagination
    setForm({}); setFile(null); setSelected(null)
    setFilters({ categoryId: '', minPrice: '', maxPrice: ''}); setPage(1)

    const cached = cache[tab]
    if (cached) {
      setData(cached) // show from cache immediately
      load(true)      // refresh in background
    } else {
      setData([])     // clear to avoid flashing previous tab's content
      setLoading(true)
      load(false)
    }
  }, [tab])

  async function load(background: boolean = false){
    if (!background) setLoading(true)
    const url = tab === 'artworks' ? '/api/artworks' : tab === 'categories' ? '/api/categories' : tab === 'collections' ? '/api/collections' : '/api/artists'
    const res = await fetch(url)
    const json = await res.json()
    setData(json)
    setCache(prev => ({...prev, [tab]: json}))
    // Load categories for filter dropdown when viewing artworks
    if (tab === 'artworks') {
      try {
        const [cres, ares] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/artists')
        ])
        if (cres.ok) setCategories(await cres.json())
        if (ares.ok) setArtists(await ares.json())
      } catch {}
    }
    if (!background) setLoading(false)
  }

  async function save(){
    setLoading(true)
    const url = `/api/admin/${tab}`
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      toast({ title: 'Added', description: `${tab.slice(0,1).toUpperCase()+tab.slice(1,)} item added` })
      setSuccess(`${tab.slice(0,1).toUpperCase()+tab.slice(1,)} item added successfully`)
      setForm({}); setFile(null); setSelected(null); await load()
    } else {
      toast({ title: 'Add failed', description: 'Please check fields and try again' })
      setSuccess(null)
    }
    setLoading(false)
  }

  async function update(row: any){
    // Merge current form fields onto the selected row; requires at least one change
    const payload = { id: row.id, ...form }
    setLoading(true)
    const url = `/api/admin/${tab}`
    const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      toast({ title: 'Updated', description: `Changes saved` })
      setSuccess('Changes saved successfully')
      setForm({}); setFile(null); setSelected(null); await load()
    } else {
      toast({ title: 'Update failed', description: 'Please check fields and try again' })
      setSuccess(null)
    }
    setLoading(false)
  }

  async function remove(id: number){
    if (!confirm('Delete this item?')) return
    setLoading(true)
    const url = `/api/admin/${tab}`
    const res = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) { toast({ title: 'Deleted', description: 'Item removed' }); setSuccess('Item deleted'); await load() }
    else { toast({ title: 'Delete failed', description: 'Try again' }); setSuccess(null) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-950/80">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Image src="/img/artwork/WhatsApp Image 2025-06-24 at 02.31.06.jpg" alt="Imbayedu" width={28} height={28} className="rounded-sm object-cover" />
            <div className="font-semibold tracking-tight">Inventory</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme==='dark' ? <Sun size={18}/> : <Moon size={18}/>}
            </Button>
            <Link href="/admin"><Button variant="ghost">Exit</Button></Link>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="mb-4">
          <div className="inline-flex rounded-md border p-1 bg-white">
            <button className={`${tab==='artworks'?'bg-neutral-100 text-neutral-900':'text-neutral-600 hover:text-neutral-900'} px-3 py-1.5 rounded-md`} onClick={()=>setTab('artworks')}>Artworks</button>
            <button className={`${tab==='categories'?'bg-neutral-100 text-neutral-900':'text-neutral-600 hover:text-neutral-900'} px-3 py-1.5 rounded-md`} onClick={()=>setTab('categories')}>Categories</button>
            <button className={`${tab==='collections'?'bg-neutral-100 text-neutral-900':'text-neutral-600 hover:text-neutral-900'} px-3 py-1.5 rounded-md`} onClick={()=>setTab('collections')}>Collections</button>
            <button className={`${tab==='artists'?'bg-neutral-100 text-neutral-900':'text-neutral-600 hover:text-neutral-900'} px-3 py-1.5 rounded-md`} onClick={()=>setTab('artists')}>Artists</button>
          </div>
        </div>

        <Card className="p-5 mb-6">
        {success && (
          <div className="mb-3 rounded-md border border-[#CBB89E] bg-[#FFF9F2] text-[#5E4B3C] px-3 py-2 text-sm">{success}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inline edit indicator */}
          {selected && (
            <div className="md:col-span-2 text-xs text-[#7B6756] -mt-1">
              Editing ID #{selected.id}. Make changes and click Update in the table row, or click Add to create a new item.
            </div>
          )}
          {tab==='artworks' && (
            <>
              <Input placeholder="Title" value={form.title||''} onChange={e=>setForm({...form, title:e.target.value})} />
              <Input placeholder="Price" type="number" value={form.price||''} onChange={e=>setForm({...form, price:parseFloat(e.target.value)||0})} />
              {/* Upload or URL */}
              {/* Image chooser */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Image URL" className="flex-1" value={form.imageUrl||''} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e)=>{
                      const f = e.target.files?.[0] || null
                      if (!f) return
                      setFile(f)
                      const localUrl = URL.createObjectURL(f)
                        setForm(prev => ({...prev, imageUrl: localUrl }))
                      toast({ title: 'Image selected', description: 'Local preview attached' })
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={()=> fileInputRef.current?.click()}
                  >
                    Choose image
                  </Button>
                </div>
                {form.imageUrl && (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageUrl} alt="preview" className="h-20 w-20 rounded object-cover border" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow"
                      onClick={()=>{
                        setFile(null)
                        setForm(f=> ({...f, imageUrl: ''}))
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {/* Artist picker */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#7B6756]">Artist</label>
                <Popover open={artistOpen} onOpenChange={setArtistOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={artistOpen} className="justify-between">
                      {form.artistId
                        ? artists.find((a)=>a.id===form.artistId)?.name || `#${form.artistId}`
                        : 'Select artist'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[320px]">
                    <Command>
                      <CommandInput placeholder="Search artist..." />
                      <CommandEmpty>No artist found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {artists.map((a)=> (
                            <CommandItem
                              key={a.id}
                              value={`${a.id} ${a.name}`}
                              onSelect={()=>{
                                setForm({...form, artistId: a.id})
                                setArtistOpen(false)
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', form.artistId===a.id ? 'opacity-100' : 'opacity-0')} />
                              {a.name} <span className="ml-2 text-xs text-muted-foreground">#{a.id}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Category picker */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#7B6756]">Category</label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={categoryOpen} className="justify-between">
                      {form.categoryId
                        ? categories.find((c)=>c.id===form.categoryId)?.name || `#${form.categoryId}`
                        : 'Select category'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[320px]">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {categories.map((c)=> (
                            <CommandItem
                              key={c.id}
                              value={`${c.id} ${c.name}`}
                              onSelect={()=>{
                                setForm({...form, categoryId: c.id})
                                setCategoryOpen(false)
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', form.categoryId===c.id ? 'opacity-100' : 'opacity-0')} />
                              {c.name} <span className="ml-2 text-xs text-muted-foreground">#{c.id}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Input placeholder="Collection ID (optional)" value={form.collectionId||''} onChange={e=>setForm({...form, collectionId:e.target.value?Number(e.target.value):null})} />
              <Input placeholder="Dimensions" value={form.dimensions||''} onChange={e=>setForm({...form, dimensions:e.target.value})} />
              <Input placeholder="Medium" value={form.medium||''} onChange={e=>setForm({...form, medium:e.target.value})} />
              <Input placeholder="Year" value={form.year||''} onChange={e=>setForm({...form, year:e.target.value})} />
              <Textarea placeholder="Description" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} />
            </>
          )}
          {tab==='categories' && (
            <>
              <Input placeholder="Name" value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})} />
              <Input placeholder="Description" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} />
            </>
          )}
          {tab==='collections' && (
            <>
              <Input placeholder="Name" value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})} />
              <Input placeholder="Description" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} />
              {/* Image chooser */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Image URL" className="flex-1" value={form.imageUrl||''} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e)=>{
                      const f = e.target.files?.[0] || null
                      if (!f) return
                      setFile(f)
                      const localUrl = URL.createObjectURL(f)
                      setForm(prev => ({...prev, imageUrl: localUrl }))
                      toast({ title: 'Image selected', description: 'Local preview attached' })
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={()=> fileInputRef.current?.click()}
                  >
                    Choose image
                  </Button>
                </div>
                {form.imageUrl && (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageUrl} alt="preview" className="h-20 w-20 rounded object-cover border" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow"
                      onClick={()=>{
                        setFile(null)
                        setForm(f=> ({...f, imageUrl: ''}))
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {tab==='artists' && (
            <>
              <Input placeholder="Name" value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})} />
              <Textarea placeholder="Bio" value={form.bio||''} onChange={e=>setForm({...form, bio:e.target.value})} />
              {/* Image chooser */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Image URL" className="flex-1" value={form.imageUrl||''} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e)=>{
                      const f = e.target.files?.[0] || null
                      if (!f) return
                      setFile(f)
                      const localUrl = URL.createObjectURL(f)
                      setForm(prev => ({...prev, imageUrl: localUrl }))
                      toast({ title: 'Image selected', description: 'Local preview attached' })
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={()=> fileInputRef.current?.click()}
                  >
                    Choose image
                  </Button>
                </div>
                {form.imageUrl && (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageUrl} alt="preview" className="h-20 w-20 rounded object-cover border" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow"
                      onClick={()=>{
                        setFile(null)
                        setForm(f=> ({...f, imageUrl: ''}))
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <Input placeholder="Location" value={form.location||''} onChange={e=>setForm({...form, location:e.target.value})} />
            </>
          )}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Button onClick={save} disabled={loading}>Add</Button>
        </div>
        </Card>

        <Card className="p-4 bg-[#F8F1E7] border-[#E3D3BD]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[#7B6756]">{data.length} items</div>
            <div className="flex items-center gap-2">
              {tab==='artworks' && (
                <>
                  <select className="border rounded-md px-2 py-1 text-sm" value={String(filters.categoryId)} onChange={(e)=>{ setFilters(f=>({...f, categoryId: e.target.value })); setPage(1) }}>
                    <option value="">All categories</option>
                    {categories.map(c=> (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                  <Input placeholder="Min $" className="w-[90px]" value={filters.minPrice} onChange={e=>{ setFilters(f=>({...f, minPrice: e.target.value })); setPage(1) }} />
                  <Input placeholder="Max $" className="w-[90px]" value={filters.maxPrice} onChange={e=>{ setFilters(f=>({...f, maxPrice: e.target.value })); setPage(1) }} />
                </>
              )}
              <Input placeholder="Search..." className="w-[240px]" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1) }} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-[#EBD9C2]">
                  <th className="py-2 pr-4 text-[#5E4B3C]">ID</th>
                  <th className="py-2 pr-4 text-[#5E4B3C]">Name/Title</th>
                  <th className="py-2 pr-4 text-[#5E4B3C]">Price/Desc</th>
                  <th className="py-2 pr-4 text-right text-[#5E4B3C]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice((page-1)*pageSize, page*pageSize)
                  .map((row:any)=> (
                  <tr key={row.id} className="border-b hover:bg-[#FFF9F2]">
                    <td className="py-2 pr-4">{row.id}</td>
                    <td className="py-2 pr-4 flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {row.imageUrl && <img alt="thumb" src={row.imageUrl} className="h-8 w-8 object-cover rounded" />}
                      <span>{row.title || row.name}</span>
                    </td>
                    <td className="py-2 pr-4">{typeof row.price==='number' ? `$${row.price.toFixed(2)}` : (row.description||'-')}</td>
                    <td className="py-2 pr-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={()=>{ setSelected(row); setForm(row) }}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={()=>update(row)}>Update</Button>
                      <Button variant="outline" size="sm" onClick={()=>{ const clone = { ...row }; delete clone.id; setForm(clone); setSelected(null); toast({ title:'Duplicated', description:'You can now add the duplicate' }) }}>Duplicate</Button>
                      <Button variant="destructive" size="sm" onClick={()=>remove(row.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="text-[#7B6756]">Page {page} of {totalPages}</div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>Prev</Button>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}