import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertArtistSchema, 
  insertCategorySchema, 
  insertCollectionSchema, 
  insertArtworkSchema, 
  insertCartItemSchema, 
  insertTestimonialSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve all images from public directory (skip in Vercel as it's handled by routes)
  if (!process.env.VERCEL) {
    app.use('/img', express.static(path.join(process.cwd(), 'public/img')));
  }

  // API Routes
  // All routes prefixed with /api

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Artists routes
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  app.get("/api/artists/featured", async (req, res) => {
    try {
      const artists = await storage.getFeaturedArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured artists" });
    }
  });

  app.get("/api/artists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }

      const artist = await storage.getArtist(id);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }

      res.json(artist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artist" });
    }
  });

  app.post("/api/artists", async (req, res) => {
    try {
      const validatedData = insertArtistSchema.parse(req.body);
      const artist = await storage.createArtist(validatedData);
      res.status(201).json(artist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid artist data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create artist" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Collections routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/featured", async (req, res) => {
    try {
      const collections = await storage.getFeaturedCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured collections" });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }

      const collection = await storage.getCollection(id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid collection data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create collection" });
    }
  });

  // Artworks routes
  app.get("/api/artworks", async (req, res) => {
    try {
      const { categoryId, artistId, collectionId, featured } = req.query;

      let artworks;

      if (categoryId) {
        artworks = await storage.getArtworksByCategory(parseInt(categoryId as string));
      } else if (artistId) {
        artworks = await storage.getArtworksByArtist(parseInt(artistId as string));
      } else if (collectionId) {
        artworks = await storage.getArtworksByCollection(parseInt(collectionId as string));
      } else if (featured === 'true') {
        artworks = await storage.getFeaturedArtworks();
      } else {
        artworks = await storage.getArtworks();
      }

      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artworks" });
    }
  });

  app.get("/api/artworks/details", async (req, res) => {
    try {
      const artworks = await storage.getArtworksWithDetails();
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artworks with details" });
    }
  });

  app.get("/api/artworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artwork ID" });
      }

      const artwork = await storage.getArtworkWithDetails(id);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      res.json(artwork);
    } catch (error) {
      console.error('Error fetching artwork:', error);
      res.status(500).json({ message: "Failed to fetch artwork" });
    }
  });

  app.post("/api/artworks", async (req, res) => {
    try {
      const validatedData = insertArtworkSchema.parse(req.body);
      const artwork = await storage.createArtwork(validatedData);
      res.status(201).json(artwork);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid artwork data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create artwork" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.get("/api/cart/:userId/details", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const cartItems = await storage.getCartItemsWithDetails(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items with details" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.createCartItem(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await storage.updateCartItemQuantity(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const success = await storage.removeCartItem(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      await storage.clearCart(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/featured", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}