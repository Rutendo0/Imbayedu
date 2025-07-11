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
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// For development, fall back to in-memory storage if database connection fails
const DATABASE_URL = "postgres://postgres:postgres@0.0.0.0:5432/artgallery";
let client;
let db;

try {
  client = postgres(DATABASE_URL);
  db = drizzle(client, { schema: { users, artists, categories, collections, artworks, cartItems, testimonials } });
} catch (error) {
  console.error('Failed to connect to PostgreSQL:', error);
  // Will fall back to in-memory storage
}

export class PostgresStorage implements IStorage {
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
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg", 
        featured: true 
      },
      { 
        name: "Cultural Portraits", 
        description: "Celebrating African heritage and identity through vibrant expressions", 
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (2).jpeg", 
        featured: true 
      },
      { 
        name: "Mixed Media", 
        description: "Contemporary techniques with traditional influences and textural exploration", 
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04 (1).jpeg", 
        featured: true 
      },

    ];

    collections.forEach(collection => this.createCollection(collection));

    // Add artists associated with Imbayedu artworks
    const artists = [
      {
        name: "Tunga Makoni",
        bio: "Contemporary painter specializing in portrait art that captures the essence of African identity and heritage through vibrant colors and expressive brushwork. Her work celebrates cultural pride and explores themes of tradition in modern contexts.",
        imageUrl: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.33_a0ff7f2e.jpg",
        featured: true,
        location: "Harare, Zimbabwe"
      },
     
    
      {
        name: "O'Neal Tanaka Maisiri ",
        bio: "O'Neal Tanaka Maisiri is a Zimbabwean artist whose abstract paintings reflect a deep connection to his environment. Using bold colors and dynamic compositions, he conveys the energy and emotions of his surroundings.",
        imageUrl: "/img/artwork/artist.png",
        featured: true,
        location: "Harare, Zimbabwe"
      }
    ];

    artists.forEach(artist => this.createArtist(artist));

    // Add all artworks with actual Imbayedu pieces
    const artworks = [
        
{
        title: "Family",
        description: "A vibrant portrait the beauty of family relations.",
        price: 0,
        imageUrl: "/img/artwork/WhatsApp Image 2025-06-24 at 04.32.13.jpg", 
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: true,
        artistId: 0
      },

      {
        title: "Blending Colours",
        description: "A vibrant portrait.",
        price: 279,
        imageUrl: "/img/artwork/WhatsApp Image 2025-06-24 at 07.18.28.jpg", 
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: true,
        artistId: 1
      },
      {
        title: "Abstract Spirit",
        description: "A vibrant portrait celebrating African heritage with bold colors and expressive brushwork.",
        price: 250,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.27.21.jpeg", 
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Sunset Reflections",
        description: "A captivating landscape depicting the warm hues of an African sunset reflecting over water.",
        price: 300,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.27.23.jpeg", 
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 100 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Nature's Harmony",
        description: "An exploration of natural forms and patterns through a rich tapestry of colors and textures.",
        price: 500,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.27.24.jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "70 x 90 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Abstract Emotion",
        description: "A powerful abstract piece exploring the depths of human emotion through color and form.",
        price: 260,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.29.57.jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Cultural Heritage",
        description: "A celebration of African cultural heritage through symbolic imagery and traditional patterns.",
        price: 290,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.29.59.jpeg",
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Cultural Heritage",
        description: "A celebration of African cultural heritage through symbolic imagery and traditional patterns",
        price: 290,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.00.jpeg",
        categoryId: 1, // Mixed Media
        collectionId: 2, // Mixed Media
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Cultural Heritage",
        description: "A celebration of African cultural heritage through symbolic imagery and traditional patterns",  
        price: 290,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.00 (1).jpeg",
        categoryId: 1, // Paintings
        collectionId: 2, // Abstract Expressions
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Colorful Abstraction",
        description: "A vibrant abstract composition with bold colors and dynamic forms creating visual harmony.",
        price: 420,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.00 (2).jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 80 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Colorful Abstraction",
        description: "A vibrant abstract composition with bold colors and dynamic forms creating visual harmony.",
        price: 420,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.01.jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 80 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
{
        title: "Dynamic Harmony",
        description: "An abstract composition that explores the interplay of shapes and colors, creating a sense of rhythm and balance.",
        price: 280,
        imageUrl: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.32 (2).jpg",
        categoryId: 1,
        collectionId: 1,
        dimensions: "100 x 100 cm",
        medium: "Collage on canvas",
        year: "2022",
        inStock: false,
        featured: true,
        artistId: 1
      },

      {
        title: "Colorful Abstraction",
        description: "A vibrant abstract composition with bold colors and dynamic forms creating visual harmony.",
        price: 420,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.01 (1).jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Cultural Portraits
        dimensions: "80 x 80 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Abstract Patterns",
        description: "A mesmerizing exploration of patterns and textures through abstract composition.",
        price: 530,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02.jpeg",
         categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Abstract Patterns",
        description: "A mesmerizing exploration of patterns and textures through abstract composition.",
        price: 530,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (1).jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Abstract Patterns",
        description: "A mesmerizing exploration of patterns and textures through abstract composition.",
        price: 530,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (2).jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 100 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Cultural Tapestry",
        description: "A vibrant representation of African cultural elements woven together in a harmonious composition.",
        price: 460,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03.jpeg",
        categoryId: 2, // Mixed Media
        collectionId: 1, // Cultural Portraits
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Cultural Tapestry",
        description: "A vibrant representation of African cultural elements woven together in a harmonious composition.",
        price: 460,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (1).jpeg",
        categoryId: 2, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Soulful Portrait",
        description: "A soulful portrait that captures the depth and spirit of its subject through expressive techniques.",
        price: 580,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (2).jpeg",
        categoryId: 2, // Mixed Media
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Soulful Portrait",
        description: "A soulful portrait that captures the depth and spirit of its subject through expressive techniques.",
        price: 580,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg",
        categoryId: 2, // Paintings
        collectionId: 2, // Abstract Expressions
        dimensions: "90 x 120 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Vibrant Abstraction",
        description: "A colorful abstract piece with geometric elements creating a sense of movement and rhythm.",
        price: 569,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05.jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "85 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: false,
        featured: true,
        artistId: 1
      },
      {
        title: "Vibrant Abstraction",
        description: "A colorful abstract piece with geometric elements creating a sense of movement and rhythm.",
        price: 569,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (2).jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "85 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2023",
        inStock: false,
        featured: false,
        artistId: 1
      },
      {
        title: "Expressive Portrait",
        description: "A bold portrait using expressive brushwork to convey emotion and character.",
        price: 390,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (3).jpeg",
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 110 cm",
        medium: "Oil on canvas",
        year: "2024",
        inStock: false,
        featured: false,
        artistId: 1
      },
      {
        title: "Dynamic Composition",
        description: "A dynamic arrangement of shapes and colors creating a sense of movement and energy.",
        price: 410,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07.jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: false,
        artistId: 1
      },
      {
        title: "Textural Abstract",
        description: "A highly textured abstract work exploring surface quality and material interaction.",
        price: 325,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (1).jpeg",
        categoryId: 2, // Mixed Media
        collectionId: 1, // Mixed Media
        dimensions: "90 x 95 cm",
        medium: "Mixed media on canvas",
        year: "2023",
        inStock: false,
        featured: false,
        artistId: 1
      },
      {
        title: "Serene Waters",
        description: "A peaceful depiction of water and sky with subtle color transitions creating a meditative mood.",
        price: 290,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (2).jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "85 x 110 cm",
        medium: "Oil on canvas",
        year: "2023",
        inStock: false,
        featured: false,
        artistId: 1
      },
      {
        title: "Expressionist Landscape",
        description: "A bold expressionist interpretation of landscape elements with expressive brushwork.",
        price: 500,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08.jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "100 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: false,
        artistId: 1
      },
      {
        title: "Cultural Celebration",
        description: "A vibrant celebration of African cultural motifs and patterns in a contemporary format.",
        price: 250,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (1).jpeg",
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 110 cm",
        medium: "Mixed media on canvas",
        year: "2024",
        inStock: false,
        featured: false,
        artistId: 1
      },
      {
        title: "Gestural Abstract",
        description: "A dynamic gestural abstract painting capturing movement and spontaneity through brushwork.",
        price: 600,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.09.jpeg",
        categoryId: 2, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "95 x 115 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: false,
        artistId: 1
      },
       { 
        title: "Abstract Expressions", 
        description: "From the vibrant strokes of paintings that sing with color to the intricate details of mixed media, this collection showcases the dynamic range of contemporary African art.", 
       price: 550,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-16 at 11.47.25.jpeg", 
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2025",
        inStock: false, 
        featured: false,
        artistId: 1
      },
 { 
        title: "Paintings", 
        description: "Creating a visual narrative that speaks to the heart and soul of African culture, this collection features a range of styles and techniques that celebrate the beauty and diversity of the continent.", 
        price: 385,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24 (1).jpeg", 
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "80 x 130 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false,
        featured: false,
        artistId: 1
      },
 { 
        title: "Cultural Portraits", 
        description: "A piece that breathes life into space, inviting viewers to explore the rich tapestry of African culture through the lens of contemporary art.", 
        price: 575,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24.jpeg",
        categoryId: 1, // Paintings
        collectionId: 1, // Abstract Expressions
        dimensions: "90 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: false, 
        featured: false,
        artistId: 1
      },

       {
        title: "A ROYAL AFRICAN DIALECT",
        description: " The bi-associative and symbolic diction in the title of the work highlights the African affinities we share as African people.  This painting highlights the unified empathy of a people under threat during the restrictive times of COVID-19",
        price: 800,
        imageUrl: "/img/artwork/royal.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "126 cm x 73 cm ",
        medium: "oil, acrylic, pastel on canvas",
        year: "2021",
        inStock: true,
        featured: false
      },

       {
        title: "BLOOMING DESIRE",
        description: "The artwork Blooming Desire is presented in an effortless flow of paint with rippling harmonies, melodious squiggles and an ultra spontaneous mode of application. In painterly automatism, this capricious work has amorous overtones, revealed in the stemming of a heart symbol juxtaposed with a rose bloom.  ",
        price: 950,
        imageUrl: "/img/artwork/box.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "38 cm x 38cm x 5cm",
        medium: "oil on canvas",
        year: "2024",
        inStock: true,
        featured: false
      },

       {
        title: "FIGHT FLIGHT",
        description: "A pun on the workings of adrenaline on the body, the image of an aeroplane taking off symbolizes the economic migration that has beset the youth of the nation.  In a search for better opportunities, employment and economic survival, Zimbabwean youths are experiencing growing up isolated in today’s broken up families.",
        price: 900,
        imageUrl: "/img/artwork/flight.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "194 cm X 54 cm",
        medium: "acrylic, ink on wood ",
        year: "2024",
        inStock: true,
        featured: false
      },
       {
        title: "UNTITLED X",
        description: "Untitled X is a work inspired by apocalyptic revelations in the Bible.   An outline of a skull entwined in the digital age of Starlink, Twitter, X and other global digital platforms harken the end times for man.",
        price: 1000,
        imageUrl: "/img/artwork/unit.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "190 cm x 135 cm ",
        medium: "oil acrylic ink and pastel on wood",
        year: "2024",
        inStock: true,
        featured: false
      },
       {
        title: "TRANSCENDENT",
        description: "In this painting the artist reminiscence about his close spiritual relationship with his late mother and how her intuition protected him from the dangerous follies of life.  Likening her intuition to an out of body experience, the artist depicts his thoughts in a surreal manner where a disjointed head hovers over his work.   This painting has layers of meaning  that question our physical and spiritual existence.",
        price: 985,
        imageUrl: "/img/artwork/UNIT3.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "120 cm X 43 cm",
        medium: "acrylic, oil, ink and pastel on canvas",
        year: "2024",
        inStock: true,
        featured: false
      },
       {
        title: "CAPPIN' VANITIES",
        description: "In local urban slang, the term capping means to tell exaggerated lies to impress one's peers. Maisiri makes a penetrating statement about the vanities and false identitiesexhibited by the youth of today. In this urban landscape the social critic uses collage of torn bank notes and faces from popular social and fashion magazines to express the pseudo identities and materialism sought by his urban peers.",
        price: 920,
        imageUrl: "/img/artwork/capp.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "120 x 38 cm",
        medium: "oil, acrylic, ink on plastic, paper and canvas",
        year: "2024",
        inStock: true,
        featured: false
      },
       {
        title: "GIRLS DESERVE THEIR FLOWERS",
        description: "Here Maisiri interrogates social norms and etiquette of placing flowers at gravesites or presenting a female with flowers as a gesture of affection.  Squiggles of white ‘iceberg’ roses snd graffiti, reading; ‘ Girls Deserve their Flowers’ occupy the left foreground of the painting as a reminder  of the importance of the moment and the  worthiness of women.",
        price: 830,
        imageUrl: "/img/artwork/girls.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "56 x 63 cm",
        medium: "acrylic, oil, ink, pastel, embroidery threads and found objects",
        year: "2024",
        inStock: true,
        featured: false
      },
       {
        title: "MUDIWA",
        description: "The Shona word Mudiwa means beloved one.  In this work Maisiri depicts an exaggerated female hand pointing to the viewer in the manner of the famous Lord Kitchener World War II poster - Your Country Needs You, calling on youths to enlist.  Here the gender sensitive artist reconstitutes the image in a socioreligious way that is locally relevant and directed to the female youth of Zimbabwe",
        price: 1000,
        imageUrl: "/img/artwork/mudiwa.png",
        artistId: 2,
        categoryId: 1,
        collectionId: 1,
        dimensions: "100 x 100 cm",
        medium: "acrylic, oil, ink, plastic and glass on canvas",
        year: "2022",
        inStock: true,
        featured: false
      },
      {
        title: "Waves of Change",
        description: "A dynamic abstract piece that captures the essence of movement and transformation through fluid brushstrokes and vibrant colors.",
        price: 500,
        imageUrl: "/img/artwork/WhatsApp Image 2025-06-10 at 07.59.33_a0ff7f2e.jpg",
        artistId: 1,
        categoryId: 2,
        collectionId: 1,
        dimensions: "100 x 100 cm",
        medium: "Acrylic on canvas",
        year: "2022",
        inStock: false,
        featured: true
      },
      {
        title: "Family",
        description: "A vibrant portrait the beauty of family relations.",
        price: 0,
        imageUrl: "/img/artwork/WhatsApp Image 2025-06-24 at 04.32.13.jpg", 
        categoryId: 1, // Paintings
        collectionId: 2, // Cultural Portraits
        dimensions: "90 x 120 cm",
        medium: "Acrylic on canvas",
        year: "2024",
        inStock: true,
        featured: true,
        artistId: 0
      },
    
    ];

    artworks.forEach(artwork => this.createArtwork(artwork));

    // Add sample testimonials
    const testimonials = [
      {
        name: "Sarah Shumba",
        location: "Art Collector, Bulawayo",
        comment: "I was looking for a statement piece for my home office and found the perfect artwork through Imbayedu. The quality exceeded my expectations, and the team was incredibly helpful throughout the entire process.",
        rating: 5,
        featured: true
      },
      {
        name: "Tafadzwa Jaka",
        location: "Interior Designer, Harare",
        comment: "As an interior designer, I've worked with many art galleries, but Imbayedu stands out for their curated selection of African art. My clients are always impressed with the unique pieces we source from them.",
        rating: 5,
        featured: true
      },
      {
        name: "Natasha Sibanda",
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
  async getArtists():Promise<Artist[]> {
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
        const artist = artwork.artistId > 0 ? await this.getArtist(artwork.artistId) : undefined;
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

    const artist = artwork.artistId > 0 ? await this.getArtist(artwork.artistId) : undefined;
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

export const storage = new PostgresStorage();