'use client';

import { X, Gift, Sparkles, Star, Moon, Eye, Heart, Sunrise } from 'lucide-react';

interface CoffretModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COFFRETS = [
  { name: 'Coffret Spécial du Mois', url: 'https://www.oznya.com', icon: Star, desc: 'Offre exclusive du mois' },
  { name: 'Coffret Abondance', url: 'https://www.magiquebusiness.com/tunnelabondance', icon: Sparkles, desc: 'Attirez l\'abondance' },
  { name: 'Coffret Sérénité Radicale', url: 'https://www.uneamiedanslemiroir.com/coffrets/sereniteradicale', icon: Moon, desc: 'Paix intérieure' },
  { name: 'Coffret Regard Sécurisant', url: 'https://www.uneamiedanslemiroir.com/coffrets/regardsecurisant', icon: Eye, desc: 'Clarté et vision' },
  { name: 'Coffret Je Suis', url: 'https://www.uneamiedanslemiroir.com/coffrets/jesuis', icon: Heart, desc: 'Connexion à soi' },
  { name: 'Coffret De la Fuite à la Présence', url: 'https://www.uneamiedanslemiroir.com/coffrets/delafuitealapresence', icon: Sparkles, desc: 'Ancrage et présence' },
  { name: 'Coffret Arméstice du Soir', url: 'https://www.uneamiedanslemiroir.com/coffrets/armesticedusoir', icon: Sunrise, desc: 'Sérénité nocturne' }
];

export function CoffretModal({ isOpen, onClose }: CoffretModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-900/40 to-violet-900/40 border-b border-cyan-500/20 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-cyan-400" />
            Nos Coffrets
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {COFFRETS.map((coffret) => {
            const IconComponent = coffret.icon;
            return (
              <a
                key={coffret.name}
                href={coffret.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                    {coffret.name}
                  </div>
                  <div className="text-xs text-slate-400">{coffret.desc}</div>
                </div>
                <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-slate-900/50">
          <p className="text-xs text-slate-400 text-center">
            Cliquez sur un coffret pour le découvrir
          </p>
        </div>
      </div>
    </div>
  );
}
