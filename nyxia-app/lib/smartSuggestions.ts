// lib/smartSuggestions.ts

// Définition du type ConversationMemory
interface ConversationMemory {
  messages: Array<{
    role: string;
    content: string;
    timestamp?: number;
  }>;
  userProfile?: {
    name?: string;
    interests?: string[];
    painPoints?: string[];
  };
  context?: Record<string, any>;
}

export class SuggestionEngine {
  static analyze(message: string, memory: ConversationMemory): string[] {
    const suggestions: string[] = [];
    const lowerMessage = message.toLowerCase();

    // Analyse des intentions
    if (lowerMessage.includes('aide') || lowerMessage.includes('comment')) {
      suggestions.push("💡 Je peux t'expliquer comment utiliser Oznya");
      suggestions.push("📚 Découvre les fonctionnalités principales");
    }

    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif')) {
      suggestions.push("💰 Voir les options d'abonnement");
      suggestions.push("🎁 Découvrir l'offre d'essai");
    }

    // Suggestions basées sur l'historique
    if (memory.messages.length > 3) {
      suggestions.push("📊 Résumé de notre conversation");
    }

    // Suggestions contextuelles
    if (memory.userProfile?.painPoints) {
      suggestions.push("🎯 Solutions adaptées à tes besoins");
    }

    return suggestions.slice(0, 3); // Maximum 3 suggestions
  }

  static getQuickActions(): string[] {
    return [
      "🚀 Démarrer une nouvelle conversation",
      "📖 Voir l'historique",
      "⚙️ Personnaliser mes préférences"
    ];
  }
}
