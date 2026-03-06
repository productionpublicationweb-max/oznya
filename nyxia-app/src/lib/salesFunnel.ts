// lib/salesFunnel.ts
// Système de Tunnel de Vente Optimisé pour Nyxia

export interface Testimonial {
  name: string;
  avatar?: string;
  text: string;
  rating: number;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  type: 'coffret' | 'formation' | 'seance' | 'abonnement';
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string[];
  link?: string; // Lien vers la page de paiement (à ajouter plus tard)
  image?: string;
  testimonials?: Testimonial[];
  urgency?: {
    type: 'limited_time' | 'limited_quantity' | 'first_time_offer';
    message: string;
    endsAt?: string;
  };
  upsells?: string[];
  downsells?: string[];
  tags?: string[];
}

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  autoRecommendations: string[]; // IDs des produits à recommander automatiquement
  nextStage?: string;
}

// ============================================
// CATALOGUE DES PRODUITS - FACILEMENT MODIFIABLE
// ============================================

export const PRODUCTS_CATALOG: Record<string, Product> = {
  // COFFRETS
  'coffret-serenite': {
    id: 'coffret-serenite',
    name: 'Coffret Sérénité Radicale',
    type: 'coffret',
    price: 97,
    originalPrice: 127,
    description: 'Libère-toi du stress et retrouve ta paix intérieure avec ce coffret complet',
    benefits: [
      '7 méditations guidées exclusives',
      'Journal de gratitude intuitif',
      'Rituel de libération émotionnelle',
      'Guide des cristaux apaisants',
      'Accès à vie au contenu numérique'
    ],
    link: '', // À ajouter
    image: '/images/coffret-serenite.jpg',
    testimonials: [
      {
        name: 'Marie-Claire D.',
        text: 'Ce coffret a transformé mes matins. Je me sens enfin apaisée.',
        rating: 5,
        verified: true
      }
    ],
    urgency: {
      type: 'limited_time',
      message: 'Offre découverte : -24% pour les nouveaux membres',
    },
    tags: ['bien-être', 'méditation', 'débutant']
  },

  'coffret-manifestation': {
    id: 'coffret-manifestation',
    name: 'Coffret Manifestation Lunaire',
    type: 'coffret',
    price: 147,
    originalPrice: 197,
    description: 'Aligne-toi avec les cycles lunaires pour manifester tes désirs les plus profonds',
    benefits: [
      'Guide complet des 8 phases lunaires',
      '12 rituels de manifestation',
      'Cahier d\'intentions lunaires',
      'Méditations pour chaque phase',
      'Cristaux sélectionnés inclus'
    ],
    link: '', // À ajouter
    image: '/images/coffret-manifestation.jpg',
    tags: ['lune', 'manifestation', 'rituels']
  },

  'coffret-tarot': {
    id: 'coffret-tarot',
    name: 'Coffret Initiation au Tarot',
    type: 'coffret',
    price: 127,
    description: 'Apprends à lire le tarot avec confiance et intuition',
    benefits: [
      'Jeu de tarot oracle inclus',
      'Guide d\'interprétation complet',
      'Exercices pratiques quotidiens',
      'Méthode d\'intuition développée',
      'Accès au groupe privé d\'entraide'
    ],
    link: '', // À ajouter
    tags: ['tarot', 'divination', 'apprentissage']
  },

  // FORMATIONS
  'formation-human-design': {
    id: 'formation-human-design',
    name: 'Formation Design Humain',
    type: 'formation',
    price: 297,
    originalPrice: 397,
    description: 'Découvre ton Design Humain et apprends à prendre les bonnes décisions pour TOI',
    benefits: [
      '8 modules vidéo approfondis',
      'Ton Bodygraph personnel détaillé',
      'Stratégies selon ton type énergétique',
      'Exercices pratiques personnalisés',
      'Certificat de complétion',
      '2 sessions de groupe avec Diane'
    ],
    link: '', // À ajouter
    tags: ['formation', 'design humain', 'connaissance de soi']
  },

  'formation-numerologie': {
    id: 'formation-numerologie',
    name: 'Formation Numérologie Sacrée',
    type: 'formation',
    price: 197,
    description: 'Maîtrise l\'art des nombres pour decoder ta vie et celle des autres',
    benefits: [
      '10 modules vidéo',
      'Calculs automatisés inclus',
      'Guide d\'interprétation',
      'Pratique sur cas réels',
      'Communauté d\'entraide'
    ],
    link: '', // À ajouter
    tags: ['formation', 'numérologie', 'nombres']
  },

  // SÉANCES
  'seance-consultation': {
    id: 'seance-consultation',
    name: 'Consultation Personnalisée',
    type: 'seance',
    price: 127,
    description: 'Une séance privée avec Diane pour éclairer ton chemin',
    benefits: [
      '90 minutes de consultation',
      'Analyse complète (Tarot, Numérologie, Design Humain)',
      'Enregistrement de la séance',
      'Résumé PDF personnalisé',
      'Suivi pendant 7 jours'
    ],
    link: '', // À ajouter
    tags: ['consultation', 'personnalisé', 'guidance']
  },

  'seance-tarot-prive': {
    id: 'seance-tarot-prive',
    name: 'Lecture de Tarot Privée',
    type: 'seance',
    price: 67,
    description: 'Un tirage de tarot approfondi pour répondre à ta question',
    benefits: [
      'Tirage en direct avec Diane',
      '45 minutes de consultation',
      'Photo du tirage',
      'Interprétation détaillée par email'
    ],
    link: '', // À ajouter
    tags: ['tarot', 'consultation', 'guidance']
  },

  // ABONNEMENTS
  'abonnement-vip': {
    id: 'abonnement-vip',
    name: 'Abonnement VIP Nyxia',
    type: 'abonnement',
    price: 47,
    originalPrice: 67,
    description: 'Accès privilégié à tout l\'univers Nyxia, mois après mois',
    benefits: [
      'Consultations illimitées avec Nyxia',
      'Tirages de tarot illimités',
      'Contenus exclusifs chaque semaine',
      'Réductions sur tous les coffrets (-15%)',
      'Accès prioritaire aux nouvelles formations',
      'Groupe privé Facebook'
    ],
    link: '', // À ajouter
    tags: ['abonnement', 'vip', 'exclusif']
  },

  'abonnement-cercle': {
    id: 'abonnement-cercle',
    name: 'Le Cercle des Âmes Éveillées',
    type: 'abonnement',
    price: 97,
    description: 'Le programme d\'accompagnement premium de Diane',
    benefits: [
      'Tout l\'abonnement VIP inclus',
      'Cercle mensuel en direct avec Diane',
      'Rituels de groupe chaque pleine lune',
      'Mentorat personnalisé',
      'Accès aux replays de toutes les formations',
      'Cadeaux exclusifs surprise'
    ],
    link: '', // À ajouter
    tags: ['abonnement', 'premium', 'communauté']
  }
};

