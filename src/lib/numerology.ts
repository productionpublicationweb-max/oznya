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
 * Calcule le nombre du jour basé sur la date actuelle (timezone Montréal)
 * Influence énergétique du moment présent
 */
export function calculateDayNumber(date: Date = new Date()): number {
  // Utiliser le timezone Montréal pour éviter les problèmes de changement de jour
  const montrealDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Montreal' }));
  const day = montrealDate.getDate();
  const month = montrealDate.getMonth() + 1;
  const year = montrealDate.getFullYear();
  
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9) {
      num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  };
  
  return reduceToSingleDigit(day + month + String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0));
}

/**
 * Obtient la date formatée en français (timezone Montréal)
 */
export function getFormattedDate(): { date: Date; formatted: string; weekday: string } {
  const now = new Date();
  const montrealDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Montreal' }));
  
  return {
    date: montrealDate,
    formatted: montrealDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    weekday: montrealDate.toLocaleDateString('fr-FR', { weekday: 'long' })
  };
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
