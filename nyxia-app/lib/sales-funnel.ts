// lib/sales-funnel.ts

export interface FunnelStage {
  id: string;
  name: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface FunnelAnalytics {
  totalUsers: number;
  byStage: Record<string, number>;
  conversionRates: Record<string, number>;
}

export class SalesFunnelManager {
  private static instance: SalesFunnelManager;
  private events: FunnelStage[] = [];

  private constructor() {}

  static getInstance(): SalesFunnelManager {
    if (!SalesFunnelManager.instance) {
      SalesFunnelManager.instance = new SalesFunnelManager();
    }
    return SalesFunnelManager.instance;
  }

  trackEvent(stage: FunnelStage): void {
    this.events.push({
      ...stage,
      timestamp: new Date().toISOString()
    });
  }

  async getFunnelAnalytics(
    startDate: string,
    endDate: string
  ): Promise<FunnelAnalytics> {
    // Filtrer les événements par date
    const filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });

    // Compter les utilisateurs par étape
    const byStage: Record<string, number> = {};
    const stages = ['awareness', 'interest', 'consideration', 'purchase'];
    
    stages.forEach(stage => {
      byStage[stage] = filteredEvents.filter(e => e.id === stage).length;
    });

    // Calculer les taux de conversion
    const conversionRates: Record<string, number> = {};
    const totalUsers = byStage.awareness || 1; // Éviter division par zéro
    
    stages.forEach(stage => {
      conversionRates[stage] = (byStage[stage] / totalUsers) * 100;
    });

    return {
      totalUsers,
      byStage,
      conversionRates
    };
  }

  // Méthode pour initialiser avec des données de démo
  initializeDemoData(): void {
    const stages = ['awareness', 'interest', 'consideration', 'purchase'];
    const counts = [1000, 450, 180, 85]; // Données de démo réalistes

    stages.forEach((stage, index) => {
      for (let i = 0; i < counts[index]; i++) {
        this.trackEvent({
          id: stage,
          name: stage,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    });
  }
}

// Initialiser avec des données de démo au chargement
if (typeof window !== 'undefined') {
  const funnel = SalesFunnelManager.getInstance();
  funnel.initializeDemoData();
}
