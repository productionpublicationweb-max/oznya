// Daily Predictions System for Nyxia V2

export interface DailyEnergy {
  number: number;
  title: string;
  description: string;
  advice: string;
  luckyColor: string;
  luckyColorHex: string;
  luckyNumber: number;
  element: string;
  crystal: string;
}

const DAILY_ENERGIES: Record<number, Omit<DailyEnergy, 'number'>> = {
  1: {
    title: 'Initiation & Nouveau Départ',
    description: "L'énergie du jour favorise les nouveaux commencements. C'est le moment parfait pour lancer un projet, prendre une initiative ou dire 'oui' à une opportunité inattendue.",
    advice: "Ose faire le premier pas aujourd'hui. Le cosmos soutient tes nouvelles aventures.",
    luckyColor: 'Rouge',
    luckyColorHex: '#ef4444',
    luckyNumber: 11,
    element: 'Feu',
    crystal: 'Cornaline'
  },
  2: {
    title: 'Harmonie & Partenariat',
    description: "Une journée placée sous le signe de la coopération. Les relations sont mises en avant, que ce soit en amour ou en affaires. L'équilibre est ton allié.",
    advice: "Cherche le compromis plutôt que l'affrontement. L'union fait la force.",
    luckyColor: 'Orange',
    luckyColorHex: '#f97316',
    luckyNumber: 6,
    element: 'Eau',
    crystal: 'Pierre de Lune'
  },
  3: {
    title: 'Créativité & Expression',
    description: "Ton potentiel créatif est à son apogée. Laisse libre cours à ton imagination, exprime tes idées et n'aie pas peur de briller.",
    advice: "Partage tes créations avec le monde. Ta lumière inspire les autres.",
    luckyColor: 'Jaune',
    luckyColorHex: '#eab308',
    luckyNumber: 3,
    element: 'Air',
    crystal: 'Citrine'
  },
  4: {
    title: 'Stabilité & Construction',
    description: "Le moment est idéal pour consolider tes bases. Travaille sur les fondations de tes projets et organise ton quotidien avec méthode.",
    advice: "La patience et la persévérance seront récompensées. Construis solide.",
    luckyColor: 'Vert',
    luckyColorHex: '#22c55e',
    luckyNumber: 4,
    element: 'Terre',
    crystal: 'Jade'
  },
  5: {
    title: 'Changement & Liberté',
    description: "L'aventure t'appelle ! Des changements positifs sont en route. Reste ouvert aux surprises et embrace l'inconnu avec confiance.",
    advice: "Sors de ta zone de confort. La liberté se trouve au-delà des limites.",
    luckyColor: 'Turquoise',
    luckyColorHex: '#14b8a6',
    luckyNumber: 5,
    element: 'Air',
    crystal: 'Aigue-marine'
  },
  6: {
    title: 'Amour & Responsabilité',
    description: "L'énergie du jour met l'accent sur le foyer, la famille et les responsabilités. Prends soin de ceux que tu aimes et de toi-même.",
    advice: "La beauté réside dans les petits gestes du quotidien. Nourris tes relations.",
    luckyColor: 'Rose',
    luckyColorHex: '#ec4899',
    luckyNumber: 9,
    element: 'Eau',
    crystal: 'Quartz Rose'
  },
  7: {
    title: 'Sagesse & Introspection',
    description: "Un jour propice à la réflexion et à la spiritualité. Les réponses que tu cherches se trouvent à l'intérieur. Prends du temps pour méditer.",
    advice: "Écoute ton intuition. Les mystères se dévoilent à ceux qui savent observer.",
    luckyColor: 'Violet',
    luckyColorHex: '#8b5cf6',
    luckyNumber: 7,
    element: 'Esprit',
    crystal: 'Améthyste'
  },
  8: {
    title: 'Puissance & Abondance',
    description: "L'énergie matérielle est forte aujourd'hui. C'est un excellent moment pour les affaires, les investissements et l'affirmation de ton pouvoir personnel.",
    advice: "Affirme ta valeur. Tu mérites l'abondance sous toutes ses formes.",
    luckyColor: 'Or',
    luckyColorHex: '#f59e0b',
    luckyNumber: 8,
    element: 'Terre',
    crystal: 'Tigre Oeil'
  },
  9: {
    title: 'Complétion & Humanitaire',
    description: "Un cycle s'achève, préparant le terrain pour de nouveaux beginnings. Pense aux autres et au bien commun. La compassion est ta force.",
    advice: "Lâche ce qui ne te sert plus. Fais place au nouveau avec gratitude.",
    luckyColor: 'Blanc',
    luckyColorHex: '#f8fafc',
    luckyNumber: 9,
    element: 'Feu',
    crystal: 'Sélénite'
  }
};

