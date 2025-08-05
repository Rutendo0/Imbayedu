import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Return mock data for now
    res.status(200).json([
      {
        id: 1,
        title: "Abstract Expression",
        artistId: 1,
        artist: "Tunga Makoni",
        price: 2500,
        imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
        inStock: true,
        category: "Painting",
        featured: true
      },
      {
        id: 2,
        title: "Royal Portrait",
        artistId: 1,
        artist: "Tunga Makoni",
        price: 3000,
        imageUrl: "/img/artwork/royal.png",
        inStock: true,
        category: "Painting",
        featured: true
      }
    ]);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}