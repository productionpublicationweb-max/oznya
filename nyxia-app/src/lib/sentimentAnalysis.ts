// lib/sentimentAnalysis.ts

/**
 * Analyseur de Sentiment Avancé pour Nyxia
 * Détecte les émotions, négations, intensificateurs et émojis
 */

// Types
export interface SentimentResult {
  score: number; // -1 à 1
  label: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0 à 1
  emotions: string[];
  intensity: 'low' | 'medium' | 'high';
  hasNegation: boolean;
}

// Mots positifs avec leur poids
const POSITIVE_WORDS: Record<string, number> = {
  // Joie et bonheur
  'bonheur': 0.4, 'heureux': 0.4, 'heureuse': 0.4, 'joyeux': 0.4, 'joyeuse': 0.4,
  'félicité': 0.35, 'euphorie': 0.35, 'extase': 0.35,
  
  // Amour et affection
  'amour': 0.4, 'aimer': 0.35, 'adorer': 0.35, 'passion': 0.3, 'tendresse': 0.3,
  'affection': 0.25, 'câlin': 0.2, 'bisou': 0.2,
  
  // Gratitude
  'merci': 0.3, 'gratitude': 0.3, 'reconnaissance': 0.3, 'reconnaissant': 0.25,
  'apprécier': 0.25, 'précieux': 0.2, 'chanceux': 0.25, 'chanceuse': 0.25,
  
  // Satisfaction
  'parfait': 0.35, 'excellent': 0.35, 'génial': 0.3, 'super': 0.25, 'superbe': 0.25,
  'magnifique': 0.35, 'merveilleux': 0.35, 'incroyable': 0.3, 'fantastique': 0.3,
  'formidable': 0.3, 'extraordinaire': 0.35, 'sublime': 0.35, 'divin': 0.3,
  
  // Beauté
  'belle': 0.25, 'beau': 0.25, 'beauté': 0.25, 'joli': 0.2, 'mignon': 0.2,
  
  // Espoir et optimisme
  'espoir': 0.25, 'optimisme': 0.25, 'confiance': 0.25, 'croyance': 0.2,
  'positif': 0.2, 'positive': 0.2, 'optimiste': 0.25,
  
  // Calme et sérénité
  'calme': 0.25, 'serein': 0.25, 'sereine': 0.25, 'paix': 0.3, 'tranquille': 0.2,
  'détente': 0.2, 'relaxation': 0.2, 'apaisement': 0.25,
  
  // Succès
  'succès': 0.3, 'réussite': 0.3, 'accomplissement': 0.3, 'victoire': 0.3,
  'progrès': 0.25, 'avancement': 0.2,
  
  // Motivation
  'motivation': 0.25, 'inspiration': 0.25, 'enthousiasme': 0.3, 'énergie': 0.2,
  'dynamique': 0.2, 'passionnant': 0.25,
  
  // Mots courants
  'bien': 0.15, 'bon': 0.15, 'meilleur': 0.2, 'meilleure': 0.2,
  'agréable': 0.2, 'sympa': 0.2, 'chouette': 0.2, 'cool': 0.2,
  'content': 0.25, 'contente': 0.25, 'satisfait': 0.25, 'satisfaite': 0.25,
  
  // Spiritualité
  'bénédiction': 0.3, 'bénir': 0.25, 'sacré': 0.2, 'lumière': 0.2,
  'illumination': 0.25, 'éveil': 0.25, 'harmonie': 0.25
};

