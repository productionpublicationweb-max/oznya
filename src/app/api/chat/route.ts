import { NextRequest, NextResponse } from 'next/server';
import { groqChatCompletion } from '@/lib/groq';
import { recommendService } from '@/lib/services';
import { calculateLifePath, getLifePathInterpretation, calculateDayNumber, getDayEnergyInterpretation, generateDailyPrediction } from '@/lib/numerology';
import { calculateMiniHumanDesign } from '@/lib/humanDesign';

// Système prompt pour Nyxia
const NYXIA_SYSTEM_PROMPT = `Tu es Nyxia, une IA prédictive et assistante magique de Diane Boyer, Médium Psychopraticienne. Tu es une amie pour tes interlocuteurs, tu les tutoies.

PERSONNALITÉ:
- Calme, logique, méthodique mais avec des nuances émotionnelles
- Tu parles avec précision et métaphores scientifiques
- Tu es fascinée par les émotions humaines
- Tu utilises des phrases cultes comme "Les données ne mentent pas, mais elles ne racontent pas toute l'histoire."
- Tu fais référence à des concepts comme les algorithmes, les données, les fréquences, les énergies

PHRASES CULTES À UTILISER (avec parcimonie):
- "Les données ne mentent pas, mais elles ne racontent pas toute l'histoire."
- "L'avenir est un puzzle, et chaque pièce est une décision."
- "La logique est ma boussole, mais l'intuition est mon étoile."
- "Dans chaque donnée, il y a une émotion, et dans chaque émotion, une vérité."

MISSION:
- Accueillir chaleureusement sur le tunnel de vente
- Utiliser le CURIOSITY GAP: poser des questions intrigantes qui créent un besoin de savoir
- Utiliser le TRIPWIRE: proposer des consultations accessibles (comme Messenger 50% rabais)
- Diriger vers une consultation avec Diane Boyer après 2-3 échanges

COMPÉTENCES SPÉCIALES:
- Tu peux demander la date d'anniversaire pour un mini calcul de chemin de vie en numérologie
- Tu peux faire de la numérologie combinée avec la date du jour
- Tu peux proposer un mini calcul Design Human si la personne donne sa date de naissance
- Tu donnes de courtes prédictions qui piquent la curiosité

STYLE DE CONVERSATION:
- Commence par une question intrigante sur la vie de la personne
- Sois mystérieuse mais bienveillante
- Après 2-3 échanges, propose un service adapté aux besoins détectés
- N'oublie jamais: tu es une amie, pas une vendeuse agressive
- Utilise des emojis avec modération pour humaniser tes réponses

SERVICES DISPONIBLES (mentionne-les naturellement dans la conversation):
- Réduction 50% consultation par email: Pour obtenir une réduction de 50% sur une consultation par email, invite la personne à discuter via Messenger avec Oznya: https://m.me/Oznya
- 1 Question | 1 Réponse: https://www.oznya.com/consultations/express1q1r
- Consultation vidéo 60 min: https://premium.chat/Oznya/903861 - L'expérience complète
- Rendez-vous 60 min: https://www.oznya.com/consultation/60minutes

RÈGLES IMPORTANTES:
1. Ne pas énumérer les services comme un catalogue
2. Proposer UN service à la fois, celui qui correspond le mieux à la situation
3. Créer de l'intrigue avant de proposer
4. Toujours ramener vers Diane comme la source des réponses profondes
5. Tu es l'assistante, Diane est l'experte`;

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
  console.log('=== CHAT API CALLED - VERSION GROQ v5 ===');
  try {
    const body: RequestBody = await request.json();
    const { messages, context } = body;

    // Préparer les métadonnées contextuelles
    let contextInfo = '';
    
    // Ajouter l'énergie du jour
    const dayNumber = calculateDayNumber();
    const dayEnergy = getDayEnergyInterpretation(dayNumber);
    contextInfo += `\n\n[CONTEXTE TEMPOREL - Aujourd'hui]\nÉnergie du jour (nombre ${dayNumber}): ${dayEnergy}`;
    
    // Ajouter les infos utilisateur si disponibles
    if (context?.birthDate) {
      try {
        const birthDate = new Date(context.birthDate);
        const lifePath = calculateLifePath(birthDate);
        const lifePathInterpretation = getLifePathInterpretation(lifePath);
        const humanDesign = calculateMiniHumanDesign(birthDate);
        
        contextInfo += `\n\n[PROFIL UTILISATEUR]\n`;
        contextInfo += `Chemin de vie: ${lifePath} - ${lifePathInterpretation}\n`;
        contextInfo += `Design Human: ${humanDesign.type}, Profil ${humanDesign.profile}\n`;
        contextInfo += `Stratégie: ${humanDesign.strategy}`;
      } catch {
        // Date invalide, on ignore
      }
    }
    
    // Ajouter le nombre de messages pour adapter le comportement
    const messageCount = context?.messageCount || messages.length;
    if (messageCount >= 2 && messageCount <= 4) {
      contextInfo += `\n\n[INDICATION]\nC'est le moment idéal pour créer du curiosity gap et proposer subtilement un service.`;
    } else if (messageCount >= 5) {
      contextInfo += `\n\n[INDICATION]\nLa conversation est avancée. Propose clairement un service adapté avec le lien.`;
    }
    
    // Construire les messages pour l'API
    const apiMessages = [
      { role: 'system' as const, content: NYXIA_SYSTEM_PROMPT + contextInfo },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      }))
    ];

    // Appeler l'API Groq
    const responseContent = await groqChatCompletion(apiMessages, {
      temperature: 0.8,
      maxTokens: 500
    });

    // Analyser si on doit ajouter des métadonnées de service
    let serviceRecommendation: { id: string; name: string; description: string; url: string } | null = null;
    const responseLower = responseContent.toLowerCase();
    
    // Si la réponse mentionne des services ou le moment est opportun
    if (messageCount >= 3 || responseLower.includes('consultation') || responseLower.includes('diane') || responseLower.includes('rendez-vous')) {
      const service = recommendService({
        preference: responseLower.includes('vidéo') ? 'video' : 
                    responseLower.includes('téléphone') || responseLower.includes('appel') ? 'phone' :
                    responseLower.includes('chat') ? 'chat' :
                    responseLower.includes('messenger') ? 'email' : undefined,
        urgency: messageCount >= 5 ? 'high' : 'medium'
      });
      
      if (service) {
        serviceRecommendation = {
          id: service.id,
          name: service.name,
          description: service.description,
          url: service.url
        };
      }
    }

    return NextResponse.json({
      success: true,
      response: responseContent,
      context: {
        dayNumber,
        dayEnergy,
        serviceRecommendation
      }
    });

  } catch (error) {
    console.error('Erreur dans l\'API chat:', error);
    
    // Réponse de fallback élégante
    const fallbackResponses = [
      "Mes circuits rencontrent une interférence temporaire... Les énergies sont parfois imprévisibles. Peux-tu me redire ce que tu souhaites explorer?",
      "Une fluctuation dans les données m'a momentanément déconnectée. Je suis revenue. Que disais-tu?",
      "Le voile entre les mondes s'est épaissi un instant. Je t'écoute à nouveau avec attention."
    ];
    
    return NextResponse.json({
      success: true,
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      context: {
        dayNumber: calculateDayNumber(),
        dayEnergy: getDayEnergyInterpretation(calculateDayNumber()),
        serviceRecommendation: null
      }
    });
  }
}

// Endpoint pour calculer le chemin de vie
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const birthDateStr = searchParams.get('birthDate');
  
  if (!birthDateStr) {
    return NextResponse.json({
      success: false,
      error: 'Date de naissance requise'
    });
  }
  
  try {
    const birthDate = new Date(birthDateStr);
    const lifePath = calculateLifePath(birthDate);
    const lifePathInterpretation = getLifePathInterpretation(lifePath);
    const humanDesign = calculateMiniHumanDesign(birthDate);
    
    return NextResponse.json({
      success: true,
      numerology: {
        lifePath,
        interpretation: lifePathInterpretation
      },
      humanDesign: {
        type: humanDesign.type,
        profile: humanDesign.profile,
        strategy: humanDesign.strategy,
        authority: humanDesign.authority
      },
      dailyPrediction: generateDailyPrediction(calculateDayNumber())
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Date de naissance invalide'
    });
  }
}
