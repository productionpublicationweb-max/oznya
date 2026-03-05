'use client';

import { useState } from 'react';
import { useAuth, User, PromoCode } from '@/lib/auth-context';
import { calculateNumerologyProfile, NumerologyProfile } from '@/lib/numerology';
import { 
  X, Star, Zap, Gift, Crown, Calendar, CreditCard, 
  Moon, Sun, Bell, BellOff, ChevronRight, Award,
  TrendingUp, Heart, Sparkles, Target
} from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

// Badge definitions
const BADGES = [
  { id: 'first_visit', name: 'Premier Pas', icon: '🌟', description: 'Première visite', color: 'from-cyan-500 to-blue-500' },
  { id: '5_messages', name: 'Curieux', icon: '🔮', description: '5 messages envoyés', color: 'from-violet-500 to-purple-500' },
  { id: '10_messages', name: 'Explorateur', icon: '🌙', description: '10 messages envoyés', color: 'from-indigo-500 to-violet-500' },
  { id: '25_messages', name: 'Passionné', icon: '✨', description: '25 messages envoyés', color: 'from-pink-500 to-rose-500' },
  { id: '50_messages', name: 'Initié', icon: '💫', description: '50 messages envoyés', color: 'from-amber-500 to-orange-500' },
  { id: '100_messages', name: 'Maître', icon: '👑', description: '100 messages envoyés', color: 'from-yellow-500 to-amber-500' },
  { id: 'first_booking', name: 'Premier Rendez-vous', icon: '📅', description: 'Première réservation', color: 'from-green-500 to-emerald-500' },
  { id: 'referral', name: 'Parrain', icon: '🤝', description: 'Premier parrainage', color: 'from-teal-500 to-cyan-500' },
  { id: 'loyalty_500', name: 'Fidèle', icon: '💎', description: '500 points de fidélité', color: 'from-blue-500 to-indigo-500' },
  { id: 'loyalty_1000', name: 'Très Fidèle', icon: '🏆', description: '1000 points de fidélité', color: 'from-purple-500 to-pink-500' },
];

