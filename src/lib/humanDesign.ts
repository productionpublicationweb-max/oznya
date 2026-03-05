// Design Human - Calculs de base pour Nyxia

export interface HumanDesignProfile {
  type: string;
  strategy: string;
  authority: string;
  profile: string;
  description: string;
}

/**
 * Types de Design Human
 */
const HUMAN_DESIGN_TYPES: Record<string, { name: string; strategy: string; description: string }> = {
  "manifestor": {
    name: "Manifesteur",
    strategy: "Informer avant d'agir",
    description: "Tu es un initié naturel, capable de déclencher des actions. Ton aura est fermée et repoussante, mais quand tu informs, tu ouvres des portes."
  },
  "generator": {
    name: "Générateur",
    strategy: "Attendre de répondre",
    description: "Tu as une réserve d'énergie infinie pour ce qui t'enthousiasme. Écoute tes sons sacraux - ils sont ta boussole."
  },
  "manifesting_generator": {
    name: "Générateur Manifesteur",
    strategy: "Répondre puis informer",
    description: "Tu es un hybride puissant. Visualise, réponds à ce qui t'excite, et informe pour éviter la résistance."
  },
  "projector": {
    name: "Projecteur",
    strategy: "Attendre l'invitation",
    description: "Tu es un guide naturel. Ton don est de voir les autres clairement, mais tu dois être reconnu et invité."
  },
  "reflector": {
    name: "Reflecteur",
    strategy: "Attendre un cycle lunaire complet",
    description: "Tu es un miroir de l'environnement. Tu reflètes la santé de ta communauté. La patience est ta superpuissance."
  }
};

/**
 * Profils de Design Human (lignes de la personnalité)
 */
const PROFILES: Record<number, { name: string; description: string }> = {
  1: { name: "Investigateur", description: "Besoin de fondations solides et de connaissances approfondies." },
  2: { name: "Ermite", description: "Talents naturels qui émergent quand on est appelé." },
  3: { name: "Martyr", description: "Apprentissage par l'essai, l'erreur et la découverte." },
  4: { name: "Opportuniste", description: "Influence à travers le réseau et les connexions." },
  5: { name: "Héros", description: "Projection des autres, capacité de leadership pratique." },
  6: { name: "Modèle", description: "Sagesse accumulée, chemin en trois phases de vie." }
};

/**
 * Autorités intérieures
 */
const AUTHORITIES: Record<string, string> = {
  "solar_plexus": "Autorité Émotionnelle - Attends la clarté émotionnelle avant de décider.",
  "sacral": "Autorité Sacrale - Tes sons gutturaux (uh-huh, un-hun) sont tes guides.",
  "splenic": "Autorité Splénique - Ton intuition instantanée, ce flair du moment.",
  "heart": "Autorité du Cœur - Tes décisions viennent de ta volonté et ton ego.",
  "g_center": "Autorité du G-Centre - Ton soi et ton identité savent le chemin.",
  "environment": "Autorité Environnementale - Les bonnes décisions viennent du bon contexte.",
  "lunar": "Autorité Lunaire - Attends le cycle lunaire pour la clarté (Reflecteurs)."
};

/**
 * Calcule un mini Design Human basé sur la date de naissance
 * Note: C'est une approximation simplifiée - le vrai HD nécessite l'heure exacte
 */
export function calculateMiniHumanDesign(birthDate: Date, birthHour?: number): HumanDesignProfile {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  const hour = birthHour || 12; // Midi par défaut
  
  // Calcul simplifié basé sur les positions solaires approximatives
  // Les vrais calculs HD nécessitent des éphémérides astronomiques
  const dayOfYear = Math.floor((birthDate.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
  
  // Détermination du type basée sur des approximations
  const typeIndex = (day + month + hour) % 5;
  const types = ["manifestor", "generator", "manifesting_generator", "projector", "reflector"];
  const typeKey = types[typeIndex];
  const typeInfo = HUMAN_DESIGN_TYPES[typeKey];
  
  // Détermination du profil (conscient/inconscient)
  const profileLine1 = ((day + year) % 6) + 1;
  const profileLine2 = ((month + hour) % 6) + 1;
  const profile1 = PROFILES[profileLine1];
  const profile2 = PROFILES[profileLine2];
  
  // Détermination de l'autorité
  const authorityKeys = Object.keys(AUTHORITIES);
  const authorityIndex = (day + month + year + hour) % authorityKeys.length;
  const authorityKey = authorityKeys[authorityIndex];
  const authority = AUTHORITIES[authorityKey];
  
  return {
    type: typeInfo.name,
    strategy: typeInfo.strategy,
    authority: authority,
    profile: `${profileLine1}/${profileLine2}`,
    description: `${typeInfo.description} Ton profil ${profileLine1}/${profileLine2} combine l'${profile1.name.toLowerCase()} et l'${profile2.name.toLowerCase()}. ${profile1.description}`
  };
}

/**
 * Génère un conseil basé sur le Design Human
 */
export function generateHDAdvice(profile: HumanDesignProfile): string {
  const advices: Record<string, string[]> = {
    "Manifesteur": [
      "Les données indiquent que tu as des initiatives en attente. Informe ton entourage.",
      "Ton énergie d'initiation est forte. Qu'as-tu envie de déclencher aujourd'hui?",
      "Le secret de ton pouvoir: informe avant d'agir, et la résistance s'évapore."
    ],
    "Générateur": [
      "Ton sacré sacré attend une question à laquelle répondre. Qu'est-ce qui t'allume?",
      "L'énergie que tu dépenses doit te passionner. Y a-t-il des 'oui' non dits?",
      "Écoute tes sons gutturaux - ils sont plus sages que ton mental."
    ],
    "Générateur Manifesteur": [
      "Tu as le don de visualiser et d'agir rapidement. Mais as-tu informé?",
      "Ton hybride énergétique est puissant. Visualise, réponds, informe.",
      "La frustration vient quand tu agis sans répondre. Patience stratégique."
    ],
    "Projecteur": [
      "Ta sagesse est précieuse, mais attends-tu d'être invité à la partager?",
      "Ton don de vision peut transformer les autres. Mais seulement si invité.",
      "Le succès vient quand tu laisses les autres te reconnaître."
    ],
    "Reflector": [
      "Tu es le thermomètre de ton environnement. Comment te sens-tu aujourd'hui?",
      "Prends ton temps - un cycle lunaire pour les décisions importantes.",
      "Ton rôle est de refléter la santé du collectif. Comment est ton entourage?"
    ]
  };
  
  const typeAdvices = advices[profile.type];
  if (typeAdvices) {
    return typeAdvices[Math.floor(Math.random() * typeAdvices.length)];
  }
  
  return "Ton design unique contient des trésors de sagesse à explorer.";
}

/**
 * Message d'introduction au Design Human
 */
export function getHDIntroduction(): string {
  return "Le Design Human est une synthèse de l'astrologie, du I Ching, de la Kabbale et du système de chakras. Il révèle comment ton énergie fonctionne et comment prendre les bonnes décisions pour toi. Veux-tu que je calcule ton profil approximatif?";
}
