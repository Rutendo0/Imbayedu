import {users, artists,categories,collections,artworks,cartItems,testimonials,
  type InsertUser,
  type User,
  type InsertArtist,
  type Artist,
  type InsertCategory,
  type Category,
  type InsertCollection,
  type Collection,
  type InsertArtwork,
  type Artwork,
  type InsertCartItem,
  type CartItem,
  type InsertTestimonial,
  type Testimonial,
  type ArtworkWithDetails,
  type CartItemWithDetails,
} from "@shared/schema";
import { orders, orderItems, type InsertOrder, type Order, type InsertOrderItem, type OrderItem } from "@shared/orders";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import postgres from "postgres";

// ---------------------------------------------
// Storage interface with CRUD methods (public API)
// ---------------------------------------------
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, password: string): Promise<boolean>;

  // Artist methods
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  getFeaturedArtists(): Promise<Artist[]>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtist(id: number, patch: Partial<InsertArtist>): Promise<Artist | undefined>;
  deleteArtist(id: number): Promise<boolean>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, patch: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Collection methods
  getCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  getFeaturedCollections(): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: number, patch: Partial<InsertCollection>): Promise<Collection | undefined>;
  deleteCollection(id: number): Promise<boolean>;

  // Artwork methods
  getArtworks(): Promise<Artwork[]>;
  getArtworksWithDetails(): Promise<ArtworkWithDetails[]>;
  getArtwork(id: number): Promise<Artwork | undefined>;
  getArtworkWithDetails(id: number): Promise<ArtworkWithDetails | undefined>;
  getArtworksByArtist(artistId: number): Promise<Artwork[]>;
  getArtworksByCategory(categoryId: number): Promise<Artwork[]>;
  getArtworksByCollection(collectionId: number): Promise<Artwork[]>;
  getFeaturedArtworks(): Promise<Artwork[]>;
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;
  updateArtwork(id: number, patch: Partial<InsertArtwork>): Promise<Artwork | undefined>;
  deleteArtwork(id: number): Promise<boolean>;

  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItemsWithDetails(userId: number): Promise<CartItemWithDetails[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrders(): Promise<Order[]>;
  getRevenueByDay(days: number): Promise<{ date: string; total: number }[]>;
  getTopArtworks(limit: number): Promise<{ title: string; revenue: number; qty: number }[]>;
}

// ---------------------------------------------
// Optional Postgres connection (falls back to in-memory)
// ---------------------------------------------
const DATABASE_URL =
  process.env.POSTGRES_URL || // Vercel Postgres
  process.env.DATABASE_URL || // Neon/Vercel DATABASE_URL
  process.env.POSTGRES_URL_NON_POOLING || // Optional alternative
  process.env.DATABASE_URL_UNPOOLED ||
  ""; // Empty means no DB; we will fallback to in-memory

let sql: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
  if (DATABASE_URL && process.env.DISABLE_DB !== "true") {
    // Keep credentials hidden in logs
    const masked = (() => {
      try {
        const [protoHost, rest] = DATABASE_URL.split("@");
        return `${protoHost}@[HIDDEN]`;
      } catch {
        return "[HIDDEN]";
      }
    })();
    console.log("Connecting to database...", masked);

    // Use a very small pool; suitable for serverless or dev
    sql = postgres(DATABASE_URL, { max: 1 });
    db = drizzle(sql, {
      schema: { users, artists, categories, collections, artworks, cartItems, testimonials, orders, orderItems },
    });
  }
} catch (error) {
  console.error("Failed to connect to PostgreSQL:", error);
  sql = null;
  db = null;
}

