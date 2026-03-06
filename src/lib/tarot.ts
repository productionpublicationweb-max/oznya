// Tarot Card Data - Major Arcana
export interface TarotCard {
  id: number;
  name: string;
  nameFR: string;
  image: string;
  keywords: string[];
  upright: string;
  reversed: string;
  element?: string;
  planet?: string;
  zodiac?: string;
}

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    nameFR: "Le Mat",
    image: "/tarot/00-fool.png",
    keywords: ["Nouveau départ", "Innocence", "Spontanéité", "Aventure"],
    upright: "Nouveau départ, prise de risque, foi en l'avenir, liberté d'esprit",
    reversed: "Imprudence, risque inconsidéré, naïveté, refus de changer",
    element: "Air",
    planet: "Uranus"
  },
  {
    id: 1,
    name: "The Magician",
    nameFR: "Le Bateleur",
    image: "/tarot/01-magician.png",
    keywords: ["Manifestation", "Pouvoir", "Action", "Créativité"],
    upright: "Talent, compétences, volonté, nouveau projet qui réussit",
    reversed: "Manipulation, tromperie, manque de direction, talents gaspillés",
    element: "Air",
    planet: "Mercure"
  },
  {
    id: 2,
    name: "The High Priestess",
    nameFR: "La Papesse",
    image: "/tarot/02-high-priestess.png",
    keywords: ["Intuition", "Mystère", "Sagesse intérieure", "Secret"],
    upright: "Intuition puissante, secrets révélés, sagesse spirituelle",
    reversed: "Secrets, information cachée, déconnexion spirituelle",
    element: "Eau",
    planet: "Lune"
  },
  {
    id: 3,
    name: "The Empress",
    nameFR: "L'Impératrice",
    image: "/tarot/03-empress.png",
    keywords: ["Féminité", "Abondance", "Création", "Nature"],
    upright: "Abondance, fertilité, créativité, maternité, nature",
    reversed: "Blocage créatif, dépendance, problèmes maternels",
    element: "Terre",
    planet: "Vénus"
  },
  {
    id: 4,
    name: "The Emperor",
    nameFR: "L'Empereur",
    image: "/tarot/04-emperor.png",
    keywords: ["Autorité", "Structure", "Pouvoir", "Stabilité"],
    upright: "Autorité, structure, contrôle, père, stabilité",
    reversed: "Tyrannie, rigidité, manque de discipline, abus de pouvoir",
    element: "Feu",
    planet: "Mars"
  },
  {
    id: 5,
    name: "The Hierophant",
    nameFR: "Le Pape",
    image: "/tarot/05-hierophant.png",
    keywords: ["Tradition", "Enseignement", "Spiritualité", "Conformité"],
    upright: "Tradition, institutions, enseignement spirituel, mentorat",
    reversed: "Rebelle, non-conformisme, nouvelles approches spirituelles",
    element: "Terre",
    planet: "Jupiter"
  },
  {
    id: 6,
    name: "The Lovers",
    nameFR: "Les Amoureux",
    image: "/tarot/06-lovers.png",
    keywords: ["Amour", "Harmonie", "Choix", "Relations"],
    upright: "Amour, harmonie, relations, choix important, alignement",
    reversed: "Déséquilibre, déconnexion, mauvais choix, conflit",
    element: "Air",
    planet: "Vénus"
  },
  {
    id: 7,
    name: "The Chariot",
    nameFR: "Le Chariot",
    image: "/tarot/07-chariot.png",
    keywords: ["Victoire", "Détermination", "Contrôle", "Volonté"],
    upright: "Victoire, succès, détermination, voyage, conquête",
    reversed: "Perte de contrôle, agressivité, obstacles, manque de direction",
    element: "Eau",
    planet: "Cancer"
  },
  {
    id: 8,
    name: "Strength",
    nameFR: "La Force",
    image: "/tarot/08-strength.png",
    keywords: ["Force", "Courage", "Patience", "Compassion"],
    upright: "Courage, force intérieure, patience, douceur, maîtrise de soi",
    reversed: "Doute de soi, faiblesse, manque de confiance, abuse de pouvoir",
    element: "Feu",
    planet: "Lion"
  },
  {
    id: 9,
    name: "The Hermit",
    nameFR: "L'Hermite",
    image: "/tarot/09-hermit.png",
    keywords: ["Solitude", "Sagesse", "Introspection", "Guidage"],
    upright: "Introspection, solitude, sagesse, guide intérieur, recherche",
    reversed: "Isolement, solitude forcée, retrait du monde",
    element: "Terre",
    planet: "Vierge"
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameFR: "La Roue de Fortune",
    image: "/tarot/10-wheel.png",
    keywords: ["Destin", "Cycle", "Chance", "Transformation"],
    upright: "Bonne fortune, destin, changement positif, cycle de vie",
    reversed: "Mauvaise chance, résistance au changement, destin défavorable",
    element: "Feu",
    planet: "Jupiter"
  },
  {
    id: 11,
    name: "Justice",
    nameFR: "La Justice",
    image: "/tarot/11-justice.png",
    keywords: ["Justice", "Vérité", "Équilibre", "Karma"],
    upright: "Justice, vérité, équilibre, cause et effet, légalité",
    reversed: "Injustice, malhonnêteté, déséquilibre, manque de responsabilité",
    element: "Air",
    planet: "Balance"
  },
  {
    id: 12,
    name: "The Hanged Man",
    nameFR: "Le Pendu",
    image: "/tarot/12-hanged-man.png",
    keywords: ["Suspension", "Lâcher-prise", "Perspective", "Sacrifice"],
    upright: "Pause, lâcher-prise, nouvelle perspective, sacrifice, attente",
    reversed: "Retard, résistance, indécision, stagner",
    element: "Eau",
    planet: "Neptune"
  },
  {
    id: 13,
    name: "Death",
    nameFR: "La Mort",
    image: "/tarot/13-death.png",
    keywords: ["Transformation", "Fin", "Renouveau", "Changement"],
    upright: "Transformation, fin d'un cycle, changement profond, renaissance",
    reversed: "Résistance au changement, stagnation, peur de l'inconnu",
    element: "Eau",
    planet: "Scorpion"
  },
  {
    id: 14,
    name: "Temperance",
    nameFR: "Tempérance",
    image: "/tarot/14-temperance.png",
    keywords: ["Équilibre", "Harmonie", "Patience", "Modération"],
    upright: "Équilibre, modération, patience, guérison, harmonie",
    reversed: "Déséquilibre, excès, impatience, manque de vision",
    element: "Feu",
    planet: "Sagittaire"
  },
  {
    id: 15,
    name: "The Devil",
    nameFR: "Le Diable",
    image: "/tarot/15-devil.png",
    keywords: ["Attachement", "Ombre", "Tentation", "Matérialisme"],
    upright: "Attachements malsains, dépendance, matérialisme, ombre",
    reversed: "Libération, briser les chaînes, reprendre le pouvoir",
    element: "Terre",
    planet: "Capricorne"
  },
  {
    id: 16,
    name: "The Tower",
    nameFR: "La Maison Dieu",
    image: "/tarot/16-tower.png",
    keywords: ["Bouleversement", "Révélation", "Libération", "Changement brutal"],
    upright: "Bouleversement, révélation, destruction nécessaire, changement soudain",
    reversed: "Éviter le désastre, peur du changement, transformation lente",
    element: "Feu",
    planet: "Mars"
  },
  {
    id: 17,
    name: "The Star",
    nameFR: "L'Étoile",
    image: "/tarot/17-star.png",
    keywords: ["Espoir", "Inspiration", "Foi", "Rénovation"],
    upright: "Espoir, inspiration, renouveau, sérénité, guidance spirituelle",
    reversed: "Perte d'espoir, désespoir, déconnexion spirituelle",
    element: "Air",
    planet: "Verseau"
  },
  {
    id: 18,
    name: "The Moon",
    nameFR: "La Lune",
    image: "/tarot/18-moon.png",
    keywords: ["Illusion", "Intuition", "Inconscient", "Rêves"],
    upright: "Illusion, intuition, inconscient, rêves, confusion",
    reversed: "Confusion levée, peur surmontée, clarté mentale",
    element: "Eau",
    planet: "Poissons"
  },
  {
    id: 19,
    name: "The Sun",
    nameFR: "Le Soleil",
    image: "/tarot/19-sun.png",
    keywords: ["Joie", "Succès", "Vitalité", "Lumière"],
    upright: "Joie, succès, vitalité, optimisme, clarté, abondance",
    reversed: "Succès temporaire, optimisme excessif, manque de joie",
    element: "Feu",
    planet: "Soleil"
  },
  {
    id: 20,
    name: "Judgement",
    nameFR: "Le Jugement",
    image: "/tarot/20-judgement.png",
    keywords: ["Réveil", "Rédemption", "Appel", "Renaissance"],
    upright: "Réveil spirituel, rédemption, appel intérieur, transformation",
    reversed: "Auto-critique, refus de l'appel, doute de soi",
    element: "Feu",
    planet: "Pluton"
  },
  {
    id: 21,
    name: "The World",
    nameFR: "Le Monde",
    image: "/tarot/21-world.png",
    keywords: ["Accomplissement", "Complétude", "Succès", "Voyage"],
    upright: "Accomplissement, complétude, succès total, voyage, fin de cycle",
    reversed: "Inachèvement, manque de clôture, retards",
    element: "Terre",
    planet: "Saturne"
  }
];

