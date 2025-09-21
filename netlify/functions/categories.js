// Categories API endpoint
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
      body: JSON.stringify(categories)
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
