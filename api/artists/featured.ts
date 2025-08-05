import type { VercelRequest, VercelResponse } from '@vercel/node';

const featuredArtists = [
  {
    id: 1,
    name: "Tunga Makoni",
    bio: "Contemporary painter specializing in abstract expressionism and cultural themes. His work explores the intersection of traditional African art with modern techniques.",
    imageUrl: "/img/artwork/artist.png",
    featured: true,
    location: "Harare, Zimbabwe",
    specialties: ["Abstract Art", "Cultural Themes", "Acrylic Painting"]
  },
  {
    id: 2,
    name: "Chiedza Mujuru",
    bio: "Mixed media artist and sculptor known for her powerful portraits and cultural commentary. She combines traditional materials with contemporary techniques.",
    imageUrl: "/img/artwork/box.png",
    featured: true,
    location: "Bulawayo, Zimbabwe",
    specialties: ["Portraits", "Mixed Media", "Cultural Art"]
  },
  {
    id: 3,
    name: "Tinashe Gwaza",
    bio: "Photographer and visual artist capturing the essence of modern African life through his lens. His work documents urban and rural narratives.",
    imageUrl: "/img/artwork/artist.png",
    featured: true,
    location: "Mutare, Zimbabwe",
    specialties: ["Photography", "Documentary", "Urban Art"]
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(featuredArtists);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}