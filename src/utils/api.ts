// src/utils/api.ts
export async function fetchEventSource(url: string, options: RequestInit & { onmessage?: (ev: MessageEvent) => void; onopen?: (response: Response) => void }): Promise<void> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'text/event-stream',
      },
    });
  
    if (!response.ok) throw new Error(`Request failed: ${response.statusText}`);
    if (options.onopen) options.onopen(response);
  
    const reader = response.body?.getReader();
  
    async function readStream() {
      if (!reader) return;
      const { value, done } = await reader.read();
      if (done) return;
  
      const decoder = new TextDecoder();
      const decodedValue = decoder.decode(value);
      const messages = decodedValue.split('\n\n');
      for (const message of messages) {
        if (!message) continue;
        options.onmessage?.(new MessageEvent('message', { data: message }));
      }
  
      readStream();
    }
  
    readStream();
  }
  