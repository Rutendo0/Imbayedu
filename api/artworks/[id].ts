import type { VercelRequest, VercelResponse } from '@vercel/node';

const artworksWithDetails = [
  {
    id: 1,
    title: "Abstract Expressions",
    description: "A vivid exploration of contemporary African themes through abstract expressionism, this piece combines bold colors with fluid forms to create a dynamic visual experience that speaks to the modern African identity.",
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
    title: "A Royal African Dialect",
    description: "The bi-associative and symbolic diction in the title of the work highlights the African affinities we share as African people. This painting highlights the unified empathy of a people under threat during the restrictive times of COVID-19.",
    price: 800,
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
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;
    const artworkId = parseInt(id as string);
    
    if (isNaN(artworkId)) {
      return res.status(400).json({ message: 'Invalid artwork ID' });
    }

    const artwork = artworksWithDetails.find(art => art.id === artworkId);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    
    res.status(200).json(artwork);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}