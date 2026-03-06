'use client';

import { useState, useEffect } from 'react';

interface SubscriptionPreferences {
  dailyPrediction: boolean;
  reminders: boolean;
  promotions: boolean;
}

interface SubscriptionManagerProps {
  onClose: () => void;
  currentEmail?: string;
}

export default function SubscriptionManager({ onClose, currentEmail }: SubscriptionManagerProps) {
  const [email, setEmail] = useState(currentEmail || '');
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState<SubscriptionPreferences>({
    dailyPrediction: true,
    reminders: true,
    promotions: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  // Vérifier si l'utilisateur est déjà abonné
  useEffect(() => {
    if (currentEmail) {
      checkSubscription(currentEmail);
    }
  }, [currentEmail]);

  const checkSubscription = async (emailToCheck: string) => {
    try {
      const response = await fetch(`/api/cron/daily-reminder?email=${encodeURIComponent(emailToCheck)}`);
      const data = await response.json();
      if (data.found && data.subscriber) {
        setIsSubscribed(true);
        setName(data.subscriber.name || '');
        setPreferences(data.subscriber.preferences);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubmit = async (action: 'subscribe' | 'update' | 'unsubscribe') => {
    if (action !== 'unsubscribe' && !email) {
      setMessage({ type: 'error', text: 'Veuillez entrer votre adresse email' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/cron/daily-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          email,
          name,
          preferences
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        if (action === 'subscribe') {
          setIsSubscribed(true);
        } else if (action === 'unsubscribe') {
          setIsSubscribed(false);
          setShowUnsubscribeConfirm(false);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Une erreur est survenue' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Veuillez entrer votre adresse email' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/cron/daily-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '📧 Email de test envoyé ! Vérifiez votre boîte de réception.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de l\'envoi' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi du test' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDaily = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Veuillez entrer votre adresse email' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/cron/daily-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-daily', email, name })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '🔮 Prédiction du jour envoyée !' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de l\'envoi' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl max-w-md w-full p-6 border border-cyan-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xl">
              📧
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {isSubscribed ? 'Mes notifications' : 'S\'abonner aux notifications'}
              </h2>
              <p className="text-xs text-slate-400">
                Recevez votre énergie du jour et plus encore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              disabled={isSubscribed}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Prénom (optionnel)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Preferences */}
          <div className="space-y-2">
            <label className="block text-sm text-slate-400 mb-2">Préférences de notification</label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={preferences.dailyPrediction}
                onChange={(e) => setPreferences({ ...preferences, dailyPrediction: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <div>
                <p className="text-sm text-white group-hover:text-cyan-400 transition-colors">
                  🔮 Énergie du jour
                </p>
                <p className="text-xs text-slate-500">Recevez votre prédiction quotidienne</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={preferences.reminders}
                onChange={(e) => setPreferences({ ...preferences, reminders: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <div>
                <p className="text-sm text-white group-hover:text-cyan-400 transition-colors">
                  ✨ Rappels personnalisés
                </p>
                <p className="text-xs text-slate-500">Un petit rappel après quelques jours d'absence</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={preferences.promotions}
                onChange={(e) => setPreferences({ ...preferences, promotions: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <div>
                <p className="text-sm text-white group-hover:text-cyan-400 transition-colors">
                  🎁 Offres spéciales
                </p>
                <p className="text-xs text-slate-500">Codes promo et offres exclusives</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {!isSubscribed ? (
            <button
              onClick={() => handleSubmit('subscribe')}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Inscription...' : 'S\'abonner'}
            </button>
          ) : (
            <>
              <button
                onClick={() => handleSubmit('update')}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Mise à jour...' : 'Mettre à jour mes préférences'}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleTestEmail}
                  disabled={isLoading}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  📧 Test
                </button>
                <button
                  onClick={handleSendDaily}
                  disabled={isLoading}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  🔮 Prédiction
                </button>
              </div>
              
              <button
                onClick={() => setShowUnsubscribeConfirm(true)}
                className="w-full py-2 text-red-400 text-sm hover:text-red-300 transition-colors"
              >
                Se désabonner
              </button>
            </>
          )}
        </div>

        {/* Unsubscribe confirmation */}
        {showUnsubscribeConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl p-6 max-w-sm w-full border border-red-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">Confirmer le désabonnement ?</h3>
              <p className="text-slate-400 text-sm mb-4">
                Vous ne recevrez plus les prédictions quotidiennes ni les rappels de Nyxia.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnsubscribeConfirm(false)}
                  className="flex-1 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSubmit('unsubscribe')}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Se désabonner
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-slate-500 mt-4 text-center">
          Vos données sont protégées. Vous pouvez vous désabonner à tout moment.
        </p>
      </div>
    </div>
  );
}
