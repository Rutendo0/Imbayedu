import type { VercelRequest, VercelResponse } from '@vercel/node';

const categories = [
  {
    id: 1,
    name: "Paintings",
    description: "Original paintings in various styles and mediums"
  },
  {
    id: 2,
    name: "Sculptures",
    description: "Three-dimensional artworks in various materials"
  },
  {
    id: 3,
    name: "Photography",
    description: "Contemporary and artistic photography"
  },
  {
    id: 4,
    name: "Mixed Media",
    description: "Artworks combining multiple mediums and techniques"
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(categories);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}