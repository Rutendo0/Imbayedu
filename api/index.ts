import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { storage } from '../server/storage';
import rateLimit from 'express-rate-limit';

const app = express();

// Configure trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// Initialize the app with routes
let initialized = false;

async function initializeApp() {
  if (!initialized) {
    await registerRoutes(app);
    
    // Initialize data storage
    class MemStorage {
      public initializeData() {
        // initialization code
      }
    }
    const memStorage = new MemStorage();
    memStorage.initializeData();
    
    initialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeApp();
  
  // Create express-compatible request/response objects
  const expressReq = req as any;
  const expressRes = res as any;
  
  app(expressReq, expressRes);
} 