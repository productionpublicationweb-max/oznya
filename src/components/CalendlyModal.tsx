'use client';

import { useState } from 'react';
import { Calendar, X, Clock, ChevronRight, Star } from 'lucide-react';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: {
    name?: string;
    email?: string;
  };
}

export function CalendlyModal({ isOpen, onClose, prefillData }: CalendlyModalProps) {
  const [selectedType, setSelectedType] = useState<'consultation-30' | 'consultation-60'>('consultation-30');

  const consultationTypes = [
    {
      id: 'consultation-30',
      name: 'Consultation 30 minutes',
      description: 'Une séance de guidance personnalisée',
      duration: '30 min',
      calendlyUrl: 'https://calendly.com/dianeboyer/consultation-30-minutes',
      price: '89 $ CAD',
      icon: '🔮',
      recommended: true
    },
    {
      id: 'consultation-60',
      name: 'Consultation 60 minutes',
      description: 'Séance approfondie avec analyse complète',
      duration: '60 min',
      calendlyUrl: 'https://calendly.com/dianeboyer/consultations-individuel-prive',
      price: '125 $ CAD',
      icon: '✨'
    }
  ];

  if (!isOpen) return null;

  const selectedConsultation = consultationTypes.find(c => c.id === selectedType);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-violet-500/20 overflow-hidden shadow-2xl shadow-violet-500/10">
        {/* Header */}
        <div className="p-4 border-b border-violet-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Prendre rendez-vous</h2>
              <p className="text-xs text-slate-400">avec Diane Boyer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Consultation type selector */}
        <div className="p-4 border-b border-violet-500/10">
          <div className="flex gap-3 justify-center">
            {consultationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as any)}
                className={`
                  relative flex-shrink-0 p-4 rounded-xl border transition-all w-48
                  ${selectedType === type.id 
                    ? 'bg-violet-500/10 border-violet-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                  }
                `}
              >
                {type.recommended && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium text-white">{type.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {type.duration}
                </div>
                <div className="text-sm text-violet-400 font-medium mt-2">{type.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calendly embed */}
        <div className="h-[500px]">
          {selectedConsultation && (
            <iframe
              src={`${selectedConsultation.calendlyUrl}${
                prefillData?.name ? `?name=${encodeURIComponent(prefillData.name)}` : ''
              }${prefillData?.email ? `&email=${encodeURIComponent(prefillData.email)}` : ''}`}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Calendly"
              className="bg-slate-900"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-violet-500/10 bg-slate-900/50">
          <p className="text-xs text-slate-500 text-center">
            Vous allez être redirigé vers Calendly pour finaliser votre rendez-vous avec Diane
          </p>
        </div>
      </div>
    </div>
  );
}

// Quick booking button component
export function QuickBookButton({ onClick, label = 'Réserver' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="
        group relative overflow-hidden
        flex items-center gap-2 px-4 py-2 rounded-full
        bg-gradient-to-r from-violet-500 to-amber-500
        text-white text-sm font-medium
        shadow-lg shadow-violet-500/25
        hover:shadow-violet-500/40
        transition-all duration-300
      "
    >
      <Calendar className="w-4 h-4" />
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
