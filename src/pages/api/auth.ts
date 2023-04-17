import { APIRoute } from 'astro';

const validPassword = import.meta.env.SITE_PASSWORD;

export const get: APIRoute = (context) => {
  if (!validPassword) {
    return new Response(JSON.stringify({ passwordEnabled: false }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    return new Response(JSON.stringify({ passwordEnabled: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
