import {
  users, User, InsertUser,
  artists, Artist, InsertArtist,
  categories, Category, InsertCategory,
  collections, Collection, InsertCollection,
  artworks, Artwork, InsertArtwork,
  cartItems, CartItem, InsertCartItem,
  testimonials, Testimonial, InsertTestimonial,
  ArtworkWithDetails, CartItemWithDetails
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Artist methods
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  getFeaturedArtists(): Promise<Artist[]>;
  createArtist(artist: InsertArtist): Promise<Artist>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Collection methods
  getCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  getFeaturedCollections(): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;

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
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artists: Map<number, Artist>;
  private categories: Map<number, Category>;
  private collections: Map<number, Collection>;
  private artworks: Map<number, Artwork>;
  private cartItems: Map<number, CartItem>;
  private testimonials: Map<number, Testimonial>;
  
  private userId: number;
  private artistId: number;
  private categoryId: number;
  private collectionId: number;
  private artworkId: number;
  private cartItemId: number;
  private testimonialId: number;

  constructor() {
    this.users = new Map();
    this.artists = new Map();
    this.categories = new Map();
    this.collections = new Map();
    this.artworks = new Map();
    this.cartItems = new Map();
    this.testimonials = new Map();
    
    this.userId = 1;
    this.artistId = 1;
    this.categoryId = 1;
    this.collectionId = 1;
    this.artworkId = 1;
    this.cartItemId = 1;
    this.testimonialId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample categories
    const categories = [
      { name: "Paintings", description: "Original paintings including oil, acrylic, watercolor and mixed media" },
      { name: "Sculptures", description: "Three-dimensional art objects created by shaping or combining materials" },
      { name: "Photography", description: "Photographic prints capturing unique perspectives and moments" },
      { name: "Mixed Media", description: "Artworks that combine different materials and techniques" }
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Add sample collections
    const collections = [
      { 
        name: "Abstract Expressions", 
        description: "Bold colors and expressive forms", 
        imageUrl: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80", 
        featured: true 
      },
      { 
        name: "Cultural Portraits", 
        description: "Celebrating African heritage and identity", 
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80", 
        featured: true 
      },
      { 
        name: "Mixed Media", 
        description: "Contemporary techniques with traditional influences", 
        imageUrl: "https://cdn.pixabay.com/photo/2020/08/19/15/24/gallery-5501368_1280.jpg", 
        featured: true 
      }
    ];
    
    collections.forEach(collection => this.createCollection(collection));
    
    // Add sample artists
    const artists = [
      {
        name: "Zinhle Mkhize",
        bio: "Contemporary painter specializing in portrait art that captures the essence of African identity and heritage.",
        imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        featured: true,
        location: "Johannesburg, South Africa"
      },
      {
        name: "Koffi Adama",
        bio: "Sculptor and mixed media artist whose work explores the intersection of traditional African symbolism and modern aesthetics.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        featured: true,
        location: "Accra, Ghana"
      },
      {
        name: "Thabo Mbeki",
        bio: "Abstract painter known for his vibrant geometric compositions that reflect the rhythm and energy of urban African life.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        featured: true,
        location: "Cape Town, South Africa"
      }
    ];
    
    artists.forEach(artist => this.createArtist(artist));
    
    // Add sample artworks
    const artworks = [
      {
        title: "Geometric Harmony",
        description: "A vibrant abstract painting exploring the relationship between color and form through geometric patterns.",
        price: 1250,
        imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Soul of Africa",
        description: "A powerful portrait that celebrates African heritage through traditional symbolism and contemporary techniques.",
        price: 1850,
        imageUrl: "https://images.unsplash.com/photo-1576773689115-5cd2b0223523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2022",
        inStock: true,
        featured: true
      },
      {
        title: "Serengeti Dreams",
        description: "A vivid landscape depicting the beauty and tranquility of the African savanna at sunset.",
        price: 2100,
        imageUrl: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 150 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Textural Ancestry",
        description: "A mixed media piece that incorporates traditional African textiles and contemporary elements to explore heritage.",
        price: 1750,
        imageUrl: "https://cdn.pixabay.com/photo/2017/08/01/20/52/people-2567915_1280.jpg",
        artistId: 2, // Koffi Adama
        categoryId: 4, // Mixed Media
        collectionId: 3, // Mixed Media
        dimensions: "70 x 90 cm",
        medium: "Mixed media on wood panel",
        year: "2022",
        inStock: true,
        featured: true
      },
      {
        title: "Guardian Spirit",
        description: "A sculptural piece inspired by traditional African guardian figures, reimagined through a contemporary lens.",
        price: 2400,
        imageUrl: "https://images.unsplash.com/photo-1581430872221-d1cfed785922?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        artistId: 2, // Koffi Adama
        categoryId: 2, // Sculptures
        collectionId: 2, // Cultural Portraits
        dimensions: "40 x 30 x 20 cm",
        medium: "Bronze",
        year: "2021",
        inStock: true,
        featured: true
      },
      {
        title: "Desert Whispers",
        description: "An abstract interpretation of the desert landscape, capturing its vastness and subtle color variations.",
        price: 1680,
        imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "60 x 80 cm",
        medium: "Acrylic and sand on canvas",
        year: "2022",
        inStock: true,
        featured: true
      },
      {
        title: "Vibrant Journey",
        description: "A colorful abstract composition representing the journey of life through dynamic brushstrokes and bold colors.",
        price: 1950,
        imageUrl: "https://cdn.pixabay.com/photo/2022/08/22/10/11/abstraction-7403055_1280.jpg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "90 x 90 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Twilight Savanna",
        description: "A photographic print capturing the magical moment when day transitions to night on the African savanna.",
        price: 1480,
        imageUrl: "https://cdn.pixabay.com/photo/2023/01/23/13/37/animals-7738990_1280.jpg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 3, // Photography
        collectionId: 2, // Cultural Portraits
        dimensions: "80 x 120 cm",
        medium: "Archival pigment print on fine art paper",
        year: "2022",
        inStock: true,
        featured: true
      }
    ];
    
    artworks.forEach(artwork => this.createArtwork(artwork));
    
    // Add sample testimonials
    const testimonials = [
      {
        name: "Sarah Johnson",
        location: "Art Collector, New York",
        comment: "I was looking for a statement piece for my home office and found the perfect artwork through Imbayedu. The quality exceeded my expectations, and the team was incredibly helpful throughout the entire process.",
        rating: 5,
        featured: true
      },
      {
        name: "Michael Chen",
        location: "Interior Designer, Los Angeles",
        comment: "As an interior designer, I've worked with many art galleries, but Imbayedu stands out for their curated selection of African art. My clients are always impressed with the unique pieces we source from them.",
        rating: 5,
        featured: true
      },
      {
        name: "Elena Rodriguez",
        location: "Home Owner, Chicago",
        comment: "I purchased a piece from Imbayedu for my husband's birthday. The shipping was prompt, and the artwork was beautifully packaged. It's now the focal point of our living room and we receive compliments on it constantly.",
        rating: 4,
        featured: true
      }
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Artist methods
  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getFeaturedArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values()).filter(artist => artist.featured);
  }

  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const id = this.artistId++;
    const artist: Artist = { ...insertArtist, id };
    this.artists.set(id, artist);
    return artist;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Collection methods
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getFeaturedCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values()).filter(collection => collection.featured);
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.collectionId++;
    const collection: Collection = { ...insertCollection, id };
    this.collections.set(id, collection);
    return collection;
  }

  // Artwork methods
  async getArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values());
  }

  async getArtworksWithDetails(): Promise<ArtworkWithDetails[]> {
    return Promise.all(
      Array.from(this.artworks.values()).map(async (artwork) => {
        const artist = await this.getArtist(artwork.artistId);
        const category = await this.getCategory(artwork.categoryId);
        const collection = artwork.collectionId ? await this.getCollection(artwork.collectionId) : undefined;
        
        return {
          ...artwork,
          artist: artist!,
          category: category!,
          collection
        };
      })
    );
  }

  async getArtwork(id: number): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }

  async getArtworkWithDetails(id: number): Promise<ArtworkWithDetails | undefined> {
    const artwork = await this.getArtwork(id);
    if (!artwork) return undefined;

    const artist = await this.getArtist(artwork.artistId);
    const category = await this.getCategory(artwork.categoryId);
    const collection = artwork.collectionId ? await this.getCollection(artwork.collectionId) : undefined;
    
    return {
      ...artwork,
      artist: artist!,
      category: category!,
      collection
    };
  }

  async getArtworksByArtist(artistId: number): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(artwork => artwork.artistId === artistId);
  }

  async getArtworksByCategory(categoryId: number): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(artwork => artwork.categoryId === categoryId);
  }

  async getArtworksByCollection(collectionId: number): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(artwork => artwork.collectionId === collectionId);
  }

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(artwork => artwork.featured);
  }

  async createArtwork(insertArtwork: InsertArtwork): Promise<Artwork> {
    const id = this.artworkId++;
    const currentDate = new Date();
    const artwork: Artwork = { 
      ...insertArtwork, 
      id, 
      createdAt: currentDate 
    };
    this.artworks.set(id, artwork);
    return artwork;
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async getCartItemsWithDetails(userId: number): Promise<CartItemWithDetails[]> {
    const cartItems = await this.getCartItems(userId);
    
    return Promise.all(
      cartItems.map(async (item) => {
        const artwork = await this.getArtworkWithDetails(item.artworkId);
        return {
          ...item,
          artwork: artwork!
        };
      })
    );
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if artwork exists
    const artwork = await this.getArtwork(insertCartItem.artworkId);
    if (!artwork) {
      throw new Error("Artwork not found");
    }
    
    // Check if item is already in cart
    const existingItems = await this.getCartItems(insertCartItem.userId);
    const existingItem = existingItems.find(item => item.artworkId === insertCartItem.artworkId);
    
    if (existingItem) {
      // Update quantity instead of creating new
      return this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + insertCartItem.quantity
      ) as Promise<CartItem>;
    }
    
    // Create new cart item
    const id = this.cartItemId++;
    const currentDate = new Date();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id, 
      addedAt: currentDate 
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = await this.getCartItem(id);
    if (!cartItem) return undefined;
    
    const updatedItem: CartItem = {
      ...cartItem,
      quantity
    };
    
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = await this.getCartItems(userId);
    userCartItems.forEach(item => {
      this.cartItems.delete(item.id);
    });
    return true;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.featured);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
