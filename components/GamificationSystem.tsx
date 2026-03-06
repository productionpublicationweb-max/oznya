// components/GamificationSystem.tsx
'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  maxProgress: number;
  reward?: string;
  unlocked: boolean;
}

export function GamificationSystem({ userId }: { userId: string }) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-conversation',
      title: 'Première Connexion Cosmique',
      description: 'Avoir ta première conversation avec Nyxia',
      icon: Sparkles,
      progress: 0,
      maxProgress: 1,
      reward: 'Code promo 10%',
      unlocked: false
    },
    {
      id: 'tarot-master',
      title: 'Maître du Tarot',
      description: 'Effectuer 5 tirages de tarot',
      icon: Star,
      progress: 0,
      maxProgress: 5,
      reward: 'Tirage personnalisé gratuit',
      unlocked: false
    },
    {
      id: 'loyal-soul',
      title: 'Âme Fidèle',
      description: 'Revenir 7 jours consécutifs',
      icon: Trophy,
      progress: 0,
      maxProgress: 7,
      reward: 'Accès VIP 1 mois',
      unlocked: false
    }
  ]);

  const [showUnlock, setShowUnlock] = useState<Achievement | null>(null);

  const checkAchievements = async () => {
    // Logique pour vérifier et débloquer les achievements
    // Intégration avec Supabase pour sauvegarder la progression
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Tes Accomplissements Mystiques
      </h3>

      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          whileHover={{ scale: 1.02 }}
          className={`
            p-4 rounded-xl border transition-all
            ${achievement.unlocked 
              ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30' 
              : 'bg-slate-800/50 border-slate-700'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`
              p-2 rounded-lg
              ${achievement.unlocked ? 'bg-yellow-500/20' : 'bg-slate-700/50'}
            `}>
              <achievement.icon className={`
                w-5 h-5
                ${achievement.unlocked ? 'text-yellow-400' : 'text-slate-400'}
              `} />
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">
                {achievement.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {achievement.description}
              </p>

              {!achievement.unlocked && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Progression</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                      }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                    />
                  </div>
                </div>
              )}

              {achievement.reward && (
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Gift className="w-3 h-3 text-violet-400" />
                  <span className="text-violet-400">{achievement.reward}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Modal de déblocage */}
      {showUnlock && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md text-center border border-yellow-500/30">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Accomplissement Débloqué !
            </h3>
            <p className="text-lg text-yellow-400 mb-4">
              {showUnlock.title}
            </p>
            {showUnlock.reward && (
              <div className="p-4 bg-violet-500/20 rounded-lg border border-violet-500/30">
                <p className="text-sm text-white">
                  🎁 Récompense: {showUnlock.reward}
                </p>
              </div>
            )}
            <button
              onClick={() => setShowUnlock(null)}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg"
            >
              Merveilleux !
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
