import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Imbayedu Art Collective API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      artists: '/api/artists',
      artworks: '/api/artworks',
      artworks_details: '/api/artworks/details',
      categories: '/api/categories',
      collections: '/api/collections',
      collections_featured: '/api/collections?featured=true',
      cart: '/api/cart',
      cart_details: '/api/cart/details',
      cart_item: '/api/cart/[id]',
      cart_clear_user: '/api/cart/user/[userId]',
      testimonials: '/api/testimonials',
      testimonials_featured: '/api/testimonials?featured=true'
    },
    timestamp: new Date().toISOString()
  })
}