import { Client, HUMAN_PROMPT, AI_PROMPT } from "@anthropic-ai/sdk";
import fetch from 'cross-fetch';
const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-v1';
const client = new Client(apiKey);

export const generateAnthropicPayload = async (messages: ChatMessage[]): Promise<string> => {
  const prompt = messages
    .map((message) => `\n\n${message.role === "user" ? "Human" : "Assistant"}: ${message.content}`)
    .join("") + AI_PROMPT;

  const response = await client.complete({
    prompt,
    stop_sequences: [HUMAN_PROMPT],
    max_tokens_to_sample: 200,
    model,
    stream: true,
    temperature: 0.6,
  });

  return response.completion;
};
