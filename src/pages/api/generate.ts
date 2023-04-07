import { ProxyAgent, fetch } from 'undici'
import { verifySignature } from '@/utils/auth'
import type { APIRoute } from 'astro'
import { completePrompt } from '@/utils/anthropicApi'

const sitePassword = import.meta.env.SITE_PASSWORD || ''
const passList = sitePassword.split(',') || []

export const post: APIRoute = async(context) => {
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

  const prompt = `${userPrompt}\n\nAssistant:`;

  try {
    const completion = await completePrompt(prompt);
    const text = completion.choices[0].delta?.content || '';
    return new Response(text, { status: 200 });
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({
      error: {
        code: err.name,
        message: err.message,
      },
    }), { status: 500 })
  }
}