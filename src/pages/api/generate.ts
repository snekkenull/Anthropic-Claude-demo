import { Client } from "@anthropic-ai/sdk";
import { verifySignature } from "@/utils/auth";
import type { APIRoute } from "astro";

const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-v1'
const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const sitePassword = import.meta.env.SITE_PASSWORD || "";
const passList = sitePassword.split(",") || [];
const client = new Client(apiKey);

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const { sign, time, messages, pass } = body;
  if (!messages) {
    return new Response(
      JSON.stringify({
        error: {
          message: "No input text.",
        },
      }),
      { status: 400 }
    );
  }
  if (
    sitePassword &&
    !(sitePassword === pass || passList.includes(pass))
  ) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Invalid password.",
        },
      }),
      { status: 401 }
    );
  }
  if (
    import.meta.env.PROD &&
    !(await verifySignature(
      { t: time, m: messages?.[messages.length - 1]?.content || "" },
      sign
    ))
  ) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Invalid signature.",
        },
      }),
      { status: 401 }
    );
  }

  const prompt = messages
    .map((message) => `\n\n${message.role}: ${message.content}`)
    .join("") + "\n\nAssistant:";

  try {
    const completion = await client.complete({
      prompt,
      stop_sequences: ["\n\nHuman:"],
      model,
    });
    return new Response(JSON.stringify(completion), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      { status: 500 }
    );
  }
};
