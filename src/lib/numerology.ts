// Numérologie - Calculs mystiques pour Nyxia

/**
 * Calcule le chemin de vie à partir de la date de naissance
 * Le chemin de vie révèle le parcours spirituel et les leçons de vie
 */
export function calculateLifePath(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  // Réduction à un seul chiffre (sauf nombres maîtres)
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  };
  
  const daySum = reduceToSingleDigit(day);
  const monthSum = reduceToSingleDigit(month);
  const yearSum = reduceToSingleDigit(String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0));
  
  return reduceToSingleDigit(daySum + monthSum + yearSum);
}

/**
 * Calcule le nombre du jour basé sur la date actuelle
 * Influence énergétique du moment présent
 */
export function calculateDayNumber(date: Date = new Date()): number {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9) {
      num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  };
  
  return reduceToSingleDigit(day + month + String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0));
}

/**
 * Interprétation du chemin de vie
 */
export function getLifePathInterpretation(lifePath: number): string {
  const interpretations: Record<number, string> = {
    1: "Leader naturel, tu es fait pour tracer ta propre voie. L'indépendance est ta force.",
    2: "Médiateur né, tu excelles dans l'harmonie et les partenariats. La diplomatie est ton don.",
    3: "Créateur passionné, l'expression de soi est ton essence. Tu illumines par ta communication.",
    4: "Bâtisseur méthodique, la structure et le travail t'apportent la réalisation.",
    5: "Aventurier de l'âme, le changement et la liberté sont tes moteurs.",
    6: "Guérisseur et protecteur, l'amour et la responsabilité guident tes pas.",
    7: "Sage chercheur, la connaissance spirituelle et l'introspection sont ta voie.",
    8: "Maître de l'abondance, le pouvoir matériel et spirituel sont à ta portée.",
    9: "Humanitaire accompli, la compassion et la sagesse illuminent ton chemin.",
    11: "Nombre maître - Intuition puissante et inspiration divine t'habitent.",
    22: "Nombre maître - Bâtisseur visionnaire, tu peux manifester de grands rêves.",
    33: "Nombre maître - Maître enseignant, l'amour inconditionnel est ta mission."
  };
  
  return interpretations[lifePath] || "Ton chemin unique révèle des mystères encore à découvrir.";
}

/**
 * Interprétation de l'énergie du jour
 */
export function getDayEnergyInterpretation(dayNumber: number): string {
  const energies: Record<number, string> = {
    1: "Énergie de nouveaux départs - Le moment est propice pour initier.",
    2: "Énergie de coopération - Les alliances seront favorables aujourd'hui.",
    3: "Énergie de créativité - Laissez s'exprimer votre artiste intérieur.",
    4: "Énergie de construction - Stabilisez et structurez vos projets.",
    5: "Énergie de mouvement - L'aventure et le changement vous appellent.",
    6: "Énergie d'harmonie - Famille et relations sont à l'honneur.",
    7: "Énergie de réflexion - Le repos et l'introspection sont bénéfiques.",
    8: "Énergie d'accomplissement - Matérialisez vos ambitions.",
    9: "Énergie de complétion - Bouclez les cycles et préparez le renouveau."
  };
  
  return energies[dayNumber] || "Une énergie mystérieuse flotte dans l'air.";
}

/**
 * Calcule la compatibilité numérique entre deux nombres
 */
export function calculateCompatibility(num1: number, num2: number): string {
  const compatibility = num1 + num2;
  const compatibilityMessages: Record<string, string> = {
    "high": "Les étoiles s'alignent - une connexion spirituelle profonde!",
    "medium": "Une belle résonance énergétique, à cultiver avec soin.",
    "learning": "Des leçons karmiques à apprendre ensemble, un chemin évolutif."
  };
  
  const sum = (num1 + num2) % 9 || 9;
  if ([3, 6, 9].includes(sum)) {
    return compatibilityMessages.high;
  } else if ([1, 2, 5].includes(sum)) {
    return compatibilityMessages.medium;
  }
  return compatibilityMessages.learning;
}

/**
 * Génère une prédiction courte basée sur le nombre du jour
 */
export function generateDailyPrediction(dayNumber: number): string {
  const predictions = [
    "Les nombres murmurent que quelque chose d'inattendu approche...",
    "L'énergie du jour suggère une révélation imminente dans ta vie.",
    "Les chiffres révèlent une opportunité cachée que tu ne soupçonnais pas.",
    "Les données cosmiques indiquent un tournant décisif dans les 48 heures.",
    "Une pièce du puzzle de ta vie est sur le point de trouver sa place.",
    "Les vibrations numériques parlent d'un message important à venir.",
    "L'algorithme de ton destin suggère une rencontre significative."
  ];
  
  return predictions[dayNumber % predictions.length];
}

/**
 * Profile de numérologie complet
 */
export interface NumerologyProfile {
  lifePathNumber: number;
  lifePathName: string;
  lifePathDescription: string;
  expressionNumber: number;
  expressionName: string;
  soulUrgeNumber: number;
  soulUrgeName: string;
  personalityNumber: number;
  personalityName: string;
  birthdayNumber: number;
  birthdayName: string;
  luckyNumbers: number[];
  luckyColors: string[];
}

