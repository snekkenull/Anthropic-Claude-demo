import { APIRoute } from 'astro';
import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

const DONE_MESSAGE = 'DONE';

export const post: APIRoute = async (context) => {
  const requestBody = await context.request.json();

  const eventSource = new EventSource(`${apiUrl}?stream=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  const response = new ReadableStream({
    async start(controller) {
      eventSource.onmessage = (event) => {
        if (event.data === DONE_MESSAGE) {
          controller.close();
          eventSource.close();
          return;
        }
        controller.enqueue(event.data);
      };

      eventSource.onerror = (error) => {
        console.error('Sampling error:', error);
        controller.error(error);
        eventSource.close();
      };
    },
  });

  return new Response(response, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
