import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    message: 'Imbayedu Art Collective API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      artists: '/api/artists',
      artworks: '/api/artworks'
    },
    timestamp: new Date().toISOString()
  });
} 