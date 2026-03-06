'use client';

import { useState } from 'react';
import { Mail, X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'summary' | 'promo' | 'prediction';
  data: {
    messages?: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
    promoCode?: string;
    discount?: number;
    expiryDate?: string;
    dailyEnergy?: {
      number: number;
      title: string;
      description: string;
      advice: string;
      luckyColor: string;
      luckyNumber: number;
      crystal: string;
    };
  };
}

export function EmailModal({ isOpen, onClose, type, data }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const titles = {
    summary: '📬 Recevoir le récapitulatif',
    promo: '🎁 Recevoir mon code promo',
    prediction: '🔮 Recevoir ma prédiction'
  };

  const descriptions = {
    summary: 'Recevez le résumé de votre conversation par email.',
    promo: 'Recevez votre code promo exclusif par email.',
    prediction: 'Recevez votre énergie du jour par email.'
  };

  const handleSend = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse email valide');
      return;
    }

    setIsSending(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      let emailType = type;
      let emailData: any = { to: email, userName: name || undefined };

      switch (type) {
        case 'summary':
          emailData.messages = data.messages || [];
          break;
        case 'promo':
          emailData.promoCode = data.promoCode;
          emailData.discount = data.discount;
          emailData.expiryDate = data.expiryDate;
          break;
        case 'prediction':
          if (data.dailyEnergy) {
            emailData = { ...emailData, ...data.dailyEnergy };
          }
          break;
      }

      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'summary' ? 'conversation-summary' : 
                type === 'promo' ? 'promo-code' : 'daily-prediction',
          data: emailData
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setEmail('');
          setName('');
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Erreur de connexion');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl shadow-cyan-500/10">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{titles[type]}</h2>
              <p className="text-xs text-slate-400">{descriptions[type]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Preview card */}
          {type === 'promo' && data.promoCode && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 text-center">
              <div className="text-2xl font-bold text-amber-300">{data.promoCode}</div>
              <div className="text-sm text-amber-200 mt-1">-{data.discount}% de réduction</div>
            </div>
          )}

          {type === 'prediction' && data.dailyEnergy && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-900/30 to-cyan-900/30 border border-violet-500/30 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                {data.dailyEnergy.number}
              </div>
              <div className="text-sm text-slate-300 mt-1">{data.dailyEnergy.title}</div>
            </div>
          )}

          {type === 'summary' && (
            <div className="p-3 rounded-lg bg-slate-800/50 text-sm text-slate-300">
              📨 Un récapitulatif complet de votre conversation sera envoyé.
            </div>
          )}

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Votre prénom (optionnel)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prénom"
                className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Votre email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-400 text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle className="w-4 h-4" />
              <span>Email envoyé avec succès !</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/10 bg-slate-900/50">
          <button
            onClick={handleSend}
            disabled={isSending || !email}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Envoyer</span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 text-center mt-2">
            Vos informations restent confidentielles
          </p>
        </div>
      </div>
    </div>
  );
}

// Quick email button
export function QuickEmailButton({ onClick, label = '📧 Email' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
    >
      <Mail className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
