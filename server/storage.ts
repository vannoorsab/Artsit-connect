import {
  users,
  categories,
  products,
  inquiries,
  favorites,
  reviews,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Inquiry,
  type InsertInquiry,
  type Favorite,
  type InsertFavorite,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(filters?: { categoryId?: string; search?: string; artisanId?: string }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Inquiry operations
  getInquiries(userId: string): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry>;
  
  // Favorite operations
  getFavorites(userId: string): Promise<Product[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, productId: string): Promise<void>;
  
  // Review operations
  getReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Analytics
  getArtisanStats(artisanId: string): Promise<{
    totalProducts: number;
    totalInquiries: number;
    averageRating: number;
    totalReviews: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Product operations
  async getProducts(filters?: { categoryId?: string; search?: string; artisanId?: string }): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isActive, true));
    
    if (filters?.categoryId) {
      query = query.where(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.search) {
      query = query.where(
        ilike(products.title, `%${filters.search}%`)
      );
    }
    
    if (filters?.artisanId) {
      query = query.where(eq(products.artisanId, filters.artisanId));
    }
    
    return query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  // Inquiry operations
  async getInquiries(userId: string): Promise<Inquiry[]> {
    return db.select().from(inquiries)
      .where(eq(inquiries.artisanId, userId))
      .orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  // Favorite operations
  async getFavorites(userId: string): Promise<Product[]> {
    const favoriteProducts = await db
      .select()
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, userId));
    
    return favoriteProducts.map(fp => fp.products);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async removeFavorite(userId: string, productId: string): Promise<void> {
    await db.delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));
  }

  // Review operations
  async getReviews(productId: string): Promise<Review[]> {
    return db.select().from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Analytics
  async getArtisanStats(artisanId: string): Promise<{
    totalProducts: number;
    totalInquiries: number;
    averageRating: number;
    totalReviews: number;
  }> {
    const totalProducts = await db
      .select({ count: sql`count(*)` })
      .from(products)
      .where(and(eq(products.artisanId, artisanId), eq(products.isActive, true)));

    const totalInquiries = await db
      .select({ count: sql`count(*)` })
      .from(inquiries)
      .where(eq(inquiries.artisanId, artisanId));

    const reviewStats = await db
      .select({
        avgRating: sql`avg(${reviews.rating})`,
        count: sql`count(*)`
      })
      .from(reviews)
      .where(eq(reviews.artisanId, artisanId));

    return {
      totalProducts: Number(totalProducts[0]?.count || 0),
      totalInquiries: Number(totalInquiries[0]?.count || 0),
      averageRating: Number(reviewStats[0]?.avgRating || 0),
      totalReviews: Number(reviewStats[0]?.count || 0),
    };
  }
}

export const storage = new DatabaseStorage();
