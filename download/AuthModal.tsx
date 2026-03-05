'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { X, Mail, Lock, User, Calendar, Gift, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [referralCode, setReferralCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          onClose();
          resetForm();
        } else {
          setError(result.error || 'Erreur de connexion');
        }
      } else {
        const result = await register({
          email,
          password,
          name: name || undefined,
          birthDate: birthDate || undefined,
          referralCode: referralCode || undefined
        });
        if (result.success) {
          onClose();
          resetForm();
        } else {
          setError(result.error || 'Erreur d\'inscription');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setBirthDate('');
    setReferralCode('');
    setError(null);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-gradient-to-r from-cyan-900/20 to-violet-900/20">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h3>
          <button 
            onClick={() => { onClose(); resetForm(); }} 
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Welcome bonus info for register */}
        {mode === 'register' && (
          <div className="px-4 py-3 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-500/20">
            <div className="flex items-center gap-2 text-sm text-amber-300">
              <Gift className="w-4 h-4" />
              <span className="font-medium">Bonus de bienvenue:</span>
            </div>
            <div className="mt-1 text-xs text-amber-200/80 space-y-0.5">
              <p>✨ 5 crédits gratuits</p>
              <p>💎 100 points de fidélité</p>
              <p>🎟️ Code promo -20% (30 jours)</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Name field (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nom (optionnel)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre prénom"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            {mode === 'register' && (
              <p className="text-[10px] text-slate-500 mt-1">Minimum 6 caractères</p>
            )}
          </div>

          {/* Birth date field (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Date de naissance (optionnel)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Pour des prédictions personnalisées basées sur la numérologie
              </p>
            </div>
          )}

          {/* Referral code field (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Code de parrainage (optionnel)
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="NYXIA-XXXXXX"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Chargement...
              </span>
            ) : mode === 'login' ? (
              'Se connecter'
            ) : (
              'Créer mon compte'
            )}
          </button>

          {/* Toggle mode */}
          <div className="text-center text-sm text-slate-400">
            {mode === 'login' ? (
              <>
                Pas encore de compte?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  S'inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