// ---------------------------------------------
// Postgres-backed storage
// ---------------------------------------------
class PostgresStorage implements IStorage {
  // Orders
  async createOrder(order: InsertOrder) {
    const [row] = await db!.insert(orders).values(order).returning()
    return row!
  }
  async addOrderItem(item: InsertOrderItem) {
    const [row] = await db!.insert(orderItems).values(item).returning()
    return row!
  }
  async getOrders() {
    return await db!.select().from(orders)
  }
  async getRevenueByDay(days: number) {
    // Simple grouping in JS since we don’t have SQL helpers wired for date trunc
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const all = await this.getOrders()
    const map = new Map<string, number>()
    for (const o of all) {
      if (o.createdAt && o.createdAt >= since && o.status === 'paid') {
        const key = o.createdAt.toISOString().slice(0, 10)
        map.set(key, (map.get(key) || 0) + (o.total || 0))
      }
    }
    return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([date,total])=>({date,total}))
  }
  async getTopArtworks(limit: number) {
    // Sum by title from orderItems
    const all = await db!.select().from(orderItems)
    const agg = new Map<string, { revenue: number; qty: number }>()
    for (const i of all) {
      const e = agg.get(i.title) || { revenue: 0, qty: 0 }
      e.revenue += (i.price || 0) * (i.quantity || 1)
      e.qty += (i.quantity || 1)
      agg.set(i.title, e)
    }
    return Array.from(agg.entries())
      .map(([title, v]) => ({ title, revenue: v.revenue, qty: v.qty }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
  }
  // User methods
  async getUser(id: number) {
    const rows = await db!.select().from(users).where(eq(users.id, id));
    return rows[0];
  }
  async getUserByUsername(username: string) {
    const rows = await db!.select().from(users).where(eq(users.username, username));
    return rows[0];
  }
  async createUser(insertUser: InsertUser) {
    const [row] = await db!
      .insert(users)
      .values({
        username: insertUser.username,
        password: insertUser.password,
        email: insertUser.email,
        fullName: insertUser.fullName ?? null,
        isAdmin: false,
      })
      .returning();
    return row!;
  }
  async updateUserPassword(id: number, password: string) {
    const [row] = await db!
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning()
    return !!row
  }

  // Artist methods
  async getArtists() {
    return await db!.select().from(artists);
  }
  async getArtist(id: number) {
    const rows = await db!.select().from(artists).where(eq(artists.id, id));
    return rows[0];
  }
  async getFeaturedArtists() {
    return await db!.select().from(artists).where(eq(artists.featured, true));
  }
  async createArtist(insertArtist: InsertArtist) {
    const [row] = await db!
      .insert(artists)
      .values({
        name: insertArtist.name,
        bio: insertArtist.bio,
        imageUrl: insertArtist.imageUrl,
        featured: insertArtist.featured ?? false,
        location: insertArtist.location ?? null,
      })
      .returning();
    return row!;
  }
  async updateArtist(id: number, patch: Partial<InsertArtist>) {
    const [row] = await db!
      .update(artists)
      .set({
        name: patch.name,
        bio: patch.bio,
        imageUrl: patch.imageUrl,
        featured: patch.featured,
        location: patch.location,
      })
      .where(eq(artists.id, id))
      .returning();
    return row;
  }
  async deleteArtist(id: number) {
    const rows = await db!.delete(artists).where(eq(artists.id, id)).returning();
    return rows.length > 0;
  }

  // Category methods
  async getCategories() {
    return await db!.select().from(categories);
  }
  async getCategory(id: number) {
    const rows = await db!.select().from(categories).where(eq(categories.id, id));
    return rows[0];
  }
  async createCategory(insertCategory: InsertCategory) {
    const [row] = await db!
      .insert(categories)
      .values({
        name: insertCategory.name,
        description: insertCategory.description ?? null,
      })
      .returning();
    return row!;
  }
  async updateCategory(id: number, patch: Partial<InsertCategory>) {
    const [row] = await db!
      .update(categories)
      .set({
        name: patch.name,
        description: patch.description,
      })
      .where(eq(categories.id, id))
      .returning();
    return row;
  }
  async deleteCategory(id: number) {
    const rows = await db!.delete(categories).where(eq(categories.id, id)).returning();
    return rows.length > 0;
  }

  // Collection methods
  async getCollections() {
    return await db!.select().from(collections);
  }
  async getCollection(id: number) {
    const rows = await db!.select().from(collections).where(eq(collections.id, id));
    return rows[0];
  }
  async getFeaturedCollections() {
    return await db!.select().from(collections).where(eq(collections.featured, true));
  }
  async createCollection(insertCollection: InsertCollection) {
    const [row] = await db!
      .insert(collections)
      .values({
        name: insertCollection.name,
        description: insertCollection.description ?? null,
        imageUrl: insertCollection.imageUrl,
        featured: insertCollection.featured ?? false,
      })
      .returning();
    return row!;
  }
  async updateCollection(id: number, patch: Partial<InsertCollection>) {
    const [row] = await db!
      .update(collections)
      .set({
        name: patch.name,
        description: patch.description,
        imageUrl: patch.imageUrl,
        featured: patch.featured,
      })
      .where(eq(collections.id, id))
      .returning();
    return row;
  }
  async deleteCollection(id: number) {
    const rows = await db!.delete(collections).where(eq(collections.id, id)).returning();
    return rows.length > 0;
  }

  // Artwork methods
  async getArtworks() {
    return await db!.select().from(artworks);
  }
  async getArtworksWithDetails(): Promise<ArtworkWithDetails[]> {
    const list = await this.getArtworks();
    const detailed = await Promise.all(
      list.map(async (aw) => {
        const artist = aw.artistId ? await this.getArtist(aw.artistId) : undefined;
        const category = await this.getCategory(aw.categoryId);
        const collection = aw.collectionId ? await this.getCollection(aw.collectionId) : undefined;
        return { ...aw, artist: artist!, category: category!, collection } as ArtworkWithDetails;
      })
    );
    return detailed;
  }
  async getArtwork(id: number) {
    const rows = await db!.select().from(artworks).where(eq(artworks.id, id));
    return rows[0];
  }
  async getArtworkWithDetails(id: number) {
    const aw = await this.getArtwork(id);
    if (!aw) return undefined;
    const artist = aw.artistId ? await this.getArtist(aw.artistId) : undefined;
    const category = await this.getCategory(aw.categoryId);
    const collection = aw.collectionId ? await this.getCollection(aw.collectionId) : undefined;
    return { ...aw, artist: artist!, category: category!, collection } as ArtworkWithDetails;
  }
  async getArtworksByArtist(artistId: number) {
    return await db!.select().from(artworks).where(eq(artworks.artistId, artistId));
  }
  async getArtworksByCategory(categoryId: number) {
    return await db!.select().from(artworks).where(eq(artworks.categoryId, categoryId));
  }
  async getArtworksByCollection(collectionId: number) {
    return await db!.select().from(artworks).where(eq(artworks.collectionId, collectionId));
  }
  async getFeaturedArtworks() {
    return await db!.select().from(artworks).where(eq(artworks.featured, true));
  }
  async createArtwork(insertArtwork: InsertArtwork) {
    const [row] = await db!
      .insert(artworks)
      .values({
        title: insertArtwork.title,
        description: insertArtwork.description,
        price: insertArtwork.price,
        imageUrl: insertArtwork.imageUrl,
        artistId: insertArtwork.artistId,
        categoryId: insertArtwork.categoryId,
        collectionId: insertArtwork.collectionId ?? null,
        dimensions: insertArtwork.dimensions ?? null,
        medium: insertArtwork.medium ?? null,
        year: insertArtwork.year ?? null,
        inStock: insertArtwork.inStock ?? true,
        featured: insertArtwork.featured ?? false,
      })
      .returning();
    return row!;
  }
  async updateArtwork(id: number, patch: Partial<InsertArtwork>) {
    const [row] = await db!
      .update(artworks)
      .set({
        title: patch.title,
        description: patch.description,
        price: patch.price,
        imageUrl: patch.imageUrl,
        artistId: patch.artistId,
        categoryId: patch.categoryId,
        collectionId: patch.collectionId,
        dimensions: patch.dimensions,
        medium: patch.medium,
        year: patch.year,
        inStock: patch.inStock,
        featured: patch.featured,
      })
      .where(eq(artworks.id, id))
      .returning();
    return row;
  }
  async deleteArtwork(id: number) {
    const rows = await db!.delete(artworks).where(eq(artworks.id, id)).returning();
    return rows.length > 0;
  }

  // Cart methods
  async getCartItems(userId: number) {
    return await db!.select().from(cartItems).where(eq(cartItems.userId, userId));
  }
  async getCartItemsWithDetails(userId: number) {
    const items = await this.getCartItems(userId);
    const result = await Promise.all(
      items.map(async (ci) => {
        const aw = await this.getArtworkWithDetails(ci.artworkId);
        return { ...ci, artwork: aw! } as CartItemWithDetails;
      })
    );
    return result;
  }
  async getCartItem(id: number) {
    const rows = await db!.select().from(cartItems).where(eq(cartItems.id, id));
    return rows[0];
  }
  async createCartItem(insertCartItem: InsertCartItem) {
    // If existing for (userId, artworkId) -> increase quantity
    const existing = (
      await db!
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.userId, insertCartItem.userId), eq(cartItems.artworkId, insertCartItem.artworkId)))
    )[0];

    if (existing) {
      const newQty = existing.quantity + (insertCartItem.quantity ?? 1);
      const [updated] = await db!
        .update(cartItems)
        .set({ quantity: newQty })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated!;
    }

    const [row] = await db!
      .insert(cartItems)
      .values({
        userId: insertCartItem.userId,
        artworkId: insertCartItem.artworkId,
        quantity: insertCartItem.quantity ?? 1,
      })
      .returning();
    return row!;
  }
  async updateCartItemQuantity(id: number, quantity: number) {
    const [row] = await db!
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return row;
  }
  async removeCartItem(id: number) {
    const rows = await db!.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return rows.length > 0;
  }
  async clearCart(userId: number) {
    await db!.delete(cartItems).where(eq(cartItems.userId, userId));
    return true;
  }

  // Testimonial methods
  async getTestimonials() {
    return await db!.select().from(testimonials);
  }
  async getFeaturedTestimonials() {
    return await db!.select().from(testimonials).where(eq(testimonials.featured, true));
  }
  async createTestimonial(insertTestimonial: InsertTestimonial) {
    const [row] = await db!
      .insert(testimonials)
      .values({
        name: insertTestimonial.name,
        location: insertTestimonial.location,
        comment: insertTestimonial.comment,
        rating: insertTestimonial.rating,
        featured: insertTestimonial.featured ?? false,
      })
      .returning();
    return row!;
  }
}

