// lib/smartSuggestions.ts
import { MemoryData } from './conversationMemory';

// Types pour les suggestions
export interface Suggestion {
  id: string;
  label: string;
  emoji: string;
  type: 'product' | 'service' | 'action' | 'reading';
  priority: number; // Plus élevé = plus important
}

// Catalogue des suggestions disponibles
const SUGGESTION_CATALOG: Record<string, Suggestion> = {
  // Produits
  serenite: {
    id: 'serenite',
    label: 'Coffret Sérénité Radicale',
    emoji: '🌙',
    type: 'product',
    priority: 10
  },
  abondance: {
    id: 'abondance',
    label: 'Coffret Abondance',
    emoji: '💰',
    type: 'product',
    priority: 10
  },
  armistice: {
    id: 'armistice',
    label: 'Coffret Armistice du Soir',
    emoji: '🌟',
    type: 'product',
    priority: 10
  },
  fuite_presence: {
    id: 'fuite_presence',
    label: 'Coffret De la Fuite à la Présence',
    emoji: '🦋',
    type: 'product',
    priority: 9
  },
  regard_securisant: {
    id: 'regard_securisant',
    label: 'Coffret Regard Sécurisant',
    emoji: '👁️',
    type: 'product',
    priority: 9
  },
  
  // Services payants
  liberation: {
    id: 'liberation',
    label: 'Séance de libération émotionnelle',
    emoji: '📅',
    type: 'service',
    priority: 8
  },
  neuro_alchimie: {
    id: 'neuro_alchimie',
    label: 'Formation Neuro-Alchimie',
    emoji: '🎯',
    type: 'service',
    priority: 7
  },
  consultation: {
    id: 'consultation',
    label: 'Consultation personnalisée',
    emoji: '💫',
    type: 'service',
    priority: 6
  },
  
  // Actions (non gratuites)
  profil_complet: {
    id: 'profil_complet',
    label: 'Analyse de profil complète',
    emoji: '✨',
    type: 'service',
    priority: 5
  },
  guidance: {
    id: 'guidance',
    label: 'Guidance spirituelle approfondie',
    emoji: '🔮',
    type: 'service',
    priority: 5
  }
};

// Mots-clés et leurs associations (produits et services payants uniquement)
const KEYWORD_ASSOCIATIONS: Record<string, string[]> = {
  // Émotions négatives
  'stress': ['serenite', 'liberation', 'consultation'],
  'anxiété': ['serenite', 'liberation', 'armistice'],
  'angoisse': ['serenite', 'liberation', 'consultation'],
  'peur': ['regard_securisant', 'liberation', 'consultation'],
  'colère': ['fuite_presence', 'liberation', 'consultation'],
  'tristesse': ['liberation', 'consultation', 'serenite'],
  'deprime': ['liberation', 'serenite', 'consultation'],
  'fatigue': ['armistice', 'serenite', 'consultation'],
  
  // Sommeil
  'sommeil': ['armistice', 'serenite', 'consultation'],
  'dormir': ['armistice', 'consultation', 'serenite'],
  'insomnie': ['armistice', 'serenite', 'consultation'],
  'nuit': ['armistice', 'consultation', 'serenite'],
  'rêve': ['armistice', 'consultation', 'guidance'],
  
  // Argent/Abondance
  'argent': ['abondance', 'neuro_alchimie', 'consultation'],
  'abondance': ['abondance', 'neuro_alchimie', 'consultation'],
  'financier': ['abondance', 'neuro_alchimie', 'consultation'],
  'richesse': ['abondance', 'consultation', 'guidance'],
  'prospérité': ['abondance', 'neuro_alchimie', 'consultation'],
  
  // Amour/Relations
  'amour': ['regard_securisant', 'consultation', 'guidance'],
  'couple': ['regard_securisant', 'consultation', 'guidance'],
  'relation': ['regard_securisant', 'consultation', 'guidance'],
  'cœur': ['regard_securisant', 'liberation', 'consultation'],
  
  // Spiritualité
  'spiritualité': ['profil_complet', 'guidance', 'consultation'],
  'spirituel': ['profil_complet', 'guidance', 'consultation'],
  'âme': ['profil_complet', 'guidance', 'consultation'],
  'destin': ['profil_complet', 'guidance', 'consultation'],
  'avenir': ['guidance', 'consultation', 'profil_complet'],
  'chemin': ['profil_complet', 'guidance', 'consultation'],
  
  // Divination (redirigé vers services payants)
  'tarot': ['guidance', 'consultation', 'profil_complet'],
  'carte': ['guidance', 'consultation'],
  'rune': ['guidance', 'consultation', 'profil_complet'],
  'oracle': ['guidance', 'consultation', 'profil_complet'],
  'prédiction': ['guidance', 'consultation', 'profil_complet'],
  
  // Connaissance de soi
  'design': ['profil_complet', 'consultation'],
  'numérologie': ['profil_complet', 'consultation', 'guidance'],
  'profil': ['profil_complet', 'consultation', 'guidance'],
  'personnalité': ['profil_complet', 'consultation', 'neuro_alchimie'],
  'connaissance': ['profil_complet', 'consultation', 'neuro_alchimie'],
  
  // Méditation/Paix
  'méditation': ['serenite', 'consultation', 'armistice'],
  'calme': ['serenite', 'consultation', 'armistice'],
  'paix': ['serenite', 'fuite_presence', 'consultation'],
  'relaxation': ['serenite', 'armistice', 'consultation']
};

