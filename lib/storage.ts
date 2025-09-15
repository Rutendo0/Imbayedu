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
// REQUIRED Postgres connection (no in-memory fallback)
// ---------------------------------------------
const DATABASE_URL = (process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED || "").trim();

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Set it in your .env to use the app.");
}

let sql: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
  // Keep credentials hidden in logs
  const masked = (() => {
    try {
      const [protoHost] = DATABASE_URL.split("@");
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
} catch (error) {
  console.error("Failed to connect to PostgreSQL:", error);
  throw error;
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
        isAdmin: insertUser.isAdmin ?? false,
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
        return { ...aw, artist: artist || { id: 0, name: 'Unknown Artist', bio: '', imageUrl: '', featured: false, location: null }, category: category!, collection } as ArtworkWithDetails;
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
    return { ...aw, artist: artist || { id: 0, name: 'Unknown Artist', bio: '', imageUrl: '', featured: false, location: null }, category: category!, collection } as ArtworkWithDetails;
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
    // Only set provided fields to avoid overwriting with undefined
    const updates: Record<string, any> = {}
    if (patch.title !== undefined) updates.title = patch.title
    if (patch.description !== undefined) updates.description = patch.description
    if (patch.price !== undefined) updates.price = patch.price
    if (patch.imageUrl !== undefined) updates.imageUrl = patch.imageUrl
    if (patch.artistId !== undefined) updates.artistId = patch.artistId
    if (patch.categoryId !== undefined) updates.categoryId = patch.categoryId
    if (patch.collectionId !== undefined) updates.collectionId = patch.collectionId
    if (patch.dimensions !== undefined) updates.dimensions = patch.dimensions
    if (patch.medium !== undefined) updates.medium = patch.medium
    if (patch.year !== undefined) updates.year = patch.year
    if (patch.inStock !== undefined) updates.inStock = patch.inStock
    if (patch.featured !== undefined) updates.featured = patch.featured

    if (Object.keys(updates).length === 0) {
      // Nothing to update; return current record
      return await this.getArtwork(id)
    }

    const [row] = await db!
      .update(artworks)
      .set(updates as any)
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

// Export a single storage instance. Always use Postgres.
export const storage: IStorage = new PostgresStorage();