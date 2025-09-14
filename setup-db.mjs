#!/usr/bin/env node

/**
 * Database Setup Script
 * This script will create the necessary tables for the application
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  users, artists, categories, collections, artworks, cartItems, testimonials 
} from './shared/schema.js';
import { orders, orderItems } from './shared/orders.js';

// Check for database URL
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('💡 Please set one of these environment variables:');
  console.log('   - DATABASE_URL');
  console.log('   - POSTGRES_URL');
  console.log('   - POSTGRES_URL_NON_POOLING');
  console.log('   - DATABASE_URL_UNPOOLED');
  console.log('');
  console.log('Example:');
  console.log('   export DATABASE_URL="postgresql://username:password@localhost:5432/imbayedu"');
  process.exit(1);
}

async function setupDatabase() {
  console.log('🔄 Setting up database...');
  
  try {
    const client = postgres(DATABASE_URL);
    const db = drizzle(client, { 
      schema: { users, artists, categories, collections, artworks, cartItems, testimonials, orders, orderItems } 
    });

    console.log('✅ Database connection established');

    // Create tables
    console.log('🔄 Creating tables...');
    
    // Create users table
    await client`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT,
      is_admin BOOLEAN DEFAULT FALSE
    )`;
    console.log('✅ Users table created');

    // Create artists table
    await client`CREATE TABLE IF NOT EXISTS artists (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      bio TEXT,
      image_url TEXT,
      featured BOOLEAN DEFAULT FALSE,
      location TEXT
    )`;
    console.log('✅ Artists table created');

    // Create categories table
    await client`CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    )`;
    console.log('✅ Categories table created');

    // Create collections table
    await client`CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      featured BOOLEAN DEFAULT FALSE
    )`;
    console.log('✅ Collections table created');

    // Create artworks table
    await client`CREATE TABLE IF NOT EXISTS artworks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      artist_id INTEGER REFERENCES artists(id),
      category_id INTEGER NOT NULL REFERENCES categories(id),
      collection_id INTEGER REFERENCES collections(id),
      dimensions TEXT,
      medium TEXT,
      year TEXT,
      in_stock BOOLEAN DEFAULT TRUE,
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log('✅ Artworks table created');

    // Create cart_items table
    await client`CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      artwork_id INTEGER NOT NULL REFERENCES artworks(id),
      quantity INTEGER DEFAULT 1,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log('✅ Cart items table created');

    // Create testimonials table
    await client`CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      comment TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      featured BOOLEAN DEFAULT FALSE
    )`;
    console.log('✅ Testimonials table created');

    // Create orders table
    await client`CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      total DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      customer_name TEXT,
      customer_email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log('✅ Orders table created');

    // Create order_items table
    await client`CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id),
      artwork_id INTEGER NOT NULL REFERENCES artworks(id),
      title TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      quantity INTEGER DEFAULT 1
    )`;
    console.log('✅ Order items table created');

    // Create admin user
    console.log('🔄 Creating admin user...');
    try {
      await client`INSERT INTO users (username, password, email, full_name, is_admin) 
                   VALUES ('admin', 'admin', 'admin@imbayedu.com', 'Admin User', true) 
                   ON CONFLICT (username) DO NOTHING`;
      console.log('✅ Admin user created (username: admin, password: admin)');
    } catch (e) {
      console.log('ℹ️  Admin user may already exist');
    }

    console.log('🎉 Database setup complete!');
    console.log('');
    console.log('You can now:');
    console.log('1. Use environment variables for login:');
    console.log('   ADMIN_USER=admin@imbayedu');
    console.log('   ADMIN_PASS=imbayedu@2025');
    console.log('2. Or use the database admin user:');
    console.log('   Username: admin');
    console.log('   Password: admin');
    
    await client.end();
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
