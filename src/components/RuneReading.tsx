'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Moon, RefreshCw } from 'lucide-react';

interface RuneReadingProps {
  isOpen: boolean;
  onClose: () => void;
  onReadingComplete: (interpretation: string) => void;
}

// Les 24 runes du Futhark Ancien
const RUNES = [
  { name: 'Fehu', symbol: 'ᚠ', meaning: 'Richesse, abondance, réussite matérielle', element: 'Feu', keyword: 'Prosperité' },
  { name: 'Uruz', symbol: 'ᚢ', meaning: 'Force, vitalité, santé, courage', element: 'Terre', keyword: 'Puissance' },
  { name: 'Thurisaz', symbol: 'ᚦ', meaning: 'Protection, défense, force brute', element: 'Feu', keyword: 'Défense' },
  { name: 'Ansuz', symbol: 'ᚨ', meaning: 'Communication, sagesse, messages divins', element: 'Air', keyword: 'Sagesse' },
  { name: 'Raidho', symbol: 'ᚱ', meaning: 'Voyage, mouvement, évolution', element: 'Air', keyword: 'Cheminement' },
  { name: 'Kenaz', symbol: 'ᚲ', meaning: 'Lumière, connaissance, créativité', element: 'Feu', keyword: 'Illumination' },
  { name: 'Gebo', symbol: 'ᚷ', meaning: 'Don, partenariat, générosité', element: 'Air', keyword: 'Union' },
  { name: 'Wunjo', symbol: 'ᚹ', meaning: 'Joie, bonheur, harmonie', element: 'Terre', keyword: 'Félicité' },
  { name: 'Hagalaz', symbol: 'ᚺ', meaning: 'Transformation, changements radicaux', element: 'Eau', keyword: 'Mutation' },
  { name: 'Nauthiz', symbol: 'ᚾ', meaning: 'Nécessité, contrainte, persévérance', element: 'Feu', keyword: 'Résilience' },
  { name: 'Isa', symbol: 'ᛁ', meaning: 'Glace, pause, introspection', element: 'Eau', keyword: 'Stase' },
  { name: 'Jera', symbol: 'ᛃ', meaning: 'Récolte, cycles, récompense', element: 'Terre', keyword: 'Cyclicité' },
  { name: 'Eihwaz', symbol: 'ᛇ', meaning: 'Endurance, protection, connexion', element: 'Terre', keyword: 'Persévérance' },
  { name: 'Perthro', symbol: 'ᛈ', meaning: 'Mystère, destin, secrets révélés', element: 'Eau', keyword: 'Destin' },
  { name: 'Algiz', symbol: 'ᛉ', meaning: 'Protection divine, garde, spiritualité', element: 'Air', keyword: 'Gardien' },
  { name: 'Sowilo', symbol: 'ᛊ', meaning: 'Soleil, succès, victoire, lumière', element: 'Feu', keyword: 'Triomphe' },
  { name: 'Tiwaz', symbol: 'ᛏ', meaning: 'Justice, honneur, sacrifice', element: 'Air', keyword: 'Vaillance' },
  { name: 'Berkano', symbol: 'ᛒ', meaning: 'Naissance, fertilité, croissance', element: 'Terre', keyword: 'Fécondité' },
  { name: 'Ehwaz', symbol: 'ᛖ', meaning: 'Partenariat, harmonie, confiance', element: 'Air', keyword: 'Accord' },
  { name: 'Mannaz', symbol: 'ᛗ', meaning: 'Humanité, soi, communauté', element: 'Air', keyword: 'Identité' },
  { name: 'Laguz', symbol: 'ᛚ', meaning: 'Eau, intuition, flux émotionnel', element: 'Eau', keyword: 'Intuition' },
  { name: 'Ingwaz', symbol: 'ᛝ', meaning: 'Fertilité, potentiel interne, gestation', element: 'Terre', keyword: 'Germination' },
  { name: 'Dagaz', symbol: 'ᛞ', meaning: 'Aube, révélation, percée', element: 'Feu', keyword: 'Éveil' },
  { name: 'Othala', symbol: 'ᛟ', meaning: 'Héritage, foyer, racines', element: 'Terre', keyword: 'Ascendance' }
];

const SPREADS = [
  { id: 'single', name: 'Rune Unique', description: 'Une rune pour une guidance rapide', count: 1 },
  { id: 'three', name: 'Triple Rune', description: 'Passé, Présent, Futur', count: 3 },
  { id: 'cross', name: 'Croix Runique', description: 'Situation, Défi, Conseil, Résultat', count: 4 }
];

