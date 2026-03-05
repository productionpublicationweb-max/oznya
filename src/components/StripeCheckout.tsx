'use client';

import { useState } from 'react';
import { CreditCard, X, Check, Shield, Lock, Sparkles, Loader2 } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  amount: number;
}

interface StripeCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceItem | null;
  promoCode?: string;
}

const CONSULTATION_SERVICES: ServiceItem[] = [
  {
    id: 'consultation-30',
    name: 'Consultation 30 minutes',
    description: 'Une séance de guidance personnalisée',
    price: '89 $ CAD',
    amount: 8900,
  },
  {
    id: 'consultation-60',
    name: 'Consultation 60 minutes',
    description: 'Séance approfondie avec analyse complète',
    price: '125 $ CAD',
    amount: 12500,
  },
  {
    id: 'express-1q1r',
    name: '1 Question | 1 Réponse',
    description: 'Une question précise, une réponse éclairante',
    price: '25 $ CAD',
    amount: 2500,
  },
];

export function StripeCheckout({ isOpen, onClose, service, promoCode }: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(service || null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!selectedService) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          promoCode
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        onClose();
      } else {
        setError(data.error || 'Erreur lors de la création du paiement');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  // Calculate discount if promo code exists
  const discountPercent = promoCode ? 15 : 0;
  const finalPrice = selectedService 
    ? Math.round(selectedService.amount * (1 - discountPercent / 100)) / 100 
    : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl shadow-cyan-500/10">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Paiement sécurisé</h2>
              <p className="text-xs text-slate-400">Réserver une consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Service selection */}
        <div className="p-4 max-h-[300px] overflow-y-auto space-y-2">
          {!selectedService && CONSULTATION_SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedService(s)}
              className="w-full p-3 rounded-xl border text-left transition-all bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-white">{s.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.description}</div>
                  <div className="text-sm text-cyan-400 mt-2 font-medium">{s.price}</div>
                </div>
              </div>
            </button>
          ))}

          {selectedService && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-900/30 to-violet-900/30 border border-cyan-500/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-white">{selectedService.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{selectedService.description}</div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 whitespace-nowrap ml-2"
                >
                  Modifier
                </button>
              </div>
              
              {/* Promo code display */}
              {promoCode && (
                <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>Code promo: <strong>{promoCode}</strong> (-15%)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Payment summary */}
        {selectedService && (
          <div className="p-4 border-t border-cyan-500/10 bg-slate-900/50">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Sous-total</span>
                <span className="text-slate-200">{selectedService.price}</span>
              </div>
              {promoCode && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-400">Réduction (15%)</span>
                  <span className="text-green-400">-{(selectedService.amount * 0.15 / 100).toFixed(2)} $</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-300 font-medium">Total</span>
                <span className="text-xl font-bold text-white">{finalPrice.toFixed(2)} $ CAD</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Payer {finalPrice.toFixed(2)} $ CAD</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Shield className="w-3 h-3" />
                <span>Sécurisé par Stripe</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Check className="w-3 h-3" />
                <span>Paiement crypté</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick payment button
export function QuickPayButton({ onClick, label = 'Payer' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
    >
      <CreditCard className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