// ---------------------------------------------
// In-memory storage (dev fallback) with seed data
// ---------------------------------------------
class InMemoryStorage implements IStorage {
  private users = new Map<number, User>();
  private artists = new Map<number, Artist>();
  private categories = new Map<number, Category>();
  private collections = new Map<number, Collection>();
  private artworks = new Map<number, Artwork>();
  private cartItems = new Map<number, CartItem>();
  private testimonials = new Map<number, Testimonial>();
  // Orders in-memory
  private orders = new Map<number, Order>();
  private orderItems = new Map<number, OrderItem>();

  private userId = 1;
  private artistId = 1;
  private categoryId = 1;
  private collectionId = 1;
  private artworkId = 1;
  private cartItemId = 1;
  private testimonialId = 1;
  private orderId = 1;
  private orderItemId = 1;
  private seeding = false;

  constructor() {
    this.seed();
  }

  private seed() {
    if (this.seeding) return; // prevent double-run
    this.seeding = true;
    // Categories
    this.createCategory({ name: "Paintings", description: "Original paintings including oil, acrylic, watercolor and mixed media" });
    this.createCategory({ name: "Mixed Media", description: "Artworks that combine different materials and techniques" });

    // Collections
    this.createCollection({
      name: "Abstract Expressions",
      description: "Bold colors and expressive forms capturing emotional landscapes",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
      featured: true,
    });
    this.createCollection({
      name: "Cultural Portraits",
      description: "Celebrating African heritage and identity through vibrant expressions",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg",
      featured: true,
    });
    this.createCollection({
      name: "Mixed Media",
      description: "Contemporary techniques with traditional influences and textural exploration",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02.jpeg",
      featured: true,
    });

    // Artists
    this.createArtist({
      name: "Tunga Makoni",
      bio: "Contemporary painter specializing in portrait art that captures the essence of African identity and heritage through vibrant colors and expressive brushwork. Her work celebrates cultural pride and explores themes of tradition in modern contexts.",
      imageUrl: "/img/artwork/Tunga.jpg?v=" + Date.now(),
      featured: true,
      location: "Harare, Zimbabwe",
    });
    this.createArtist({
      name: "O'Neal Tanaka Maisiri ",
      bio: "O'Neal Tanaka Maisiri is a Zimbabwean artist whose abstract paintings reflect a deep connection to his environment. Using bold colors and dynamic compositions, he conveys the energy and emotions of his surroundings.",
      imageUrl: "/img/artwork/artist.png",
      featured: true,
      location: "Harare, Zimbabwe",
    });

    // Artworks (34 items)
    this.createArtwork({
      title: "Blending Colours",
      description: "A vibrant portrait.",
      price: 279,
      imageUrl: "/img/artwork/WhatsApp Image 2025-06-24 at 07.18.28.jpg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "90 x 120 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Abstract Spirit",
      description: "A vibrant portrait celebrating African heritage with bold colors and expressive brushwork.",
      price: 250,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.27.21.jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "90 x 120 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Nature's Harmony",
      description: "An exploration of natural forms and patterns through a rich tapestry of colors and textures.",
      price: 500,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.27.24.jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "70 x 90 cm",
      medium: "Mixed media on canvas",
      year: "2023",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Abstract Emotion",
      description: "A powerful abstract piece exploring the depths of human emotion through color and form.",
      price: 260,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.29.57.jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "100 x 100 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Cultural Heritage",
      description: "A celebration of African cultural heritage through symbolic imagery and traditional patterns.",
      price: 290,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.29.59.jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "100 x 100 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Urban Rhythms",
      description: "Dynamic movement and rhythm inspired by city life.",
      price: 320,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.00.jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "80 x 120 cm",
      medium: "Acrylic on canvas",
      year: "2023",
      inStock: true,
      featured: true,
      artistId: 1,
    });
    this.createArtwork({
      title: "Golden Hour",
      description: "Warm golden hues capturing twilight serenity.",
      price: 340,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.00 (1).jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "90 x 90 cm",
      medium: "Oil on canvas",
      year: "2022",
      inStock: true,
      featured: false,
      artistId: 2,
    });
    this.createArtwork({
      title: "Reflections",
      description: "Reflective planes and layered textures in cool tones.",
      price: 280,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.00 (2).jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "70 x 100 cm",
      medium: "Mixed media on canvas",
      year: "2024",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Roots and Patterns",
      description: "Traditional motifs woven into modern abstraction.",
      price: 360,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.01.jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "100 x 120 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Ethereal Motion",
      description: "Soft gradients and flowing forms suggesting motion.",
      price: 310,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.01 (1).jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "85 x 110 cm",
      medium: "Acrylic on canvas",
      year: "2023",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Desert Winds",
      description: "Warm palettes and sweeping strokes evoking desert winds.",
      price: 295,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02.jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "75 x 95 cm",
      medium: "Oil on canvas",
      year: "2022",
      inStock: true,
      featured: false,
      artistId: 2,
    });
    this.createArtwork({
      title: "Midnight Blues",
      description: "Deep blues and indigo layers with subtle highlights.",
      price: 270,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (1).jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "80 x 80 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 1,
    });
    this.createArtwork({
      title: "Joyful Dance",
      description: "Expressive brushwork capturing movement and joy.",
      price: 305,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (2).jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "90 x 110 cm",
      medium: "Acrylic on canvas",
      year: "2023",
      inStock: true,
      featured: false,
      artistId: 2,
    });
    this.createArtwork({
      title: "Tribal Echoes",
      description: "Geometric echoes of tribal design in a modern palette.",
      price: 335,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03.jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "95 x 120 cm",
      medium: "Mixed media on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 1,
    });
    this.createArtwork({
      title: "Spirit of the Plains",
      description: "Earth tones with sweeping gestures suggest open plains.",
      price: 315,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (1).jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "100 x 100 cm",
      medium: "Oil on canvas",
      year: "2023",
      inStock: true,
      featured: false,
      artistId: 2,
    });
    this.createArtwork({
      title: "Emerald Forest",
      description: "Vibrant greens layered with textured strokes.",
      price: 295,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (2).jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "85 x 120 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Festival Lights",
      description: "Colorful lights and shapes reminiscent of festivities.",
      price: 285,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "80 x 100 cm",
      medium: "Acrylic on canvas",
      year: "2022",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Ocean Whisper",
      description: "Cool turquoise tones suggestive of ocean breezes.",
      price: 270,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05.jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "70 x 100 cm",
      medium: "Mixed media on canvas",
      year: "2023",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Crimson Tide",
      description: "Bold reds and flowing forms create a dramatic effect.",
      price: 350,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (1).jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "90 x 120 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Sapphire Dream",
      description: "Dreamlike layers of blues and violets.",
      price: 330,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (2).jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "100 x 120 cm",
      medium: "Oil on canvas",
      year: "2023",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Harvest Sun",
      description: "Golden textures evoking harvest fields and sunlight.",
      price: 345,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (3).jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "80 x 115 cm",
      medium: "Acrylic on canvas",
      year: "2022",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Hidden Paths",
      description: "Interlaced lines suggesting hidden pathways.",
      price: 300,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.06.jpeg",
      categoryId: 1,
      collectionId: 1,
      dimensions: "85 x 110 cm",
      medium: "Mixed media on canvas",
      year: "2024",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Rising Voices",
      description: "Vibrant crescendos of color rising in harmony.",
      price: 315,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.06 (1).jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "100 x 100 cm",
      medium: "Acrylic on canvas",
      year: "2023",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Ancient Stories",
      description: "Symbolic motifs referencing ancestral narratives.",
      price: 355,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07.jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "90 x 120 cm",
      medium: "Oil on canvas",
      year: "2022",
      inStock: true,
      featured: false,
      artistId: 1,
    });
    this.createArtwork({
      title: "Ubuntu",
      description: "Community and connection expressed through form and color.",
      price: 390,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (1).jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "100 x 120 cm",
      medium: "Acrylic on canvas",
      year: "2024",
      inStock: true,
      featured: true,
      artistId: 2,
    });
    this.createArtwork({
      title: "Mother and Child",
      description: "Tender portrait exploring the bond of motherhood.",
      price: 370,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (2).jpeg",
      categoryId: 1,
      collectionId: 2,
      dimensions: "80 x 100 cm",
      medium: "Acrylic on canvas",
      year: "2023",
      inStock: true,
      featured: true,
      artistId: 1,
    });
 
    this.createArtwork({
      title: "Rain Maker",
      description: "Ritual patterns calling forth life-giving rain.",
      price: 310,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (1).jpeg",
      categoryId: 1,
      collectionId: 3,
      dimensions: "85 x 115 cm",
      medium: "Acrylic on canvas",
      year: "2022",
      inStock: true,
      featured: false,
      artistId: 1,
    });
  
  }

