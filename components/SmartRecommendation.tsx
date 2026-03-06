// components/SmartRecommendation.tsx
'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Clock, Users, Star, Zap, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';

// Types intégrés directement
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  popularity?: number;
}

interface SmartRecommendationProps {
  userId?: string;
  currentProduct?: Product;
  maxRecommendations?: number;
}

// Données de démo
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Formation NeuroAlchimie Niveau 1',
    description: 'Découvre les bases de la régulation émotionnelle',
    price: 197,
    category: 'formation',
    rating: 4.8,
    popularity: 95
  },
  {
    id: '2',
    name: 'Accompagnement Personnalisé 3 mois',
    description: 'Transformation profonde avec suivi individuel',
    price: 1497,
    category: 'coaching',
    rating: 5.0,
    popularity: 88
  },
  {
    id: '3',
    name: 'Masterclass CashFlow Aligné',
    description: 'Transforme ta relation à l\'argent',
    price: 97,
    category: 'masterclass',
    rating: 4.9,
    popularity: 92
  },
  {
    id: '4',
    name: 'Pack Sérénité Complète',
    description: 'Tous les outils pour ton équilibre nerveux',
    price: 397,
    category: 'pack',
    rating: 4.7,
    popularity: 85
  }
];

export function SmartRecommendation({ 
  userId,
  currentProduct,
  maxRecommendations = 3 
}: SmartRecommendationProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      // Filtrer le produit actuel et prendre les N premiers
      const filtered = demoProducts
        .filter(p => p.id !== currentProduct?.id)
        .slice(0, maxRecommendations);
      
      setRecommendations(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentProduct, maxRecommendations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-lg">
          <Zap className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Recommandations pour toi
          </h2>
          <p className="text-sm text-slate-400">
            Basées sur ton parcours et tes besoins
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300"
          >
            {/* Badge popularité */}
            {product.popularity && product.popularity > 90 && (
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full text-xs font-medium text-white">
                  <Star className="w-3 h-3" />
                  Populaire
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Icône catégorie */}
              <div className="mb-4">
                <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-xl">
                  {product.category === 'formation' && <ShoppingBag className="w-6 h-6 text-cyan-400" />}
                  {product.category === 'coaching' && <Users className="w-6 h-6 text-cyan-400" />}
                  {product.category === 'masterclass' && <Clock className="w-6 h-6 text-cyan-400" />}
                  {product.category === 'pack' && <Gift className="w-6 h-6 text-cyan-400" />}
                </div>
              </div>

              {/* Titre et description */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {product.description}
              </p>

              {/* Note */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-slate-400 ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Prix et CTA */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                  {product.price}€
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Découvrir
                </button>
              </div>
            </div>

            {/* Effet hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
