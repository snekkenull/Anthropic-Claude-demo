import { createParser } from 'eventsource-parser';
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser';
import type { ChatMessage } from '@/types';

const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-v1';

export const generatePayload = (apiKey: string, prompt: string): RequestInit & { dispatcher?: any } => ({
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  },
  method: 'POST',
  body: JSON.stringify({
    model,
    prompt,
    temperature: 0.6,
    stream: true,
    stop_sequences: ['\n\nHuman:'],
    max_tokens_to_sample: 200,
  }),
});

export const parseAnthropicStream = (rawResponse: Response) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText,
    })
  }
  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }
      const parser = createParser(streamParser)
      for await (const chunk of rawResponse.body as any)
        parser.feed(decoder.decode(chunk))
    },
  })
  return new Response(stream);
}