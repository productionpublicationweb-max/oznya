'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, DollarSign, Eye, Heart, Sparkles, Crown } from 'lucide-react';
import { useMemo } from 'react';

// Données simulées pour la démo - en production, ces données viendraient de la base de données
const DEMO_ANALYTICS = {
  totalUsers: 1247,
  conversionRate: 12.5,
  averageCart: 147,
  revenue: 15450,
  byStage: {
    awareness: 1247,
    interest: 892,
    consideration: 456,
    intent: 234,
    purchase: 156,
    loyalty: 89,
    advocacy: 34
  },
  topProducts: [
    { name: 'Coffret Sérénité Radicale', sales: 47, revenue: 4559 },
    { name: 'Abonnement VIP Nyxia', sales: 38, revenue: 1786 },
    { name: 'Formation Design Humain', sales: 23, revenue: 6831 },
    { name: 'Consultation Personnalisée', sales: 18, revenue: 2286 }
  ],
  recentActions: [
    { type: 'purchase', product: 'Coffret Sérénité', time: 'Il y a 5 min' },
    { type: 'cart_added', product: 'Formation Design Humain', time: 'Il y a 12 min' },
    { type: 'interest', product: 'Abonnement VIP', time: 'Il y a 23 min' },
    { type: 'purchase', product: 'Consultation', time: 'Il y a 45 min' }
  ]
};

export function FunnelAnalytics() {
  // En production, ces données seraient chargées depuis l'API
  const analytics = useMemo(() => DEMO_ANALYTICS, []);

  const stages = [
    { id: 'awareness', name: 'Découverte', icon: Eye, color: 'from-slate-500 to-slate-400' },
    { id: 'interest', name: 'Intérêt', icon: Heart, color: 'from-pink-500 to-rose-400' },
    { id: 'consideration', name: 'Considération', icon: ShoppingCart, color: 'from-amber-500 to-orange-400' },
    { id: 'intent', name: 'Intention', icon: Sparkles, color: 'from-violet-500 to-purple-400' },
    { id: 'purchase', name: 'Achat', icon: DollarSign, color: 'from-green-500 to-emerald-400' },
    { id: 'loyalty', name: 'Fidélité', icon: Crown, color: 'from-cyan-500 to-blue-400' }
  ];

  const metrics = [
    { label: 'Visiteurs', value: analytics.totalUsers.toLocaleString('fr-FR'), icon: Users, change: '+12%' },
    { label: 'Taux conversion', value: `${analytics.conversionRate}%`, icon: TrendingUp, change: '+2.3%' },
    { label: 'Panier moyen', value: `${analytics.averageCart}$`, icon: ShoppingCart, change: '+8%' },
    { label: 'Revenus', value: `${analytics.revenue.toLocaleString('fr-FR')}$`, icon: DollarSign, change: '+24%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Analyse du Tunnel de Vente
          </h2>
          <p className="text-sm text-slate-400">Performance sur les 30 derniers jours</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          📈 Croissance +24%
        </div>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <metric.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xs text-green-400 font-medium">{metric.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metric.value}
            </div>
            <div className="text-xs text-slate-400 mt-1">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Visualisation du funnel */}
        <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            Progression dans le Funnel
          </h3>
          
          <div className="space-y-3">
            {stages.map((stage, index) => {
              const count = analytics.byStage[stage.id] || 0;
              const percentage = (count / analytics.totalUsers) * 100;
              const Icon = stage.icon;

              return (
                <div key={stage.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm text-white">{stage.name}</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      {count} <span className="text-xs">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.15 }}
                      className={`h-full bg-gradient-to-r ${stage.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Taux de conversion entre étapes */}
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">Taux de conversion par étape</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-400">
                Découverte → Intérêt: 71.5%
              </span>
              <span className="px-2 py-1 text-xs rounded bg-amber-500/10 text-amber-400">
                Intérêt → Achat: 17.5%
              </span>
            </div>
          </div>
        </div>

        {/* Top Produits */}
        <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            Produits les Plus Vendus
          </h3>
          
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.sales} ventes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-cyan-400">
                    {product.revenue.toLocaleString('fr-FR')}$
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          Activité Récente
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {analytics.recentActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                action.type === 'purchase' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                  : action.type === 'cart_added'
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                    : 'bg-violet-500/10 border border-violet-500/20 text-violet-300'
              }`}
            >
              {action.type === 'purchase' && '💳'}
              {action.type === 'cart_added' && '🛒'}
              {action.type === 'interest' && '✨'}
              <span>{action.product}</span>
              <span className="text-xs opacity-60">{action.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Note informative */}
      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
        <p className="text-xs text-cyan-300 text-center">
          💡 Les données affichées sont simulées pour la démonstration. 
          En production, les analytics seront alimentées par les actions réelles des utilisateurs.
        </p>
      </div>
    </div>
  );
}

export default FunnelAnalytics;
