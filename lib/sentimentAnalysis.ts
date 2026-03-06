// lib/sentimentAnalysis.ts
export class SentimentAnalyzer {
  private static positiveWords = [
    'merci', 'génial', 'super', 'parfait', 'excellent', 'incroyable',
    'magnifique', 'belle', 'joie', 'bonheur', 'amour', 'gratitude'
  ];

  private static negativeWords = [
    'triste', 'difficile', 'problème', 'peur', 'anxiété', 'stress',
    'mal', 'douleur', 'souffrance', 'inquiète', 'perdue'
  ];

  static analyze(text: string): {
    score: number; // -1 à 1
    label: 'positive' | 'neutral' | 'negative';
    emotions: string[];
  } {
    const lowerText = text.toLowerCase();
    let score = 0;
    const emotions: string[] = [];

    // Analyse des mots
    this.positiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        score += 0.1;
        emotions.push(word);
      }
    });

    this.negativeWords.forEach(word => {
      if (lowerText.includes(word)) {
        score -= 0.1;
        emotions.push(word);
      }
    });

    // Normalisation
    score = Math.max(-1, Math.min(1, score));

    return {
      score,
      label: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
      emotions
    };
  }

  static getEmpatheticResponse(sentiment: 'positive' | 'neutral' | 'negative'): string {
    const responses = {
      positive: [
        "Je ressens cette belle énergie qui émane de toi ! ✨",
        "Quelle magnifique vibration ! Continue de rayonner ainsi. 🌟"
      ],
      neutral: [
        "Je t'écoute avec toute mon attention. 🌙",
        "Je suis là pour t'accompagner dans cette exploration. 💫"
      ],
      negative: [
        "Je sens que tu traverses un moment délicat. Sache que je suis là pour toi. 💙",
        "Tes émotions sont légitimes et importantes. Prenons le temps d'explorer ensemble. 🌸"
      ]
    };

    const options = responses[sentiment];
    return options[Math.floor(Math.random() * options.length)];
  }
}
