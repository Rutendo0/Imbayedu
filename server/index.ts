import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

import { fileURLToPath } from 'url';
import { storage } from "./storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure trust proxy for rate limiting
app.set('trust proxy', 1);

// Apply rate limiter to all requests
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Improved static file serving for both development and production
const publicPath = process.env.NODE_ENV === "production" 
  ? path.join(__dirname, '../public')
  : path.join(__dirname, '../../public');


// Update static file serving section in index.ts
if (process.env.NODE_ENV === "production") {
  // Serve static assets from dist/public in production
  app.use('/assets', express.static(path.join(__dirname, '../public/assets'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));
  app.use(express.static(path.join(__dirname, '../public')));
} else {
  // Serve static assets from client/dist/assets in development
  app.use('/assets', express.static(path.join(__dirname, '../../client/dist/assets')));
  app.use(express.static(path.join(__dirname, '../../public')));
}

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });
  next();
});

// Error handling middleware
// ...existing code...
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err); // Better error logging
});

(async () => {
  const server = await registerRoutes(app);

  // Initialize data storage
  class MemStorage {
    public initializeData() {
      // initialization code
    }
  }
  const memStorage = new MemStorage();
  memStorage.initializeData();

  // Production static file serving
  if (process.env.NODE_ENV === "production") {
    // Serve static files from the dist/public directory
    app.use(express.static(path.join(__dirname, "../public")));

    app.get("*", (req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      // For client-side routing, send the index.html
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });
  }

  // Vite setup for development
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Local development server when not on Vercel
  if (!process.env.VERCEL) {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Server running on http://0.0.0.0:${port}`);
    });
  }
 })();

export default app;
