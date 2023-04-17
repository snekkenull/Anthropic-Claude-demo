// src/pages/api/generate.ts

import { APIRoute } from 'astro';
import { client, generatePrompt } from '@/utils/anthropic';
import type { ChatMessage } from '@/types';

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const messages: ChatMessage[] = body.messages;
  const prompt = generatePrompt(messages);

  try {
    const response = await client.complete({
      prompt,
      model: 'claude-v1',
      stop_sequences: ['\n\nHuman:'],
      max_tokens_to_sample: 200,
      stream: true,
    });

    context.response.setHeader('Content-Type', 'text/event-stream');
    context.response.setHeader('Cache-Control', 'no-cache');
    context.response.setHeader('Connection', 'keep-alive');

    response.on('data', (chunk) => {
      context.response.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });

    response.on('end', () => {
      context.response.write('data: [DONE]\n\n');
      context.response.end();
    });

    response.on('error', (error) => {
      console.error("Anthropic API Error: ", error);
      context.response.writeHead(500);
      context.response.end();
    });
  } catch (error) {
    console.error("Anthropic API Error: ", error);
    context.response.writeHead(500);
    context.response.end();
  }
};
