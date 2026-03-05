// Force redeploy v5 - 2026-03-02 - CACHE BUST
// Groq API client for chat completions (NO z-ai dependency)

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function groqChatCompletion(
  messages: GroqMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  console.log('GROQ_API_KEY configured:', !!apiKey);
  
  if (!apiKey) {
    console.error('GROQ_API_KEY is not configured in environment');
    throw new Error('GROQ_API_KEY is not configured');
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options?.model || 'llama-3.3-70b-versatile',
        messages,
        temperature: options?.temperature ?? 0.8,
        max_tokens: options?.maxTokens ?? 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    console.log('Groq response received:', !!data.choices[0]?.message?.content);
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq chat completion error:', error);
    throw error;
  }
}
