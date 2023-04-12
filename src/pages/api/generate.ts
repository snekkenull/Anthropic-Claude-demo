// src/pages/api/generate.ts
import { APIRoute } from 'astro';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

export const post: APIRoute = async (context) => {
  const requestBody = await context.request.json();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({ ...requestBody, stream: true }),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    return new Response(JSON.stringify(responseBody), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
};
