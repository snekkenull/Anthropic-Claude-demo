import { APIRoute } from 'astro';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

export const post: APIRoute = async (context) => {  
  const requestBody = await context.request.json();
  
  let response;
  try {
    response = await fetch(apiUrl, {     
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json',  
        'X-API-Key': apiKey,  
      },  
      body: JSON.stringify({  
        ...requestBody,  
        stream: true 
      }),  
    });
  } catch (error) {
    console.error('Error while fetching Anthropic API:', error);
    return new Response('Error while fetching Anthropic API', {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }    

  context.res.setHeader('Content-Type', 'text/event-stream');  
  context.res.setHeader('Cache-Control', 'no-cache');   
  context.res.setHeader('Connection', 'keep-alive');    

  try {
    for await (const chunk of response.body) {    
      context.res.write(`data: ${chunk}\n\n`);  
    }  
  } catch (error) {
    console.error('Error while streaming:', error);
  } finally {
    context.res.end();
  }
};
