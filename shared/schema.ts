import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Artists schema
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false),
  location: text("location"),
});

export const insertArtistSchema = createInsertSchema(artists).pick({
  name: true,
  bio: true,
  imageUrl: true,
  featured: true,
  location: true,
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
});

// Collections schema
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false),
});

export const insertCollectionSchema = createInsertSchema(collections).pick({
  name: true,
  description: true,
  imageUrl: true,
  featured: true,
});

// Artworks schema
export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url").notNull(),
  artistId: integer("artist_id"),
  categoryId: integer("category_id").notNull(),
  collectionId: integer("collection_id"),
  dimensions: text("dimensions"),
  medium: text("medium"),
  year: text("year"),
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArtworkSchema = createInsertSchema(artworks).pick({
  title: true,
  description: true,
  price: true,
  imageUrl: true,
  artistId: true,
  categoryId: true,
  collectionId: true,
  dimensions: true,
  medium: true,
  year: true,
  inStock: true,
  featured: true,
});

// Cart Items schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  artworkId: integer("artwork_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  artworkId: true,
  quantity: true,
});

// Testimonials schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  comment: text("comment").notNull(),
  rating: integer("rating").notNull(),
  featured: boolean("featured").default(false),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  location: true,
  comment: true,
  rating: true,
  featured: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

export type InsertArtwork = z.infer<typeof insertArtworkSchema>;
export type Artwork = typeof artworks.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Custom types for frontend
export type ArtworkWithDetails = Artwork & {
  artist: Artist;
  category: Category;
  collection?: Collection;
};

export type CartItemWithDetails = CartItem & {
  artwork: ArtworkWithDetails;
};