export function RuneReading({ isOpen, onClose, onReadingComplete }: RuneReadingProps) {
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);
  const [drawnRunes, setDrawnRunes] = useState<typeof RUNES>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [showInterpretation, setShowInterpretation] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (!isOpen) return;
    // Using flushSync or batching to avoid cascading renders is not needed here
    // as this is a legitimate state reset on prop change
    const timer = setTimeout(() => {
      setSelectedSpread(null);
      setDrawnRunes([]);
      setInterpretation('');
      setShowInterpretation(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const drawRunes = (count: number) => {
    setIsDrawing(true);
    setInterpretation('');
    setShowInterpretation(false);
    
    // Animation de tirage
    setTimeout(() => {
      const shuffled = [...RUNES].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);
      setDrawnRunes(selected);
      setIsDrawing(false);
      
      // Générer l'interprétation
      generateInterpretation(selected);
    }, 1500);
  };

  const generateInterpretation = (runes: typeof RUNES) => {
    let interp = '';
    
    if (runes.length === 1) {
      const rune = runes[0];
      interp = `🌟 **${rune.name}** (${rune.symbol})

*Élément: ${rune.element} • Mot-clé: ${rune.keyword}*

${rune.meaning}

Cette rune t'apparaît aujourd'hui comme un guide puissant. Elle te connecte à l'énergie primordiale de ${rune.element.toLowerCase()}, t'invitant à explorer sa signification profonde dans ta vie actuelle.

La sagesse des anciens Nordiques nous enseigne que chaque rune est une clé vers une compréhension plus profonde de nous-mêmes et du monde qui nous entoure.`;
    } else if (runes.length === 3) {
      interp = `🔮 **Tirage Triple Rune**

**Passé:** ${runes[0].name} (${runes[0].symbol})
${runes[0].meaning}
Les énergies de ${runes[0].element} ont façonné ton chemin jusqu'ici.

**Présent:** ${runes[1].name} (${runes[1].symbol})
${runes[1].meaning}
L'énergie ${runes[1].element.toLowerCase()} t'accompagne dans l'instant présent.

**Futur:** ${runes[2].name} (${runes[2].symbol})
${runes[2].meaning}
Le chemin devant toi vibre de l'énergie de ${runes[2].element.toLowerCase()}.

---
✨ Ces trois runes forment un tout cohérent. Ensemble, elles te révèlent une vision complète de ton cheminement spirituel.`;
    } else if (runes.length === 4) {
      interp = `🔮 **Croix Runique**

**Situation actuelle:** ${runes[0].name} (${runes[0].symbol})
${runes[0].meaning}

**Défi à relever:** ${runes[1].name} (${runes[1].symbol})
${runes[1].meaning}

**Conseil des dieux:** ${runes[2].name} (${runes[2].symbol})
${runes[2].meaning}

**Résultat probable:** ${runes[3].name} (${runes[3].symbol})
${runes[3].meaning}

---
✨ La croix runique t'offre une vision complète de ta situation. Médite sur ces symboles anciens pour comprendre leur message.`;
    }
    
    setInterpretation(interp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-violet-500/30 overflow-hidden shadow-2xl shadow-violet-500/20">
        {/* Header */}
        <div className="relative p-5 border-b border-violet-500/20 bg-gradient-to-r from-violet-900/30 to-slate-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                ᚱ
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Runes Anciennes</h2>
                <p className="text-xs text-slate-400">Futhark Ancien • 24 symboles sacrés</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Spread Selection */}
          {!selectedSpread && !isDrawing && drawnRunes.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-300 text-center mb-4">
                Choisis ton tirage runique pour recevoir la guidance des anciens
              </p>
              {SPREADS.map(spread => (
                <button
                  key={spread.id}
                  onClick={() => {
                    setSelectedSpread(spread.id);
                    drawRunes(spread.count);
                  }}
                  className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 hover:bg-slate-800/70 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white group-hover:text-violet-300 transition-colors">
                        {spread.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{spread.description}</p>
                    </div>
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                      {spread.count === 1 ? 'ᚠ' : spread.count === 3 ? 'ᚠᚢᚦ' : 'ᚠᚢᚦᚨ'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Drawing Animation */}
          {isDrawing && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-violet-500/30 border-t-violet-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-pulse">ᚱ</span>
                </div>
              </div>
              <p className="mt-6 text-violet-300 animate-pulse">
                Les runes dansent dans le mystère...
              </p>
            </div>
          )}

          {/* Drawn Runes */}
          {!isDrawing && drawnRunes.length > 0 && (
            <div className="space-y-5">
              {/* Runes Display */}
              <div className="flex justify-center gap-4 flex-wrap">
                {drawnRunes.map((rune, index) => (
                  <div 
                    key={index}
                    className="relative group"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-violet-500/30 flex items-center justify-center group-hover:border-violet-400/50 transition-all">
                      <span className="text-4xl text-violet-300 group-hover:text-violet-200 transition-colors">
                        {rune.symbol}
                      </span>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-2 font-medium">
                      {rune.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Show Interpretation Button */}
              {!showInterpretation && (
                <button
                  onClick={() => setShowInterpretation(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-300 font-medium hover:from-violet-500/30 hover:to-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Révéler l'interprétation
                </button>
              )}

              {/* Interpretation */}
              {showInterpretation && (
                <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                  <div className="prose prose-sm prose-invert max-w-none">
                    {interpretation.split('\n').map((line, i) => (
                      <p 
                        key={i} 
                        className="text-sm text-slate-300 leading-relaxed mb-2"
                        dangerouslySetInnerHTML={{ 
                          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-violet-300">$1</strong>') 
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDrawnRunes([]);
                    setSelectedSpread(null);
                    setShowInterpretation(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Nouveau tirage
                </button>
                <button
                  onClick={() => {
                    onReadingComplete(`🔮 **Tirage de Runes**\n\n${interpretation}`);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Continuer avec Nyxia
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/50">
          <p className="text-xs text-slate-500 text-center">
            Les runes du Futhark Ancien sont un oracle germanique millénaire, 
            utilisé pour la divination et la guidance spirituelle.
          </p>
        </div>
      </div>
    </div>
  );
}
