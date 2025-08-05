import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the dist directory
app.use('/assets', express.static(path.join(__dirname, '../dist/public/assets')));
app.use(express.static(path.join(__dirname, '../dist/public')));

// Simple API endpoints for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/api/artists', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Tunga Makoni",
      bio: "Contemporary painter specializing in portrait art",
      imageUrl: "/img/artwork/artist.png",
      featured: true,
      location: "Harare, Zimbabwe"
    }
  ]);
});

app.get('/api/artworks', (req, res) => {
  res.json([
    {
      id: 1,
      title: "Abstract Expression",
      artistId: 1,
      price: 2500,
      imageUrl: "/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg",
      inStock: true
    }
  ]);
});

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve the React app for all other routes
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

export default app; 