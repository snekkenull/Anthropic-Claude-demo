import { APIRoute } from 'astro';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

import { fetchEventSource } from '@/utils/api';

export const post: APIRoute = async (context) => {
  const requestBody = await context.request.json();
  const responseHeaders = new Headers({ 'Content-Type': 'text/event-stream' });

  const response = new Response(undefined, {
    status: 200,
    headers: responseHeaders,
  });

  fetchEventSource(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ ...requestBody, stream: true }),
    onmessage: (ev) => {
      response.write(ev.data + '\n\n');
    },
    onopen: () => {
      context.send(response);
    },
  }).catch((error) => {
    console.error('Error in fetchEventSource:', error);
    response.write('event: error\ndata: ' + JSON.stringify({ error: error.message }) + '\n\n');
    response.end();
  });

  context.waitUntil(response.finished);
};
