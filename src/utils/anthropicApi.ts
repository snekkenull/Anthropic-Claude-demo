import { Client } from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-v1'
const client = new Client(apiKey);

export const completePrompt = async (prompt: string) => {
  try {
    const completion = await client.complete({
      prompt: prompt,
      stop_sequences: ["\n\nHuman:"],
      max_tokens_to_sample: 200,
      model,
    });

    return completion;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
