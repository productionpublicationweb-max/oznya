// components/GamificationSystem.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Gift, X, Crown, Heart, Zap, Moon, Sun, Calendar, MessageCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
  maxProgress: number;
  reward: string;
  rewardType: 'credits' | 'promo' | 'free_service' | 'vip';
  unlocked: boolean;
  unlockedAt?: string;
}

interface GamificationSystemProps {
  userId: string;
  conversationCount?: number;
  onReward?: (reward: { type: string; value: string }) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-conversation',
    title: 'Première Connexion Cosmique',
    description: 'Avoir ta première conversation avec Nyxia',
    icon: Sparkles,
    progress: 0,
    maxProgress: 1,
    reward: '50 points de fidélité',
    rewardType: 'credits',
    unlocked: false
  },
  {
    id: 'curious-explorer',
    title: 'Explorateur Curieux',
    description: 'Avoir 5 conversations avec Nyxia',
    icon: MessageCircle,
    progress: 0,
    maxProgress: 5,
    reward: 'Code promo 15%',
    rewardType: 'promo',
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
    rewardType: 'free_service',
    unlocked: false
  },
  {
    id: 'rune-seeker',
    title: 'Chercheur de Runes',
    description: 'Effectuer 3 tirages de runes',
    icon: Moon,
    progress: 0,
    maxProgress: 3,
    reward: 'Lecture des runes approfondie',
    rewardType: 'free_service',
    unlocked: false
  },
  {
    id: 'loyal-soul',
    title: 'Âme Fidèle',
    description: 'Revenir 7 jours consécutifs',
    icon: Calendar,
    progress: 0,
    maxProgress: 7,
    reward: 'Accès VIP 1 mois',
    rewardType: 'vip',
    unlocked: false
  },
  {
    id: 'night-owl',
    title: 'Hibou Nocturne',
    description: 'Parler à Nyxia après minuit 3 fois',
    icon: Moon,
    progress: 0,
    maxProgress: 3,
    reward: 'Guidance de nuit exclusive',
    rewardType: 'free_service',
    unlocked: false
  },
  {
    id: 'early-bird',
    title: 'Lève-Tôt Spirituel',
    description: 'Parler à Nyxia avant 6h du matin',
    icon: Sun,
    progress: 0,
    maxProgress: 1,
    reward: '100 points de fidélité',
    rewardType: 'credits',
    unlocked: false
  },
  {
    id: 'conversations-25',
    title: 'Passionné Mystique',
    description: 'Avoir 25 conversations avec Nyxia',
    icon: Heart,
    progress: 0,
    maxProgress: 25,
    reward: 'Code promo 25%',
    rewardType: 'promo',
    unlocked: false
  },
  {
    id: 'conversations-50',
    title: 'Initié Confirmé',
    description: 'Avoir 50 conversations avec Nyxia',
    icon: Zap,
    progress: 0,
    maxProgress: 50,
    reward: 'Consultation gratuite avec Diane',
    rewardType: 'free_service',
    unlocked: false
  },
  {
    id: 'conversations-100',
    title: 'Maître Cosmique',
    description: 'Avoir 100 conversations avec Nyxia',
    icon: Crown,
    progress: 0,
    maxProgress: 100,
    reward: 'Statut VIP à vie + 500 points',
    rewardType: 'vip',
    unlocked: false
  }
];

