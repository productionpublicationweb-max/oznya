'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Star, Clock, Users, Check, ExternalLink, 
  Sparkles, Crown, BookOpen, Package, Calendar,
  ChevronRight, Zap, Heart
} from 'lucide-react';
import { useState } from 'react';
import { 
  salesFunnel, 
  Product, 
  Testimonial 
} from '@/lib/salesFunnel';

interface ProductRecommendationProps {
  product: Product;
  variant?: 'card' | 'inline' | 'banner';
  onAction?: (product: Product) => void;
}

export function ProductRecommendation({ 
  product, 
  variant = 'card',
  onAction 
}: ProductRecommendationProps) {
  const discount = salesFunnel.calculateDiscount(product.price, product.originalPrice);
  
  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 p-4"
      >
        {product.urgency && (
          <div className="absolute top-0 right-0 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-bl-lg">
            {product.urgency.message}
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <div className="text-3xl">
            {product.type === 'coffret' && '🎁'}
            {product.type === 'formation' && '📚'}
            {product.type === 'seance' && '🔮'}
            {product.type === 'abonnement' && '⭐'}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-white text-sm">{product.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{product.description}</p>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-cyan-400">
              {salesFunnel.formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-500 line-through">
                {salesFunnel.formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-pointer group"
        onClick={() => onAction?.(product)}
      >
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
          <Package className="w-5 h-5 text-cyan-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors truncate">
            {product.name}
          </p>
          <p className="text-xs text-slate-400 truncate">{product.benefits[0]}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-cyan-400">
            {salesFunnel.formatPrice(product.price)}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </div>
      </motion.div>
    );
  }

  // Default: card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
    >
      {/* Badge urgence */}
      {product.urgency && (
        <div className="absolute top-0 right-0 z-10">
          <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-bl-xl flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {product.urgency.message}
          </div>
        </div>
      )}

      {/* Réduction */}
      {discount > 0 && !product.urgency && (
        <div className="absolute top-3 left-3 z-10">
          <div className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-lg">
            -{discount}%
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
            {product.type === 'coffret' && <Gift className="w-6 h-6 text-cyan-400" />}
            {product.type === 'formation' && <BookOpen className="w-6 h-6 text-violet-400" />}
            {product.type === 'seance' && <Sparkles className="w-6 h-6 text-pink-400" />}
            {product.type === 'abonnement' && <Crown className="w-6 h-6 text-amber-400" />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                {product.type === 'coffret' && 'Coffret'}
                {product.type === 'formation' && 'Formation'}
                {product.type === 'seance' && 'Séance'}
                {product.type === 'abonnement' && 'Abonnement'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-4">{product.description}</p>

        {/* Bénéfices */}
        <div className="space-y-2 mb-4">
          {product.benefits.slice(0, 4).map((benefit, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
          {product.benefits.length > 4 && (
            <p className="text-xs text-slate-500">+{product.benefits.length - 4} autres avantages</p>
          )}
        </div>

        {/* Témoignage si disponible */}
        {product.testimonials && product.testimonials.length > 0 && (
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[...Array(product.testimonials[0].rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              {product.testimonials[0].verified && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Vérifié
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 italic">"{product.testimonials[0].text}"</p>
            <p className="text-xs text-slate-500 mt-1">— {product.testimonials[0].name}</p>
          </div>
        )}

        {/* Prix et CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
          <div>
            <div className="text-2xl font-bold text-white">
              {salesFunnel.formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 line-through">
                  {salesFunnel.formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs text-green-400">
                  Économise {salesFunnel.formatPrice(product.originalPrice - product.price)}
                </span>
              </div>
            )}
            {product.type === 'abonnement' && (
              <span className="text-xs text-slate-400">/mois</span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction?.(product)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
          >
            Découvrir
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Composant pour afficher plusieurs recommandations
interface ProductRecommendationsListProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  onProductAction?: (product: Product) => void;
}

export function ProductRecommendationsList({ 
  products, 
  title = 'Recommandé pour toi',
  subtitle = 'Basé sur ton parcours spirituel',
  onProductAction 
}: ProductRecommendationsListProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            {title}
          </h3>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductRecommendation 
              product={product} 
              onAction={onProductAction}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Modal détaillé pour un produit
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onPurchase?: (product: Product) => void;
}

export function ProductModal({ product, onClose, onPurchase }: ProductModalProps) {
  if (!product) return null;

  const discount = salesFunnel.calculateDiscount(product.price, product.originalPrice);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-cyan-500/20"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            ✕
          </button>

          {/* Badge urgence */}
          {product.urgency && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-lg flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {product.urgency.message}
            </div>
          )}

          <div className="text-center pt-8">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 mb-4">
              {product.type === 'coffret' && <Gift className="w-10 h-10 text-cyan-400" />}
              {product.type === 'formation' && <BookOpen className="w-10 h-10 text-violet-400" />}
              {product.type === 'seance' && <Sparkles className="w-10 h-10 text-pink-400" />}
              {product.type === 'abonnement' && <Crown className="w-10 h-10 text-amber-400" />}
            </div>

            <span className="text-xs text-slate-400 uppercase tracking-wide">
              {product.type === 'coffret' && 'Coffret Digital'}
              {product.type === 'formation' && 'Formation en Ligne'}
              {product.type === 'seance' && 'Séance Privée'}
              {product.type === 'abonnement' && 'Abonnement Premium'}
            </span>
            
            <h2 className="text-2xl font-bold text-white mt-2">{product.name}</h2>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          <p className="text-slate-300 leading-relaxed">{product.description}</p>

          {/* Bénéfices */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">✨ Ce qui est inclus</h4>
            <div className="space-y-2">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Témoignages */}
          {product.testimonials && product.testimonials.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">💬 Ce qu'elles disent</h4>
              <div className="space-y-3">
                {product.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Achat vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 italic">"{testimonial.text}"</p>
                    <p className="text-xs text-slate-500 mt-2">— {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Prix et CTA */}
          <div className="pt-4 border-t border-slate-700/30">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white">
                  {salesFunnel.formatPrice(product.price)}
                  {product.type === 'abonnement' && <span className="text-lg text-slate-400">/mois</span>}
                </div>
                {product.originalPrice && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 line-through">
                      {salesFunnel.formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-green-400 font-medium">
                      -{discount}% aujourd'hui
                    </span>
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPurchase?.(product)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {product.link ? 'Accéder maintenant' : 'Je suis intéressé(e)'}
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            <p className="text-xs text-center text-slate-500 mt-3">
              🔒 Paiement sécurisé • Satisfait ou remboursé 30 jours
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductRecommendation;
