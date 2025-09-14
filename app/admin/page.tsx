"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
            className="object-cover"
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
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
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
    stock: ''
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
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
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
            index === self.findIndex(a => a.name === artist.name)
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
    loadArtworks()
    loadReferenceData()
  }, [])

  const handleDelete = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Artwork',
      description: 'Are you sure you want to delete this artwork? This action cannot be undone.',
      action: async () => {
        try {
          await fetch(`/api/admin/artworks/${id}`, { method: 'DELETE' })
          loadArtworks()
        } catch (error) {
          console.error('Failed to delete artwork:', error)
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
        setConfirmDialog({
          isOpen: true,
          title: 'Success',
          description: 'Artwork has been added successfully!',
          action: () => {},
          actionText: 'OK',
          variant: 'default'
        })
      } else {
        const error = await response.json()
        setConfirmDialog({
          isOpen: true,
          title: 'Error',
          description: error.message || 'Failed to add artwork. Please try again.',
          action: () => {},
          actionText: 'OK',
          variant: 'default'
        })
      }
    } catch (error) {
      console.error('Failed to add artwork:', error)
      setConfirmDialog({
        isOpen: true,
        title: 'Error',
        description: 'Failed to add artwork. Please check your connection and try again.',
        action: () => {},
        actionText: 'OK',
        variant: 'default'
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
        setConfirmDialog({
          isOpen: true,
          title: 'Success',
          description: 'Artist has been added successfully!',
          action: () => {},
          actionText: 'OK',
          variant: 'default'
        })
      } else {
        const error = await response.json()
        setConfirmDialog({
          isOpen: true,
          title: 'Error',
          description: error.message || 'Failed to add artist. Please try again.',
          action: () => {},
          actionText: 'OK',
          variant: 'default'
        })
      }
    } catch (error) {
      console.error('Failed to add artist:', error)
      setConfirmDialog({
        isOpen: true,
        title: 'Error',
        description: 'Failed to add artist. Please check your connection and try again.',
        action: () => {},
        actionText: 'OK',
        variant: 'default'
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
        setConfirmDialog({
          isOpen: true,
          title: 'Success',
          description: 'Collection has been added successfully!',
          action: () => {},
          actionText: 'OK',
          variant: 'default'
        })
      } else {
        const error = await response.json()
        setConfirmDialog({
          isOpen: true,
          title: 'Error',
          description: error.message || 'Failed to add collection. Please try again.',
          action: () => {},
          actionText: 'OK',
          variant: 'default'
        })
      }
    } catch (error) {
      console.error('Failed to add collection:', error)
      setConfirmDialog({
        isOpen: true,
        title: 'Error',
        description: 'Failed to add collection. Please check your connection and try again.',
        action: () => {},
        actionText: 'OK',
        variant: 'default'
      })
    }
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
            // Remove artist from local state instead of reloading all data
            setArtists(prev => prev.filter(artist => artist.id !== id))
            setConfirmDialog({
              isOpen: true,
              title: 'Success',
              description: 'Artist has been deleted successfully!',
              action: () => {},
              actionText: 'OK',
              variant: 'default'
            })
          } else {
            const error = await response.json()
            setConfirmDialog({
              isOpen: true,
              title: 'Error',
              description: error.message || 'Failed to delete artist. Please try again.',
              action: () => {},
              actionText: 'OK',
              variant: 'default'
            })
          }
        } catch (error) {
          console.error('Failed to delete artist:', error)
          setConfirmDialog({
            isOpen: true,
            title: 'Error',
            description: 'Failed to delete artist. Please check your connection and try again.',
            action: () => {},
            actionText: 'OK',
            variant: 'default'
          })
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
            // Remove collection from local state instead of reloading all data
            setCollections(prev => prev.filter(collection => collection.id !== id))
            setConfirmDialog({
              isOpen: true,
              title: 'Success',
              description: 'Collection has been deleted successfully!',
              action: () => {},
              actionText: 'OK',
              variant: 'default'
            })
          } else {
            const error = await response.json()
            setConfirmDialog({
              isOpen: true,
              title: 'Error',
              description: error.message || 'Failed to delete collection. Please try again.',
              action: () => {},
              actionText: 'OK',
              variant: 'default'
            })
          }
        } catch (error) {
          console.error('Failed to delete collection:', error)
          setConfirmDialog({
            isOpen: true,
            title: 'Error',
            description: 'Failed to delete collection. Please check your connection and try again.',
            action: () => {},
            actionText: 'OK',
            variant: 'default'
          })
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
              setShowAddCollection(true)
              setShowAddForm(false)
              setShowAddArtist(false)
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

      {/* Add Artist Form */}
      {showAddArtist && (
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
      )}

      {/* Artist List - Only show when Add Artist is active */}
      {showAddArtist && (
        <Card>
          <CardHeader>
            <CardTitle>All Artists</CardTitle>
            <CardDescription>Manage your artists</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No artists found
                    </TableCell>
                  </TableRow>
                ) : (
                  artists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell>
                        <Image
                          src={artist.imageUrl || '/placeholder-artist.jpg'}
                          alt={artist.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{artist.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{artist.bio || '-'}</TableCell>
                      <TableCell>
                        {artist.website ? (
                          <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit
                          </a>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteArtist(artist.id)}>
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

      {/* Add Collection Form */}
      {showAddCollection && (
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
                          src={collection.imageUrl || '/placeholder-collection.jpg'}
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
                          <Button size="sm" variant="outline">
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


      {/* Artwork List - Only show when Add Artwork is active */}
      {showAddForm && (
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
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : artworks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No artworks found
                    </TableCell>
                  </TableRow>
                ) : (
                  artworks.map((artwork) => (
                    <TableRow key={artwork.id}>
                      <TableCell>
                        <Image
                          src={artwork.imageUrl || '/placeholder-artwork.jpg'}
                          alt={artwork.title}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{artwork.title}</TableCell>
                      <TableCell>{artwork.artist?.name || 'Unknown'}</TableCell>
                      <TableCell>${artwork.price || 0}</TableCell>
                      <TableCell>{artwork.stock || 0}</TableCell>
                      <TableCell>
                        <Badge variant={artwork.stock > 0 ? 'default' : 'destructive'}>
                          {artwork.stock > 0 ? 'In Stock' : 'Out of Stock'}
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
      )}
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
              onClick={() => setActiveTab(activeTab === 'settings' ? 'dashboard' : 'settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              variant={activeTab === 'inventory' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('inventory')}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            
            <Button 
              variant={activeTab === 'sales' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('sales')}
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <Package className="h-6 w-6" />
                    Manage Inventory
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('sales')}
                  >
                    <TrendingUp className="h-6 w-6" />
                    View Sales Analytics
                  </Button>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'inventory' && <InventoryManager onBack={() => setActiveTab('dashboard')} />}
        {activeTab === 'sales' && <SalesAnalytics onBack={() => setActiveTab('dashboard')} />}
        {activeTab === 'settings' && <AdminSettings onBack={() => setActiveTab('dashboard')} />}
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
