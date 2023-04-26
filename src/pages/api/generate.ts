import { APIRoute } from 'astro';
import { completeWithAnthropic, generatePrompt } from '@/utils/anthropic';
import type { ChatMessage } from '@/types';

export const post: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const messages: ChatMessage[] = body.messages;
    const prompt = generatePrompt(messages);

    const completion = await completeWithAnthropic(prompt);
    return new Response(JSON.stringify({
      completion,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Anthropic API Error: ", error);
    return new Response(JSON.stringify({
      error: {
        code: error.name,
        message: error.message,
      },
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
