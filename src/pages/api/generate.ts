// generate.ts
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

  if (!response.ok) {
    const error = await response.json();
    console.error('API response error:', error.error);

    return new Response(JSON.stringify(error), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const responseStream = new ReadableStream({
    async start(controller) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log('Stream complete');
          controller.close();
          return;
        }

        if (value) {
          const char = decoder.decode(value, { stream: true });
          controller.enqueue(char);
        }

        reader.read().then(processText).catch((error) => {
          console.error('Error processing text:', error);
          controller.error(error);
          controller.close();
        });
      }).catch((error) => {
        console.error('Error reading from the stream:', error);
        controller.error(error);
        controller.close();
      });
    },
  });

  return new Response(responseStream, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