export function GamificationSystem({ userId, conversationCount = 0, onReward }: GamificationSystemProps) {
  // Initialize state with default values first
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    // Try to load from localStorage synchronously during initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`nyxia_achievements_${userId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.achievements || DEFAULT_ACHIEVEMENTS;
        } catch {
          return DEFAULT_ACHIEVEMENTS;
        }
      }
    }
    return DEFAULT_ACHIEVEMENTS;
  });
  
  const [showUnlock, setShowUnlock] = useState<Achievement | null>(null);
  
  const [totalPoints, setTotalPoints] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`nyxia_achievements_${userId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.totalPoints || 0;
        } catch {
          return 0;
        }
      }
    }
    return 0;
  });
  
  const [level, setLevel] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`nyxia_achievements_${userId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.level || 1;
        } catch {
          return 1;
        }
      }
    }
    return 1;
  });

  // Sauvegarder les achievements
  const saveAchievements = useCallback((newAchievements: Achievement[], points: number, lvl: number) => {
    localStorage.setItem(`nyxia_achievements_${userId}`, JSON.stringify({
      achievements: newAchievements,
      totalPoints: points,
      level: lvl
    }));
  }, [userId]);

  // Mettre à jour la progression
  const updateProgress = useCallback((achievementId: string, progress: number) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === achievementId && !a.unlocked) {
          const newProgress = Math.min(progress, a.maxProgress);
          const newlyUnlocked = newProgress >= a.maxProgress;
          
          if (newlyUnlocked) {
            // Débloquer l'achievement
            setTimeout(() => {
              setShowUnlock({ ...a, progress: newProgress, unlocked: true, unlockedAt: new Date().toISOString() });
              // Ajouter les points
              const pointsEarned = a.maxProgress * 10;
              setTotalPoints(p => {
                const newPoints = p + pointsEarned;
                // Calculer le niveau
                const newLevel = Math.floor(newPoints / 100) + 1;
                setLevel(newLevel);
                saveAchievements(updated, newPoints, newLevel);
                return newPoints;
              });
              // Notifier le parent
              onReward?.({ type: a.rewardType, value: a.reward });
            }, 500);
          }
          
          return { ...a, progress: newProgress, unlocked: newlyUnlocked };
        }
        return a;
      });
      
      saveAchievements(updated, totalPoints, level);
      return updated;
    });
  }, [totalPoints, level, saveAchievements, onReward]);

  // Mettre à jour le nombre de conversations
  useEffect(() => {
    if (conversationCount > 0) {
      // Use setTimeout to avoid cascading renders
      const timer = setTimeout(() => {
        updateProgress('first-conversation', 1);
        updateProgress('curious-explorer', conversationCount);
        updateProgress('conversations-25', conversationCount);
        updateProgress('conversations-50', conversationCount);
        updateProgress('conversations-100', conversationCount);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [conversationCount, updateProgress]);

  // Vérifier l'heure pour les achievements nocturnes/matinaux
  useEffect(() => {
    const hour = new Date().getHours();
    const timer = setTimeout(() => {
      if (hour >= 0 && hour < 6) {
        // Nuit
        const storedNight = localStorage.getItem(`nyxia_night_count_${userId}`);
        const nightCount = (storedNight ? parseInt(storedNight) : 0) + 1;
        localStorage.setItem(`nyxia_night_count_${userId}`, nightCount.toString());
        updateProgress('night-owl', nightCount);
      }
      if (hour >= 4 && hour < 6) {
        // Tôt le matin
        updateProgress('early-bird', 1);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [userId, updateProgress]);

  // Vérifier les jours consécutifs
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDays = localStorage.getItem(`nyxia_consecutive_days_${userId}`);
    const lastVisit = localStorage.getItem(`nyxia_last_visit_${userId}`);
    
    const timer = setTimeout(() => {
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Jour consécutif
          const consecutiveDays = (storedDays ? parseInt(storedDays) : 0) + 1;
          localStorage.setItem(`nyxia_consecutive_days_${userId}`, consecutiveDays.toString());
          updateProgress('loyal-soul', consecutiveDays);
        } else if (diffDays > 1) {
          // Reset
          localStorage.setItem(`nyxia_consecutive_days_${userId}`, '1');
          updateProgress('loyal-soul', 1);
        }
      }
      
      localStorage.setItem(`nyxia_last_visit_${userId}`, today);
    }, 0);
    return () => clearTimeout(timer);
  }, [userId, updateProgress]);

  // Calculer le niveau basé sur les points
  const levelName = () => {
    if (level >= 10) return { name: 'Légende', icon: '👑' };
    if (level >= 8) return { name: 'Oracle', icon: '🔮' };
    if (level >= 6) return { name: 'Sage', icon: '💫' };
    if (level >= 4) return { name: 'Initié', icon: '🌟' };
    if (level >= 2) return { name: 'Explorateur', icon: '🌿' };
    return { name: 'Nouveau', icon: '🌱' };
  };

  const currentLevel = levelName();
  const nextLevelPoints = level * 100;
  const progressToNextLevel = (totalPoints % 100) / 100 * 100;

  return (
    <div className="space-y-4">
      {/* En-tête avec niveau et points */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{currentLevel.icon}</div>
            <div>
              <div className="text-xs text-slate-400">Niveau {level}</div>
              <div className="text-lg font-semibold text-white">{currentLevel.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">{totalPoints}</div>
            <div className="text-xs text-slate-400">Points de fidélité</div>
          </div>
        </div>
        
        {/* Barre de progression vers le prochain niveau */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Progression niveau {level + 1}</span>
            <span>{totalPoints} / {nextLevelPoints}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Titre de section */}
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Tes Accomplissements Mystiques
      </h3>

      {/* Liste des achievements */}
      <div className="space-y-2">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.01 }}
            className={`
              p-3 rounded-xl border transition-all cursor-pointer
              ${achievement.unlocked 
                ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30' 
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }
            `}
            onClick={() => achievement.unlocked && setShowUnlock(achievement)}
          >
            <div className="flex items-start gap-3">
              <div className={`
                p-2 rounded-lg flex-shrink-0
                ${achievement.unlocked ? 'bg-yellow-500/20' : 'bg-slate-700/50'}
              `}>
                <achievement.icon className={`
                  w-4 h-4
                  ${achievement.unlocked ? 'text-yellow-400' : 'text-slate-400'}
                `} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium truncate ${achievement.unlocked ? 'text-yellow-300' : 'text-white'}`}>
                    {achievement.title}
                  </h4>
                  {achievement.unlocked && (
                    <span className="text-xs text-yellow-400 flex-shrink-0 ml-2">✓ Débloqué</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Progression</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
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

                <div className="mt-1.5 flex items-center gap-1 text-xs">
                  <Gift className="w-3 h-3 text-violet-400" />
                  <span className="text-violet-400 truncate">{achievement.reward}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de déblocage */}
      <AnimatePresence>
        {showUnlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowUnlock(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md w-full text-center border border-yellow-500/30 shadow-2xl shadow-yellow-500/20"
            >
              {/* Animation de célébration */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              >
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                🎉 Accomplissement Débloqué !
              </h3>
              <p className="text-xl text-yellow-400 mb-4 font-medium">
                {showUnlock.title}
              </p>
              
              <p className="text-slate-300 text-sm mb-4">
                {showUnlock.description}
              </p>

              <div className="p-4 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl border border-violet-500/30 mb-6">
                <div className="text-xs text-slate-400 mb-1">🎁 Récompense obtenue</div>
                <p className="text-lg text-white font-medium">
                  {showUnlock.reward}
                </p>
              </div>
              
              <button
                onClick={() => setShowUnlock(null)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Merveilleux !
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GamificationSystem;
