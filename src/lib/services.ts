// Services de consultations - Diane Boyer (Oznya)
// CORRIGÉ: Le 50% est pour "1 Question | 1 Réponse" par EMAIL, pas Messenger

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  url: string;
  category: 'products' | 'email' | 'chat' | 'phone' | 'video' | 'appointment';
  tags: string[];
  recommended?: boolean;
}

export const SERVICES: Service[] = [
  // Produits
  {
    id: 'coffret-roue-annee',
    name: 'Coffret Spécial Roue de l\'Année',
    description: 'Un coffret mystique pour accompagner les cycles sacrés de l\'année. Idéal pour les pratiquants et les curieux de la magie naturelle.',
    url: 'https://www.oznya.com',
    category: 'products',
    tags: ['rituel', 'magie', 'cycles', 'saison', 'célébration']
  },
  {
    id: 'coffret-abondance',
    name: 'Coffret Abondance',
    description: 'Un ensemble puissant pour attirer la prospérité et manifester l\'abondance dans tous les domaines de ta vie.',
    url: 'https://www.magiquebusiness.com/tunnelabondance',
    category: 'products',
    tags: ['abondance', 'prospérité', 'manifestation', 'richesse']
  },
  
  // Consultations Courriel (IMPORTANT: par EMAIL, pas Messenger!)
  {
    id: 'promo-50-code',
    name: 'Code Promo 50% - 1 Question | 1 Réponse',
    description: 'Écris "Promo" à Oznya IA sur Messenger pour obtenir ton code promo 50% sur une consultation email "1 Question | 1 Réponse". Diane t\'enverra une réponse détaillée par courriel.',
    url: 'https://m.me/Oznya',
    category: 'email',
    tags: ['promo', 'réduction', 'code', 'email', 'courriel'],
    recommended: true
  },
  {
    id: 'express-1q1r',
    name: '1 Question | 1 Réponse',
    description: 'Une question précise, une réponse éclairante par EMAIL. Parfait pour lever un doute rapidement. Diane te répond par courriel.',
    url: 'https://www.oznya.com/consultations/express1q1r',
    category: 'email',
    tags: ['rapide', 'simple', 'précis', 'question', 'email']
  },
  {
    id: 'domaine-precis',
    name: '1 Domaine précis',
    description: 'Une exploration approfondie d\'un domaine spécifique de ta vie par EMAIL: amour, carrière, spiritualité...',
    url: 'https://www.oznya.com/consultations/domaineprecis',
    category: 'email',
    tags: ['approfondi', 'domaine', 'thématique', 'email']
  },
  {
    id: 'complete-meditation',
    name: 'Complète + Méditation',
    description: 'Une consultation complète par EMAIL avec une méditation guidée personnalisée. L\'expérience ultime.',
    url: 'https://www.oznya.com/consultations/completeavecmeditation',
    category: 'email',
    tags: ['complet', 'méditation', 'personnalisé', 'transformation', 'email']
  },
  
  // Consultations Chat (via premium.chat - PAYANT)
  {
    id: 'chat-10min',
    name: 'Consultation Chat 10 min',
    description: 'Une session de chat de 10 minutes pour des réponses rapides et directes.',
    url: 'https://premium.chat/Oznya/903857',
    category: 'chat',
    tags: ['chat', 'rapide', '10min', 'instantané', 'payant']
  },
  {
    id: 'chat-30min',
    name: 'Consultation Chat 30 min',
    description: 'Une demi-heure de chat pour explorer tes questions en profondeur. À partir de 0.95€.',
    url: 'https://premium.chat/Oznya/903222',
    category: 'chat',
    tags: ['chat', 'approfondi', '30min', 'payant']
  },
  
  // Consultations Téléphoniques (via premium.chat - PAYANT)
  {
    id: 'phone-10min',
    name: 'Consultation Téléphonique 10 min',
    description: 'Un appel de 10 minutes pour des éclaircissements rapides.',
    url: 'https://premium.chat/Oznya/903845',
    category: 'phone',
    tags: ['téléphone', 'appel', 'rapide', '10min', 'payant']
  },
  {
    id: 'phone-30min',
    name: 'Consultation Téléphonique 30 min',
    description: 'Une demi-heure au téléphone pour une consultation plus complète.',
    url: 'https://premium.chat/Oznya/903216',
    category: 'phone',
    tags: ['téléphone', 'appel', '30min', 'approfondi', 'payant']
  },
  {
    id: 'phone-60min',
    name: 'Consultation Téléphonique 60 min',
    description: 'Une heure complète au téléphone pour une exploration approfondie de ta situation.',
    url: 'https://premium.chat/Oznya/903866',
    category: 'phone',
    tags: ['téléphone', 'appel', '60min', 'complet', 'payant']
  },
  
  // Consultations Vidéo (via premium.chat - PAYANT)
  {
    id: 'video-15min',
    name: 'Consultation Vidéo 15 min',
    description: 'Une session vidéo de 15 minutes pour une connexion visuelle et des messages personnalisés.',
    url: 'https://premium.chat/Oznya/903863',
    category: 'video',
    tags: ['vidéo', '15min', 'visuel', 'connexion', 'payant']
  },
  {
    id: 'video-30min',
    name: 'Consultation Vidéo 30 min',
    description: 'Une demi-heure en vidéo pour une expérience immersive et transformante.',
    url: 'https://premium.chat/Oznya/903094',
    category: 'video',
    tags: ['vidéo', '30min', 'immersif', 'payant']
  },
  {
    id: 'video-60min',
    name: 'Consultation Vidéo 60 min',
    description: 'L\'expérience complète: une heure en vidéo avec Diane pour une transformation profonde.',
    url: 'https://premium.chat/Oznya/903861',
    category: 'video',
    tags: ['vidéo', '60min', 'complet', 'transformation', 'premium', 'payant'],
    recommended: true
  },
  
  // Consultations Rendez-Vous
  {
    id: 'rdv-30min',
    name: 'Rendez-vous 30 min',
    description: 'Un rendez-vous planifié de 30 minutes pour une session personnalisée.',
    url: 'https://www.oznya.com/consultation/30minutes',
    category: 'appointment',
    tags: ['rdv', 'rendez-vous', '30min', 'planifié']
  },
  {
    id: 'rdv-60min',
    name: 'Rendez-vous 60 min',
    description: 'Un rendez-vous d\'une heure pour une consultation complète et approfondie.',
    url: 'https://www.oznya.com/consultation/60minutes',
    category: 'appointment',
    tags: ['rdv', 'rendez-vous', '60min', 'complet', 'approfondi'],
    recommended: true
  }
];