// Tarot spread types
export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: string[];
}

export const tarotSpreads: TarotSpread[] = [
  {
    id: "single",
    name: "Tirage Simple",
    description: "Une carte pour une réponse rapide",
    cardCount: 1,
    positions: ["Message du jour"]
  },
  {
    id: "three-card",
    name: "Tirage à Trois",
    description: "Passé, Présent, Futur",
    cardCount: 3,
    positions: ["Passé", "Présent", "Futur"]
  },
  {
    id: "love",
    name: "Tirage Amour",
    description: "Explorer votre vie amoureuse",
    cardCount: 3,
    positions: ["Votre cœur", "L'autre personne", "La relation"]
  },
  {
    id: "decision",
    name: "Tirage Décision",
    description: "Vous aider à prendre une décision",
    cardCount: 3,
    positions: ["Situation actuelle", "Option A", "Option B"]
  },
  {
    id: "celtic",
    name: "Croix Celtique",
    description: "Un tirage complet et détaillé",
    cardCount: 10,
    positions: [
      "Présent",
      "Défi",
      "Passé récent",
      "Futur proche",
      "Le dessus",
      "Le dessous",
      "Vous",
      "Environnement",
      "Espoirs/Craintes",
      "Résultat"
    ]
  }
];

// Shuffle and draw cards
export function shuffleDeck(): TarotCard[] {
  return [...majorArcana].sort(() => Math.random() - 0.5);
}

export function drawCards(count: number): { card: TarotCard; isReversed: boolean }[] {
  const shuffled = shuffleDeck();
  return shuffled.slice(0, count).map(card => ({
    card,
    isReversed: Math.random() > 0.7 // 30% chance of being reversed
  }));
}

// Generate interpretation
export function generateInterpretation(
  spread: TarotSpread,
  drawnCards: { card: TarotCard; isReversed: boolean }[]
): string {
  let interpretation = `🔮 **Votre Tirage ${spread.name}**\n\n`;
  
  drawnCards.forEach((drawn, index) => {
    const position = spread.positions[index];
    const { card, isReversed } = drawn;
    
    interpretation += `**${position}** : ${card.nameFR}`;
    if (isReversed) interpretation += " (Inversée)";
    interpretation += "\n";
    interpretation += `> ${isReversed ? card.reversed : card.upright}\n\n`;
  });
  
  return interpretation;
}