// Suggestions basées sur le Design Humain (services payants uniquement)
const DESIGN_TYPE_SUGGESTIONS: Record<string, string[]> = {
  'Manifesteur': ['neuro_alchimie', 'liberation', 'consultation'],
  'Générateur': ['serenite', 'abondance', 'consultation'],
  'Générateur Manifesteur': ['neuro_alchimie', 'abondance', 'liberation', 'consultation'],
  'Projecteur': ['regard_securisant', 'profil_complet', 'consultation'],
  'Reflecteur': ['armistice', 'profil_complet', 'consultation']
};

// Suggestions basées sur le sentiment (services payants uniquement)
const SENTIMENT_SUGGESTIONS: Record<string, string[]> = {
  'positive': ['abondance', 'neuro_alchimie', 'profil_complet'],
  'neutral': ['consultation', 'profil_complet', 'guidance'],
  'negative': ['serenite', 'liberation', 'armistice', 'consultation']
};

/**
 * Analyse un message et retourne des suggestions pertinentes
 */
export function analyzeSuggestions(
  message: string, 
  memory: MemoryData
): Suggestion[] {
  const lowerMessage = message.toLowerCase();
  const suggestionScores: Map<string, number> = new Map();

  // 1. Analyser les mots-clés du message
  for (const [keyword, suggestionIds] of Object.entries(KEYWORD_ASSOCIATIONS)) {
    if (lowerMessage.includes(keyword)) {
      for (const id of suggestionIds) {
        const current = suggestionScores.get(id) || 0;
        suggestionScores.set(id, current + 10);
      }
    }
  }

  // 2. Suggestions basées sur l'historique
  for (const question of memory.commonQuestions.slice(0, 5)) {
    const lowerQ = question.toLowerCase();
    for (const [keyword, suggestionIds] of Object.entries(KEYWORD_ASSOCIATIONS)) {
      if (lowerQ.includes(keyword)) {
        for (const id of suggestionIds) {
          const current = suggestionScores.get(id) || 0;
          suggestionScores.set(id, current + 3); // Moins prioritaire que le message actuel
        }
      }
    }
  }

  // 3. Suggestions basées sur le Design Humain
  if (memory.designHumain?.type) {
    const typeSuggestions = DESIGN_TYPE_SUGGESTIONS[memory.designHumain.type] || [];
    for (const id of typeSuggestions) {
      const current = suggestionScores.get(id) || 0;
      suggestionScores.set(id, current + 5);
    }
  }

  // 4. Suggestions basées sur le sentiment
  const sentimentSuggestions = SENTIMENT_SUGGESTIONS[memory.overallSentiment] || [];
  for (const id of sentimentSuggestions) {
    const current = suggestionScores.get(id) || 0;
    suggestionScores.set(id, current + 2);
  }

  // 5. Éviter les suggestions déjà vues (purchaseHistory)
  for (const purchase of memory.purchaseHistory) {
    const lowerP = purchase.toLowerCase();
    for (const [id] of suggestionScores) {
      if (lowerP.includes(id.toLowerCase())) {
        suggestionScores.delete(id);
      }
    }
  }

  // 6. Trier par score et récupérer les suggestions
  const sortedIds = Array.from(suggestionScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  // 7. Convertir en objets Suggestion
  const suggestions: Suggestion[] = sortedIds
    .map(id => SUGGESTION_CATALOG[id])
    .filter(Boolean);

  // Si pas assez de suggestions, ajouter des suggestions par défaut (payantes)
  if (suggestions.length < 3) {
    const defaultSuggestions = ['consultation', 'profil_complet', 'guidance'];
    for (const id of defaultSuggestions) {
      if (!suggestions.find(s => s.id === id) && SUGGESTION_CATALOG[id]) {
        suggestions.push(SUGGESTION_CATALOG[id]);
        if (suggestions.length >= 3) break;
      }
    }
  }

  return suggestions;
}

/**
 * Génère un texte de suggestion naturel
 */
export function formatSuggestions(suggestions: Suggestion[]): string[] {
  return suggestions.map(s => `${s.emoji} ${s.label}`);
}

/**
 * Génère une réponse avec suggestions intégrées
 */
export function generateSuggestionResponse(
  suggestions: Suggestion[], 
  context?: string
): string {
  if (suggestions.length === 0) {
    return '';
  }

  const intro = context 
    ? `En lien avec ${context}, je te suggère:`
    : 'Je sens que cela pourrait t\'accompagner:';

  const formattedList = suggestions
    .map(s => `• ${s.emoji} **${s.label}**`)
    .join('\n');

  return `${intro}\n\n${formattedList}`;
}

const smartSuggestions = {
  analyzeSuggestions,
  formatSuggestions,
  generateSuggestionResponse
};

export default smartSuggestions;
