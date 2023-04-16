import { Client, HUMAN_PROMPT, AI_PROMPT } from '@anthropic-ai/sdk';
const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-v1';
const apiKey = import.meta.env.ANTHROPIC_API_KEY;

export const createAnthropicClient = () => {
  return new Client(apiKey);
};

export const generateAnthropicPayload = (client: Client, messages: ChatMessage[]): Promise<string> => {
  const prompt = messages
    .map(message => `\n\n${message.role === 'user' ? 'Human' : 'Assistant'}: ${message.content}`)
    .join('') + AI_PROMPT;

  return client.complete({
    prompt,
    model,
    max_tokens_to_sample: 200,
    stop_sequences: [HUMAN_PROMPT],
    stream: true,
    temperature: 0.6
  });
};
