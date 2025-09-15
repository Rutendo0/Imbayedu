import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Force Node.js runtime (file system APIs are not available on Edge)
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // Vercel’s filesystem is read-only at runtime. Prevent writes in production.
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return NextResponse.json(
        {
          message:
            'Runtime uploads to the local filesystem are disabled in production. Configure an external storage (e.g. Vercel Blob, S3, Cloudinary) and update this route to store and return remote URLs.',
        },
        { status: 501 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'artwork', 'artist', 'collection'

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ message: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${type}_${timestamp}.${extension}`

    // Determine upload directory
    const uploadDir = join(process.cwd(), 'public', 'img', type)
    const filepath = join(uploadDir, filename)

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the public URL
    const publicUrl = `/img/${type}/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 })
  }
}
