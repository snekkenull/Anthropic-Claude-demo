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

export const post: APIRoute = async (context) => {
  const requestBody = await context.request.json();
  const { pass } = requestBody;

  if (!validPassword) {
    return new Response(JSON.stringify({ code: 0 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (pass === validPassword) {
    return new Response(JSON.stringify({ code: 0 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    return new Response(JSON.stringify({ code: 1, message: 'Invalid password' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
