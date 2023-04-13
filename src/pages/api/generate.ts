import { APIRoute } from 'astro';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

const parseAnthropicStream = (rawResponse: Response) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of rawResponse.body as any) {
        const json = JSON.parse(decoder.decode(chunk));
        const text = json.completion || '';
        const queue = encoder.encode(text);
        controller.enqueue(queue);
      }
      controller.close();
    },
  });

  return new Response(stream);
};

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

  return parseAnthropicStream(response) as Response;
};
