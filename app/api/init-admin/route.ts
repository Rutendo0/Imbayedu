import { NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export async function POST() {
  try {
    // Get database URL from environment
    const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED

    if (!DATABASE_URL) {
      return NextResponse.json({ 
        message: 'No database URL configured. Please set DATABASE_URL environment variable.',
        error: 'Missing database configuration'
      }, { status: 500 })
    }

    const client = postgres(DATABASE_URL)

    // Create tables if they don't exist
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT,
        is_admin BOOLEAN DEFAULT FALSE
      )
    `

    await client`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        payment_method TEXT,
        customer_name TEXT,
        customer_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await client`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        artwork_id INTEGER NOT NULL DEFAULT 0,
        title TEXT NOT NULL DEFAULT '',
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        quantity INTEGER DEFAULT 1
      )
    `

    // Create other required tables
    await client`
      CREATE TABLE IF NOT EXISTS artists (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        bio TEXT,
        image_url TEXT,
        featured BOOLEAN DEFAULT FALSE,
        location TEXT
      )
    `

    await client`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `

    await client`
      CREATE TABLE IF NOT EXISTS collections (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        featured BOOLEAN DEFAULT FALSE
      )
    `

    await client`
      CREATE TABLE IF NOT EXISTS artworks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        image_url TEXT,
        artist_id INTEGER,
        category_id INTEGER NOT NULL DEFAULT 1,
        collection_id INTEGER,
        dimensions TEXT,
        medium TEXT,
        year TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await client`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        artwork_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await client`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT,
        comment TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        featured BOOLEAN DEFAULT FALSE
      )
    `

    // Create admin user
    const result = await client`
      INSERT INTO users (username, password, email, full_name, is_admin) 
      VALUES ('admin', 'admin', 'admin@imbayedu.com', 'Admin User', true) 
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username, is_admin
    `

    await client.end()

    return NextResponse.json({ 
      message: 'Database initialized successfully',
      adminUser: result[0] || { username: 'admin', isAdmin: true },
      credentials: {
        username: 'admin',
        password: 'admin'
      }
    })

  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      message: 'Failed to initialize database', 
      error: String(error) 
    }, { status: 500 })
  }
}

export async function GET() {
  return POST()
}
