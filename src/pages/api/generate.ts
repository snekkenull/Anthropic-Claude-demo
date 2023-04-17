import { generatePayload, parseAnthropicStream } from '@/utils/anthropic'
import type { APIRoute } from 'astro'

const apiKey = import.meta.env.ANTHROPIC_API_KEY
const baseUrl = (import.meta.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com').trim().replace(/\/$/, '')

export const post: APIRoute = async (context) => {
  const body = await context.request.json()
  const prompt = body.prompt
  console.log('Received prompt:', prompt) 
  const initOptions = generatePayload(apiKey, prompt)

  const response = await fetch(`${baseUrl}/v1/complete`, initOptions).catch((err: Error) => {
    console.error('Anthropic API error:', err)
      return new Response(JSON.stringify({
      error: {
        code: err.name,
        message: err.message,
      },
    }), { status: 500 })
  }) as Response
  console.log('Anthropic API response:', response)
  return parseAnthropicStream(response) as Response
}