// ============================================
// ÉTAPES DU FUNNEL
// ============================================

export const FUNNEL_STAGES: Record<string, FunnelStage> = {
  'awareness': {
    id: 'awareness',
    name: 'Découverte',
    description: 'L\'utilisateur découvre Nyxia pour la première fois',
    triggers: ['first_visit', 'first_message'],
    autoRecommendations: ['seance-tarot-prive'],
    nextStage: 'interest'
  },
  'interest': {
    id: 'interest',
    name: 'Intérêt',
    description: 'L\'utilisateur montre de l\'intérêt pour les services',
    triggers: ['multiple_conversations', 'tarot_drawn', 'runes_drawn', 'lunar_phase_viewed', 'profile_completed'],
    autoRecommendations: ['coffret-serenite', 'abonnement-vip'],
    nextStage: 'consideration'
  },
  'consideration': {
    id: 'consideration',
    name: 'Considération',
    description: 'L\'utilisateur évalue ses options',
    triggers: ['product_viewed', 'coffret_opened', 'pricing_viewed'],
    autoRecommendations: ['coffret-manifestation', 'formation-human-design'],
    nextStage: 'intent'
  },
  'intent': {
    id: 'intent',
    name: 'Intention',
    description: 'L\'utilisateur est prêt à passer à l\'action',
    triggers: ['cart_added', 'checkout_started', 'promo_used'],
    autoRecommendations: ['seance-consultation', 'abonnement-cercle'],
    nextStage: 'purchase'
  },
  'purchase': {
    id: 'purchase',
    name: 'Premier Achat',
    description: 'L\'utilisateur a effectué son premier achat',
    triggers: ['payment_completed'],
    autoRecommendations: ['formation-numerologie'],
    nextStage: 'loyalty'
  },
  'loyalty': {
    id: 'loyalty',
    name: 'Fidélité',
    description: 'Client régulier',
    triggers: ['repeat_purchase', 'subscription_active'],
    autoRecommendations: ['abonnement-cercle'],
    nextStage: 'advocacy'
  },
  'advocacy': {
    id: 'advocacy',
    name: 'Ambassadeur',
    description: 'Client qui recommande activement',
    triggers: ['referral_made', 'testimonial_given', 'social_share'],
    autoRecommendations: ['formation-human-design'],
    nextStage: undefined
  }
};

