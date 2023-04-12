import { APIRoute } from 'astro';
import fetchStream from 'fetch-readablestream';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

const DONE_MESSAGE = 'DONE';

export const post: APIRoute = async (context) => {
  const requestBody = await context.request.json();

  const response = await fetchStream(`${anthropicAPIUrl}/v1/complete?stream=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });
  

  const response = new ReadableStream({
    async start(controller) {
      response.body
      .pipeThrough(new TextDecoderStream())
      .pipeTo(
        new WritableStream({
          write(chunk) {
            console.log('Received message:', chunk);
            if (chunk === DONE_MESSAGE) {
              controller.close();
              return;
            }
            controller.enqueue(chunk);
          },
          close() {
            controller.close();
          },
        }),
      );
    },
  });

  return new Response(response, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
