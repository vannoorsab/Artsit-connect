import { z } from "zod";

// Firebase-compatible type definitions and validation schemas

// User types and schemas
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  isVerified: z.boolean().optional(),
});

// Category types and schemas
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export const insertCategorySchema = categorySchema;

// Product types and schemas
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  artisanId: string;
  images: string[];
  materials?: string;
  dimensions?: string;
  careInstructions?: string;
  isActive: boolean;
  aiEnhanced?: boolean;
  aiPricingSuggested?: boolean;
  seoTitle?: string;
  marketingCaption?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  artisanId: z.string().min(1, "Artisan ID is required"),
  images: z.array(z.string()).default([]),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  careInstructions: z.string().optional(),
  aiEnhanced: z.boolean().optional(),
  aiPricingSuggested: z.boolean().optional(),
  seoTitle: z.string().optional(),
  marketingCaption: z.string().optional(),
});

export const insertProductSchema = productSchema;

// Inquiry types and schemas
export interface Inquiry {
  id: string;
  productId: string;
  artisanId: string;
  buyerId: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: Date;
}

export const inquirySchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  artisanId: z.string().min(1, "Artisan ID is required"),
  buyerId: z.string().min(1, "Buyer ID is required"),
  message: z.string().min(1, "Message is required"),
  status: z.enum(['pending', 'responded', 'closed']).default('pending'),
});

export const insertInquirySchema = inquirySchema;

// Favorite types and schemas
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

export const favoriteSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
});

export const insertFavoriteSchema = favoriteSchema;

// Review types and schemas
export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  artisanId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  buyerId: z.string().min(1, "Buyer ID is required"),
  artisanId: z.string().min(1, "Artisan ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

export const insertReviewSchema = reviewSchema;

// Legacy type aliases for compatibility
export type UpsertUser = Partial<User> & { id: string };
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
