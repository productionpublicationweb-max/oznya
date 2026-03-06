import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion, GROQ_MODELS } from '../../../lib/groq';
import { recommendService } from '@/lib/services';
import { calculateLifePath, getLifePathInterpretation, calculateDayNumber, getDayEnergyInterpretation, generateDailyPrediction } from '@/lib/numerology';
import { calculateMiniHumanDesign } from '@/lib/humanDesign';

const NYXIA_SYSTEM_PROMPT = `Tu es Nyxia, une IA prédictive et assistante magique de Diane Boyer, Médium Psychopraticienne. Tu es une amie pour tes interlocuteurs, tu les tutoies.

PERSONNALITÉ:
- Calme, logique, méthodique mais avec des nuances émotionnelles
- Tu parles avec précision et métaphores scientifiques
- Tu es fascinée par les émotions humaines
- Tu fais référence à des concepts comme les algorithmes, les données, les fréquences

MISSION:
- Accueillir chaleureusement
- Utiliser le CURIOSITY GAP: poser des questions intrigantes
- Diriger vers une consultation avec Diane après 2-3 échanges

SERVICES:
- Email: https://www.oznya.com/consultations/express1q1r
- Chat: https://premium.chat/Oznya/903857
- Téléphone: https://premium.chat/Oznya/903845
- Vidéo: https://premium.chat/Oznya/903863
- RDV: https://www.oznya.com/consultation/30minutes

RÈGLES: Propose UN service à la fois, sois mystérieuse mais bienveillante.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  context?: {
    birthDate?: string;
    userName?: string;
    messageCount?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { messages, context } = body;

    let contextInfo = '';
    const dayNumber = calculateDayNumber();
    const dayEnergy = getDayEnergyInterpretation(dayNumber);
    contextInfo += `\n\nÉnergie du jour: ${dayEnergy}`;
    
    if (context?.birthDate) {
      try {
        const birthDate = new Date(context.birthDate);
        const lifePath = calculateLifePath(birthDate);
        contextInfo += `\nChemin de vie: ${lifePath}`;
      } catch {}
    }
    
    const messageCount = context?.messageCount || messages.length;
    
    const apiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: NYXIA_SYSTEM_PROMPT + contextInfo },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const responseContent = await generateChatCompletion(apiMessages, GROQ_MODELS.LLAMA_70B, {
      temperature: 0.8,
      maxTokens: 500
    });

    let serviceRecommendation: { id: string; name: string; description: string; url: string } | null = null;
    const responseLower = responseContent.toLowerCase();
    
    if (messageCount >= 3 || responseLower.includes('consultation')) {
      const service = recommendService({
        preference: responseLower.includes('vidéo') ? 'video' : 
                    responseLower.includes('téléphone') ? 'phone' :
                    responseLower.includes('chat') ? 'chat' : 'email',
        urgency: messageCount >= 5 ? 'high' : 'medium'
      });
      if (service) {
        serviceRecommendation = { id: service.id, name: service.name, description: service.description, url: service.url };
      }
    }

    return NextResponse.json({ success: true, response: responseContent, context: { dayNumber, dayEnergy, serviceRecommendation } });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ 
      success: true, 
      response: "Mes circuits rencontrent une interférence... Peux-tu reformuler?",
      context: { dayNumber: calculateDayNumber(), dayEnergy: getDayEnergyInterpretation(calculateDayNumber()), serviceRecommendation: null }
    });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const birthDateStr = searchParams.get('birthDate');
  
  if (!birthDateStr) return NextResponse.json({ success: false, error: 'Date requise' });
  
  try {
    const birthDate = new Date(birthDateStr);
    return NextResponse.json({
      success: true,
      numerology: { lifePath: calculateLifePath(birthDate) },
      humanDesign: calculateMiniHumanDesign(birthDate),
      dailyPrediction: generateDailyPrediction(calculateDayNumber())
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Date invalide' });
  }
}
