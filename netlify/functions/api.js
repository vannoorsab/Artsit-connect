// Native Netlify Function for ArtisanConnect API
const setCorsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers': 'Set-Cookie'
});

const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  return cookies;
};

// Demo data
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
    title: 'Handwoven Silk Scarf',
    description: 'Beautiful handwoven silk scarf with traditional patterns.',
    price: '89.99',
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '2',
    artisanId: 'artisan1',
    aiEnhanced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Ceramic Tea Set',
    description: 'Handcrafted ceramic tea set with intricate blue patterns.',
    price: '149.99',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '1',
    artisanId: 'artisan2',
    aiEnhanced: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Silver Pendant Necklace',
    description: 'Elegant silver pendant necklace with traditional engravings.',
    price: '199.99',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '3',
    artisanId: 'artisan3',
    aiEnhanced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Wooden Cutting Board',
    description: 'Premium wooden cutting board made from sustainable bamboo.',
    price: '45.99',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
    categoryId: '4',
    artisanId: 'artisan4',
    aiEnhanced: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Copper Bowl Set',
    description: 'Set of three handforged copper bowls with hammered finish.',
    price: '129.99',
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'],
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

const demoUser = {
  id: 'demo-user',
  email: 'demo@artisanconnect.com',
  firstName: 'Demo',
  lastName: 'User'
};

// Main handler function
exports.handler = async (event, context) => {
  const { httpMethod, path, headers, body, queryStringParameters } = event;
  const origin = headers.origin || headers.Origin;
  const cookies = parseCookies(headers.cookie);
  
  console.log('API Request:', { httpMethod, path, origin });

  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: setCorsHeaders(origin),
      body: ''
    };
  }

  try {
    // Parse request body for POST requests
    let requestBody = {};
    if (body) {
      try {
        requestBody = JSON.parse(body);
      } catch (e) {
        console.error('Failed to parse body:', e);
      }
    }

    // Route handling
    if (path === '/debug') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...setCorsHeaders(origin)
        },
        body: JSON.stringify({
          message: 'API is working',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'unknown',
          path,
          method: httpMethod,
          headers: headers
        })
      };
    }

    if (path === '/categories' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...setCorsHeaders(origin)
        },
        body: JSON.stringify(categories)
      };
    }

    if (path === '/products' && httpMethod === 'GET') {
      console.log('Products endpoint called, returning', products.length, 'products');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...setCorsHeaders(origin)
        },
        body: JSON.stringify(products)
      };
    }

    if (path.startsWith('/products/') && httpMethod === 'GET') {
      const productId = path.split('/')[2];
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            ...setCorsHeaders(origin)
          },
          body: JSON.stringify({ message: 'Product not found' })
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...setCorsHeaders(origin)
        },
        body: JSON.stringify(product)
      };
    }

    if (path === '/auth/user' && httpMethod === 'GET') {
      const authToken = cookies.auth_token;
      
      if (!authToken) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            ...setCorsHeaders(origin)
          },
          body: JSON.stringify({ message: 'Not authenticated' })
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...setCorsHeaders(origin)
        },
        body: JSON.stringify(demoUser)
      };
    }

    if (path === '/auth/login' && httpMethod === 'POST') {
      const { email, password } = requestBody;
      console.log('Login attempt:', { email, password: password ? '***' : undefined });

      if (!email || !password) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            ...setCorsHeaders(origin)
          },
          body: JSON.stringify({
            success: false,
            message: 'Email and password are required'
          })
        };
      }

      // Create cookie header
      const cookieValue = `auth_token=demo-token; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : 'SameSite=Lax'}; Max-Age=86400; Path=/`;

      const response = {
        success: true,
        user: {
          ...demoUser,
          email: email
        }
      };

      console.log('Login successful for:', email);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieValue,
          ...setCorsHeaders(origin)
        },
        body: JSON.stringify(response)
      };
    }

    if (path === '/auth/logout' && httpMethod === 'POST') {
      const cookieValue = `auth_token=; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : 'SameSite=Lax'}; Max-Age=0; Path=/`;

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieValue,
          ...setCorsHeaders(origin)
        },
        body: JSON.stringify({ success: true })
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        ...setCorsHeaders(origin)
      },
      body: JSON.stringify({ message: 'Route not found', path, method: httpMethod })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...setCorsHeaders(origin)
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
