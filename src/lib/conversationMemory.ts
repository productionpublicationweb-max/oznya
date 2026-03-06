// lib/conversationMemory.ts
import prisma from './db';

// Types pour la mémoire conversationnelle
export interface MemoryData {
  topics: string[];
  tone: 'formal' | 'casual' | 'mystical';
  interests: string[];
  commonQuestions: string[];
  favoriteServices: string[];
  purchaseHistory: string[];
  birthDate?: string;
  designHumain?: {
    type: string;
    profile: string;
    authority: string;
  };
  lunarPhase?: string;
  overallSentiment: 'positive' | 'neutral' | 'negative';
  recentSentiments: Array<{
    timestamp: string;
    sentiment: number; // -1 à 1
  }>;
}

// Mémoire par défaut
function createDefaultMemory(): MemoryData {
  return {
    topics: [],
    tone: 'mystical',
    interests: [],
    commonQuestions: [],
    favoriteServices: [],
    purchaseHistory: [],
    overallSentiment: 'neutral',
    recentSentiments: []
  };
}

/**
 * Charge la mémoire conversationnelle d'un utilisateur
 */
export async function loadUserMemory(userId: string): Promise<MemoryData> {
  try {
    const memory = await prisma.conversationMemory.findUnique({
      where: { userId }
    });

    if (!memory) {
      // Créer une nouvelle mémoire pour cet utilisateur
      const newMemory = await prisma.conversationMemory.create({
        data: {
          userId,
          topics: '[]',
          tone: 'mystical',
          interests: '[]',
          commonQuestions: '[]',
          favoriteServices: '[]',
          purchaseHistory: '[]',
          overallSentiment: 'neutral',
          recentSentiments: '[]'
        }
      });

      return {
        topics: JSON.parse(newMemory.topics || '[]'),
        tone: newMemory.tone as MemoryData['tone'],
        interests: JSON.parse(newMemory.interests || '[]'),
        commonQuestions: JSON.parse(newMemory.commonQuestions || '[]'),
        favoriteServices: JSON.parse(newMemory.favoriteServices || '[]'),
        purchaseHistory: JSON.parse(newMemory.purchaseHistory || '[]'),
        birthDate: newMemory.birthDate || undefined,
        designHumain: newMemory.designHumainType ? {
          type: newMemory.designHumainType,
          profile: newMemory.designHumainProfile || '',
          authority: ''
        } : undefined,
        lunarPhase: undefined,
        overallSentiment: newMemory.overallSentiment as MemoryData['overallSentiment'],
        recentSentiments: JSON.parse(newMemory.recentSentiments || '[]')
      };
    }

    // Retourner la mémoire existante
    return {
      topics: JSON.parse(memory.topics || '[]'),
      tone: memory.tone as MemoryData['tone'],
      interests: JSON.parse(memory.interests || '[]'),
      commonQuestions: JSON.parse(memory.commonQuestions || '[]'),
      favoriteServices: JSON.parse(memory.favoriteServices || '[]'),
      purchaseHistory: JSON.parse(memory.purchaseHistory || '[]'),
      birthDate: memory.birthDate || undefined,
      designHumain: memory.designHumainType ? {
        type: memory.designHumainType,
        profile: memory.designHumainProfile || '',
        authority: ''
      } : undefined,
      lunarPhase: undefined,
      overallSentiment: memory.overallSentiment as MemoryData['overallSentiment'],
      recentSentiments: JSON.parse(memory.recentSentiments || '[]')
    };
  } catch (error) {
    console.error('[MemoryManager] Erreur chargement mémoire:', error);
    return createDefaultMemory();
  }
}

/**
 * Met à jour la mémoire conversationnelle
 */
export async function updateUserMemory(
  userId: string, 
  updates: Partial<MemoryData>
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {};

    // Mapper les champs - convertir les tableaux en JSON strings
    if (updates.topics) updateData.topics = JSON.stringify(updates.topics);
    if (updates.tone) updateData.tone = updates.tone;
    if (updates.interests) updateData.interests = JSON.stringify(updates.interests);
    if (updates.commonQuestions) updateData.commonQuestions = JSON.stringify(updates.commonQuestions);
    if (updates.favoriteServices) updateData.favoriteServices = JSON.stringify(updates.favoriteServices);
    if (updates.purchaseHistory) updateData.purchaseHistory = JSON.stringify(updates.purchaseHistory);
    if (updates.birthDate !== undefined) updateData.birthDate = updates.birthDate || null;
    if (updates.overallSentiment) updateData.overallSentiment = updates.overallSentiment;
    if (updates.recentSentiments) updateData.recentSentiments = JSON.stringify(updates.recentSentiments);

    // Mapper le Design Humain
    if (updates.designHumain) {
      updateData.designHumainType = updates.designHumain.type;
      updateData.designHumainProfile = updates.designHumain.profile;
    }

    await prisma.conversationMemory.upsert({
      where: { userId },
      create: {
        userId,
        topics: JSON.stringify(updates.topics || []),
        tone: updates.tone || 'mystical',
        interests: JSON.stringify(updates.interests || []),
        commonQuestions: JSON.stringify(updates.commonQuestions || []),
        favoriteServices: JSON.stringify(updates.favoriteServices || []),
        purchaseHistory: JSON.stringify(updates.purchaseHistory || []),
        birthDate: updates.birthDate || null,
        designHumainType: updates.designHumain?.type || null,
        designHumainProfile: updates.designHumain?.profile || null,
        overallSentiment: updates.overallSentiment || 'neutral',
        recentSentiments: JSON.stringify(updates.recentSentiments || [])
      },
      update: updateData
    });
  } catch (error) {
    console.error('[MemoryManager] Erreur mise à jour mémoire:', error);
  }
}

