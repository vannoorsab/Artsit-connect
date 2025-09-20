import { adminDb } from "./firebase";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

// Firebase collection names
const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  INQUIRIES: 'inquiries',
  FAVORITES: 'favorites',
  REVIEWS: 'reviews'
};

// Type definitions for Firebase documents
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  isVerified?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
}

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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Inquiry {
  id: string;
  productId: string;
  artisanId: string;
  buyerId: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: Timestamp;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  artisanId: string;
  rating: number;
  comment?: string;
  createdAt: Timestamp;
}

export const storage = {
  // User operations
  async getUser(id: string): Promise<User | null> {
    try {
      const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(id).get();
      if (!userDoc.exists) {
        return null;
      }
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  async upsertUser(userData: Partial<User> & { id: string }): Promise<User> {
    try {
      const userRef = adminDb.collection(COLLECTIONS.USERS).doc(userData.id);
      const now = Timestamp.now();

      const userDoc = await userRef.get();
      const data = {
        ...userData,
        updatedAt: now,
        ...(userDoc.exists ? {} : { createdAt: now })
      };

      await userRef.set(data, { merge: true });
      return { id: userData.id, ...data } as User;
    } catch (error) {
      console.error("Error upserting user:", error);
      throw error;
    }
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    try {
      const snapshot = await adminDb.collection(COLLECTIONS.CATEGORIES).orderBy('name').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
  },

  async createCategory(categoryData: { name: string; description?: string }): Promise<Category> {
    try {
      const data = {
        ...categoryData,
        createdAt: Timestamp.now()
      };
      const docRef = await adminDb.collection(COLLECTIONS.CATEGORIES).add(data);
      return { id: docRef.id, ...data } as Category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Product operations
  async getProducts(filters: {
    categoryId?: string;
    search?: string;
    artisanId?: string;
  }): Promise<Product[]> {
    try {
      let query = adminDb.collection(COLLECTIONS.PRODUCTS)
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc');

      // Note: Firebase doesn't support multiple where clauses with different fields efficiently
      // We'll filter in memory for now, but for production you might want to use composite indexes
      const snapshot = await query.get();
      let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

      // Apply filters
      if (filters.categoryId) {
        products = products.filter(p => p.categoryId === filters.categoryId);
      }
      if (filters.artisanId) {
        products = products.filter(p => p.artisanId === filters.artisanId);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }

      return products;
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const productDoc = await adminDb.collection(COLLECTIONS.PRODUCTS).doc(id).get();
      if (!productDoc.exists) {
        return null;
      }
      return { id: productDoc.id, ...productDoc.data() } as Product;
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const now = Timestamp.now();
      const data = {
        ...productData,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };
      const docRef = await adminDb.collection(COLLECTIONS.PRODUCTS).add(data);
      return { id: docRef.id, ...data } as Product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const productRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      await productRef.update(updateData);

      const updatedDoc = await productRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const productRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(id);
      await productRef.update({
        isActive: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Inquiry operations
  async getInquiries(artisanId: string): Promise<Inquiry[]> {
    try {
      const snapshot = await adminDb.collection(COLLECTIONS.INQUIRIES)
        .where('artisanId', '==', artisanId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
    } catch (error) {
      console.error("Error getting inquiries:", error);
      throw error;
    }
  },

  async createInquiry(inquiryData: Omit<Inquiry, 'id' | 'createdAt'>): Promise<Inquiry> {
    try {
      const data = {
        ...inquiryData,
        status: 'pending' as const,
        createdAt: Timestamp.now()
      };
      const docRef = await adminDb.collection(COLLECTIONS.INQUIRIES).add(data);
      return { id: docRef.id, ...data } as Inquiry;
    } catch (error) {
      console.error("Error creating inquiry:", error);
      throw error;
    }
  },

  // Favorites operations
  async getFavorites(userId: string): Promise<Favorite[]> {
    try {
      const snapshot = await adminDb.collection(COLLECTIONS.FAVORITES)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Favorite));
    } catch (error) {
      console.error("Error getting favorites:", error);
      throw error;
    }
  },

  async addFavorite(favoriteData: { userId: string; productId: string }): Promise<Favorite> {
    try {
      const data = {
        ...favoriteData,
        createdAt: Timestamp.now()
      };
      const docRef = await adminDb.collection(COLLECTIONS.FAVORITES).add(data);
      return { id: docRef.id, ...data } as Favorite;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  },

  async removeFavorite(userId: string, productId: string): Promise<void> {
    try {
      const snapshot = await adminDb.collection(COLLECTIONS.FAVORITES)
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .get();

      const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  },

  // Reviews operations
  async getReviews(productId: string): Promise<Review[]> {
    try {
      const snapshot = await adminDb.collection(COLLECTIONS.REVIEWS)
        .where('productId', '==', productId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    } catch (error) {
      console.error("Error getting reviews:", error);
      throw error;
    }
  },

  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    try {
      const data = {
        ...reviewData,
        createdAt: Timestamp.now()
      };
      const docRef = await adminDb.collection(COLLECTIONS.REVIEWS).add(data);
      return { id: docRef.id, ...data } as Review;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Artisan stats
  async getArtisanStats(artisanId: string): Promise<{
    totalProducts: number;
    totalReviews: number;
    averageRating: number;
    totalInquiries: number;
  }> {
    try {
      const [productsSnapshot, reviewsSnapshot, inquiriesSnapshot] = await Promise.all([
        adminDb.collection(COLLECTIONS.PRODUCTS)
          .where('artisanId', '==', artisanId)
          .where('isActive', '==', true)
          .get(),
        adminDb.collection(COLLECTIONS.REVIEWS)
          .where('artisanId', '==', artisanId)
          .get(),
        adminDb.collection(COLLECTIONS.INQUIRIES)
          .where('artisanId', '==', artisanId)
          .get()
      ]);

      const totalProducts = productsSnapshot.size;
      const totalReviews = reviewsSnapshot.size;
      const totalInquiries = inquiriesSnapshot.size;

      // Calculate average rating
      let averageRating = 0;
      if (totalReviews > 0) {
        const totalRating = reviewsSnapshot.docs.reduce((sum, doc) => {
          const review = doc.data() as Review;
          return sum + review.rating;
        }, 0);
        averageRating = totalRating / totalReviews;
      }

      return {
        totalProducts,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        totalInquiries,
      };
    } catch (error) {
      console.error("Error getting artisan stats:", error);
      throw error;
    }
  },
};
