exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization, Prefer'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = new URLSearchParams(event.queryStringParameters || {});
  const targetPath = params.get('path') || '';
  params.delete('path');
  const queryString = params.toString();

  const supabaseUrl = `https://supabase.co{targetPath}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(supabaseUrl, {
      method: event.httpMethod,
      headers: {
        'apikey': event.headers['apikey'] || '',
        'Authorization': event.headers['authorization'] || '',
        'Content-Type': 'application/json',
        'Prefer': event.headers['prefer'] || ''
      },
      body: (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') ? event.body : undefined
    });

    const text = await response.text();
    return { statusCode: response.status, headers, body: text };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
