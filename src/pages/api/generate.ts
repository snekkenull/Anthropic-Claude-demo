// #vercel-disable-blocks
import { ProxyAgent, fetch } from 'undici'
// #vercel-end

import { APIRoute } from 'astro';
import { verifySignature } from '@/utils/auth'

const apiKey = import.meta.env.ANTHROPIC_API_KEY
const apiUrl = ((import.meta.env.ANTHROPIC_API_BASE_URL) || 'https://api.anthropic.com/v1/complete').trim().replace(/\/$/, '')
//const apiUrl = 'https://api.anthropic.com/v1/complete';
const sitePassword = import.meta.env.SITE_PASSWORD || ''
const passList = sitePassword.split(',') || []

export const post: APIRoute = async (context) => {

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


  const requestBody = await context.request.json();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  const responseBody = await response.json();

  return new Response(JSON.stringify(responseBody), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