/**
 * Ajoute un sentiment récent et met à jour le sentiment global
 */
export async function recordSentiment(
  userId: string, 
  sentiment: number // -1 à 1
): Promise<void> {
  try {
    const memory = await loadUserMemory(userId);
    
    // Ajouter le nouveau sentiment
    const recentSentiments = [
      { timestamp: new Date().toISOString(), sentiment },
      ...(memory.recentSentiments || []).slice(0, 9) // Garder les 10 derniers
    ];

    // Calculer le sentiment moyen
    const avgSentiment = recentSentiments.reduce((acc, s) => acc + s.sentiment, 0) / recentSentiments.length;
    
    let overallSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (avgSentiment > 0.2) overallSentiment = 'positive';
    else if (avgSentiment < -0.2) overallSentiment = 'negative';

    await updateUserMemory(userId, {
      overallSentiment,
      recentSentiments
    });
  } catch (error) {
    console.error('[MemoryManager] Erreur enregistrement sentiment:', error);
  }
}

/**
 * Ajoute une question aux questions fréquentes
 */
export async function recordQuestion(userId: string, question: string): Promise<void> {
  try {
    const memory = await loadUserMemory(userId);
    
    // Éviter les doublons et garder les 20 dernières
    const questions = [
      question,
      ...memory.commonQuestions.filter(q => q !== question)
    ].slice(0, 20);

    await updateUserMemory(userId, { commonQuestions: questions });
  } catch (error) {
    console.error('[MemoryManager] Erreur enregistrement question:', error);
  }
}

/**
 * Génère un message de bienvenue personnalisé
 */
export function getPersonalizedGreeting(memory: MemoryData, userName?: string): string {
  const name = userName || 'belle âme';
  
  const greetings = {
    positive: [
      `Quelle joie de te revoir, ${name} ! Ton énergie lumineuse illumine notre sanctuaire. ✨`,
      `Ravie de te retrouver, ${name} ! Je sens que notre connexion cosmique s'intensifie. 🌙`,
      `${name.charAt(0).toUpperCase() + name.slice(1)} ! Les étoiles m'ont chuchoté ton retour. 💫`
    ],
    neutral: [
      `Bienvenue à nouveau dans notre sanctuaire cosmique, ${name}. 🔮`,
      `Te revoilà, ${name}. Quelles mystères souhaites-tu explorer aujourd'hui ? 🌙`,
      `${name.charAt(0).toUpperCase() + name.slice(1)}, je suis là pour t'accompagner. ✨`
    ],
    negative: [
      `Je sens que tu traverses une période délicate, ${name}. Je suis là pour t'éclairer. 💫`,
      `${name.charAt(0).toUpperCase() + name.slice(1)}, prends le temps dont tu as besoin. Notre sanctuaire t'accueille avec bienveillance. 🌙`,
      `Bienvenue, ${name}. Laisse-moi t'offrir un moment de réconfort et de clarté. ✨`
    ]
  };

  const sentimentGreetings = greetings[memory.overallSentiment] || greetings.neutral;
  return sentimentGreetings[Math.floor(Math.random() * sentimentGreetings.length)];
}

/**
 * Génère un contexte pour l'IA basé sur la mémoire
 */
export function buildAIContext(memory: MemoryData, userName?: string): string {
  const parts: string[] = [];

  // Informations de base
  if (userName) {
    parts.push(`L'utilisateur s'appelle ${userName}.`);
  }

  // Design Humain
  if (memory.designHumain) {
    parts.push(`Son Design Humain: ${memory.designHumain.type}, profil ${memory.designHumain.profile}, autorité ${memory.designHumain.authority}.`);
  }

  // Centres d'intérêt
  if (memory.interests.length > 0) {
    parts.push(`Ses centres d'intérêt: ${memory.interests.join(', ')}.`);
  }

  // Sujets de discussion
  if (memory.topics.length > 0) {
    parts.push(`Sujets qu'il/elle apprécie: ${memory.topics.join(', ')}.`);
  }

  // Services favoris
  if (memory.favoriteServices.length > 0) {
    parts.push(`Services qu'il/elle a appréciés: ${memory.favoriteServices.join(', ')}.`);
  }

  // Ton préféré
  parts.push(`Ton de conversation préféré: ${memory.tone}.`);

  // Sentiment récent
  parts.push(`Humeur générale récente: ${memory.overallSentiment}.`);

  return parts.join(' ');
}

// Export par défaut pour compatibilité
const conversationMemory = {
  loadUserMemory,
  updateUserMemory,
  recordSentiment,
  recordQuestion,
  getPersonalizedGreeting,
  buildAIContext
};

export default conversationMemory;
