export const parseAnthropicStream = (rawResponse: Response) => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
  
    if (!rawResponse.ok) {
      return new Response(rawResponse.body, {
        status: rawResponse.status,
        statusText: rawResponse.statusText,
      });
    }
  
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of rawResponse.body as any) {
          const text = decoder.decode(chunk);
          const json = JSON.parse(text);
          const message = json.completion.trim();
          const queue = encoder.encode(message);
          controller.enqueue(queue);
        }
        controller.close();
      },
    });
  
    return new Response(stream);
  };