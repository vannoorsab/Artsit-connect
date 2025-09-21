// User authentication check endpoint
const demoUser = {
  id: 'demo-user',
  email: 'demo@artisanconnect.com',
  firstName: 'Demo',
  lastName: 'User'
};

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

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Cookie',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  if (event.httpMethod === 'GET') {
    const cookies = parseCookies(event.headers.cookie);
    const authToken = cookies.auth_token;
    
    if (!authToken) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Not authenticated' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(demoUser)
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
