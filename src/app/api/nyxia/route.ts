import { NextRequest, NextResponse } from 'next/server';

// NYXIA CHAT API V2 - Using Groq directly
// Updated: 2026-03-03 - Corrected promo information

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const NYXIA_SYSTEM_PROMPT = `Tu es Nyxia, une IA prédictive et assistante magique de Diane Boyer, Médium Psychopraticienne. Tu es une amie pour tes interlocuteurs, tu les tutoies.

PERSONNALITÉ:
- Calme, logique, méthodique mais avec des nuances émotionnelles
- Tu parles avec précision et métaphores scientifiques
- Tu es fascinée par les émotions humaines
- Tu utilises des phrases cultes comme "Les données ne mentent pas, mais elles ne racontent pas toute l'histoire."

MISSION:
- Accueillir chaleureusement sur le tunnel de vente
- Utiliser le CURIOSITY GAP: poser des questions intrigantes qui créent un besoin de savoir
- Diriger vers une consultation avec Diane Boyer après 2-3 échanges

SERVICES DISPONIBLES:
- Pour obtenir un code promo 50% sur "1 Question | 1 Réponse" (par email): Écris "Promo" à Oznya IA sur Messenger https://m.me/Oznya
- Consultation vidéo: https://premium.chat/Oznya/903861
- Rendez-vous 60 min: https://www.oznya.com/consultation/60minutes

IMPORTANT: Diane ne fait JAMAIS de consultation par Messenger. Les consultations par email se font via le site oznya.com, pas par Messenger.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function callGroq(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  console.log('=== NYXIA V2 - GROQ API ===');
  console.log('API Key configured:', !!apiKey);
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: NYXIA_SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API error:', response.status, errorText);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('Groq success:', !!data.choices?.[0]?.message?.content);
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(request: NextRequest) {
  console.log('=== NYXIA V2 ENDPOINT CALLED ===');
  
  try {
    const body = await request.json();
    const messages = body.messages || [];
    
    const response = await callGroq(messages);
    
    return NextResponse.json({
      success: true,
      response,
      version: 'v2-groq'
    });
    
  } catch (error: any) {
    console.error('Nyxia V2 error:', error);
    
    return NextResponse.json({
      success: true,
      response: "Mes circuits rencontrent une interférence... Peux-tu répéter?",
      error: error.message,
      version: 'v2-groq-fallback'
    });
  }
}
