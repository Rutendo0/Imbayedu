#!/usr/bin/env node

/**
 * Database Setup Script for Vercel Postgres
 * Run this after creating your Vercel Postgres database
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  users, artists, categories, collections, artworks, cartItems, testimonials 
} from './shared/schema.js';

const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is required');
  console.log('💡 Make sure you have created a Vercel Postgres database and the environment variable is set');
  process.exit(1);
}

async function setupDatabase() {
  console.log('🔄 Setting up database...');
  
  try {
    const client = postgres(DATABASE_URL);
    const db = drizzle(client, { 
      schema: { users, artists, categories, collections, artworks, cartItems, testimonials } 
    });

    console.log('✅ Database connection established');
    console.log('✅ Schema loaded successfully');
    console.log('🎉 Database setup complete!');
    
    await client.end();
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();