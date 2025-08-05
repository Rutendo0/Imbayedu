import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample artwork data with full details
const artworksWithDetails = [
  {
    id: 1,
    title: "Abstract Expressions",
    description: "A vivid exploration of contemporary African themes through abstract expressionism.",
    price: 1200,
    imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
    categoryId: 1,
    collectionId: 1,
    dimensions: "100 x 120 cm",
    medium: "Acrylic on canvas",
    year: "2024",
    inStock: true,
    featured: true,
    artistId: 1,
    createdAt: "2024-01-15T00:00:00Z",
    artist: {
      id: 1,
      name: "Tunga Makoni",
      bio: "Contemporary painter specializing in abstract expressionism",
      imageUrl: "/img/artwork/artist.png",
      featured: true,
      location: "Harare, Zimbabwe"
    },
    category: {
      id: 1,
      name: "Paintings",
      description: "Original paintings in various styles"
    },
    collection: {
      id: 1,
      name: "Abstract Expressions",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
      featured: true,
      description: "Contemporary abstract works"
    }
  },
  {
    id: 2,
    title: "Royal Portrait",
    description: "A majestic portrait celebrating African royalty and heritage.",
    price: 3000,
    imageUrl: "/img/artwork/royal.png",
    categoryId: 1,
    collectionId: 1,
    dimensions: "126 x 73 cm",
    medium: "Oil, acrylic, pastel on canvas",
    year: "2021",
    inStock: true,
    featured: true,
    artistId: 2,
    createdAt: "2021-08-10T00:00:00Z",
    artist: {
      id: 2,
      name: "Featured Artist",
      bio: "Portrait and cultural artist",
      imageUrl: "/img/artwork/box.png",
      featured: true,
      location: "Zimbabwe"
    },
    category: {
      id: 1,
      name: "Paintings",
      description: "Original paintings in various styles"
    },
    collection: {
      id: 1,
      name: "Abstract Expressions",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
      featured: true,
      description: "Contemporary abstract works"
    }
  },
  {
    id: 3,
    title: "Cultural Heritage",
    description: "A piece that breathes life into space, celebrating African culture.",
    price: 575,
    imageUrl: "/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24.jpeg",
    categoryId: 1,
    collectionId: 1,
    dimensions: "90 x 120 cm",
    medium: "Acrylic on canvas",
    year: "2024",
    inStock: true,
    featured: false,
    artistId: 1,
    createdAt: "2024-03-20T00:00:00Z",
    artist: {
      id: 1,
      name: "Tunga Makoni",
      bio: "Contemporary painter specializing in abstract expressionism",
      imageUrl: "/img/artwork/artist.png",
      featured: true,
      location: "Harare, Zimbabwe"
    },
    category: {
      id: 1,
      name: "Paintings",
      description: "Original paintings in various styles"
    },
    collection: {
      id: 1,
      name: "Abstract Expressions",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
      featured: true,
      description: "Contemporary abstract works"
    }
  },
  {
    id: 4,
    title: "Modern Interpretation",
    description: "Creating a visual narrative that speaks to contemporary African art.",
    price: 385,
    imageUrl: "/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24 (1).jpeg",
    categoryId: 1,
    collectionId: 1,
    dimensions: "80 x 130 cm",
    medium: "Acrylic on canvas",
    year: "2024",
    inStock: false,
    featured: false,
    artistId: 1,
    createdAt: "2024-02-15T00:00:00Z",
    artist: {
      id: 1,
      name: "Tunga Makoni",
      bio: "Contemporary painter specializing in abstract expressionism",
      imageUrl: "/img/artwork/artist.png",
      featured: true,
      location: "Harare, Zimbabwe"
    },
    category: {
      id: 1,
      name: "Paintings",
      description: "Original paintings in various styles"
    },
    collection: {
      id: 1,
      name: "Abstract Expressions",
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
      featured: true,
      description: "Contemporary abstract works"
    }
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(artworksWithDetails);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}