// Mots négatifs avec leur poids
const NEGATIVE_WORDS: Record<string, number> = {
  // Tristesse
  'triste': 0.4, 'tristesse': 0.4, 'pleurer': 0.35, 'larmes': 0.3,
  'chagrin': 0.4, 'deuil': 0.45, 'mélancolie': 0.35, 'nostalgie': 0.25,
  'désespoir': 0.5, 'désespéré': 0.45, 'désespérée': 0.45,
  
  // Peur et anxiété
  'peur': 0.4, 'anxiété': 0.4, 'angoisse': 0.45, 'panique': 0.45,
  'terreur': 0.5, 'effroi': 0.5, 'phobie': 0.4, 'crainte': 0.35,
  'inquiet': 0.35, 'inquiète': 0.35, 'inquiétude': 0.35,
  'stress': 0.35, 'tendu': 0.25, 'tendue': 0.25,
  
  // Colère
  'colère': 0.45, 'énervement': 0.35, 'irritation': 0.3, 'agacement': 0.3,
  'furieux': 0.5, 'furieuse': 0.5, 'rage': 0.5, 'haine': 0.5,
  'frustration': 0.35, 'frustré': 0.35, 'frustrée': 0.35,
  
  // Douleur
  'douleur': 0.45, 'souffrance': 0.45, 'mal': 0.3, 'blessure': 0.35,
  'blessé': 0.35, 'blessée': 0.35, 'douloureux': 0.35, 'douloureuse': 0.35,
  
  // Dépression
  'dépression': 0.5, 'déprimé': 0.45, 'déprimée': 0.45, 'déprime': 0.4,
  'mélancolique': 0.35, 'abattement': 0.4, 'apathie': 0.35,
  
  // Fatigue
  'fatigue': 0.3, 'fatigué': 0.3, 'fatiguée': 0.3, 'épuisé': 0.35, 'épuisée': 0.35,
  'épuisement': 0.35, 'lassitude': 0.3, 'crevé': 0.25, 'crevée': 0.25,
  
  // Confusion
  'perdu': 0.3, 'perdue': 0.3, 'perte': 0.3, 'perdre': 0.25,
  'confus': 0.25, 'confuse': 0.25, 'confusion': 0.25,
  
  // Difficultés
  'problème': 0.3, 'difficulté': 0.25, 'difficile': 0.25,
  'obstacle': 0.2, 'bloqué': 0.25, 'bloquée': 0.25,
  'échec': 0.35, 'raté': 0.25, 'ratée': 0.25,
  
  // Solitude
  'seul': 0.35, 'seule': 0.35, 'solitude': 0.35, 'isolé': 0.3, 'isolée': 0.3,
  'abandonné': 0.4, 'abandonnée': 0.4, 'abandon': 0.35,
  
  // Culpabilité
  'culpabilité': 0.35, 'coupable': 0.3, 'honte': 0.35, 'honteux': 0.3, 'honteuse': 0.3,
  'remords': 0.3, 'regret': 0.25, 'regretter': 0.25,
  
  // Mots courants
  'mauvais': 0.25, 'mauvaise': 0.25, 'pire': 0.3,
  'négatif': 0.2, 'négative': 0.2,
  'ennui': 0.25, 'ennuyeux': 0.2, 'ennuyeuse': 0.2,
  
  // Rejet
  'rejet': 0.35, 'rejeté': 0.35, 'rejetée': 0.35, 'exclu': 0.3, 'exclue': 0.3
};

// Intensificateurs
const INTENSIFIERS: Record<string, number> = {
  'très': 1.5, 'vraiment': 1.5, 'tellement': 1.6, 'extrêmement': 1.8,
  'incroyablement': 1.7, 'absolument': 1.6, 'complètement': 1.5,
  'totalement': 1.5, 'énormément': 1.6, 'immensément': 1.7,
  'particulièrement': 1.4, 'spécialement': 1.4, 'surtout': 1.3,
  'super': 1.4, 'ultra': 1.5, 'hyper': 1.4, 'trop': 1.3,
  'grave': 1.3, 'sérieusement': 1.3,
  'incroyable': 1.4, 'dingue': 1.3, 'fou': 1.3, 'folle': 1.3
};

// Diminueurs
const DIMINISHERS: Record<string, number> = {
  'un': 1, 'peu': 0.5, 'légèrement': 0.5, 'plutôt': 0.7, 'assez': 0.75,
  'quelque': 0.6, 'à': 1, 'peine': 0.4,
  'moyennement': 0.6, 'passablement': 0.6, 'relativement': 0.7,
  'plus': 1, 'moins': 0.6
};

// Mots de négation
const NEGATION_WORDS = [
  'ne', "n'", 'pas', 'non', 'aucun', 'aucune', 'jamais', 'rien',
  'personne', 'ni', 'sans', 'guère', 'point'
];

// Portée de la négation
const NEGATION_SCOPE = 4;

// Émojis positifs
const POSITIVE_EMOJIS: Record<string, number> = {
  '😊': 0.3, '😄': 0.35, '😀': 0.3, '😁': 0.35, '😆': 0.3,
  '🥰': 0.4, '😍': 0.4, '🤩': 0.35, '😘': 0.3, '😗': 0.25,
  '❤️': 0.4, '💕': 0.35, '💖': 0.4, '💗': 0.35, '💝': 0.35,
  '✨': 0.25, '🌟': 0.3, '⭐': 0.25, '💫': 0.3, '🌈': 0.3,
  '🎉': 0.35, '🎊': 0.3, '🙌': 0.3, '👏': 0.25, '💪': 0.25,
  '🙏': 0.3, '👍': 0.25, '👌': 0.2, '✅': 0.2,
  '🌞': 0.3, '☀️': 0.25, '🌸': 0.25, '🌺': 0.25, '🌻': 0.25,
  '🦋': 0.25, '🔮': 0.2, '🌙': 0.2,
  '❤': 0.4, '💜': 0.35, '💙': 0.35, '💚': 0.35, '🧡': 0.35,
  '🥳': 0.35, '😇': 0.3, '🤗': 0.3, '😌': 0.25, '☺️': 0.3,
  '💞': 0.35, '💓': 0.35, '💘': 0.35, '💟': 0.3
};

