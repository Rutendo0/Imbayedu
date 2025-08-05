import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Return mock data for now
    res.status(200).json([
      {
        id: 1,
        name: "Tunga Makoni",
        bio: "Contemporary painter specializing in portrait art",
        imageUrl: "/img/artwork/artist.png",
        featured: true,
        location: "Harare, Zimbabwe"
      },
      {
        id: 2,
        name: "Sample Artist",
        bio: "Mixed media artist",
        imageUrl: "/img/artwork/box.png",
        featured: false,
        location: "Zimbabwe"
      }
    ]);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}