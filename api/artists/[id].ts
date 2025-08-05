import type { VercelRequest, VercelResponse } from '@vercel/node';

const artists = [
  {
    id: 1,
    name: "Tunga Makoni",
    bio: "Contemporary painter specializing in abstract expressionism and cultural themes. His work explores the intersection of traditional African art with modern techniques, creating pieces that resonate with both local and international audiences.",
    imageUrl: "/img/artwork/artist.png",
    featured: true,
    location: "Harare, Zimbabwe",
    specialties: ["Abstract Art", "Cultural Themes", "Acrylic Painting"],
    education: "National Gallery School of Visual Arts, Harare",
    exhibitions: ["Contemporary African Art, 2023", "Abstract Visions, 2022", "Cultural Narratives, 2021"],
    awards: ["Best Emerging Artist 2020", "Cultural Heritage Award 2021"]
  },
  {
    id: 2,
    name: "Chiedza Mujuru",
    bio: "Mixed media artist and sculptor known for her powerful portraits and cultural commentary. She combines traditional materials with contemporary techniques to create thought-provoking pieces that challenge social norms.",
    imageUrl: "/img/artwork/box.png",
    featured: true,
    location: "Bulawayo, Zimbabwe",
    specialties: ["Portraits", "Mixed Media", "Cultural Art"],
    education: "University of Zimbabwe, Fine Arts",
    exhibitions: ["Women in Art, 2023", "Social Commentary, 2022", "Mixed Visions, 2021"],
    awards: ["Women Artist Award 2022", "Innovation in Art 2021"]
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;
    const artistId = parseInt(id as string);
    
    if (isNaN(artistId)) {
      return res.status(400).json({ message: 'Invalid artist ID' });
    }

    const artist = artists.find(art => art.id === artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    res.status(200).json(artist);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}