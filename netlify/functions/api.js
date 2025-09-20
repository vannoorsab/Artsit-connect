import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

// Import your existing routes
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Demo data - same as your existing server
const categories = [
  { id: '1', name: 'Pottery', description: 'Handcrafted ceramic pieces' },
  { id: '2', name: 'Textiles', description: 'Woven fabrics and clothing' },
  { id: '3', name: 'Jewelry', description: 'Handmade jewelry and accessories' },
  { id: '4', name: 'Woodwork', description: 'Carved and crafted wood items' },
  { id: '5', name: 'Metalwork', description: 'Forged and crafted metal pieces' },
  { id: '6', name: 'Art', description: 'Paintings and artistic creations' },
  { id: '7', name: 'Home Decor', description: 'Decorative items for the home' },
  { id: '8', name: 'Traditional Crafts', description: 'Cultural and traditional items' }
];

const products = [
  {
    id: '1',
    title: 'Handcrafted Ceramic Vase',
    description: 'Beautiful blue and white ceramic vase with intricate patterns, perfect for home decoration.',
    price: '89.99',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '1',
    artisanId: 'artisan1',
    aiEnhanced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Woven Cotton Scarf',
    description: 'Soft, handwoven cotton scarf with traditional patterns in vibrant colors.',
    price: '45.00',
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '2',
    artisanId: 'artisan2',
    aiEnhanced: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Silver Wire Bracelet',
    description: 'Elegant handmade silver wire bracelet with delicate beadwork.',
    price: '67.50',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '3',
    artisanId: 'artisan3',
    aiEnhanced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Carved Wooden Bowl',
    description: 'Beautiful hand-carved wooden bowl made from sustainable oak wood.',
    price: '125.00',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '4',
    artisanId: 'artisan4',
    aiEnhanced: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Copper Wind Chimes',
    description: 'Melodious copper wind chimes with hand-forged details and beautiful sound.',
    price: '78.00',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '5',
    artisanId: 'artisan5',
    aiEnhanced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Abstract Canvas Painting',
    description: 'Original abstract painting on canvas with vibrant colors and modern design.',
    price: '299.99',
    images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '6',
    artisanId: 'artisan6',
    aiEnhanced: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Demo user for authentication
const demoUser = {
  id: 'demo-user',
  email: 'demo@artisanconnect.com',
  firstName: 'Demo',
  lastName: 'User'
};

// Routes
app.get('/categories', (req, res) => {
  res.json(categories);
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Auth routes
app.get('/auth/user', (req, res) => {
  const authToken = req.headers.authorization || req.cookies?.auth_token;
  if (!authToken) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(demoUser);
});

app.post('/auth/login', (req, res) => {
  res.cookie('auth_token', 'demo-token', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({ 
    success: true, 
    user: demoUser 
  });
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

// Export the serverless function
export const handler = serverless(app);
