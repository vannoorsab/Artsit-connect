import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generatePricingSuggestion, 
  generateMarketingContent, 
  enhanceArtisanStory,
  analyzeProductImage 
} from "./openai";
import { 
  insertProductSchema, 
  insertInquirySchema, 
  insertReviewSchema,
  insertCategorySchema 
} from "@shared/schema";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { categoryId, search, artisanId } = req.query;
      const products = await storage.getProducts({
        categoryId: categoryId as string,
        search: search as string,
        artisanId: artisanId as string
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, upload.array('images', 10), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = req.files as Express.Multer.File[];
      const imagePaths = files?.map(file => `/uploads/${file.filename}`) || [];
      
      const productData = insertProductSchema.parse({
        ...req.body,
        artisanId: userId,
        images: imagePaths,
        price: parseFloat(req.body.price)
      });

      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const product = await storage.getProduct(req.params.id);
      
      if (!product || product.artisanId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedProduct = await storage.updateProduct(req.params.id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const product = await storage.getProduct(req.params.id);
      
      if (!product || product.artisanId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // AI assistance routes
  app.post('/api/ai/pricing', isAuthenticated, async (req, res) => {
    try {
      const { title, description, category, materials } = req.body;
      
      if (!title || !description || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const pricingSuggestion = await generatePricingSuggestion(
        title, 
        description, 
        category, 
        materials || ""
      );
      
      res.json(pricingSuggestion);
    } catch (error) {
      console.error("Error generating pricing suggestion:", error);
      res.status(500).json({ message: "Failed to generate pricing suggestion" });
    }
  });

  app.post('/api/ai/marketing', isAuthenticated, async (req: any, res) => {
    try {
      const { title, description, category } = req.body;
      const user = await storage.getUser(req.user.claims.sub);
      
      if (!title || !description || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const artisanName = user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : 'Artisan';

      const marketingContent = await generateMarketingContent(
        title,
        description,
        category,
        artisanName
      );
      
      res.json(marketingContent);
    } catch (error) {
      console.error("Error generating marketing content:", error);
      res.status(500).json({ message: "Failed to generate marketing content" });
    }
  });

  app.post('/api/ai/story', isAuthenticated, async (req: any, res) => {
    try {
      const { bio, craftType, experience } = req.body;
      const user = await storage.getUser(req.user.claims.sub);
      
      if (!bio || !craftType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const enhancedStory = await enhanceArtisanStory(
        bio,
        craftType,
        user?.location || "",
        experience || ""
      );
      
      res.json(enhancedStory);
    } catch (error) {
      console.error("Error enhancing artisan story:", error);
      res.status(500).json({ message: "Failed to enhance artisan story" });
    }
  });

  app.post('/api/ai/analyze-image', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString('base64');
      
      const analysis = await analyzeProductImage(base64Image);
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Inquiry routes
  app.get('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const inquiries = await storage.getInquiries(userId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const inquiryData = insertInquirySchema.parse({
        ...req.body,
        buyerId
      });

      const inquiry = await storage.createInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // Favorites routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.body;
      
      const favorite = await storage.addFavorite({ userId, productId });
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:productId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.params;
      
      await storage.removeFavorite(userId, productId);
      res.json({ message: "Favorite removed successfully" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Reviews routes
  app.get('/api/reviews/:productId', async (req, res) => {
    try {
      const reviews = await storage.getReviews(req.params.productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        buyerId
      });

      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Artisan stats
  app.get('/api/artisan/:id/stats', async (req, res) => {
    try {
      const stats = await storage.getArtisanStats(req.params.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching artisan stats:", error);
      res.status(500).json({ message: "Failed to fetch artisan stats" });
    }
  });

  // Update user profile
  app.put('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updatedUser = await storage.upsertUser({
        id: userId,
        ...req.body
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
