import { AI_PROMPT, Client, HUMAN_PROMPT } from "@anthropic-ai/sdk";
import type { ChatMessage } from '@/types';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;

const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-2';

export const client = new Client(apiKey);

export const generatePrompt = (messages: ChatMessage[]): string => {
  let prompt = "";
  messages.forEach(message => {
    prompt += `\n\n${message.role === 'user' ? 'Human' : 'Assistant'}: ${message.content}`;
  });
  prompt += `\n\nAssistant:`;
  return prompt;
}

export const completeWithAnthropic = async (prompt: string) => {
  try {
    const response = await client.complete({
      prompt,
      model,
      stop_sequences: [HUMAN_PROMPT],
      max_tokens_to_sample: 1000000,
      stream: true,
    });

    return response.completion;
  } catch (error) {
    console.error("Anthropic API Error: ", error);
    throw error;
  }
};