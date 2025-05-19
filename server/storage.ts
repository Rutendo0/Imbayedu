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
import { title } from "process";

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
    // Add relevant categories
    const categories = [
      { name: "Paintings", description: "Original paintings including oil, acrylic, watercolor and mixed media" },
      { name: "Mixed Media", description: "Artworks that combine different materials and techniques" }
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Add collections featuring actual Imbayedu artwork images
    const collections = [
      { 
        name: "Abstract Expressions", 
        description: "Bold colors and expressive forms capturing emotional landscapes", 
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg", 
        featured: true 
      },
      { 
        name: "Cultural Portraits", 
        description: "Celebrating African heritage and identity through vibrant expressions", 
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (2).jpeg", 
        featured: true 
      },
      { 
        name: "Mixed Media", 
        description: "Contemporary techniques with traditional influences and textural exploration", 
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.04 (1).jpeg", 
        featured: true 
      },
    
    ];
    
    collections.forEach(collection => this.createCollection(collection));
    
    // Add artists associated with Imbayedu artworks
    const artists = [
      {
        name: "Zinhle Mkhize",
        bio: "Contemporary painter specializing in portrait art that captures the essence of African identity and heritage through vibrant colors and expressive brushwork. Her work celebrates cultural pride and explores themes of tradition in modern contexts.",
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (3).jpeg",
        featured: true,
        location: "Marondera, Zimbabwe"
      },
      {
        name: "Koffi Adama",
        bio: "Sculptor and mixed media artist whose work explores the intersection of traditional African symbolism and modern aesthetics. His textural experimentations create dynamic compositions that invite viewers to reconsider materials and forms.",
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (1).jpeg",
        featured: true,
        location: "Harare, Zimbabwe"
      },
      {
        name: "Thabo Mbeki",
        bio: "Abstract painter known for his vibrant geometric compositions that reflect the rhythm and energy of urban African life. His landscapes capture emotional responses to environments through bold color relationships and dynamic forms.",
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.08.jpeg",
        featured: true,
        location: "Harare, Zimbabwe"
      }
    ];
    
    artists.forEach(artist => this.createArtist(artist));
    
    // Add all artworks with actual Imbayedu pieces
    const artworks = [
      {
        title: "African Spirit",
        description: "A vibrant portrait celebrating African heritage with bold colors and expressive brushwork.",
        price: 1850,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.27.21.jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Sunset Reflections",
        description: "A captivating landscape depicting the warm hues of an African sunset reflecting over water.",
        price: 1650,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.27.23.jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 100 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Nature's Harmony",
        description: "An exploration of natural forms and patterns through a rich tapestry of colors and textures.",
        price: 1450,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.27.24.jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "70 x 90 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Abstract Emotion",
        description: "A powerful abstract piece exploring the depths of human emotion through color and form.",
        price: 1950,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.29.57.jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Cultural Heritage",
        description: "A celebration of African cultural heritage through symbolic imagery and traditional patterns.",
        price: 2100,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.29.59.jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Urban Rhythm",
        description: "A dynamic composition capturing the energy and rhythm of urban African life.",
        price: 1750,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.00.jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 2, // Mixed Media
        collectionId: 3, // Mixed Media
        dimensions: "80 x 100 cm",
        medium: "Mixed media on wood panel",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Serene Landscape",
        description: "A peaceful landscape showcasing the serene beauty of African natural environments.",
        price: 1880,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.00 (1).jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Colorful Abstraction",
        description: "A vibrant abstract composition with bold colors and dynamic forms creating visual harmony.",
        price: 1680,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.00 (2).jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 80 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Textured Landscape",
        description: "A richly textured landscape highlighting the diverse topography of African environments.",
        price: 1950,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.01.jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 120 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Vibrant Portrait",
        description: "A striking portrait featuring bold colors and expressive brushwork celebrating African identity.",
        price: 2200,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.01 (1).jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Abstract Patterns",
        description: "A mesmerizing exploration of patterns and textures through abstract composition.",
        price: 1850,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.02.jpeg",
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
        title: "Nature's Palette",
        description: "A colorful interpretation of natural elements using an expressive color palette.",
        price: 1750,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (1).jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "90 x 90 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Emotional Landscape",
        description: "A landscape that captures emotional response through color harmonies and compositional elements.",
        price: 1980,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (2).jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 120 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Cultural Tapestry",
        description: "A vibrant representation of African cultural elements woven together in a harmonious composition.",
        price: 2150,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.03.jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 2, // Mixed Media
        collectionId: 1, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Mixed media on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Abstract Movement",
        description: "A dynamic abstract piece capturing movement and energy through flowing forms and vibrant colors.",
        price: 1950,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (1).jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Soulful Portrait",
        description: "A soulful portrait that captures the depth and spirit of its subject through expressive techniques.",
        price: 2300,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (2).jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 2, // Mixed Media
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Vibrant Expression",
        description: "An expressive and vibrant piece showcasing bold brushstrokes and dynamic color relationships.",
        price: 1850,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg",
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
        title: "Textural Study",
        description: "A rich exploration of texture and form through layers of paint and mixed media elements.",
        price: 1780,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.04 (1).jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 2, // Mixed Media
        collectionId: 3, // Mixed Media
        dimensions: "90 x 90 cm",
        medium: "Mixed media on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Natural Harmony",
        description: "A balanced composition inspired by natural forms and organic elements from African landscapes.",
        price: 1950,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.05.jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 120 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: true,
        featured: true
      },
      {
        title: "Cultural Identity",
        description: "A powerful representation of African cultural identity through symbolic imagery and traditional patterns.",
        price: 2400,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (1).jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "110 x 130 cm",
        medium: "Mixed media on canvas",
        year: "2024",
        inStock: true,
        featured: true
      },
      {
        title: "Vibrant Abstraction",
        description: "A colorful abstract piece with geometric elements creating a sense of movement and rhythm.",
        price: 1850,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (2).jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "85 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: true,
        featured: false
      },
      {
        title: "Expressive Portrait",
        description: "A bold portrait using expressive brushwork to convey emotion and character.",
        price: 2100,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (3).jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 110 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: true,
        featured: false
      },
      {
        title: "Sculptural Forms",
        description: "An explorative painting investigating sculptural forms and textures through paint application.",
        price: 1950,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.06.jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 3, // Mixed Media
        dimensions: "95 x 120 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: true,
        featured: false
      },
      {
        title: "Minimalist Landscape",
        description: "A subdued landscape with minimal elements creating a sense of calm and spaciousness.",
        price: 1750,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.06 (1).jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 90 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: true,
        featured: false
      },
      {
        title: "Dynamic Composition",
        description: "A dynamic arrangement of shapes and colors creating a sense of movement and energy.",
        price: 1880,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.07.jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: false
      },
      {
        title: "Textural Abstract",
        description: "A highly textured abstract work exploring surface quality and material interaction.",
        price: 1950,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (1).jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 2, // Mixed Media
        collectionId: 1, // Mixed Media
        dimensions: "90 x 95 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: true,
        featured: false
      },
      {
        title: "Serene Waters",
        description: "A peaceful depiction of water and sky with subtle color transitions creating a meditative mood.",
        price: 1780,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (2).jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "85 x 110 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: true,
        featured: false
      },
      {
        title: "Expressionist Landscape",
        description: "A bold expressionist interpretation of landscape elements with expressive brushwork.",
        price: 2100,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.08.jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: false
      },
      {
        title: "Cultural Celebration",
        description: "A vibrant celebration of African cultural motifs and patterns in a contemporary format.",
        price: 2250,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (1).jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 110 cm",
        medium: "Mixed media on canvas",
        year: "2024",
        inStock: true,
        featured: false
      },
      {
        title: "Gestural Abstract",
        description: "A dynamic gestural abstract painting capturing movement and spontaneity through brushwork.",
        price: 1950,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
        artistId: 2, // Koffi Adama
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "95 x 115 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: true,
        featured: false
      },
      {
        title: "Vibrant Landscape",
        description: "A colorful landscape painting with bold hues capturing the vibrant quality of African light.",
        price: 2050,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-15 at 09.30.09.jpeg",
        artistId: 3, // Thabo Mbeki
        categoryId: 2, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: true,
        featured: false
      },
       { 
        title: "Abstract Expressions", 
        description: "From the vibrant strokes of paintings that sing with color to the intricate details of mixed media, this collection showcases the dynamic range of contemporary African art.", 
       price: 1850,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-16 at 11.47.25.jpeg", 
       artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2025",
        inStock: true, 
        featured: false
      },
 { 
        title: "Paintings", 
        description: "Creating a visual narrative that speaks to the heart and soul of African culture, this collection features a range of styles and techniques that celebrate the beauty and diversity of the continent.", 
        price: 1750,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-16 at 11.47.24 (1).jpeg", 
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 130 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: false 
      },
 { 
        title: "Cultural Portraits", 
        description: "A piece that breathes life into space, inviting viewers to explore the rich tapestry of African culture through the lens of contemporary art.", 
        price: 2000,
        imageUrl: "img/artwork/WhatsApp Image 2025-05-16 at 11.47.24.jpeg",
        artistId: 1, // Zinhle Mkhize
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "90 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true, 
        featured: false 
      },

    ];
    
    artworks.forEach(artwork => this.createArtwork(artwork));
    
    // Add sample testimonials
    const testimonials = [
      {
        name: "Sarah Johnson",
        location: "Art Collector, Bulawayo",
        comment: "I was looking for a statement piece for my home office and found the perfect artwork through Imbayedu. The quality exceeded my expectations, and the team was incredibly helpful throughout the entire process.",
        rating: 5,
        featured: true
      },
      {
        name: "Michael Chen",
        location: "Interior Designer, Harare",
        comment: "As an interior designer, I've worked with many art galleries, but Imbayedu stands out for their curated selection of African art. My clients are always impressed with the unique pieces we source from them.",
        rating: 5,
        featured: true
      },
      {
        name: "Elena Sibanda",
        location: "Home Owner, Marondera",
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
    const user: User = { ...insertUser, fullName: insertUser.fullName ?? null, id, isAdmin: false };
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
    const artist: Artist = {
      id,
      name: insertArtist.name,
      bio: insertArtist.bio,
      imageUrl: insertArtist.imageUrl,
      location: insertArtist.location ?? null,
      featured: insertArtist.featured ?? null
    };
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
    const category: Category = { ...insertCategory, id, description: insertCategory.description ?? null };
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
    const collection: Collection = {
      id,
      name: insertCollection.name,
      imageUrl: insertCollection.imageUrl,
      featured: insertCollection.featured ?? null,
      description: insertCollection.description ?? null
    };
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
      collectionId: insertArtwork.collectionId ?? null,
      featured: insertArtwork.featured ?? null,
      dimensions: insertArtwork.dimensions ?? null,
      medium: insertArtwork.medium ?? null,
      year: insertArtwork.year ?? null,
      inStock: insertArtwork.inStock ?? null,
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
        existingItem.quantity + (insertCartItem.quantity ?? 1)
      ) as Promise<CartItem>;
    }
    
    // Create new cart item
    const id = this.cartItemId++;
    const currentDate = new Date();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id, 
      quantity: insertCartItem.quantity ?? 1, 
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
    const testimonial: Testimonial = { ...insertTestimonial, id, featured: insertTestimonial.featured ?? null };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