// Émojis négatifs
const NEGATIVE_EMOJIS: Record<string, number> = {
  '😢': 0.35, '😭': 0.45, '😿': 0.35, '🥺': 0.25,
  '😞': 0.35, '😔': 0.3, '😟': 0.3, '🙁': 0.25, '☹️': 0.35,
  '💔': 0.45, '😫': 0.4, '😩': 0.4, '😣': 0.3, '😖': 0.3,
  '😤': 0.35, '😡': 0.45, '🤬': 0.5, '😠': 0.4, '🤯': 0.35,
  '😰': 0.4, '😨': 0.4, '😱': 0.45, '😳': 0.25,
  '🤢': 0.35, '🤮': 0.4, '😷': 0.25, '🤒': 0.3, '🤕': 0.3,
  '👎': 0.3, '🙅': 0.3, '🚫': 0.25,
  '🌑': 0.15, '💀': 0.35, '☠️': 0.35, '⚰️': 0.4, '🖤': 0.2,
  '😥': 0.3, '😓': 0.3, '🥲': 0.2
};

/**
 * Classe d'analyse de sentiment
 */
export class SentimentAnalyzer {
  
  /**
   * Analyse le sentiment d'un texte
   */
  static analyze(text: string): SentimentResult {
    const lowerText = text.toLowerCase();
    const words = this.tokenize(lowerText);
    
    let score = 0;
    const emotions: string[] = [];
    let hasNegation = false;
    let totalWeight = 0;
    
    // Analyser les émojis
    const emojiResult = this.analyzeEmojis(text);
    score += emojiResult.score;
    emotions.push(...emojiResult.emotions);
    
    // Trouver les négations
    const negationPositions = this.findNegations(words);
    hasNegation = negationPositions.length > 0;
    
    // Analyser chaque mot
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let wordScore = 0;
      let wordWeight = 1;
      
      if (POSITIVE_WORDS[word]) {
        wordScore = POSITIVE_WORDS[word];
        emotions.push(word);
      } else if (NEGATIVE_WORDS[word]) {
        wordScore = -NEGATIVE_WORDS[word];
        emotions.push(word);
      }
      
      if (wordScore !== 0) {
        // Intensificateur
        const prevWord = i > 0 ? words[i - 1] : '';
        if (INTENSIFIERS[prevWord]) {
          wordScore *= INTENSIFIERS[prevWord];
          wordWeight = INTENSIFIERS[prevWord];
        } else if (DIMINISHERS[prevWord]) {
          wordScore *= DIMINISHERS[prevWord];
          wordWeight = DIMINISHERS[prevWord];
        }
        
        // Négation
        const isNegated = this.isInNegationScope(i, negationPositions, words);
        if (isNegated) {
          wordScore *= -0.5;
        }
        
        score += wordScore;
        totalWeight += wordWeight;
      }
    }
    
    // Normaliser
    const normalizedScore = Math.max(-1, Math.min(1, score));
    const confidence = Math.min(1, totalWeight / 3);
    const intensity: 'low' | 'medium' | 'high' = 
      Math.abs(normalizedScore) > 0.5 ? 'high' :
      Math.abs(normalizedScore) > 0.25 ? 'medium' : 'low';
    
    let label: 'positive' | 'neutral' | 'negative';
    if (normalizedScore > 0.15) {
      label = 'positive';
    } else if (normalizedScore < -0.15) {
      label = 'negative';
    } else {
      label = 'neutral';
    }
    