  // User methods
  async getUser(id: number) { return this.users.get(id); }
  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find(u => u.username === username);
  }
  async createUser(insertUser: InsertUser) {
    const id = this.userId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName ?? null,
      isAdmin: false,
    };
    this.users.set(id, user);
    return user;
  }
  async updateUserPassword(id: number, password: string) {
    const u = await this.getUser(id)
    if (!u) return false
    this.users.set(id, { ...u, password })
    return true
  }

  // Artist methods
  async getArtists() { return Array.from(this.artists.values()); }
  async getArtist(id: number) { return this.artists.get(id); }
  async getFeaturedArtists() { return (await this.getArtists()).filter(a => !!a.featured); }
  async createArtist(insertArtist: InsertArtist) {
    const id = this.artistId++;
    const artist: Artist = {
      id,
      name: insertArtist.name,
      bio: insertArtist.bio,
      imageUrl: insertArtist.imageUrl,
      featured: insertArtist.featured ?? false,
      location: insertArtist.location ?? null,
    };
    this.artists.set(id, artist);
    return artist;
  }

  // Category methods
  async getCategories() { return Array.from(this.categories.values()); }
  async getCategory(id: number) { return this.categories.get(id); }
  async createCategory(insertCategory: InsertCategory) {
    const id = this.categoryId++;
    const category: Category = { id, name: insertCategory.name, description: insertCategory.description ?? null };
    this.categories.set(id, category);
    return category;
  }

  // Collection methods
  async getCollections() { return Array.from(this.collections.values()); }
  async getCollection(id: number) { return this.collections.get(id); }
  async getFeaturedCollections() { return (await this.getCollections()).filter(c => !!c.featured); }
  async createCollection(insertCollection: InsertCollection) {
    const id = this.collectionId++;
    const collection: Collection = {
      id,
      name: insertCollection.name,
      description: insertCollection.description ?? null,
      imageUrl: insertCollection.imageUrl,
      featured: insertCollection.featured ?? false,
    };
    this.collections.set(id, collection);
    return collection;
  }

  // Artwork methods
  async getArtworks() { return Array.from(this.artworks.values()); }
  async getArtworksWithDetails(): Promise<ArtworkWithDetails[]> {
    const all = await this.getArtworks();
    const result = await Promise.all(all.map(async (aw) => {
      const artist = aw.artistId ? await this.getArtist(aw.artistId) : undefined;
      const category = await this.getCategory(aw.categoryId);
      const collection = aw.collectionId ? await this.getCollection(aw.collectionId) : undefined;
      return { ...aw, artist: artist!, category: category!, collection } as ArtworkWithDetails;
    }));
    return result;
  }
  async getArtwork(id: number) { return this.artworks.get(id); }
  async getArtworkWithDetails(id: number) {
    const aw = await this.getArtwork(id);
    if (!aw) return undefined;
    const artist = aw.artistId ? await this.getArtist(aw.artistId) : undefined;
    const category = await this.getCategory(aw.categoryId);
    const collection = aw.collectionId ? await this.getCollection(aw.collectionId) : undefined;
    return { ...aw, artist: artist!, category: category!, collection } as ArtworkWithDetails;
  }
  async getArtworksByArtist(artistId: number) { return (await this.getArtworks()).filter(a => a.artistId === artistId); }
  async getArtworksByCategory(categoryId: number) { return (await this.getArtworks()).filter(a => a.categoryId === categoryId); }
  async getArtworksByCollection(collectionId: number) { return (await this.getArtworks()).filter(a => a.collectionId === collectionId); }
  async getFeaturedArtworks() { return (await this.getArtworks()).filter(a => !!a.featured); }
  async createArtwork(insertArtwork: InsertArtwork) {
    const id = this.artworkId++;
    const artwork: Artwork = {
      id,
      title: insertArtwork.title,
      description: insertArtwork.description,
      price: insertArtwork.price,
      imageUrl: insertArtwork.imageUrl,
      artistId: insertArtwork.artistId,
      categoryId: insertArtwork.categoryId,
      collectionId: insertArtwork.collectionId ?? null,
      dimensions: insertArtwork.dimensions ?? null,
      medium: insertArtwork.medium ?? null,
      year: insertArtwork.year ?? null,
      inStock: insertArtwork.inStock ?? true,
      featured: insertArtwork.featured ?? false,
      createdAt: new Date(),
    };
    this.artworks.set(id, artwork);
    return artwork;
  }

  // Cart methods
  async getCartItems(userId: number) { return Array.from(this.cartItems.values()).filter(ci => ci.userId === userId); }
  async getCartItemsWithDetails(userId: number) {
    const items = await this.getCartItems(userId);
    const result = await Promise.all(items.map(async (ci) => {
      const aw = await this.getArtworkWithDetails(ci.artworkId);
      return { ...ci, artwork: aw! } as CartItemWithDetails;
    }));
    return result;
  }
  async getCartItem(id: number) { return this.cartItems.get(id); }
  async createCartItem(insertCartItem: InsertCartItem) {
    const existing = (await this.getCartItems(insertCartItem.userId))
      .find(ci => ci.artworkId === insertCartItem.artworkId);
    if (existing) {
      return (await this.updateCartItemQuantity(existing.id, existing.quantity + (insertCartItem.quantity ?? 1)))!;
    }
    const id = this.cartItemId++;
    const item: CartItem = {
      id,
      userId: insertCartItem.userId,
      artworkId: insertCartItem.artworkId,
      quantity: insertCartItem.quantity ?? 1,
      addedAt: new Date(),
    };
    this.cartItems.set(id, item);
    return item;
  }
  async updateCartItemQuantity(id: number, quantity: number) {
    const item = await this.getCartItem(id);
    if (!item) return undefined;
    const updated: CartItem = { ...item, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }
  async removeCartItem(id: number) { return this.cartItems.delete(id); }
  async clearCart(userId: number) {
    (await this.getCartItems(userId)).forEach(ci => this.cartItems.delete(ci.id));
    return true;
  }

  // Testimonial methods
  async getTestimonials() { return Array.from(this.testimonials.values()); }
  async getFeaturedTestimonials() { return (await this.getTestimonials()).filter(t => !!t.featured); }
  async createTestimonial(insertTestimonial: InsertTestimonial) {
    const id = this.testimonialId++;
    const t: Testimonial = {
      id,
      name: insertTestimonial.name,
      location: insertTestimonial.location,
      comment: insertTestimonial.comment,
      rating: insertTestimonial.rating,
      featured: insertTestimonial.featured ?? false,
    };
    this.testimonials.set(id, t);
    return t;
  }
}

// Export a single storage instance. Prefer Postgres when available.
export const storage: IStorage = db ? new PostgresStorage() : new InMemoryStorage();