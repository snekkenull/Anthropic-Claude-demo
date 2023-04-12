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
    body: JSON.stringify({
      ...requestBody,
      stream: true,
    }),
  });

  console.log('Received response from Anthropic API:', response);

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
};
