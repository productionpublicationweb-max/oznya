'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, DollarSign, Eye, Heart, Sparkles, Crown, Activity, RefreshCw } from 'lucide-react';
import { useState, useCallback } from 'react';
import { getDashboardStats, trackVisit, getRecentEvents, FunnelEvent } from '@/lib/salesFunnel';

// Initialisation paresseuse pour éviter les appels setState dans useEffect
function getInitialEvents(): FunnelEvent[] {
  if (typeof window !== 'undefined') {
    trackVisit();
    return getRecentEvents(20);
  }
  return [];
}

export function FunnelAnalytics() {
  const [recentEvents, setRecentEvents] = useState<FunnelEvent[]>(getInitialEvents);
  
  // Rafraîchir les données
  const refreshData = useCallback(() => {
    setRecentEvents(getRecentEvents(20));
  }, []);

  // Charger les statistiques - dérivé directement pendant le rendu
  const stats = getDashboardStats();
  const isRealData = stats.hasRealData;
  const analytics = stats;

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
          <p className="text-sm text-slate-400">
            Performance {isRealData ? 'en temps réel' : 'simulée - données de démonstration'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isRealData && (
            <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" />
              Données réelles
            </span>
          )}
          <button 
            onClick={refreshData}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all"
            title="Rafraîchir les données"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
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
          {isRealData && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 animate-pulse">
              Live
            </span>
          )}
        </h3>
        
        {analytics.recentActions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {analytics.recentActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  action.type === 'purchase' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                    : action.type === 'cart_add' || action.type === 'interest'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                      : action.type === 'feature_used'
                        ? 'bg-violet-500/10 border border-violet-500/20 text-violet-300'
                        : 'bg-slate-500/10 border border-slate-500/20 text-slate-300'
                }`}
              >
                {action.type === 'purchase' && '💳'}
                {action.type === 'cart_add' && '🛒'}
                {action.type === 'interest' && '✨'}
                {action.type === 'feature_used' && '🔮'}
                {action.type === 'view' && '👁️'}
                <span>{action.product}</span>
                <span className="text-xs opacity-60">{action.time}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune activité récente</p>
            <p className="text-xs mt-1">Les actions des utilisateurs apparaîtront ici</p>
          </div>
        )}
      </div>

      {/* Note informative */}
      <div className={`p-4 rounded-xl ${isRealData ? 'bg-green-500/5 border border-green-500/20' : 'bg-cyan-500/5 border border-cyan-500/20'}`}>
        <p className={`text-xs text-center ${isRealData ? 'text-green-300' : 'text-cyan-300'}`}>
          {isRealData 
            ? '✅ Ces données sont réelles et mises à jour en temps réel basées sur l\'activité du site.'
            : '💡 Les données affichées sont simulées pour la démonstration. Les analytics seront alimentées par les actions réelles des utilisateurs.'
          }
        </p>
      </div>
    </div>
  );
}

export default FunnelAnalytics;
