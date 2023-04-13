import { APIRoute } from 'astro';

const apiKey = import.meta.env.ANTHROPIC_API_KEY;
const apiUrl = 'https://api.anthropic.com/v1/complete';

const requestBody = await request.json();
const messages = requestBody.messages;

async function post(request: ServerRequest) {

  const requestBody = await request.json();
  const messages = requestBody.messages;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: createPromptFromMessages(messages),
      stop_sequences: ['\n\nHuman:'],
      max_tokens_to_sample: 2046,
      model: 'claude-v1',
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error.error);
    return jsonResponse({ error: error.error }, { status: response.status });
  }

  const decoder = new TextDecoder();
  const streamParser = createParser((event) => {
    if (event.type === 'event') {
      try {
        const json = JSON.parse(event.data);
        const text = json.completion;
        request.respond({ body: JSON.stringify({ completion: text }) });
      } catch (e) {
        console.error(e);
      }
    }
  });

  for await (const chunk of response.body) {
    streamParser.feed(decoder.decode(chunk));
  }

  request.finalize();
}