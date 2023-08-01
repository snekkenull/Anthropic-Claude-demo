import Anthropic, { HUMAN_PROMPT } from "@anthropic-ai/sdk";
import type { ChatMessage } from '@/types';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;

const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-2';

const max_tokens = import.meta.env.ANTHROPIC_API_TOKEN || '1000000';

// Instantiate with "apiKey" as an object property
const client = new Anthropic({ apiKey });

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
    const params = {
      prompt,
      model,
      stop_sequences: [HUMAN_PROMPT],
      max_tokens_to_sample: max_tokens,
      stream: true,
    };

    let text = '';
    // Use async iterator to get the completion
    const stream = await client.completions.create(params);
    for await (const completion of stream) {
      const diff = completion.completion;
      text += diff;
    }

    return text;
  } catch (error) {
    console.error("Anthropic API Error: ", error);
    throw error;
  }
};
