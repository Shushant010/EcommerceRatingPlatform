import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = insertUserSchema.extend({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // In a real app, you'd hash the password
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      
      // Add stats for each product
      const productsWithStats = await Promise.all(
        products.map(async (product) => {
          const stats = await storage.getProductStats(product.id);
          return {
            ...product,
            averageRating: stats.averageRating,
            reviewCount: stats.reviewCount,
          };
        })
      );

      res.json(productsWithStats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProductWithReviews(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Review routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Check if user already reviewed this product
      const existingReview = await storage.getUserReviewForProduct(
        reviewData.userId,
        reviewData.productId
      );
      
      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this product" });
      }

      // Verify user and product exist
      const user = await storage.getUser(reviewData.userId);
      const product = await storage.getProduct(reviewData.productId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const reviews = await storage.getReviewsByProduct(id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Check if user has reviewed a product
  app.get("/api/reviews/check", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const productId = parseInt(req.query.productId as string);
      
      if (isNaN(userId) || isNaN(productId)) {
        return res.status(400).json({ message: "Invalid user or product ID" });
      }

      const review = await storage.getUserReviewForProduct(userId, productId);
      res.json({ hasReviewed: !!review });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
