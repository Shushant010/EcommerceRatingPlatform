import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Use the shared insertUserSchema directly to match the form payload
const registerSchema = insertUserSchema;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);

      // Check if user already exists by email or username
      const existingByEmail = await storage.getUserByEmail(userData.email);
      if (existingByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const existingByUsername = await storage.getUserByUsername(userData.username);
      if (existingByUsername) {
        return res.status(400).json({ message: "Username already taken" });
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
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // No such user
        return res.status(404).json({ message: "User not found" });
      }
      if (user.password !== password) {
        // Password mismatch
        return res.status(401).json({ message: "Incorrect password" });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
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
      console.error("Get products error:", error);
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
      console.error("Get product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Review routes
app.post("/api/reviews", async (req, res) => {
  try {
    const { userId, productId, rating, title, content } = req.body;

    // Custom validation: ensure at least rating or content is provided
    const trimmedContent = content?.trim();
    const hasRating = rating && rating >= 1 && rating <= 5;
    const hasContent = trimmedContent && trimmedContent.length > 0;

    if (!hasRating && !hasContent) {
      return res.status(400).json({ 
        message: "Please provide either a star rating or review content" 
      });
    }

    // Validate required fields
    if (!userId || !productId) {
      return res.status(400).json({ 
        message: "User ID and Product ID are required" 
      });
    }

    // Check if user already reviewed this product
    const existingReview = await storage.getUserReviewForProduct(
      userId,
      productId
    );

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Verify user and product exist
    const reviewer = await storage.getUser(userId);
    const product = await storage.getProduct(productId);

    if (!reviewer) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prepare review data - explicitly handle null/undefined for optional fields
    const reviewData = {
      userId,
      productId,
      rating: hasRating ? rating : 0,
      title: title?.trim() || " ",
      content: hasContent ? trimmedContent : " "
    };

    console.log("Review data being sent to storage:", reviewData);

    const review = await storage.createReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
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
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

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
      console.error("Check review error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
