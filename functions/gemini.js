export async function onRequest(context) {
  // Only allow POST requests
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { targetApi, payload } = await context.request.json();
    // Securely gets the API key from Cloudflare's settings
    const apiKey = context.env.GOOGLE_API_KEY; 

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is not configured.' }), { status: 500 });
    }

    let apiUrl = '';
    if (targetApi === 'vision') {
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    } else if (targetApi === 'tts') {
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid target API.' }), { status: 400 });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}