// Login API endpoint
const demoUser = {
  id: 'demo-user',
  email: 'demo@artisanconnect.com',
  firstName: 'Demo',
  lastName: 'User'
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    try {
      const body = JSON.parse(event.body || '{}');
      const { email, password } = body;

      console.log('Login attempt:', { email, password: password ? '***' : undefined });

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
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
          ...headers,
          'Set-Cookie': cookieValue
        },
        body: JSON.stringify(response)
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Internal server error'
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
