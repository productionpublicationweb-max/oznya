'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, Brain, Shield, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useCallback } from 'react';
import { calculateFullHumanDesign, DesignHumainData } from '@/lib/humanDesign';

interface DesignHumainProps {
  birthDate: string | null;
  onEditProfile?: () => void;
}

const typeColors: Record<string, string> = {
  'Manifesteur': 'from-red-500 to-orange-500',
  'Générateur': 'from-orange-500 to-yellow-500',
  'Générateur Manifesteur': 'from-yellow-500 to-green-500',
  'Projecteur': 'from-green-500 to-cyan-500',
  'Reflecteur': 'from-cyan-500 to-blue-500'
};

const typeIcons: Record<string, typeof Zap> = {
  'Manifesteur': Zap,
  'Générateur': Heart,
  'Générateur Manifesteur': Sparkles,
  'Projecteur': Brain,
  'Reflecteur': Shield
};

const centerNames: Record<string, string> = {
  head: 'Tête',
  ajna: 'Ajna',
  throat: 'Gorge',
  g: 'G-Centre',
  heart: 'Cœur',
  sacral: 'Sacral',
  solarPlexus: 'Plexus Solaire',
  spleen: 'Rate',
  root: 'Racine'
};

export function DesignHumain({ birthDate, onEditProfile }: DesignHumainProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<DesignHumainData | null>(null);
  const [showCenters, setShowCenters] = useState(false);
  const [showGates, setShowGates] = useState(false);

  const calculateDesign = useCallback(() => {
    if (!birthDate) return null;
    
    try {
      const date = new Date(birthDate + 'T12:00:00');
      const designData = calculateFullHumanDesign(date);
      setData(designData);
      return designData;
    } catch (error) {
      console.error('Erreur calcul Design Humain:', error);
      return null;
    }
  }, [birthDate]);

  const handleExpand = () => {
    if (!data && birthDate) {
      calculateDesign();
    }
    setIsExpanded(!isExpanded);
  };

  // Si pas de date de naissance
  if (!birthDate) {
    return (
      <div className="p-4 border-t border-violet-500/10">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Design Humain
          </h4>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-2">Ajoute ta date de naissance pour découvrir ton Design Humain</p>
          <button
            onClick={onEditProfile}
            className="w-full py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm hover:bg-amber-500/30 transition-colors"
          >
            Modifier mon profil
          </button>
        </div>
      </div>
    );
  }

  // Calculer automatiquement si on a une date
  const designData = data || calculateDesign();

  return (
    <div className="border-t border-violet-500/10">
      {/* Header cliquable */}
      <button
        onClick={handleExpand}
        className="w-full p-4 flex items-center justify-between hover:bg-violet-500/5 transition-colors"
      >
        <h4 className="text-sm font-medium text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Design Humain
        </h4>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && designData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Type énergétique */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${typeColors[designData.type]} text-white relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const TypeIcon = typeIcons[designData.type];
                      return <TypeIcon className="w-6 h-6" />;
                    })()}
                    <div>
                      <h3 className="text-lg font-bold">{designData.type}</h3>
                      <p className="text-xs opacity-90">Profil {designData.profile}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div><span className="font-semibold">Stratégie:</span> {designData.strategy}</div>
                    <div><span className="font-semibold">Autorité:</span> {designData.authority}</div>
                    <div><span className="font-semibold">Non-Soi:</span> {designData.notSelf}</div>
                  </div>
                </div>
              </motion.div>

              {/* Mini Bodygraph */}
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <BodygraphMini centers={designData.centers} />
              </div>

              {/* Centres définis/ouverts */}
              <div>
                <button
                  onClick={() => setShowCenters(!showCenters)}
                  className="w-full flex items-center justify-between text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-medium">Centres Énergétiques</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCenters ? 'rotate-180' : ''}`} />
                </button>
                
                {showCenters && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {Object.entries(designData.centers).map(([center, isDefined]) => (
                      <div
                        key={center}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isDefined 
                            ? 'bg-cyan-500/10 border-cyan-500/30' 
                            : 'bg-slate-800/30 border-slate-700/30'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${isDefined ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                        <span className="text-[10px] text-slate-300">{centerNames[center]}</span>
                        <p className="text-[8px] text-slate-500">{isDefined ? 'Défini' : 'Ouvert'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Portes activées */}
              <div>
                <button
                  onClick={() => setShowGates(!showGates)}
                  className="w-full flex items-center justify-between text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-medium">Portes & Canaux</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showGates ? 'rotate-180' : ''}`} />
                </button>
                
                {showGates && (
                  <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {designData.gates.map(gate => (
                        <span
                          key={gate}
                          className="px-2 py-1 bg-violet-500/20 border border-violet-500/30 rounded text-[10px] text-violet-300"
                        >
                          {gate}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-1.5">
                      {designData.channels.map((channel, i) => (
                        <div
                          key={i}
                          className="text-[10px] text-slate-300 p-2 bg-slate-700/30 rounded"
                        >
                          {channel}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Conseil personnalisé */}
              <div className="p-3 bg-gradient-to-br from-amber-500/10 to-violet-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[11px] text-slate-300 italic">
                  "Ton Design Humain révèle comment ton énergie fonctionne naturellement. 
                  En suivant ta stratégie et ton autorité, tu prends des décisions alignées avec ton vrai soi."
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini Bodygraph SVG
function BodygraphMini({ centers }: { centers: DesignHumainData['centers'] }) {
  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 120 160" className="w-32 h-44">
        {/* Head */}
        <circle
          cx="60"
          cy="15"
          r="10"
          fill={centers.head ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Ajna */}
        <polygon
          points="50,30 70,30 60,45"
          fill={centers.ajna ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Throat */}
        <rect
          x="50"
          y="52"
          width="20"
          height="15"
          fill={centers.throat ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* G Center */}
        <polygon
          points="60,75 70,85 60,95 50,85"
          fill={centers.g ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Heart/Ego */}
        <polygon
          points="80,75 90,85 80,95 70,85"
          fill={centers.heart ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Solar Plexus */}
        <polygon
          points="40,75 30,85 40,95 50,85"
          fill={centers.solarPlexus ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Sacral */}
        <rect
          x="50"
          y="100"
          width="20"
          height="15"
          rx="3"
          fill={centers.sacral ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Spleen */}
        <polygon
          points="35,100 25,110 35,120 45,110"
          fill={centers.spleen ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Root */}
        <rect
          x="50"
          y="130"
          width="20"
          height="15"
          fill={centers.root ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="1.5"
        />
        
        {/* Connexions */}
        <line x1="60" y1="25" x2="60" y2="30" stroke="#64748b" strokeWidth="1" />
        <line x1="60" y1="45" x2="60" y2="52" stroke="#64748b" strokeWidth="1" />
        <line x1="60" y1="67" x2="60" y2="75" stroke="#64748b" strokeWidth="1" />
        <line x1="60" y1="95" x2="60" y2="100" stroke="#64748b" strokeWidth="1" />
        <line x1="60" y1="115" x2="60" y2="130" stroke="#64748b" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default DesignHumain;