// Level definitions
const LEVELS = [
  { level: 1, name: 'Nouveau', minXP: 0, icon: '🌱' },
  { level: 2, name: 'Curieux', minXP: 100, icon: '🌿' },
  { level: 3, name: 'Explorateur', minXP: 250, icon: '🌳' },
  { level: 4, name: 'Initié', minXP: 500, icon: '⭐' },
  { level: 5, name: 'Éveillé', minXP: 1000, icon: '🌟' },
  { level: 6, name: 'Sage', minXP: 2000, icon: '💫' },
  { level: 7, name: 'Maître', minXP: 3500, icon: '🌙' },
  { level: 8, name: 'Gardien', minXP: 5500, icon: '🔮' },
  { level: 9, name: 'Oracle', minXP: 8000, icon: '✨' },
  { level: 10, name: 'Légende', minXP: 12000, icon: '👑' },
];

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout, updateUser } = useAuth();
  const [showNumerology, setShowNumerology] = useState(false);

  // Calculate numerology profile
  const birthDate = user?.birthDate;
  const numerology = birthDate ? calculateNumerologyProfile(birthDate) : null;

  if (!isOpen || !user) return null;

  const currentLevel = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === user.level + 1);
  const xpProgress = nextLevel 
    ? ((user.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 
    : 100;

  const userBadges = user.badges.map(badgeId => BADGES.find(b => b.id === badgeId)).filter(Boolean);

  const toggleTheme = async () => {
    const newTheme = user.theme === 'dark' ? 'light' : 'dark';
    await updateUser({ theme: newTheme });
  };

  const toggleNotifications = async () => {
    await updateUser({ notifications: !user.notifications });
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-lg bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-900/30 to-violet-900/30 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  {user.name || 'Belle Âme'}
                </h3>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level & XP */}
        <div className="p-4 border-b border-cyan-500/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentLevel.icon}</span>
              <div>
                <div className="text-sm font-medium text-white">Niveau {user.level} - {currentLevel.name}</div>
                <div className="text-xs text-slate-400">{user.xp} XP</div>
              </div>
            </div>
            {nextLevel && (
              <div className="text-xs text-slate-400">
                {nextLevel.minXP - user.xp} XP pour {nextLevel.name}
              </div>
            )}
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <CreditCard className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{user.credits}</div>
            <div className="text-[10px] text-slate-400">Crédits</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{user.loyaltyPoints}</div>
            <div className="text-[10px] text-slate-400">Points Fidélité</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <Zap className="w-5 h-5 text-violet-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{user.totalMessages}</div>
            <div className="text-[10px] text-slate-400">Messages</div>
          </div>
        </div>

        {/* Promo Codes */}
        {user.promoCodes && user.promoCodes.length > 0 && (
          <div className="p-4 border-t border-cyan-500/10">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400" />
              Codes Promo Actifs
            </h4>
            <div className="space-y-2">
              {user.promoCodes.map((promo, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-amber-300">{promo.code}</div>
                      <div className="text-xs text-amber-200/70">
                        -{promo.discount}% • Expire le {new Date(promo.expiresAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                      {promo.source === 'welcome' ? 'Bienvenue' : promo.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Numerology Section */}
        {numerology && (
          <div className="p-4 border-t border-cyan-500/10">
            <button
              onClick={() => setShowNumerology(!showNumerology)}
              className="w-full flex items-center justify-between"
            >
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-violet-400" />
                Ma Numérologie
              </h4>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showNumerology ? 'rotate-90' : ''}`} />
            </button>
            
            {showNumerology && (
              <div className="mt-3 space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-violet-900/30 to-indigo-900/30 border border-violet-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
                      {numerology.lifePathNumber}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Chemin de Vie</div>
                      <div className="text-xs text-violet-300">{numerology.lifePathName}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">{numerology.lifePathDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                    <div className="text-lg font-bold text-cyan-400">{numerology.expressionNumber}</div>
                    <div className="text-[10px] text-slate-400">Expression</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                    <div className="text-lg font-bold text-pink-400">{numerology.soulUrgeNumber}</div>
                    <div className="text-[10px] text-slate-400">Âme</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                    <div className="text-lg font-bold text-amber-400">{numerology.personalityNumber}</div>
                    <div className="text-[10px] text-slate-400">Personnalité</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                    <div className="text-lg font-bold text-green-400">{numerology.birthdayNumber}</div>
                    <div className="text-[10px] text-slate-400">Anniversaire</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {userBadges.length > 0 && (
          <div className="p-4 border-t border-cyan-500/10">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-400" />
              Badges ({userBadges.length}/{BADGES.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {userBadges.map((badge) => badge && (
                <div
                  key={badge.id}
                  className={`p-2 rounded-lg bg-gradient-to-r ${badge.color} bg-opacity-20 border border-white/10`}
                  title={badge.description}
                >
                  <span className="text-lg">{badge.icon}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="p-4 border-t border-cyan-500/10 space-y-3">
          <h4 className="text-sm font-medium text-white mb-2">Préférences</h4>
          
          {/* Theme toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-2">
              {user.theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="text-sm text-slate-200">Thème {user.theme === 'dark' ? 'sombre' : 'clair'}</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-10 h-6 rounded-full transition-colors ${user.theme === 'dark' ? 'bg-cyan-500' : 'bg-amber-500'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${user.theme === 'dark' ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Notifications toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-2">
              {user.notifications ? <Bell className="w-4 h-4 text-cyan-400" /> : <BellOff className="w-4 h-4 text-slate-400" />}
              <span className="text-sm text-slate-200">Notifications</span>
            </div>
            <button
              onClick={toggleNotifications}
              className={`w-10 h-6 rounded-full transition-colors ${user.notifications ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${user.notifications ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Birth date */}
          {user.birthDate && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-200">
                Né(e) le {new Date(user.birthDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-cyan-500/10">
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
