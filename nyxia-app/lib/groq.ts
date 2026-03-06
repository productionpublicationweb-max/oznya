const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  model: string = 'llama-3.3-70b-versatile',
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 500,
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export const GROQ_MODELS = { LLAMA_70B: 'llama-3.3-70b-versatile' };