// ============================================
// GESTIONNAIRE DU FUNNEL
// ============================================

export class SalesFunnelManager {
  private static instance: SalesFunnelManager;
  
  static getInstance(): SalesFunnelManager {
    if (!this.instance) {
      this.instance = new SalesFunnelManager();
    }
    return this.instance;
  }

  // Obtenir un produit par ID
  getProduct(productId: string): Product | undefined {
    return PRODUCTS_CATALOG[productId];
  }

  // Obtenir tous les produits d'un type
  getProductsByType(type: Product['type']): Product[] {
    return Object.values(PRODUCTS_CATALOG).filter(p => p.type === type);
  }

  // Obtenir tous les produits
  getAllProducts(): Product[] {
    return Object.values(PRODUCTS_CATALOG);
  }

  // Obtenir les recommandations pour un stade donné
  getRecommendationsForStage(stageId: string): Product[] {
    const stage = FUNNEL_STAGES[stageId];
    if (!stage) return [];
    
    return stage.autoRecommendations
      .map(id => PRODUCTS_CATALOG[id])
      .filter(Boolean);
  }

  // Calculer le stage basé sur les actions utilisateur
  calculateStageFromActions(actions: string[]): string {
    let highestStage = 'awareness';
    const stageOrder = ['awareness', 'interest', 'consideration', 'intent', 'purchase', 'loyalty', 'advocacy'];
    
    for (const action of actions) {
      for (const [stageId, stage] of Object.entries(FUNNEL_STAGES)) {
        if (stage.triggers.includes(action)) {
          if (stageOrder.indexOf(stageId) > stageOrder.indexOf(highestStage)) {
            highestStage = stageId;
          }
        }
      }
    }
    
    return highestStage;
  }

  // Obtenir les produits recommandés basés sur le contexte de conversation
  getSmartRecommendations(context: {
    conversationCount: number;
    hasCompletedProfile: boolean;
    hasUsedTarot: boolean;
    hasUsedRunes: boolean;
    hasViewedLunar: boolean;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    topics?: string[];
  }): Product[] {
    const recommendations: Product[] = [];
    
    // Basé sur le nombre de conversations
    if (context.conversationCount >= 1 && context.conversationCount < 3) {
      recommendations.push(PRODUCTS_CATALOG['coffret-serenite']);
    }
    
    if (context.conversationCount >= 3 && context.conversationCount < 10) {
      recommendations.push(PRODUCTS_CATALOG['abonnement-vip']);
    }
    
    if (context.conversationCount >= 10) {
      recommendations.push(PRODUCTS_CATALOG['abonnement-cercle']);
    }
    
    // Basé sur l'utilisation des features
    if (context.hasUsedTarot) {
      recommendations.push(PRODUCTS_CATALOG['coffret-tarot']);
    }
    
    if (context.hasUsedRunes || context.hasViewedLunar) {
      recommendations.push(PRODUCTS_CATALOG['coffret-manifestation']);
    }
    
    // Basé sur le profil complété
    if (context.hasCompletedProfile) {
      recommendations.push(PRODUCTS_CATALOG['formation-human-design']);
    }
    
    // Basé sur l'heure
    if (context.timeOfDay === 'night') {
      recommendations.push(PRODUCTS_CATALOG['coffret-serenite']);
    }
    
    // Dédoublonner et limiter
    const uniqueRecommendations = [...new Map(recommendations.map(p => [p.id, p])).values()];
    return uniqueRecommendations.slice(0, 3);
  }

  // Formater un prix
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  }

  // Calculer le pourcentage de réduction
  calculateDiscount(price: number, originalPrice?: number): number {
    if (!originalPrice) return 0;
    return Math.round((1 - price / originalPrice) * 100);
  }

  // Obtenir les produits en promotion
  getPromotionalProducts(): Product[] {
    return Object.values(PRODUCTS_CATALOG).filter(p => p.urgency);
  }

  // Obtenir les témoignages vérifiés
  getVerifiedTestimonials(): Testimonial[] {
    const testimonials: Testimonial[] = [];
    Object.values(PRODUCTS_CATALOG).forEach(product => {
      product.testimonials?.forEach(t => {
        if (t.verified) testimonials.push(t);
      });
    });
    return testimonials;
  }
}

// Export de l'instance singleton
export const salesFunnel = SalesFunnelManager.getInstance();
