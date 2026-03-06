'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight, Gift, Crown, BookOpen, Package } from 'lucide-react';
import { useState, useMemo } from 'react';
import { 
  salesFunnel, 
  Product, 
  FUNNEL_STAGES 
} from '@/lib/salesFunnel';
import { ProductRecommendation, ProductModal } from './ProductRecommendation';

interface FunnelSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  context: {
    conversationCount: number;
    hasCompletedProfile: boolean;
    hasUsedTarot: boolean;
    hasUsedRunes: boolean;
    hasViewedLunar: boolean;
  };
}

export function FunnelSidebar({ isOpen, onClose, userId, context }: FunnelSidebarProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Calculer le stage et les recommandations avec useMemo
  const { userStage, recommendations } = useMemo(() => {
    // Calculer le stage basé sur le contexte
    const actions: string[] = [];
    
    if (context.conversationCount >= 1) actions.push('first_message');
    if (context.conversationCount >= 3) actions.push('multiple_conversations');
    if (context.hasCompletedProfile) actions.push('profile_completed');
    if (context.hasUsedTarot) actions.push('tarot_drawn');
    if (context.hasUsedRunes) actions.push('runes_drawn');
    if (context.hasViewedLunar) actions.push('lunar_phase_viewed');

    const stage = salesFunnel.calculateStageFromActions(actions);

    // Obtenir les recommandations intelligentes
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const smartRecs = salesFunnel.getSmartRecommendations({
      ...context,
      timeOfDay
    });
    
    return { userStage: stage, recommendations: smartRecs };
  }, [context]);

  const stageInfo = FUNNEL_STAGES[userStage];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-cyan-500/20 z-[150] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-cyan-500/10 to-violet-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Boutique Nyxia</h3>
                    <p className="text-xs text-slate-400">Offres sélectionnées pour toi</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stage indicator */}
              <div className="mt-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Ton niveau:</span>
                  <span className="text-cyan-400 font-medium">{stageInfo?.name || 'Découverte'}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 h-[calc(100%-120px)] overflow-y-auto space-y-4">
              {/* Promotions du moment */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Offres Spéciales
                </h4>
                <div className="space-y-3">
                  {salesFunnel.getPromotionalProducts().slice(0, 2).map(product => (
                    <ProductRecommendation
                      key={product.id}
                      product={product}
                      variant="inline"
                      onAction={setSelectedProduct}
                    />
                  ))}
                </div>
              </div>

              {/* Recommandations personnalisées */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-violet-400" />
                  Recommandé pour toi
                </h4>
                <div className="space-y-3">
                  {recommendations.length > 0 ? (
                    recommendations.map(product => (
                      <ProductRecommendation
                        key={product.id}
                        product={product}
                        variant="inline"
                        onAction={setSelectedProduct}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">
                      Continue ta conversation pour découvrir des offres personnalisées
                    </p>
                  )}
                </div>
              </div>

              {/* Toutes les catégories */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">📦 Tout notre univers</h4>
                <div className="grid grid-cols-2 gap-2">
                  <CategoryButton 
                    icon={<Gift className="w-4 h-4" />}
                    label="Coffrets"
                    count={salesFunnel.getProductsByType('coffret').length}
                    onClick={() => {}}
                  />
                  <CategoryButton 
                    icon={<BookOpen className="w-4 h-4" />}
                    label="Formations"
                    count={salesFunnel.getProductsByType('formation').length}
                    onClick={() => {}}
                  />
                  <CategoryButton 
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Séances"
                    count={salesFunnel.getProductsByType('seance').length}
                    onClick={() => {}}
                  />
                  <CategoryButton 
                    icon={<Crown className="w-4 h-4" />}
                    label="Abonnements"
                    count={salesFunnel.getProductsByType('abonnement').length}
                    onClick={() => {}}
                  />
                </div>
              </div>

              {/* Tous les produits */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">🎯 Tous les produits</h4>
                <div className="space-y-2">
                  {salesFunnel.getAllProducts().map(product => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600 transition-all text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {product.type === 'coffret' && '🎁'}
                          {product.type === 'formation' && '📚'}
                          {product.type === 'seance' && '🔮'}
                          {product.type === 'abonnement' && '⭐'}
                        </span>
                        <span className="text-sm text-slate-300">{product.name}</span>
                      </div>
                      <span className="text-sm font-medium text-cyan-400">
                        {salesFunnel.formatPrice(product.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal produit */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onPurchase={(product) => {
              // Ici on pourra rediriger vers le lien de paiement
              if (product.link) {
                window.open(product.link, '_blank');
              } else {
                // Marquer l'intérêt
                console.log('Intérêt pour:', product.id);
              }
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface CategoryButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}

function CategoryButton({ icon, label, count, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all text-left"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-cyan-400">{icon}</span>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <span className="text-xs text-slate-500">{count} produits</span>
    </button>
  );
}

export default FunnelSidebar;