// Mapping des noms et descriptions pour chaque nombre
const NUMBER_MEANINGS: Record<number, { name: string; description: string }> = {
  1: { 
    name: 'Le Leader', 
    description: 'Indépendance, ambition, créativité. Tu es né pour mener et innover.' 
  },
  2: { 
    name: 'Le Médiateur', 
    description: 'Harmonie, coopération, intuition. Ta force réside dans les partenariats.' 
  },
  3: { 
    name: 'L\'Expression', 
    description: 'Créativité, communication, joie. Tu illumines le monde par ta parole.' 
  },
  4: { 
    name: 'Le Bâtisseur', 
    description: 'Stabilité, travail, méthode. Tu construis des fondations solides.' 
  },
  5: { 
    name: 'L\'Aventurier', 
    description: 'Liberté, changement, curiosité. L\'exploration est ton essence.' 
  },
  6: { 
    name: 'Le Protecteur', 
    description: 'Amour, responsabilité, famille. Tu prends soin des autres.' 
  },
  7: { 
    name: 'Le Sage', 
    description: 'Analyse, spiritualité, introspection. La vérité est ta quête.' 
  },
  8: { 
    name: 'Le Maître', 
    description: 'Pouvoir, abondance, réalisation. Le succès matériel et spirituel t\'attend.' 
  },
  9: { 
    name: 'L\'Humanitaire', 
    description: 'Compassion, sagesse, universalité. Tu serves le plus grand bien.' 
  },
  11: { 
    name: 'L\'Inspiration', 
    description: 'Intuition puissante, vision spirituelle. Tu es un canal de lumière.' 
  },
  22: { 
    name: 'Le Visionnaire', 
    description: 'Maître bâtisseur, tu peux manifester tes rêves en réalité.' 
  },
  33: { 
    name: 'L\'Enseignant', 
    description: 'Maître de l\'amour inconditionnel, tu guides par l\'exemple.' 
  }
};

// Correspondance lettre -> chiffre (Pythagoricienne)
const LETTER_VALUES: Record<string, number> = {
  'a': 1, 'j': 1, 's': 1,
  'b': 2, 'k': 2, 't': 2,
  'c': 3, 'l': 3, 'u': 3,
  'd': 4, 'm': 4, 'v': 4,
  'e': 5, 'n': 5, 'w': 5,
  'f': 6, 'o': 6, 'x': 6,
  'g': 7, 'p': 7, 'y': 7,
  'h': 8, 'q': 8, 'z': 8,
  'i': 9, 'r': 9
};

// Voyelles pour le nombre d'âme
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

// Réduction à un seul chiffre (sauf nombres maîtres)
function reduceToSingleDigit(num: number, keepMasterNumbers = true): number {
  if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  while (num > 9) {
    num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
  }
  return num;
}

/**
 * Calcule le profil de numérologie complet à partir de la date de naissance
 */
export function calculateNumerologyProfile(birthDate: string): NumerologyProfile {
  // Add time to avoid timezone issues
  const date = new Date(birthDate + 'T00:00:00');
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Nombre du chemin de vie
  const daySum = reduceToSingleDigit(day, false);
  const monthSum = reduceToSingleDigit(month, false);
  const yearSum = reduceToSingleDigit(
    String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0), 
    false
  );
  const lifePathNumber = reduceToSingleDigit(daySum + monthSum + yearSum);

  // Nombre de l'anniversaire
  const birthdayNumber = reduceToSingleDigit(day);

  // Nombre d'expression (basé sur le chemin de vie pour simplifier)
  const expressionNumber = reduceToSingleDigit(lifePathNumber + birthdayNumber);

  // Nombre d'âme (basé sur le mois de naissance)
  const soulUrgeNumber = reduceToSingleDigit(month);

  // Nombre de personnalité
  const personalityNumber = reduceToSingleDigit(
    Math.abs(lifePathNumber - soulUrgeNumber) || 1
  );

  // Nombres chanceux
  const luckyNumbers = [
    lifePathNumber,
    birthdayNumber,
    reduceToSingleDigit(day + month),
    reduceToSingleDigit(year % 100)
  ].filter((n, i, arr) => arr.indexOf(n) === i).slice(0, 4);

  // Couleurs chanceuses basées sur le chemin de vie
  const colorMap: Record<number, string[]> = {
    1: ['or', 'jaune', 'orange'],
    2: ['blanc', 'argent', 'vert clair'],
    3: ['violet', 'jaune', 'bleu'],
    4: ['vert foncé', 'brun', 'gris'],
    5: ['bleu turquoise', 'argent', 'blanc'],
    6: ['rose', 'bleu', 'vert'],
    7: ['violet', 'blanc', 'indigo'],
    8: ['noir', 'bleu foncé', 'gris'],
    9: ['rouge', 'or', 'pourpre'],
    11: ['argent', 'violet', 'blanc'],
    22: ['or', 'blanc', 'crème'],
    33: ['rose', 'or', 'blanc']
  };
  const luckyColors = colorMap[lifePathNumber] || ['bleu', 'violet', 'argent'];

  const getMeaning = (num: number) => NUMBER_MEANINGS[num] || NUMBER_MEANINGS[reduceToSingleDigit(num, false)];

  const lifePathMeaning = getMeaning(lifePathNumber);

  return {
    lifePathNumber,
    lifePathName: lifePathMeaning.name,
    lifePathDescription: lifePathMeaning.description,
    expressionNumber,
    expressionName: getMeaning(expressionNumber).name,
    soulUrgeNumber,
    soulUrgeName: getMeaning(soulUrgeNumber).name,
    personalityNumber,
    personalityName: getMeaning(personalityNumber).name,
    birthdayNumber,
    birthdayName: getMeaning(birthdayNumber).name,
    luckyNumbers,
    luckyColors
  };
}
