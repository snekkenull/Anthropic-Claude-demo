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
    },
    body: JSON.stringify({
      ...requestBody,
      stream: true
    }),
  });
  context.res.setHeader('Content-Type', 'text/event-stream');
  context.res.setHeader('Cache-Control', 'no-cache');
  context.res.setHeader('Connection', 'keep-alive');
  for await (const chunk of response.body) {
    context.res.write(data: $ {
        chunk
      }\
      n\ n);
  }
  context.res.end();
};
