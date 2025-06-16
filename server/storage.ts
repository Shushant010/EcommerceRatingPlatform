import { 
  users, 
  products, 
  reviews,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Review,
  type InsertReview,
  type ProductWithReviews,
  type ReviewWithUser
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductWithReviews(id: number): Promise<ProductWithReviews | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Review methods
  getReviewsByProduct(productId: number): Promise<ReviewWithUser[]>;
  getUserReviewForProduct(userId: number, productId: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getProductStats(productId: number): Promise<{ averageRating: number; reviewCount: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductWithReviews(id: number): Promise<ProductWithReviews | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;

    const productReviews = await this.getReviewsByProduct(id);
    const stats = await this.getProductStats(id);

    return {
      ...product,
      reviews: productReviews,
      averageRating: stats.averageRating,
      reviewCount: stats.reviewCount,
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getReviewsByProduct(productId: number): Promise<ReviewWithUser[]> {
    return await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        productId: reviews.productId,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(sql`${reviews.createdAt} DESC`);
  }

  async getUserReviewForProduct(userId: number, productId: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)));
    return review || undefined;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async getProductStats(productId: number): Promise<{ averageRating: number; reviewCount: number }> {
    const [stats] = await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    return {
      averageRating: Number(stats.averageRating) || 0,
      reviewCount: Number(stats.reviewCount) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