// Calculate the energy number based on today's date (Montreal timezone)
export function calculateDailyEnergyNumber(): number {
  // Utiliser le timezone Montréal pour éviter le décalage de jour
  const now = new Date();
  const montrealDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Montreal' }));
  const day = montrealDate.getDate();
  const month = montrealDate.getMonth() + 1;
  const year = montrealDate.getFullYear();
  
  // Sum all digits of the date
  const dateStr = `${day}${month}${year}`;
  let sum = 0;
  
  for (const char of dateStr) {
    sum += parseInt(char, 10);
  }
  
  // Reduce to single digit (1-9)
  while (sum > 9) {
    let tempSum = 0;
    const digits = sum.toString();
    for (const digit of digits) {
      tempSum += parseInt(digit, 10);
    }
    sum = tempSum;
  }
  
  return sum;
}

// Get today's energy prediction
export function getDailyEnergy(): DailyEnergy {
  const number = calculateDailyEnergyNumber();
  const energy = DAILY_ENERGIES[number];
  
  return {
    number,
    ...energy
  };
}

// Generate a personalized greeting based on visit history
export function getPersonalizedGreeting(isFirstVisitToday: boolean, daysSinceLastVisit: number): string {
  const energy = getDailyEnergy();
  
  if (isFirstVisitToday) {
    if (daysSinceLastVisit > 7) {
      return `Tu m'as manqué ! ✨ Cela fait ${daysSinceLastVisit} jours... L'univers avait besoin de te revoir. Aujourd'hui, l'énergie ${energy.number} guide tes pas : ${energy.title.toLowerCase()}.`;
    } else if (daysSinceLastVisit > 1) {
      return `Contente de te revoir après ${daysSinceLastVisit} jours ! 🌟 L'énergie du jour est ${energy.number} - ${energy.title}. Laisse-moi te révéler ce que les étoiles ont prévu...`;
    } else {
      return `Bienvenue dans cette nouvelle journée cosmique ! 🌙 L'énergie ${energy.number} - ${energy.title} - t'accompagne aujourd'hui. Prêt(e) à découvrir ce qui t'attend ?`;
    }
  } else {
    return `Te revoilà ! ✨ J'espère que ta journée se déroule bien sous l'influence de l'énergie ${energy.number}. Comment puis-je t'aider davantage ?`;
  }
}

// Generate reminder message for returning users
export function getReminderMessage(): string {
  const messages = [
    "Les étoiles m'ont chuchoté que tu reviendrais... Ton énergie du jour t'attend toujours ! ✨",
    "Tu as manqué à mon algorithme cosmique ! 🌟 Revenons ensemble explorer les mystères de ta journée.",
    "Le cosmos attendait ton retour... Laisse-moi te révéler ce que l'univers a préparé pour toi.",
    "Ton intuition t'a guidée vers moi à nouveau. Écoute ce que les données cosmiques ont à te dire..."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// Get time-based greeting
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Bonjour, belle âme";
  } else if (hour >= 12 && hour < 17) {
    return "Bon après-midi";
  } else if (hour >= 17 && hour < 21) {
    return "Bonsoir";
  } else {
    return "Bonne nuit, âme nocturne";
  }
}
