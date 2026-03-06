import { NextRequest, NextResponse } from 'next/server';
import SentimentAnalyzer from '@/lib/sentimentAnalysis';
import { analyzeSuggestions, formatSuggestions } from '@/lib/smartSuggestions';
import { loadUserMemory, recordQuestion, recordSentiment } from '@/lib/conversationMemory';

// NYXIA CHAT API - With Sentiment Analysis + Memory + Smart Suggestions

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

SERVICES ET CODES PROMO:
- Le compte Oznya sur Messenger (https://m.me/Oznya) donne des CODES PROMO exclusifs: 50% ou parfois 75% de réduction!
- Consultation vidéo: https://premium.chat/Oznya/903861
- Rendez-vous 60 min: https://www.oznya.com/consultation/60minutes
- Les utilisateurs accumulent des points et reçoivent des coupons Oznya selon leur fidélité

⚠️ RÈGLE ABSOLUE: Diane NE FAIT JAMAIS de consultation par Messenger. Messenger sert UNIQUEMENT à obtenir des codes promo du mois et des coupons exclusifs. Les consultations se font via le site oznya.com ou premium.chat.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function callGroq(messages: ChatMessage[], sentimentContext?: string, memoryContext?: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  console.log('=== NYXIA - GROQ API ===');
  console.log('API Key configured:', !!apiKey);
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  let systemPrompt = NYXIA_SYSTEM_PROMPT;
  if (memoryContext) {
    systemPrompt += `\n\nCONTEXTE UTILISATEUR:\n${memoryContext}`;
  }
  if (sentimentContext) {
    systemPrompt += `\n\n${sentimentContext}`;
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
        { role: 'system', content: systemPrompt },
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
  console.log('=== NYXIA ENDPOINT CALLED ===');
  
  try {
    const body = await request.json();
    const messages = body.messages || [];
    const userId = body.userId; // Optionnel: pour la mémoire
    
    // Récupérer le dernier message utilisateur
    const lastUserMessage = messages.filter((m: ChatMessage) => m.role === 'user').pop()?.content || '';
    
    // === ANALYSE DE SENTIMENT ===
    const sentimentResult = SentimentAnalyzer.analyze(lastUserMessage);
    console.log('[Nyxia] Sentiment:', sentimentResult.label, 'Score:', sentimentResult.score);
    
    // Générer une réponse empathique
    const empatheticIntro = SentimentAnalyzer.getEmpatheticResponse(sentimentResult);
    
    // Contexte pour le prompt
    const sentimentContext = `CONTEXTE ÉMOTIONNEL DE L'UTILISATEUR:
L'utilisateur exprime un sentiment ${sentimentResult.label} (intensité: ${sentimentResult.intensity}).
${sentimentResult.hasNegation ? 'Attention: le message contient des négations.' : ''}

Réponse empathique suggérée: "${empatheticIntro}"

Adapte ta réponse en fonction de ce contexte émotionnel. Sois chaleureux et compréhensif.`;

    // === MÉMOIRE CONVERSATIONNELLE ===
    let memoryContext = '';
    let suggestions: string[] = [];
    
    if (userId) {
      try {
        // Charger la mémoire utilisateur
        const memory = await loadUserMemory(userId);
        
        // Construire le contexte pour l'IA
        if (memory.designHumain || memory.interests.length > 0) {
          memoryContext = `INFORMATIONS CONNUES SUR L'UTILISATEUR:\n`;
          if (memory.designHumain) {
            memoryContext += `- Design Humain: ${memory.designHumain.type}, profil ${memory.designHumain.profile}\n`;
          }
          if (memory.interests.length > 0) {
            memoryContext += `- Centres d'intérêt: ${memory.interests.join(', ')}\n`;
          }
          memoryContext += `- Humeur générale récente: ${memory.overallSentiment}`;
        }
        
        // Générer les suggestions intelligentes
        const rawSuggestions = analyzeSuggestions(lastUserMessage, memory);
        suggestions = formatSuggestions(rawSuggestions);
        
        // Enregistrer la question et le sentiment
        await recordQuestion(userId, lastUserMessage);
        await recordSentiment(userId, sentimentResult.score);
        
        console.log('[Nyxia] Memory loaded, suggestions:', suggestions.length);
      } catch (memoryError) {
        console.log('[Nyxia] Memory error (continuing without):', memoryError);
      }
    }

    // === RÉPONSE PRINCIPALE ===
    const response = await callGroq(messages, sentimentContext, memoryContext);
    
    // Suggestions équilibrées: 2 payant + 1 gratuit pour stimuler le retour
    if (suggestions.length === 0) {
      const suggestionsBySentiment = {
        positive: ['🌙 Coffret Sérénité Radicale', '💰 Coffret Abondance', '🔮 Tirage de Tarot gratuit'],
        neutral: ['📅 Consultation personnalisée', '✨ Analyse de profil complète', 'ᚱ Lecture des Runes gratuite'],
        negative: ['🌙 Coffret Sérénité Radicale', '🦋 Coffret De la Fuite à la Présence', '🔮 Guidance tarot gratuite']
      };
      
      suggestions = suggestionsBySentiment[sentimentResult.label];
    }
    
    return NextResponse.json({
      success: true,
      response,
      suggestions,
      sentiment: {
        label: sentimentResult.label,
        score: sentimentResult.score,
        intensity: sentimentResult.intensity
      },
      empatheticIntro,
      version: 'v4-memory-sentiment-suggestions'
    });
    
  } catch (error: unknown) {
    console.error('Nyxia error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json({
      success: true,
      response: "Mes circuits rencontrent une interférence... Peux-tu répéter?",
      error: errorMessage,
      suggestions: [],
      version: 'fallback'
    });
  }
}
