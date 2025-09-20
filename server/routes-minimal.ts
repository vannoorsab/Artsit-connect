import express, { type Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });

  // Categories route (demo data)
  app.get('/api/categories', (req, res) => {
    res.json([
      { id: '1', name: 'Pottery & Ceramics', description: 'Handcrafted pottery, vases, bowls, and ceramic art', createdAt: new Date() },
      { id: '2', name: 'Textiles & Fabrics', description: 'Handwoven fabrics, embroidery, and textile art', createdAt: new Date() },
      { id: '3', name: 'Jewelry & Accessories', description: 'Handmade jewelry, bags, and fashion accessories', createdAt: new Date() },
      { id: '4', name: 'Wood & Furniture', description: 'Wooden crafts, furniture, and carpentry work', createdAt: new Date() },
      { id: '5', name: 'Metalwork', description: 'Metal crafts, sculptures, and decorative items', createdAt: new Date() },
      { id: '6', name: 'Art & Paintings', description: 'Original paintings, drawings, and artistic creations', createdAt: new Date() },
      { id: '7', name: 'Home Decor', description: 'Decorative items for home and living spaces', createdAt: new Date() },
      { id: '8', name: 'Traditional Crafts', description: 'Cultural and traditional handicrafts', createdAt: new Date() }
    ]);
  });

  // Products route (demo data)
  app.get('/api/products', (req, res) => {
    const demoProducts = [
      {
        id: '1',
        title: 'Handwoven Ceramic Bowl',
        description: 'Beautiful handwoven ceramic bowl perfect for serving or decoration. Made with traditional techniques passed down through generations.',
        price: 45.99,
        categoryId: '1',
        artisanId: 'artisan-1',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
        materials: 'Clay, Natural Glazes',
        dimensions: '8" diameter x 3" height',
        careInstructions: 'Hand wash only, avoid extreme temperatures',
        isActive: true,
        aiEnhanced: true,
        aiPricingSuggested: true,
        seoTitle: 'Handwoven Ceramic Bowl - Artisan Made',
        marketingCaption: 'Bring warmth to your table with this stunning handwoven ceramic bowl',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Embroidered Silk Scarf',
        description: 'Luxurious silk scarf with intricate hand embroidery featuring traditional floral patterns. Each piece is unique and tells its own story.',
        price: 89.99,
        categoryId: '2',
        artisanId: 'artisan-2',
        images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400'],
        materials: 'Pure Silk, Cotton Thread',
        dimensions: '60" x 20"',
        careInstructions: 'Dry clean only',
        isActive: true,
        aiEnhanced: true,
        aiPricingSuggested: false,
        seoTitle: 'Hand Embroidered Silk Scarf - Traditional Craft',
        marketingCaption: 'Elevate your style with this exquisite hand-embroidered silk scarf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Sterling Silver Pendant',
        description: 'Elegant sterling silver pendant with natural gemstone. Handcrafted by skilled artisans using traditional silversmithing techniques.',
        price: 125.00,
        categoryId: '3',
        artisanId: 'artisan-3',
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
        materials: 'Sterling Silver, Natural Gemstone',
        dimensions: '1.5" x 1" pendant',
        careInstructions: 'Clean with silver polish cloth',
        isActive: true,
        aiEnhanced: false,
        aiPricingSuggested: true,
        seoTitle: 'Sterling Silver Gemstone Pendant - Handcrafted Jewelry',
        marketingCaption: 'A timeless piece that captures the beauty of natural gemstones',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Wooden Coffee Table',
        description: 'Rustic wooden coffee table made from reclaimed oak. Features natural wood grain and a smooth finish that highlights the beauty of the wood.',
        price: 299.99,
        categoryId: '4',
        artisanId: 'artisan-4',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
        materials: 'Reclaimed Oak Wood, Natural Finish',
        dimensions: '48" x 24" x 18" height',
        careInstructions: 'Dust regularly, use wood conditioner monthly',
        isActive: true,
        aiEnhanced: true,
        aiPricingSuggested: true,
        seoTitle: 'Reclaimed Oak Coffee Table - Handcrafted Furniture',
        marketingCaption: 'Bring natural warmth to your living space with this beautiful reclaimed oak table',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        title: 'Copper Wall Art',
        description: 'Stunning copper wall art featuring abstract geometric patterns. Hand-hammered and oxidized to create unique patina effects.',
        price: 175.00,
        categoryId: '5',
        artisanId: 'artisan-5',
        images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
        materials: 'Pure Copper, Natural Patina',
        dimensions: '24" x 18"',
        careInstructions: 'Dust gently, avoid harsh chemicals',
        isActive: true,
        aiEnhanced: false,
        aiPricingSuggested: false,
        seoTitle: 'Hand-Hammered Copper Wall Art - Abstract Design',
        marketingCaption: 'Transform your walls with this striking hand-hammered copper artwork',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        title: 'Watercolor Landscape Painting',
        description: 'Original watercolor painting depicting a serene mountain landscape. Painted on high-quality watercolor paper with professional pigments.',
        price: 220.00,
        categoryId: '6',
        artisanId: 'artisan-6',
        images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
        materials: 'Watercolor on Paper, Professional Frame',
        dimensions: '16" x 20" framed',
        careInstructions: 'Keep away from direct sunlight, dust frame regularly',
        isActive: true,
        aiEnhanced: true,
        aiPricingSuggested: true,
        seoTitle: 'Original Watercolor Mountain Landscape - Fine Art',
        marketingCaption: 'Bring the tranquility of nature into your home with this beautiful watercolor',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Apply filters if provided
    let filteredProducts = demoProducts;
    const { categoryId, search, artisanId } = req.query;

    if (categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
    }
    if (artisanId) {
      filteredProducts = filteredProducts.filter(p => p.artisanId === artisanId);
    }
    if (search) {
      const searchLower = search.toString().toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredProducts);
  });

  // Auth user route - now requires authentication
  app.get('/api/auth/user', (req, res) => {
    // Check for authentication token in cookies
    const authToken = req.cookies?.auth_token;

    if (!authToken) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Return user data if authenticated
    res.json({
      id: 'demo-user',
      email: 'demo@artisanconnect.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Demo user for ArtisanConnect marketplace',
      location: 'Demo City, Demo State',
      joinedAt: new Date(),
      isVerified: true
    });
  });

  // Login route
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Simple demo authentication - in real app, verify credentials
    if (email && password) {
      // Set authentication token/session
      res.cookie('auth_token', 'demo-auth-token', {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({
        success: true,
        user: {
          id: 'demo-user',
          email: email,
          firstName: 'Demo',
          lastName: 'User',
          profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          bio: 'Demo user for ArtisanConnect marketplace',
          location: 'Demo City, Demo State',
          joinedAt: new Date(),
          isVerified: true
        }
      });
    } else {
      res.status(400).json({ message: 'Email and password required' });
    }
  });

  // Logout route
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true, message: 'Logged out successfully' });
  });

  const server = createServer(app);
  return server;
}
