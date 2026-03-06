'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap, X, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  salesFunnel, 
  Product 
} from '@/lib/salesFunnel';

interface SmartRecommendationProps {
  userId?: string;
  context: {
    conversationCount: number;
    hasCompletedProfile: boolean;
    hasUsedTarot: boolean;
    hasUsedRunes: boolean;
    hasViewedLunar: boolean;
  };
}

export function SmartRecommendation({ userId, context }: SmartRecommendationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Obtenir la meilleure recommandation basée sur le contexte
  const topRecommendation = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const recommendations = salesFunnel.getSmartRecommendations({
      ...context,
      timeOfDay
    });

    return recommendations[0] || null;
  }, [context]);

  // Masquer après 3 interactions si l'utilisateur n'a pas cliqué
  if (!isVisible || !topRecommendation) return null;

  const discount = salesFunnel.calculateDiscount(
    topRecommendation.price, 
    topRecommendation.originalPrice
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative group"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(true)}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 hover:border-violet-400/50 transition-all"
        >
          {/* Icône animée */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
          </motion.div>
          
          <span className="text-xs font-medium text-violet-300 group-hover:text-violet-200">
            Pour toi
          </span>

          {/* Badge de réduction */}
          {discount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold rounded-full">
              -{discount}%
            </span>
          )}

          {/* Indicateur pulse */}
          <motion.span
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-violet-400 rounded-full"
          />
        </motion.button>

        {/* Mini tooltip au hover */}
        <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-slate-800 border border-violet-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <p className="text-xs text-slate-300 truncate">{topRecommendation.name}</p>
          <p className="text-xs text-violet-400 font-medium">
            {salesFunnel.formatPrice(topRecommendation.price)}
          </p>
        </div>
      </motion.div>

      {/* Modal de détails */}
      <AnimatePresence>
        {showDetails && topRecommendation && (
          <SmartRecommendationModal
            product={topRecommendation}
            onClose={() => setShowDetails(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface SmartRecommendationModalProps {
  product: Product;
  onClose: () => void;
}

function SmartRecommendationModal({ product, onClose }: SmartRecommendationModalProps) {
  const discount = salesFunnel.calculateDiscount(product.price, product.originalPrice);

  // Contenu du modal
  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 rounded-2xl border border-violet-500/20 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-violet-500/20 to-pink-500/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge recommandé */}
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-violet-400" />
            </motion.div>
            <span className="text-sm font-medium text-violet-300">
              Recommandé spécialement pour toi
            </span>
          </div>

          {/* Type de produit */}
          <span className="text-xs text-slate-400 uppercase tracking-wide">
            {product.type === 'coffret' && '🎁 Coffret'}
            {product.type === 'formation' && '📚 Formation'}
            {product.type === 'seance' && '🔮 Séance'}
            {product.type === 'abonnement' && '⭐ Abonnement'}
          </span>

          <h2 className="text-2xl font-bold text-white mt-2">
            {product.name}
          </h2>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-5">
          {/* Urgence */}
          {product.urgency && (
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300 font-medium">
                {product.urgency.message}
              </span>
            </motion.div>
          )}

          {/* Description */}
          <p className="text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Bénéfices */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              ✨ Ce qui est inclus
            </h4>
            <div className="space-y-2">
              {product.benefits.slice(0, 5).map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-violet-400" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
              {product.benefits.length > 5 && (
                <p className="text-xs text-slate-500 ml-8">
                  +{product.benefits.length - 5} autres avantages
                </p>
              )}
            </div>
          </div>

          {/* Témoignage */}
          {product.testimonials && product.testimonials.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(product.testimonials[0].rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                {product.testimonials[0].verified && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Achat vérifié
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-300 italic">
                "{product.testimonials[0].text}"
              </p>
              <p className="text-xs text-slate-500 mt-2">
                — {product.testimonials[0].name}
              </p>
            </div>
          )}

          {/* Prix et CTA */}
          <div className="pt-4 border-t border-slate-700/30">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white">
                  {salesFunnel.formatPrice(product.price)}
                  {product.type === 'abonnement' && (
                    <span className="text-lg text-slate-400">/mois</span>
                  )}
                </div>
                {product.originalPrice && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 line-through">
                      {salesFunnel.formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-green-400 font-medium">
                      Économise {salesFunnel.formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (product.link) {
                  window.open(product.link, '_blank');
                }
                onClose();
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {product.link ? 'Accéder maintenant' : 'Je suis intéressé(e)'}
            </motion.button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Zap className="w-3 h-3 text-green-400" />
              <span>Garantie satisfait ou remboursé 30 jours</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Rendu côté client uniquement avec Portal
  if (typeof window === 'undefined') return null;
  
  return createPortal(modalContent, document.body);
}

export default SmartRecommendation;
