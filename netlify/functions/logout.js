// Logout API endpoint
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Cookie',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'POST') {
    // Create cookie header to clear the auth token
    const cookieValue = `auth_token=; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : 'SameSite=Lax'}; Max-Age=0; Path=/`;

    console.log('User logged out successfully');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Set-Cookie': cookieValue
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Logged out successfully' 
      })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
