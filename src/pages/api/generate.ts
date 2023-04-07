// #vercel-disable-blocks
import { ProxyAgent, fetch } from 'undici'
// #vercel-end
import { generatePayload, parseOpenAIStream } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'
import type { APIRoute } from 'astro'
import { Client, HUMAN_PROMPT } from "@anthropic-ai/sdk"


const apiKey = import.meta.env.ANTHROPIC_API_KEY
const model = import.meta.env.ANTHROPIC_API_MODEL || 'claude-v1'

const sitePassword = import.meta.env.SITE_PASSWORD || ''
const passList = sitePassword.split(',') || []

export const post: APIRoute = async(context) => {
  const body = await context.request.json()
  const { sign, time, messages, pass } = body
  if (!messages) {
    return new Response(JSON.stringify({
      error: {
        message: 'No input text.',
      },
    }), { status: 400 })
  }
  if (sitePassword && !(sitePassword === pass || passList.includes(pass))) {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid password.',
      },
    }), { status: 401 })
  }
  if (import.meta.env.PROD && !await verifySignature({ t: time, m: messages?.[messages.length - 1]?.content || '' }, sign)) {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid signature.',
      },
    }), { status: 401 })
  }
  
  const client = new Client(apiKey)

  const prompt = messages
    .map((message) => `${message.role === "user" ? HUMAN_PROMPT : "Assistant:"} ${message.content}`)
    .join("\n\n")

  try {
    const response = await client.complete({
      prompt: `${HUMAN_PROMPT}\n\n${prompt}\n\nAssistant:`,
      stop_sequences: [HUMAN_PROMPT],
      max_tokens_to_sample: 200,
      model: model,
    })

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({
      error: {
        message: error.message,
      },
    }), { status: 500 })
  }
}