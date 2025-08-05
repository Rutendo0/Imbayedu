import type { VercelRequest, VercelResponse } from '@vercel/node';

const collections = [
  {
    id: 1,
    name: "Abstract Expressions",
    imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
    featured: true,
    description: "A curated collection of contemporary abstract works that explore African themes through modern artistic techniques."
  },
  {
    id: 2,
    name: "Cultural Portraits",
    imageUrl: "/img/artwork/royal.png",
    featured: true,
    description: "Powerful portraits that celebrate African identity, heritage, and contemporary social narratives."
  },
  {
    id: 3,
    name: "Modern Heritage",
    imageUrl: "/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24.jpeg",
    featured: true,
    description: "Works that bridge traditional African art forms with contemporary artistic expression."
  },
  {
    id: 4,
    name: "Urban Visions",
    imageUrl: "/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24 (1).jpeg",
    featured: false,
    description: "Contemporary works that capture the essence of modern African urban life."
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(collections);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}