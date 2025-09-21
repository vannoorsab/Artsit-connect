// Products API endpoint
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

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products)
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
