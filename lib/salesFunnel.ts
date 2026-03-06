// lib/salesFunnel.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  order: number;
  conversionRate?: number;
}

export interface UserFunnelProgress {
  userId: string;
  currentStage: string;
  completedStages: string[];
  lastActivity: Date;
  metadata?: Record<string, any>;
}

export interface FunnelMetrics {
  totalUsers: number;
  conversionRate: number;
  averageTimeToConversion: number;
  dropOffPoints: { stage: string; rate: number }[];
}

// Étapes du funnel de vente
export const FUNNEL_STAGES: FunnelStage[] = [
  {
    id: 'awareness',
    name: 'Découverte',
    description: 'Premier contact avec Oznya',
    order: 1
  },
  {
    id: 'interest',
    name: 'Intérêt',
    description: 'Exploration des fonctionnalités',
    order: 2
  },
  {
    id: 'consideration',
    name: 'Considération',
    description: 'Comparaison et réflexion',
    order: 3
  },
  {
    id: 'intent',
    name: 'Intention',
    description: 'Préparation à l\'achat',
    order: 4
  },
  {
    id: 'purchase',
    name: 'Achat',
    description: 'Conversion en client',
    order: 5
  },
  {
    id: 'loyalty',
    name: 'Fidélité',
    description: 'Client régulier',
    order: 6
  },
  {
    id: 'advocacy',
    name: 'Ambassadeur',
    description: 'Recommandation active',
    order: 7
  }
];

export class SalesFunnelManager {
  private static instance: SalesFunnelManager;

  private constructor() {}

  static getInstance(): SalesFunnelManager {
    if (!SalesFunnelManager.instance) {
      SalesFunnelManager.instance = new SalesFunnelManager();
    }
    return SalesFunnelManager.instance;
  }

  // Récupérer la progression d'un utilisateur
  async getUserProgress(userId: string): Promise<UserFunnelProgress | null> {
    const { data, error } = await supabase
      .from('funnel_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      userId: data.user_id,
      currentStage: data.current_stage,
      completedStages: data.completed_stages || [],
      lastActivity: new Date(data.last_activity),
      metadata: data.metadata
    };
  }

  // Mettre à jour la progression
  async updateProgress(userId: string, newStage: string): Promise<void> {
    const progress = await this.getUserProgress(userId);
    
    const completedStages = progress?.completedStages || [];
    if (!completedStages.includes(newStage)) {
      completedStages.push(newStage);
    }

    await supabase
      .from('funnel_progress')
      .upsert({
        user_id: userId,
        current_stage: newStage,
        completed_stages: completedStages,
        last_activity: new Date().toISOString()
      });
  }

  // Calculer les métriques du funnel
  async calculateMetrics(): Promise<FunnelMetrics> {
    const { data: allProgress } = await supabase
      .from('funnel_progress')
      .select('*');

    if (!allProgress || allProgress.length === 0) {
      return {
        totalUsers: 0,
        conversionRate: 0,
        averageTimeToConversion: 0,
        dropOffPoints: []
      };
    }

    const totalUsers = allProgress.length;
    const purchasedUsers = allProgress.filter(
      p => p.completed_stages?.includes('purchase')
    ).length;

    const conversionRate = (purchasedUsers / totalUsers) * 100;

    // Calculer les points de décrochage
    const dropOffPoints = FUNNEL_STAGES.map(stage => {
      const usersAtStage = allProgress.filter(
        p => p.current_stage === stage.id
      ).length;
      return {
        stage: stage.name,
        rate: (usersAtStage / totalUsers) * 100
      };
    });

    return {
      totalUsers,
      conversionRate,
      averageTimeToConversion: 0, // À calculer avec les timestamps
      dropOffPoints
    };
  }

  // Tracker une action utilisateur
  async trackUserAction(userId: string, action: string, metadata?: any) {
    // Enregistrer l'action
    await supabase.from('funnel_actions').insert({
      user_id: userId,
      action,
      metadata,
      timestamp: new Date().toISOString()
    });

    // Déterminer si l'action change l'étape du funnel
    const stageMapping: Record<string, string> = {
      'first_visit': 'awareness',
      'feature_explored': 'interest',
      'pricing_viewed': 'consideration',
      'trial_started': 'intent',
      'payment_initiated': 'purchase',
      'subscription_active': 'loyalty',
      'referral_made': 'advocacy'
    };

    const newStage = stageMapping[action];
    if (newStage) {
      await this.updateProgress(userId, newStage);
    }
  }

  // Obtenir des recommandations personnalisées
  async getRecommendations(userId: string): Promise<string[]> {
    const progress = await this.getUserProgress(userId);
    if (!progress) {
      return ['Explorez les fonctionnalités d\'Oznya'];
    }

    const recommendations: Record<string, string[]> = {
      'awareness': [
        'Découvrez comment Oznya peut vous aider',
        'Regardez notre vidéo de présentation',
        'Essayez une première conversation'
      ],
      'interest': [
        'Explorez nos différents modèles IA',
        'Testez la génération d\'images',
        'Créez votre premier agent personnalisé'
      ],
      'consideration': [
        'Comparez nos offres',
        'Lisez les témoignages clients',
        'Calculez votre ROI avec Oznya'
      ],
      'intent': [
        'Démarrez votre essai gratuit',
        'Planifiez une démo personnalisée',
        'Consultez notre FAQ'
      ],
      'purchase': [
        'Choisissez votre plan',
        'Configurez votre compte',
        'Profitez de notre offre de lancement'
      ],
      'loyalty': [
        'Explorez les fonctionnalités avancées',
        'Rejoignez notre communauté',
        'Participez à nos webinaires'
      ],
      'advocacy': [
        'Parrainez vos amis',
        'Partagez votre expérience',
        'Devenez ambassadeur Oznya'
      ]
    };

    return recommendations[progress.currentStage] || [];
  }
}

// Export singleton
export const salesFunnel = SalesFunnelManager.getInstance();
