import { APIRoute } from 'astro';
import { createAnthropicClient, generateAnthropicPayload } from '@/utils/anthropic';
import type { ChatMessage } from '@/types';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const messages: ChatMessage[] = body.messages;

  try {
    const client = createAnthropicClient();
    const completion = await generateAnthropicPayload(client, messages);

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completion }),
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          code: error.name,
          message: error.message,
        },
      }),
    };
  }
};
