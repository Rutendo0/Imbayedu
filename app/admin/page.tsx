"use client"

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  Settings, 
  UserPlus, 
  Key, 
  LogOut, 
  Sun, 
  Moon, 
  Package, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import Image from 'next/image'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { toast } from '@/components/hooks/use-toast'

// Professional Confirmation Dialog Component
function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  action, 
  actionText, 
  variant 
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  action: () => void
  actionText: string
  variant: 'destructive' | 'default'
}) {
  const handleConfirm = () => {
    action()
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === 'destructive' ? (
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Settings className="w-4 h-4 text-blue-600" />
              </div>
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-6">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={`px-6 ${
              variant === 'destructive' 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Image Upload Component
function ImageUpload({ onUpload, currentUrl, type }: {
  onUpload: (url: string) => void
  currentUrl?: string
  type: 'artwork' | 'artist' | 'collection'
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success) {
        onUpload(result.url)
      } else {
        alert(result.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  return (
    <div className="space-y-4">
      <Label>Image</Label>
      
      {/* Current Image Preview */}
      {currentUrl && (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <Image
            src={currentUrl}
            alt="Current image"
            fill
            className="object-contain"
            sizes="128px"
          />
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Choose File
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

// Add Artist Form Component
function AddArtistForm({ onSubmit, onCancel }: {
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    imageUrl: '',
    website: '',
    socialMedia: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </div>
      
      <ImageUpload
        onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
        currentUrl={formData.imageUrl}
        type="artist"
      />
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Artist biography..."
        />
      </div>
      
      <div>
        <Label htmlFor="socialMedia">Social Media</Label>
        <Input
          id="socialMedia"
          value={formData.socialMedia}
          onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
          placeholder="@username or social media links"
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit">Add Artist</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

// Edit Artist Form Component
function EditArtistForm({ artist, onSubmit, onCancel }: {
  artist: any
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    id: artist.id,
    name: artist.name || '',
    bio: artist.bio || '',
    imageUrl: artist.imageUrl || '',
    website: artist.website || '',
    socialMedia: artist.socialMedia || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="edit-website">Website</Label>
          <Input
            id="edit-website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </div>
      
      <ImageUpload
        onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
        currentUrl={formData.imageUrl}
        type="artist"
      />
      
      <div>
        <Label htmlFor="edit-bio">Bio</Label>
        <Textarea
          id="edit-bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Artist biography..."
        />
      </div>
      
      <div>
        <Label htmlFor="edit-socialMedia">Social Media</Label>
        <Input
          id="edit-socialMedia"
          value={formData.socialMedia}
          onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
          placeholder="@username or social media links"
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit">Update Artist</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

// Add Collection Form Component
function AddCollectionForm({ onSubmit, onCancel }: {
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <ImageUpload
        onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
        currentUrl={formData.imageUrl}
        type="collection"
      />
      
      <div>
        <Label htmlFor="collection-description">Description</Label>
        <textarea
          id="collection-description"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Collection description..."
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit">Add Collection</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

// Edit Collection Form Component
function EditCollectionForm({ collection, onSubmit, onCancel }: {
  collection: any
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    id: collection.id,
    name: collection.name || '',
    description: collection.description || '',
    imageUrl: collection.imageUrl || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Name *</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <ImageUpload
        onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
        currentUrl={formData.imageUrl}
        type="collection"
      />
      
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Collection description..."
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit">Update Collection</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

// Edit Artwork Form Component
function EditArtworkForm({ artwork, artists, categories, collections, onSubmit, onCancel }: {
  artwork: any
  artists: any[]
  categories: any[]
  collections: any[]
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: artwork.title || '',
    description: artwork.description || '',
    price: artwork.price || '',
    imageUrl: artwork.imageUrl || '',
    artistId: artwork.artistId || '',
    categoryId: artwork.categoryId || '',
    collectionId: artwork.collectionId || '',
    dimensions: artwork.dimensions || '',
    medium: artwork.medium || '',
    year: artwork.year || '',
    inStock: artwork.inStock !== false,
    featured: artwork.featured || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ id: artwork.id, ...formData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-title">Title *</Label>
          <Input
            id="edit-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="edit-price">Price *</Label>
          <Input
            id="edit-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="edit-artistId">Artist *</Label>
          <Select value={formData.artistId} onValueChange={(value) => setFormData({ ...formData, artistId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select artist" />
            </SelectTrigger>
            <SelectContent>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id.toString()}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="edit-categoryId">Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="edit-collectionId">Collection</Label>
          <Select value={formData.collectionId} onValueChange={(value) => setFormData({ ...formData, collectionId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id.toString()}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="edit-inStock">Stock Status</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            />
            <label htmlFor="edit-inStock" className="text-sm">In Stock</label>
          </div>
        </div>
        
        <div>
          <Label htmlFor="edit-dimensions">Dimensions</Label>
          <Input
            id="edit-dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            placeholder="e.g., 30 x 40 cm"
          />
        </div>
        
        <div>
          <Label htmlFor="edit-medium">Medium</Label>
          <Input
            id="edit-medium"
            value={formData.medium}
            onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
            placeholder="e.g., Oil on Canvas"
          />
        </div>
        
        <div>
          <Label htmlFor="edit-year">Year</Label>
          <Input
            id="edit-year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="e.g., 2023"
          />
        </div>
        
        <div>
          <Label htmlFor="edit-imageUrl">Image URL</Label>
          <Input
            id="edit-imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="Image URL"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Artwork description"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Artwork
        </Button>
      </div>
    </form>
  )
}

// Add Artwork Form Component
function AddArtworkForm({ artists, categories, collections, onSubmit, onCancel }: {
  artists: any[]
  categories: any[]
  collections: any[]
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    artistId: '',
    categoryId: '',
    collectionId: '',
    dimensions: '',
    medium: '',
    inStock: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="artistId">Artist *</Label>
          <Select value={formData.artistId} onValueChange={(value) => setFormData({ ...formData, artistId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select artist" />
            </SelectTrigger>
            <SelectContent>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id.toString()}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="collectionId">Collection</Label>
          <Select value={formData.collectionId} onValueChange={(value) => setFormData({ ...formData, collectionId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id.toString()}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="inStock">Stock Status</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            />
            <label htmlFor="inStock" className="text-sm">In Stock</label>
          </div>
        </div>
        
        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            placeholder="e.g., 30 x 40 cm"
          />
        </div>
        
        <div>
          <Label htmlFor="medium">Medium</Label>
          <Input
            id="medium"
            value={formData.medium}
            onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
            placeholder="e.g., Oil on canvas"
          />
        </div>
      </div>
      
      <ImageUpload
        onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
        currentUrl={formData.imageUrl}
        type="artwork"
      />
      
      <div>
        <Label htmlFor="imageUrl">Or enter image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the artwork..."
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit">Add Artwork</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

// Inventory Management Component
function InventoryManager({ onBack }: { onBack: () => void }) {
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [artists, setArtists] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [showAddArtist, setShowAddArtist] = useState(false)
  const [showAddCollection, setShowAddCollection] = useState(false)
  const [editingArtist, setEditingArtist] = useState<any>(null)
  const [editingCollection, setEditingCollection] = useState<any>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    action: () => void
    actionText: string
    variant: 'destructive' | 'default'
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
    actionText: '',
    variant: 'default'
  })

  const artworksByArtist = useMemo(() => {
    const grouped: { [key: number]: any[] } = {}
    artworks.forEach(artwork => {
      if (artwork.artistId) {
        if (!grouped[artwork.artistId]) {
          grouped[artwork.artistId] = []
        }
        grouped[artwork.artistId].push(artwork)
      }
    })
    return grouped
  }, [artworks])

  const loadArtworks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/artworks')
      const data = await response.json()
      setArtworks(data || [])
    } catch (error) {
      console.error('Failed to load artworks:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReferenceData = async () => {
    try {
      const [artistsRes, categoriesRes, collectionsRes] = await Promise.all([
        fetch('/api/admin/artists'),
        fetch('/api/categories'),
        fetch('/api/admin/collections')
      ])
      
      const [artistsData, categoriesData, collectionsData] = await Promise.all([
        artistsRes.json(),
        categoriesRes.json(),
        collectionsRes.json()
      ])
      
      // Ensure we're setting arrays, not concatenating, and deduplicate by name
      console.log('Raw artists data:', artistsData)
      const uniqueArtists = Array.isArray(artistsData)
        ? artistsData.filter((artist, index, self) =>
            index === self.findIndex(a => a.id === artist.id)
          )
        : []
      console.log('Unique artists after deduplication:', uniqueArtists)
      
      const uniqueCategories = Array.isArray(categoriesData) 
        ? categoriesData.filter((category, index, self) => 
            index === self.findIndex(c => c.id === category.id)
          ) 
        : []
      
      const uniqueCollections = Array.isArray(collectionsData) 
        ? collectionsData.filter((collection, index, self) => 
            index === self.findIndex(c => c.name === collection.name)
          ) 
        : []
      
      setArtists(uniqueArtists)
      setCategories(uniqueCategories)
      setCollections(uniqueCollections)
    } catch (error) {
      console.error('Failed to load reference data:', error)
      // Reset to empty arrays on error
      setArtists([])
      setCategories([])
      setCollections([])
    }
  }

  useEffect(() => {
    // Reset all form states when component mounts
    console.log('InventoryManager mounting - resetting all form states')
    setEditingArtwork(null)
    setShowAddForm(false)
    setShowAddArtist(false)
    setShowAddCollection(false)
    setEditingCollection(null)
    
    loadArtworks()
    loadReferenceData()
  }, [])

  // Auto-scroll to top when editing artwork
  useEffect(() => {
    if (editingArtwork) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [editingArtwork])

  // Auto-scroll to top when editing artist
  useEffect(() => {
    if (editingArtist) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [editingArtist])

  // Reset editing state when component unmounts or when navigating
  useEffect(() => {
    return () => {
      setEditingArtwork(null)
      setShowAddForm(false)
      setShowAddArtist(false)
      setShowAddCollection(false)
      setEditingCollection(null)
    }
  }, [])

  const handleDelete = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Artwork',
      description: 'Are you sure you want to delete this artwork? This action cannot be undone.',
      action: async () => {
        try {
          const res = await fetch(`/api/admin/artworks/${id}`, { method: 'DELETE' })
          if (res.ok) {
            toast({ title: 'Deleted', description: 'Artwork deleted successfully.' })
            loadArtworks()
          } else {
            const err = await res.json().catch(() => ({}))
            toast({ title: 'Error', description: err.message || 'Failed to delete artwork.' })
          }
        } catch (error) {
          console.error('Failed to delete artwork:', error)
          toast({ title: 'Error', description: 'Network error while deleting artwork.' })
        }
      },
      actionText: 'Delete Artwork',
      variant: 'destructive'
    })
  }

  const handleAddArtwork = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowAddForm(false)
        loadArtworks()
        toast({
          title: 'Success',
          description: 'Artwork has been added successfully!'
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to add artwork. Please try again.'
        })
      }
    } catch (error) {
      console.error('Failed to add artwork:', error)
      toast({
        title: 'Error',
        description: 'Failed to add artwork. Please check your connection and try again.'
      })
    }
  }

  const handleUpdateArtwork = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/artworks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setEditingArtwork(null)
        loadArtworks()
        toast({
          title: 'Success',
          description: 'Artwork has been updated successfully!'
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to update artwork. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating artwork:', error)
      toast({
        title: 'Error',
        description: 'Failed to update artwork. Please check your connection and try again.',
        variant: 'destructive'
      })
    }
  }

  const handleAddArtist = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowAddArtist(false)
        // Reload only artists data, not all reference data
        const artistsRes = await fetch('/api/admin/artists')
        const artistsData = await artistsRes.json()
        setArtists(Array.isArray(artistsData) ? artistsData : [])
        toast({
          title: 'Success',
          description: 'Artist has been added successfully!'
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to add artist. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to add artist:', error)
      toast({
        title: 'Error',
        description: 'Failed to add artist. Please check your connection and try again.',
        variant: 'destructive'
      })
    }
  }

  const handleAddCollection = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowAddCollection(false)
        // Reload only collections data, not all reference data
        const collectionsRes = await fetch('/api/admin/collections')
        const collectionsData = await collectionsRes.json()
        setCollections(Array.isArray(collectionsData) ? collectionsData : [])
        toast({
          title: 'Success',
          description: 'Collection has been added successfully!'
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to add collection. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to add collection:', error)
      toast({
        title: 'Error',
        description: 'Failed to add collection. Please check your connection and try again.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateCollection = async (formData: any) => {
    try {
      const response = await fetch(`/api/admin/collections/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const updated = await response.json()
        setCollections(prev => prev.map(c => c.id === updated.id ? updated : c))
        setEditingCollection(null)
        toast({
          title: 'Success',
          description: 'Collection has been updated successfully!'
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to update collection. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating collection:', error)
      toast({
        title: 'Error',
        description: 'Failed to update collection. Please check your connection and try again.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateArtist = async (formData: any) => {
    try {
      const response = await fetch(`/api/admin/artists/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updated = await response.json()
        setArtists(prev => prev.map(a => a.id === updated.id ? updated : a))
        setEditingArtist(null)
        toast({
          title: 'Success',
          description: 'Artist has been updated successfully!'
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to update artist. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating artist:', error)
      toast({
        title: 'Error',
        description: 'Failed to update artist. Please check your connection and try again.',
        variant: 'destructive'
      })
    }
  }

  const handleEditCollection = (collection: any) => {
    setEditingCollection(collection)
  }

  const handleDeleteArtist = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Artist',
      description: 'Are you sure you want to delete this artist? This action cannot be undone and will affect all artworks by this artist.',
      action: async () => {
        try {
          const response = await fetch(`/api/admin/artists/${id}`, { method: 'DELETE' })
          if (response.ok) {
            setArtists(prev => prev.filter(artist => artist.id !== id))
            toast({ title: 'Deleted', description: 'Artist has been deleted successfully!' })
          } else {
            const error = await response.json().catch(() => ({}))
            toast({ title: 'Error', description: error.message || 'Failed to delete artist. Please try again.' })
          }
        } catch (error) {
          console.error('Failed to delete artist:', error)
          toast({ title: 'Error', description: 'Failed to delete artist. Please check your connection and try again.' })
        }
      },
      actionText: 'Delete Artist',
      variant: 'destructive'
    })
  }

  const handleDeleteCollection = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Collection',
      description: 'Are you sure you want to delete this collection? This action cannot be undone and will affect all artworks in this collection.',
      action: async () => {
        try {
          const response = await fetch(`/api/admin/collections/${id}`, { method: 'DELETE' })
          if (response.ok) {
            setCollections(prev => prev.filter(collection => collection.id !== id))
            toast({ title: 'Deleted', description: 'Collection has been deleted successfully!' })
          } else {
            const error = await response.json().catch(() => ({}))
            toast({ title: 'Error', description: error.message || 'Failed to delete collection. Please try again.' })
          }
        } catch (error) {
          console.error('Failed to delete collection:', error)
          toast({ title: 'Error', description: 'Failed to delete collection. Please check your connection and try again.' })
        }
      },
      actionText: 'Delete Collection',
      variant: 'destructive'
    })
  }

  const handleCleanupDuplicates = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clean Up Duplicates',
      description: 'This will remove duplicate artists and collections from the database. This action cannot be undone. Continue?',
      action: async () => {
        try {
          const response = await fetch('/api/admin/cleanup-duplicates', { method: 'POST' })
          const result = await response.json()
          
          if (response.ok) {
            setConfirmDialog({
              isOpen: true,
              title: 'Cleanup Complete',
              description: `Successfully cleaned up duplicates! ${result.artistsRemaining} artists and ${result.collectionsRemaining} collections remaining.`,
              action: () => {},
              actionText: 'OK',
              variant: 'default'
            })
            // Reload all data
            loadReferenceData()
          } else {
            setConfirmDialog({
              isOpen: true,
              title: 'Error',
              description: result.message || 'Failed to cleanup duplicates. Please try again.',
              action: () => {},
              actionText: 'OK',
              variant: 'default'
            })
          }
        } catch (error) {
          console.error('Cleanup error:', error)
          setConfirmDialog({
            isOpen: true,
            title: 'Error',
            description: 'Failed to cleanup duplicates. Please check your connection and try again.',
            action: () => {},
            actionText: 'OK',
            variant: 'default'
          })
        }
      },
      actionText: 'Clean Up',
      variant: 'destructive'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Inventory Management</h2>
            <p className="text-gray-600">Manage your artwork inventory</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showAddForm ? "default" : "outline"}
            onClick={() => {
              setEditingArtwork(null)
              setShowAddForm(true)
              setShowAddArtist(false)
              setShowAddCollection(false)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Artwork
          </Button>
          <Button 
            variant={showAddArtist ? "default" : "outline"}
            onClick={() => {
              setEditingArtwork(null)
              setShowAddArtist(true)
              setShowAddForm(false)
              setShowAddCollection(false)
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Artist
          </Button>
          <Button 
            variant={showAddCollection ? "default" : "outline"}
            onClick={() => {
              setEditingArtwork(null)
              setShowAddCollection(true)
              setShowAddForm(false)
              setShowAddArtist(false)
              setEditingCollection(null)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Collection
          </Button>
          <Button 
            variant="destructive"
            onClick={handleCleanupDuplicates}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clean Duplicates
          </Button>
        </div>
      </div>

      {/* Add Artwork Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Artwork</CardTitle>
            <CardDescription>Fill in the details to add a new artwork to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <AddArtworkForm 
              artists={artists}
              categories={categories}
              collections={collections}
              onSubmit={handleAddArtwork}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit Artwork Form */}
      {editingArtwork && (
        <>

          <Card>
          <CardHeader>
            <CardTitle>Edit Artwork</CardTitle>
            <CardDescription>Update the details for this artwork</CardDescription>
          </CardHeader>
          <CardContent>
            <EditArtworkForm 
              artwork={editingArtwork}
              artists={artists}
              categories={categories}
              collections={collections}
              onSubmit={handleUpdateArtwork}
              onCancel={() => setEditingArtwork(null)}
            />
          </CardContent>
        </Card>
        </>
      )}

      {/* Add Artist Form */}
      {showAddArtist && !editingArtist && (
        <>
          {console.log('Rendering Add Artist Form')}
          <Card>
          <CardHeader>
            <CardTitle>Add New Artist</CardTitle>
            <CardDescription>Add a new artist to your database</CardDescription>
          </CardHeader>
          <CardContent>
            <AddArtistForm
              onSubmit={handleAddArtist}
              onCancel={() => setShowAddArtist(false)}
            />
          </CardContent>
          </Card>
          </>
      )}

      {/* Edit Artist Form */}
      {editingArtist && showAddArtist && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Artist</CardTitle>
            <CardDescription>Update the artist details</CardDescription>
          </CardHeader>
          <CardContent>
            <EditArtistForm
              artist={editingArtist}
              onSubmit={handleUpdateArtist}
              onCancel={() => setEditingArtist(null)}
            />
          </CardContent>
        </Card>
      )}

      {/* Artist List - Only show when Add Artist is active */}
      {showAddArtist && (
        <Card>
          <CardHeader>
            <CardTitle>All Artists with Artworks</CardTitle>
            <CardDescription>Manage artists and view their associated artworks</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {artists.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No artists found
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {artists.map((artist) => (
                  <AccordionItem key={artist.id} value={artist.id.toString()}>
                    <AccordionTrigger className="px-4 py-3">
                      <div className="flex items-center gap-4 w-full">
                        <Image
                          src={artist.imageUrl || '/img/artwork/artist.png'}
                          alt={artist.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{artist.name}</div>
                          <div className="text-sm text-muted-foreground">{artist.bio ? artist.bio.substring(0, 100) + '...' : 'No bio'}</div>
                          <div className="text-xs text-muted-foreground">
                            {artist.website ? 'Website available' : 'No website'} • {artworksByArtist[artist.id]?.length || 0} artworks
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingArtist(artist)
                              setShowAddArtist(true)
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <Edit className="w-4 h-4" />
                          </div>
                          <div
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-input bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteArtist(artist.id)
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <Trash2 className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      {artworksByArtist[artist.id] && artworksByArtist[artist.id].length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Artwork Image</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {artworksByArtist[artist.id].map((artwork: any) => (
                              <TableRow key={artwork.id}>
                                <TableCell>
                                  <Image
                                    src={artwork.imageUrl || '/img/artwork/artist.png'}
                                    alt={artwork.title}
                                    width={30}
                                    height={30}
                                    className="rounded object-cover"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{artwork.title}</TableCell>
                                <TableCell>${artwork.price || 0}</TableCell>
                                <TableCell>
                                  <Badge variant={artwork.inStock ? 'default' : 'destructive'}>
                                    {artwork.inStock ? 'In Stock' : 'Out of Stock'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No artworks for this artist yet.
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Collection Forms */}
      {showAddCollection && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Collection</CardTitle>
              <CardDescription>Create a new art collection</CardDescription>
            </CardHeader>
            <CardContent>
              <AddCollectionForm
                onSubmit={handleAddCollection}
                onCancel={() => setShowAddCollection(false)}
              />
            </CardContent>
          </Card>
          
          {editingCollection && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Collection</CardTitle>
                <CardDescription>Update the collection details</CardDescription>
              </CardHeader>
              <CardContent>
                <EditCollectionForm
                  collection={editingCollection}
                  onSubmit={handleUpdateCollection}
                  onCancel={() => setEditingCollection(null)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Collection List - Only show when Add Collection is active */}
      {showAddCollection && (
        <Card>
          <CardHeader>
            <CardTitle>All Collections</CardTitle>
            <CardDescription>Manage your collections</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No collections found
                    </TableCell>
                  </TableRow>
                ) : (
                  collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <Image
                          src={collection.imageUrl || '/img/artwork/artist.png'}
                          alt={collection.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{collection.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{collection.description || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditCollection(collection)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteCollection(collection.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}


      {/* Artwork List - Always visible */}
      <Card>
        <CardHeader>
          <CardTitle>All Artworks</CardTitle>
          <CardDescription>Manage your artworks</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : artworks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No artworks found
                  </TableCell>
                </TableRow>
              ) : (
                artworks.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell>
                      <Image
                        src={artwork.imageUrl || '/img/artwork/artist.png'}
                        alt={artwork.title}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{artwork.title}</TableCell>
                    <TableCell>{artwork.artist?.name || 'Unknown'}</TableCell>
                    <TableCell>{artwork.collection?.name || 'None'}</TableCell>
                    <TableCell>${artwork.price || 0}</TableCell>
                    <TableCell>{artwork.inStock ? 1 : 0}</TableCell>
                    <TableCell>
                      <Badge variant={artwork.inStock ? 'default' : 'destructive'}>
                        {artwork.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingArtwork(artwork)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(artwork.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        action={confirmDialog.action}
        actionText={confirmDialog.actionText}
        variant={confirmDialog.variant}
      />
    </div>
  )
}

// Sales Analytics Component
function SalesAnalytics({ onBack }: { onBack: () => void }) {
  const [salesData, setSalesData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')

  const loadSalesData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/sales?days=${timeRange}`)
      const data = await response.json()
      setSalesData(data)
    } catch (error) {
      console.error('Failed to load sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSalesData()
  }, [timeRange])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Sales Analytics</h2>
            <p className="text-gray-600">Track your sales performance and trends</p>
          </div>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${salesData?.totalRevenue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +{salesData?.revenueGrowth || 0}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{salesData?.orderGrowth || 0}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${salesData?.averageOrderValue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +{salesData?.aovGrowth || 0}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Seller</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{salesData?.topSeller?.title || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {salesData?.topSeller?.sales || 0} units sold
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>Revenue over the selected time period</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Sales chart will be displayed here</p>
                <p className="text-sm">Revenue: ${salesData?.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Settings Component
function AdminSettings({ onBack }: { onBack: () => void }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handlePasswordChange = async () => {
    setMsg(null)
    setBusy(true)
    try {
      const res = await fetch('/api/auth/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || 'Failed to update password')
      setMsg('Password updated successfully')
      setNewPassword('')
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Admin Settings</h2>
          <p className="text-gray-600">Manage your admin account settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your admin password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={passwordVisible ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {msg && (
            <div className={`text-sm ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {msg}
            </div>
          )}
          
          <Button onClick={handlePasswordChange} disabled={busy || !newPassword}>
            {busy ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [componentKey, setComponentKey] = useState(Date.now())

  // Reset any editing states when switching tabs
  const handleTabChange = (tab: string) => {
    console.log(`Switching to tab: ${tab}`)
    setActiveTab(tab)
    // Force component remount by changing the key
    setComponentKey(Date.now())
  }
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    action: () => void
    actionText: string
    variant: 'destructive' | 'default'
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
    actionText: '',
    variant: 'default'
  })

  // Initialize theme on client side
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
      const next = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      setTheme(next)
      if (next === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch {}
  }, [])

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
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
        
        const data = await response.json()
        setStats(data)
      } catch (error) {
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDashboard()
  }, [router])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  const logout = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Logout',
      description: 'Are you sure you want to logout? You will need to login again to access the admin dashboard.',
      action: async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
      },
      actionText: 'Logout',
      variant: 'default'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image
              src="/img/artwork/WhatsApp Image 2025-06-24 at 02.31.06.jpg"
              alt="Imbayedu"
              width={32}
              height={32}
              className="rounded-sm object-cover"
            />
            <div className="font-bold text-xl tracking-tight">
              Admin Dashboard
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'outline'} 
              onClick={() => handleTabChange(activeTab === 'settings' ? 'dashboard' : 'settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              variant={activeTab === 'inventory' ? 'default' : 'outline'} 
              onClick={() => handleTabChange('inventory')}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            
            <Button 
              variant={activeTab === 'sales' ? 'default' : 'outline'} 
              onClick={() => handleTabChange('sales')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Sales
            </Button>
            
            <Button variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.ordersCount || 0}</div>
                  <p className="text-xs text-muted-foreground">All time orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue (30d)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats?.revenue?.reduce((s: any, r: any) => s + r.total, 0).toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Artwork</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{stats?.topArtworks?.[0]?.title || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground">Best seller</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>


          </div>
        )}

        {activeTab === 'inventory' && <InventoryManager key={`inventory-${componentKey}`} onBack={() => handleTabChange('dashboard')} />}
        {activeTab === 'sales' && <SalesAnalytics key={`sales-${componentKey}`} onBack={() => handleTabChange('dashboard')} />}
        {activeTab === 'settings' && <AdminSettings key={`settings-${componentKey}`} onBack={() => handleTabChange('dashboard')} />}
      </div>

      {/* Professional Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        action={confirmDialog.action}
        actionText={confirmDialog.actionText}
        variant={confirmDialog.variant}
      />
    </div>
  )
}
