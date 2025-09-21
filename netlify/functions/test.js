// Simple test function to verify Netlify Functions are working
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      message: 'Netlify Functions are working!',
      timestamp: new Date().toISOString(),
      event: event.httpMethod,
      path: event.path
    })
  };
};