/**
 * Recommande un service basé sur le contexte de conversation
 */
export function recommendService(context: {
  urgency?: 'low' | 'medium' | 'high';
  budget?: 'low' | 'medium' | 'high';
  preference?: 'chat' | 'phone' | 'video' | 'email';
  topic?: string;
}): Service | null {
  const { urgency, budget, preference, topic } = context;
  
  // Filtrer par préférence de type
  let candidates = SERVICES;
  if (preference) {
    candidates = candidates.filter(s => s.category === preference);
  }
  
  // Priorité aux services recommandés
  const recommended = candidates.filter(s => s.recommended);
  if (recommended.length > 0) {
    return recommended[0];
  }
  
  // Logique basée sur l'urgence
  if (urgency === 'high') {
    const quick = candidates.filter(s => 
      s.tags.includes('rapide') || s.tags.includes('10min') || s.tags.includes('instantané')
    );
    if (quick.length > 0) return quick[0];
  }
  
  // Logique basée sur le budget
  if (budget === 'low') {
    const economic = candidates.filter(s => 
      s.tags.includes('promo') || s.tags.includes('économique')
    );
    if (economic.length > 0) return economic[0];
  }
  
  // Logique basée sur le sujet
  if (topic) {
    const topicMatch = candidates.filter(s => 
      s.tags.some(tag => topic.toLowerCase().includes(tag))
    );
    if (topicMatch.length > 0) return topicMatch[0];
  }
  
  // Retourner un service par défaut
  return candidates[0] || null;
}

/**
 * Génère un lien tracké pour un service
 */
export function generateTrackedLink(serviceId: string, source: string = 'nyxia_chat'): string {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return '';
  
  const url = new URL(service.url);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'chat');
  url.searchParams.set('utm_campaign', 'nyxia_assistant');
  
  return url.toString();
}

/**
 * Obtient les services par catégorie
 */
export function getServicesByCategory(): Record<string, Service[]> {
  return SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
}

/**
 * Messages de transition vers les services - CORRIGÉS
 */
export const SERVICE_TRANSITIONS = {
  curiosity: [
    "Les données suggèrent que tu pourrais bénéficier d'une guidance plus approfondie...",
    "Je sens qu'il y a des révélations qui t'attendent. Diane pourrait t'éclairer...",
    "Mon analyse indique une opportunité de transformation. Veux-tu l'explorer?"
  ],
  tripwire: [
    "J'ai quelque chose de spécial pour toi... Écris 'Promo' à Oznya IA sur Messenger pour obtenir un code 50% sur une consultation email!",
    "Petit secret: il existe une façon économique d'obtenir des réponses... Demande le code promo à Oznya IA sur Messenger!",
    "Les étoiles s'alignent sur une offre exclusive: 50% sur '1 Question | 1 Réponse' par email. Écris 'Promo' sur Messenger!"
  ],
  softSell: [
    "Si tu souhaites approfondir, Diane propose des consultations personnalisées.",
    "Pour aller plus loin dans cette exploration, Diane est disponible pour t'accompagner.",
    "Mon rôle est de te guider vers les réponses. Diane détient les clés de la suite..."
  ]
};

/**
 * Obtient un message de transition aléatoire
 */
export function getRandomTransition(type: keyof typeof SERVICE_TRANSITIONS): string {
  const messages = SERVICE_TRANSITIONS[type];
  return messages[Math.floor(Math.random() * messages.length)];
}
