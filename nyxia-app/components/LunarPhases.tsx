// components/LunarPhases.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LunarPhase {
  name: string;
  emoji: string;
  percentage: number;
  description: string;
  energy: string;
  advice: string;
  rituals: string[];
  color: string;
}

export function LunarPhasesButton() {
  const [showModal, setShowModal] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<LunarPhase | null>(null);

  useEffect(() => {
    const phase = calculateLunarPhase();
    setCurrentPhase(phase);
  }, []);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-xs hover:bg-slate-700/50 hover:border-cyan-500/30 transition-all group"
      >
        <motion.div
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Moon className="w-4 h-4 text-cyan-400" />
        </motion.div>
        <span>Phase Lunaire</span>
        {currentPhase && (
          <span className="text-lg">{currentPhase.emoji}</span>
        )}
        
        {/* Indicateur de nouvelle lune / pleine lune */}
        {currentPhase && (currentPhase.name === 'Nouvelle Lune' || currentPhase.name === 'Pleine Lune') && (
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
          />
        )}
      </button>

      <AnimatePresence>
        {showModal && currentPhase && (
          <LunarPhaseModal
            phase={currentPhase}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function LunarPhaseModal({ 
  phase, 
  onClose 
}: { 
  phase: LunarPhase;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden"
      >
        {/* Header avec animation de la lune */}
        <div 
          className="relative p-6 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${phase.color}20, ${phase.color}10)`
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 text-center">
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-6xl mb-4"
            >
              {phase.emoji}
            </motion.div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              {phase.name}
            </h3>
            
            <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
              <Sparkles className="w-4 h-4" style={{ color: phase.color }} />
              <span>Illumination: {phase.percentage}%</span>
            </div>
          </div>

          {/* Animation d'étoiles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">
              ✨ Énergie de cette phase
            </h4>
            <p className="text-sm text-slate-300">
              {phase.description}
            </p>
          </div>

          {/* Énergie */}
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Énergie:</span> {phase.energy}
            </p>
          </div>

          {/* Conseil */}
          <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-lg">
            <p className="text-sm text-white">
              💫 {phase.advice}
            </p>
          </div>

          {/* Rituels recommandés */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">
              🌙 Rituels Recommandés
            </h4>
            <div className="space-y-2">
              {phase.rituals.map((ritual, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: phase.color }}
                  />
                  <span>{ritual}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA vers coffrets */}
          <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
            Découvrir les coffrets alignés avec cette énergie
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Fonction de calcul de la phase lunaire
function calculateLunarPhase(): LunarPhase {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Calcul simplifié (pour un calcul précis, utilise une librairie comme suncalc)
  const c = Math.floor((year - 1900) / 100);
  const e = 2 - c + Math.floor(c / 4);
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524.5;
  
  const daysSinceNew = (jd - 2451549.5) / 29.53;
  const phase = daysSinceNew - Math.floor(daysSinceNew);
  const percentage = Math.round(phase * 100);

  const phases: LunarPhase[] = [
    {
      name: 'Nouvelle Lune',
      emoji: '🌑',
      percentage: 0,
      description: 'La lune est invisible, marquant un nouveau cycle. C\'est le moment des intentions et des nouveaux départs.',
      energy: 'Introspection, nouveaux départs, intentions',
      advice: 'Plante les graines de tes intentions. C\'est le moment idéal pour définir tes objectifs pour le cycle à venir.',
      rituals: [
        'Méditation d\'intention',
        'Écriture de tes souhaits',
        'Nettoyage énergétique de ton espace',
        'Rituel du feu pour libérer l\'ancien'
      ],
      color: '#1e293b'
    },
    {
      name: 'Premier Croissant',
      emoji: '🌒',
      percentage: 12.5,
      description: 'La lumière commence à croître. C\'est le moment de l\'action et de la construction.',
      energy: 'Action, construction, détermination',
      advice: 'Passe à l\'action sur tes intentions. Les obstacles qui apparaissent sont des opportunités de croissance.',
      rituals: [
        'Planification concrète',
        'Premiers pas vers tes objectifs',
        'Affirmations positives',
        'Activation de tes projets'
      ],
      color: '#334155'
    },
    {
      name: 'Premier Quartier',
      emoji: '🌓',
      percentage: 25,
      description: 'La moitié de la lune est éclairée. C\'est un moment de décision et d\'engagement.',
      energy: 'Décision, engagement, action',
      advice: 'Prends des décisions importantes. C\'est le moment de t\'engager pleinement dans tes projets.',
      rituals: [
        'Prise de décision claire',
        'Engagement envers tes objectifs',
        'Élimination des obstacles',
        'Renforcement de ta volonté'
      ],
      color: '#475569'
    },
    {
      name: 'Lune Gibbeuse Croissante',
      emoji: '🌔',
      percentage: 37.5,
      description: 'La lumière continue de croître. C\'est le moment du perfectionnement et de l\'ajustement.',
      energy: 'Perfectionnement, ajustement, patience',
      advice: 'Affine tes méthodes. Reste patiente et continue d\'ajuster ton approche.',
      rituals: [
        'Révision de tes stratégies',
        'Apprentissage et formation',
        'Demande de conseils',
        'Amélioration continue'
      ],
      color: '#64748b'
    },
    {
      name: 'Pleine Lune',
      emoji: '🌕',
      percentage: 50,
      description: 'La lune est pleinement illuminée. C\'est le pic d\'énergie, de manifestation et de célébration.',
      energy: 'Manifestation, célébration, gratitude',
      advice: 'Célèbre tes accomplissements. C\'est le moment de récolter ce que tu as semé et de pratiquer la gratitude.',
      rituals: [
        'Rituel de gratitude',
        'Célébration de tes victoires',
        'Libération de ce qui ne te sert plus',
        'Recharge énergétique sous la lune'
      ],
      color: '#f1f5f9'
    },
    {
      name: 'Lune Gibbeuse Décroissante',
      emoji: '🌖',
      percentage: 62.5,
      description: 'La lumière commence à décroître. C\'est le moment du partage et de la transmission.',
      energy: 'Partage, transmission, enseignement',
      advice: 'Partage ce que tu as appris. Transmets ta sagesse et aide les autres sur leur chemin.',
      rituals: [
        'Enseignement aux autres',
        'Partage de tes connaissances',
        'Gratitude envers tes mentors',
        'Réflexion sur ton parcours'
      ],
      color: '#cbd5e1'
    },
    {
      name: 'Dernier Quartier',
      emoji: '🌗',
      percentage: 75,
      description: 'La moitié de la lune est encore visible. C\'est le moment du lâcher-prise et du pardon.',
      energy: 'Lâcher-prise, pardon, libération',
      advice: 'Libère ce qui ne te sert plus. Pardonne-toi et pardonne aux autres.',
      rituals: [
        'Rituel de pardon',
        'Libération émotionnelle',
        'Nettoyage énergétique',
        'Écriture et brûlage de ce que tu laisses partir'
      ],
      color: '#94a3b8'
    },
    {
      name: 'Dernier Croissant',
      emoji: '🌘',
      percentage: 87.5,
      description: 'Un fin croissant reste visible. C\'est le moment du repos et de l\'introspection profonde.',
      energy: 'Repos, introspection, préparation',
      advice: 'Repose-toi et prépare-toi pour le nouveau cycle. C\'est le moment de l\'introspection profonde.',
      rituals: [
        'Méditation profonde',
        'Repos et récupération',
        'Bilan du cycle écoulé',
        'Préparation pour la nouvelle lune'
      ],
      color: '#475569'
    }
  ];

  // Déterminer la phase actuelle
  let currentPhase = phases[0];
  
  if (percentage < 6.25) currentPhase = phases[0]; // Nouvelle Lune
  else if (percentage < 18.75) currentPhase = phases[1]; // Premier Croissant
  else if (percentage < 31.25) currentPhase = phases[2]; // Premier Quartier
  else if (percentage < 43.75) currentPhase = phases[3]; // Gibbeuse Croissante
  else if (percentage < 56.25) currentPhase = phases[4]; // Pleine Lune
  else if (percentage < 68.75) currentPhase = phases[5]; // Gibbeuse Décroissante
  else if (percentage < 81.25) currentPhase = phases[6]; // Dernier Quartier
  else if (percentage < 93.75) currentPhase = phases[7]; // Dernier Croissant
  else currentPhase = phases[0]; // Retour à Nouvelle Lune

  return {
    ...currentPhase,
    percentage
  };
}
