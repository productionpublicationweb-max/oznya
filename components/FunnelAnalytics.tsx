// components/FunnelAnalytics.tsx
'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

// Définitions des types
interface FunnelAnalytics {
  totalUsers: number;
  byStage: Record<string, number>;
  conversionRates: Record<string, number>;
}

// Fonction pour générer des données de démo
function generateDemoAnalytics(): FunnelAnalytics {
  const stages = {
    awareness: 1000,
    interest: 450,
    consideration: 180,
    purchase: 85
  };

  const totalUsers = stages.awareness;
  const conversionRates: Record<string, number> = {};

  Object.keys(stages).forEach(stage => {
    conversionRates[stage] = (stages[stage as keyof typeof stages] / totalUsers) * 100;
  });

  return {
    totalUsers,
    byStage: stages,
    conversionRates
  };
}

export function FunnelAnalytics() {
  const [analytics, setAnalytics] = useState<FunnelAnalytics | null>(null);

  useEffect(() => {
    // Charger les données de démo
    setAnalytics(generateDemoAnalytics());
  }, []);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-400">Chargement...</div>
      </div>
    );
  }

  const stages = [
    { id: 'awareness', name: 'Découverte', icon: Users },
    { id: 'interest', name: 'Intérêt', icon: TrendingUp },
    { id: 'consideration', name: 'Considération', icon: ShoppingCart },
    { id: 'purchase', name: 'Achat', icon: DollarSign }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        Analyse du Tunnel de Vente
      </h2>

      {/* Métriques clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Visiteurs', value: analytics.totalUsers.toLocaleString(), icon: Users },
          { label: 'Taux de conversion', value: '8.5%', icon: TrendingUp },
          { label: 'Panier moyen', value: '147€', icon: ShoppingCart },
          { label: 'Revenus', value: '12,450€', icon: DollarSign }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visualisation du funnel */}
      <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Progression dans le Funnel
        </h3>
        
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const count = analytics.byStage[stage.id] || 0;
            const percentage = (count / analytics.totalUsers) * 100;
            const Icon = stage.icon;

            return (
              <div key={stage.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-white">{stage.name}</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    {count.toLocaleString()} ({percentage.toFixed(1)}%)
                  </div>
                </div>
                
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
