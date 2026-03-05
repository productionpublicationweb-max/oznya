'use client';

import { X, Gift, Sparkles } from 'lucide-react';

interface CoffretModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COFFRETS = [
  { name: 'Coffret Spécial du Mois', url: 'https://www.oznya.com', icon: '🌟', desc: 'Offre exclusive du mois' },
  { name: 'Coffret Abondance', url: 'https://www.magiquebusiness.com/tunnelabondance', icon: '💎', desc: 'Attirez l\'abondance' },
  { name: 'Coffret Sérénité Radicale', url: 'https://www.uneamiedanslemiroir.com/coffrets/sereniteradicale', icon: '🌙', desc: 'Paix intérieure profonde' },
  { name: 'Coffret Regard Sécurisant', url: 'https://www.uneamiedanslemiroir.com/coffrets/regardsecurisant', icon: '👁️', desc: 'Clarté et vision' },
  { name: 'Coffret Je Suis', url: 'https://www.uneamiedanslemiroir.com/coffrets/jesuis', icon: '✨', desc: 'Connexion à soi' },
  { name: 'Coffret De la Fuite à la Présence', url: 'https://www.uneamiedanslemiroir.com/coffrets/delafuitealapresence', icon: '🦋', desc: 'Ancrage et présence' },
  { name: 'Coffret Arméstice du Soir', url: 'https://www.uneamiedanslemiroir.com/coffrets/armesticedusoir', icon: '🌅', desc: 'Sérénité nocturne' }
];

export function CoffretModal({ isOpen, onClose }: CoffretModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-500/20 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            Nos Coffrets
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {COFFRETS.map((coffret) => (
            <a
              key={coffret.name}
              href={coffret.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
            >
              <span className="text-2xl">{coffret.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{coffret.name}</div>
                <div className="text-xs text-slate-400">{coffret.desc}</div>
              </div>
              <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuickCoffretButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm transition-colors"
    >
      <Gift className="w-4 h-4" />
      Coffret
    </button>
  );
}