    return {
      score: Number(normalizedScore.toFixed(3)),
      label,
      confidence: Number(confidence.toFixed(2)),
      emotions: Array.from(new Set(emotions)),
      intensity,
      hasNegation
    };
  }
  
  private static tokenize(text: string): string[] {
    return text
      .replace(/[^\wàâäéèêëïîôùûüç'\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }
  
  private static findNegations(words: string[]): number[] {
    const positions: number[] = [];
    for (let i = 0; i < words.length; i++) {
      if (NEGATION_WORDS.includes(words[i])) {
        positions.push(i);
      }
    }
    return positions;
  }
  
  private static isInNegationScope(
    wordIndex: number, 
    negationPositions: number[], 
    words: string[]
  ): boolean {
    for (const negPos of negationPositions) {
      if (wordIndex > negPos && wordIndex <= negPos + NEGATION_SCOPE) {
        for (let i = negPos; i < wordIndex; i++) {
          const w = words[i];
          if (w === '.' || w === '!' || w === '?' || w === ';') {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
  
  private static analyzeEmojis(text: string): { score: number; emotions: string[] } {
    let score = 0;
    const emotions: string[] = [];
    
    for (const [emoji, weight] of Object.entries(POSITIVE_EMOJIS)) {
      if (text.includes(emoji)) {
        score += weight;
        emotions.push(`emoji:${emoji}`);
      }
    }
    
    for (const [emoji, weight] of Object.entries(NEGATIVE_EMOJIS)) {
      if (text.includes(emoji)) {
        score -= weight;
        emotions.push(`emoji:${emoji}`);
      }
    }
    
    return { score, emotions };
  }
  
  /**
   * Génère une réponse empathique
   */
  static getEmpatheticResponse(result: SentimentResult): string {
    const { label, intensity, hasNegation } = result;
    
    const responses = {
      positive: {
        high: [
          "Je ressens cette magnifique énergie ! C'est vraiment inspirant ! ✨🌟",
          "Quelle belle vibration ! Ta joie est contagieuse ! 💫",
          "Ton enthousiasme illumine notre échange ! 🌈"
        ],
        medium: [
          "Je sens cette belle énergie positive ! ✨",
          "Quelle belle vibration ! Continue sur cette voie. 🌟",
          "Ta positivité est un véritable rayon de soleil ! ☀️"
        ],
        low: [
          "C'est agréable de sentir cette douce positivité. 🌙",
          "Une belle énergie tranquille émane de toi. 💫",
          "Je t'accompagne avec joie dans cette dynamique. ✨"
        ]
      },
      neutral: {
        high: [
          "Je t'écoute avec toute mon attention. 🌙",
          "Je suis présente pour t'accompagner. 💫",
          "Je ressens beaucoup de mouvement en toi. 🔮"
        ],
        medium: [
          "Je t'écoute avec attention et bienveillance. 🌙",
          "Je suis là pour t'accompagner. 💫",
          "Chaque échange est une opportunité de découverte. ✨"
        ],
        low: [
          "Je t'écoute. 🌙",
          "Je suis présente pour toi. 💫",
          "Dis-moi ce qui t'inspire. ✨"
        ]
      },
      negative: {
        high: [
          "Je ressens une souffrance importante. Sache que tu n'es pas seule, je suis là pour t'accompagner. 💙🌸",
          "Ce que tu traverses semble très difficile. Tes émotions sont légitimes. 🤲✨",
          "Je sens une grande détresse. Respire, tu es en sécurité ici. 🌧️🌈"
        ],
        medium: [
          "Je sens que tu traverses un moment délicat. Je suis là pour t'écouter. 💙",
          "Tes émotions sont importantes. Prends le temps dont tu as besoin. 🌸",
          "Je ressens ta douleur. Cet espace est un refuge pour toi. 🤲"
        ],
        low: [
          "Je perçois une ombre légère. Je t'écoute avec bienveillance. 🌙",
          "Quelque chose semble te préoccuper. Je suis là pour toi. 💫",
          "Je t'invite à partager ce qui te pèse. 🌸"
        ]
      }
    };
    
    const intensityResponses = responses[label][intensity];
    let response = intensityResponses[Math.floor(Math.random() * intensityResponses.length)];
    
    if (hasNegation && label !== 'neutral') {
      const nuanceAdditions = [
        " Je sens aussi une nuance importante dans tes mots.",
        " Il y a une subtilité dans ce que tu exprimes.",
        " J'entends la complexité de ce que tu partages."
      ];
      response += nuanceAdditions[Math.floor(Math.random() * nuanceAdditions.length)];
    }
    
    return response;
  }
  
  static quickAnalyze(text: string): 'positive' | 'neutral' | 'negative' {
    return this.analyze(text).label;
  }
  
  /**
   * Version rapide avec juste le label
   */
  static getLabel(text: string): 'positive' | 'neutral' | 'negative' {
    return this.analyze(text).label;
  }
}

export default SentimentAnalyzer;
