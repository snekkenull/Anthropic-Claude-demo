import { APIRoute } from 'astro';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

export const post: APIRoute = async (context) => {
  console.log('Received request at /api/generate');
  const requestBody = await context.request.json();

  console.log('Sending request to Anthropic API:', requestBody);
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  console.log('Received response from Anthropic API:', response);
  const responseBody = await response.json();
  console.log('Response JSON data:', responseBody);

  return new Response(JSON.stringify(responseBody), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};