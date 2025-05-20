
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { storage } from './storage';
import * as schema from '../shared/schema';

async function migrate() {
  const DATABASE_URL = "postgres://postgres:postgres@0.0.0.0:5432/postgres";
  const client = postgres(DATABASE_URL);
  const db = drizzle(client, { schema });

  console.log("Starting migration...");

  // Get all data from memory storage
  const artists = await storage.getArtists();
  const categories = await storage.getCategories();
  const collections = await storage.getCollections();
  const artworks = await storage.getArtworks();
  const testimonials = await storage.getTestimonials();

  try {
    // Insert artists
    console.log("Migrating artists...");
    await Promise.all(artists.map(artist => 
      db.insert(schema.artists).values(artist).onConflictDoNothing()
    ));

    // Insert categories
    console.log("Migrating categories...");
    await Promise.all(categories.map(category =>
      db.insert(schema.categories).values(category).onConflictDoNothing()
    ));

    // Insert collections
    console.log("Migrating collections...");
    await Promise.all(collections.map(collection =>
      db.insert(schema.collections).values(collection).onConflictDoNothing()
    ));

    // Insert artworks
    console.log("Migrating artworks...");
    await Promise.all(artworks.map(artwork =>
      db.insert(schema.artworks).values(artwork).onConflictDoNothing()
    ));

    // Insert testimonials
    console.log("Migrating testimonials...");
    await Promise.all(testimonials.map(testimonial =>
      db.insert(schema.testimonials).values(testimonial).onConflictDoNothing()
    ));

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
