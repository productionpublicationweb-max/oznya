'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface LunarPhase {
  id: string;
  name: string;
  emoji: string;
  illumination: string;
  description: string;
  energy: string;
  advice: string;
  rituals: string[];
  color: string;
  bestFor: string[];
  crystals: string[];
  affirmation: string;
}

// Les 8 phases lunaires avec leurs informations détaillées
const LUNAR_PHASES: LunarPhase[] = [
  {
    id: 'nouvelle-lune',
    name: 'Nouvelle Lune',
    emoji: '🌑',
    illumination: '0%',
    description: 'La lune est invisible dans le ciel, marquant le début d\'un nouveau cycle lunaire. C\'est le moment des graines, des intentions et des nouveaux départs. L\'énergie est celle du potentiel pur, de tout ce qui peut encore advenir.',
    energy: 'Introspection profonde, nouveaux départs, intentions, repos',
    advice: 'C\'est le moment idéal pour planter les graines de tes intentions. Prends le temps de méditer sur ce que tu souhaites voir fleurir dans les semaines à venir. Écris tes souhaits, nettoie ton espace énergétique.',
    rituals: [
      'Méditation d\'intention en silence',
      'Écriture de tes souhaits et objectifs',
      'Nettoyage énergétique de ton espace (sauge, palo santo)',
      'Rituel du feu pour libérer l\'ancien',
      'Bain de sel purificateur'
    ],
    color: '#1e293b',
    bestFor: [
      'Nouveaux projets',
      'Fixer des intentions',
      'Plans et planification',
      'Repos et régénération'
    ],
    crystals: ['L\'Obsidienne', 'L\'Onyx noir', 'La Pierre de Lune'],
    affirmation: 'Je sème les graines de mes rêves les plus profonds.'
  },
  {
    id: 'premier-croissant',
    name: 'Premier Croissant',
    emoji: '🌒',
    illumination: '1% - 49%',
    description: 'Un fin croissant de lumière apparaît dans le ciel. L\'énergie monte doucement, c\'est le moment de passer à l\'action sur les intentions posées à la nouvelle lune. La croissance commence.',
    energy: 'Action naissante, détermination, premiers pas, espoir',
    advice: 'Commence à mettre en mouvement tes projets. Les obstacles qui apparaissent sont des opportunités de croissance. Fais confiance au processus et continue d\'avancer, un pas à la fois.',
    rituals: [
      'Premiers pas concrets vers tes objectifs',
      'Affirmations positives quotidiennes',
      'Planification détaillée',
      'Activation énergétique (marche, mouvement)',
      'Visualisation créatrice'
    ],
    color: '#334155',
    bestFor: [
      'Démarrer un projet',
      'Prendre des décisions',
      'Apprendre de nouvelles compétences',
      'Établir de nouvelles habitudes'
    ],
    crystals: ['La Citrine', 'L\'Aventurine verte', 'Le Quartz clair'],
    affirmation: 'J\'avance avec confiance sur mon chemin.'
  },
  {
    id: 'premier-quartier',
    name: 'Premier Quartier',
    emoji: '🌓',
    illumination: '50%',
    description: 'La moitié de la lune est éclairée. Nous sommes à mi-chemin entre la nouvelle et la pleine lune. C\'est un moment charnière où les décisions importantes se prennent.',
    energy: 'Décision, engagement, action déterminée, courage',
    advice: 'C\'est le moment de prendre des décisions importantes et de t\'engager pleinement. Ne laisse pas les doutes t\'arrêter. Tu as l\'énergie nécessaire pour surmonter les obstacles.',
    rituals: [
      'Prise de décision claire',
      'Engagement formel envers tes objectifs',
      'Élimination des obstacles identifiés',
      'Renforcement de ta volonté',
      'Rituel de courage'
    ],
    color: '#475569',
    bestFor: [
      'Prendre des décisions importantes',
      'Résoudre des conflits',
      'Dépasser les obstacles',
      'Renforcer les engagements'
    ],
    crystals: ['La Carnéole', 'Le Jaspe rouge', 'L\'Œil de Tigre'],
    affirmation: 'Je prends des décisions alignées avec mon âme.'
  },
  {
    id: 'gibbeuse-croissante',
    name: 'Lune Gibbeuse Croissante',
    emoji: '🌔',
    illumination: '51% - 99%',
    description: 'La lune est presque entièrement illuminée. L\'énergie est à son paroxysme avant la pleine lune. C\'est le moment du perfectionnement, de l\'affinage et des ajustements de dernière minute.',
    energy: 'Perfectionnement, ajustement, patience, raffinement',
    advice: 'Affine tes méthodes et ajuste ton approche si nécessaire. Reste patiente, les résultats approchent. C\'est le moment de peaufiner les détails et de préparer la récolte.',
    rituals: [
      'Révision et amélioration de tes stratégies',
      'Apprentissage et formation complémentaire',
      'Demande de conseils ou de mentorat',
      'Gratitude pour les progrès accomplis',
      'Préparation de la célébration'
    ],
    color: '#64748b',
    bestFor: [
      'Perfectionner un projet',
      'Apprendre et s\'améliorer',
      'Ajuster ses plans',
      'Préparer un lancement'
    ],
    crystals: ['L\'Améthyste', 'La Sodalite', 'Le Lapis-Lazuli'],
    affirmation: 'Je perfectionne mon œuvre avec amour et patience.'
  },
  {
    id: 'pleine-lune',
    name: 'Pleine Lune',
    emoji: '🌕',
    illumination: '100%',
    description: 'La lune est pleinement illuminée, rayonnant de toute sa lumière. C\'est le pic d\'énergie du cycle, le moment de la manifestation, de la célébration et de la récolte. Tout ce qui a été semé atteint son apogée.',
    energy: 'Manifestation, célébration, gratitude, accomplissement, intensité',
    advice: 'Célèbre tes accomplissements et pratique la gratitude. C\'est aussi le moment de libérer ce qui ne te sert plus. L\'énergie est puissante, utilise-la pour manifester tes désirs les plus profonds.',
    rituals: [
      'Rituel de gratitude abondante',
      'Célébration de tes victoires',
      'Libération de ce qui ne te sert plus',
      'Recharge énergétique de tes cristaux sous la lune',
      'Méditation de pleine conscience'
    ],
    color: '#fef3c7',
    bestFor: [
      'Célébrer les accomplissements',
      'Manifestation puissante',
      'Libération et pardon',
      'Chargement énergétique'
    ],
    crystals: ['La Pierre de Lune', 'Le Sélénite', 'Le Quartz clair'],
    affirmation: 'Je célèbre la plénitude de ma vie et mes accomplissements.'
  },
  {
    id: 'gibbeuse-decroissante',
    name: 'Lune Gibbeuse Décroissante',
    emoji: '🌖',
    illumination: '99% - 51%',
    description: 'La lumière de la lune commence à décroître doucement. C\'est le moment du partage, de la transmission et de la gratitude. L\'énergie se tourne vers l\'intégration et l\'enseignement.',
    energy: 'Partage, transmission, enseignement, intégration, reconnaissance',
    advice: 'Partage ce que tu as appris avec les autres. Transmets ta sagesse et aide ceux qui sont sur le même chemin. C\'est le moment de remercier ceux qui t\'ont soutenue.',
    rituals: [
      'Enseignement et mentorat',
      'Partage de tes connaissances',
      'Gratitude envers tes guides et mentors',
      'Réflexion sur ton parcours',
      'Écriture dans un journal de gratitude'
    ],
    color: '#cbd5e1',
    bestFor: [
      'Partager ses connaissances',
      'Enseigner et guider',
      'Remercier et honorer',
      'Intégrer les leçons'
    ],
    crystals: ['L\'Aigue-Marine', 'La Calcite bleue', 'La Célestine'],
    affirmation: 'Je partage ma lumière avec le monde.'
  },
  {
    id: 'dernier-quartier',
    name: 'Dernier Quartier',
    emoji: '🌗',
    illumination: '50%',
    description: 'La moitié de la lune est encore visible, mais l\'obscurité gagne du terrain. C\'est le moment du lâcher-prise, du pardon et de la libération. On ferme les cycles qui n\'ont plus lieu d\'être.',
    energy: 'Lâcher-prise, pardon, libération, nettoyage, transition',
    advice: 'Libère ce qui ne te sert plus. Pardonne-toi et pardonne aux autres. C\'est le moment de faire le ménage émotionnel et énergétique pour te préparer au nouveau cycle.',
    rituals: [
      'Rituel de pardon (soi-même et autres)',
      'Libération émotionnelle (pleurs, écriture)',
      'Grand nettoyage physique et énergétique',
      'Écriture et brûlage de ce que tu laisses partir',
      'Bain purificateur'
    ],
    color: '#94a3b8',
    bestFor: [
      'Lâcher ce qui ne sert plus',
      'Pardonner et se libérer',
      'Nettoyer et purifier',
      'Fermer des cycles'
    ],
    crystals: ['L\'Améthyste', 'Le Quartz fumé', 'La Tourmaline noire'],
    affirmation: 'Je libère tout ce qui ne me sert plus avec gratitude.'
  },
  {
    id: 'dernier-croissant',
    name: 'Dernier Croissant',
    emoji: '🌘',
    illumination: '49% - 1%',
    description: 'Un fin croissant de lumière reste visible avant que la lune ne disparaisse complètement. C\'est le moment du repos, de l\'introspection profonde et de la préparation au nouveau cycle.',
    energy: 'Repos, introspection, préparation, sagesse, calme',
    advice: 'Accorde-toi un temps de repos et de récupération. C\'est le moment de l\'introspection profonde et de la préparation pour la nouvelle lune à venir. Fais le bilan du cycle qui s\'achève.',
    rituals: [
      'Méditation profonde en silence',
      'Repos et récupération active',
      'Bilan complet du cycle écoulé',
      'Préparation des intentions pour la prochaine nouvelle lune',
      'Connexion avec ta sagesse intérieure'
    ],
    color: '#374151',
    bestFor: [
      'Se reposer et récupérer',
      'Réfléchir et méditer',
      'Faire un bilan',
      'Se préparer au renouveau'
    ],
    crystals: ['La Labradorite', 'L\'Obsidienne flocon de neige', 'La Pierre de Lune'],
    affirmation: 'Je me repose dans la sagesse de l\'univers.'
  }
];

interface LunarPhasesButtonProps {
  onOpenCoffret?: () => void;
}

export function LunarPhasesButton({ onOpenCoffret }: LunarPhasesButtonProps) {
  const [showModal, setShowModal] = useState(false);

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
        <span>Phases</span>
        <span className="text-base">🌙</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <LunarPhasesModal
            onClose={() => setShowModal(false)}
            onOpenCoffret={() => {
              setShowModal(false);
              onOpenCoffret?.();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface LunarPhasesModalProps {
  onClose: () => void;
  onOpenCoffret?: () => void;
}

function LunarPhasesModal({ 
  onClose,
  onOpenCoffret
}: LunarPhasesModalProps) {
  const [selectedPhase, setSelectedPhase] = useState<LunarPhase | null>(null);

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
        {/* Header */}
        <div 
          className="relative p-6 overflow-hidden"
          style={{
            background: selectedPhase 
              ? `linear-gradient(135deg, ${selectedPhase.color}40, ${selectedPhase.color}20)`
              : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))'
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 text-center">
            {selectedPhase ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-7xl mb-4"
                >
                  {selectedPhase.emoji}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedPhase.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                  <Sparkles className="w-4 h-4" style={{ color: selectedPhase.color }} />
                  <span>Illumination: {selectedPhase.illumination}</span>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl mb-4"
                >
                  🌙
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Phases Lunaires
                </h3>
                <p className="text-sm text-slate-300">
                  Clique sur une phase pour découvrir son énergie
                </p>
              </>
            )}
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
          {selectedPhase ? (
            <PhaseDetails 
              phase={selectedPhase} 
              onBack={() => setSelectedPhase(null)}
              onOpenCoffret={onOpenCoffret}
            />
          ) : (
            <PhaseGrid onSelect={setSelectedPhase} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface PhaseGridProps {
  onSelect: (phase: LunarPhase) => void;
}

function PhaseGrid({ onSelect }: PhaseGridProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400 text-center">
        Choisis la phase lunaire que tu souhaites explorer
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {LUNAR_PHASES.map((phase, index) => (
          <motion.button
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(phase)}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {phase.emoji}
              </span>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                  {phase.name}
                </p>
                <p className="text-xs text-slate-500">
                  {phase.illumination}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
        <p className="text-xs text-cyan-300 text-center">
          💡 Consulte un calendrier lunaire pour connaître la phase actuelle
        </p>
      </div>
    </div>
  );
}

interface PhaseDetailsProps {
  phase: LunarPhase;
  onBack: () => void;
  onOpenCoffret?: () => void;
}

function PhaseDetails({ phase, onBack, onOpenCoffret }: PhaseDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      {/* Retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
      >
        ← Toutes les phases
      </button>

      {/* Description */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2">
          ✨ Description
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
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
          💫 <span className="font-semibold">Conseil:</span> {phase.advice}
        </p>
      </div>

      {/* Idéal pour */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2">
          🎯 Idéal pour
        </h4>
        <div className="flex flex-wrap gap-2">
          {phase.bestFor.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
            >
              {item}
            </span>
          ))}
        </div>
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
                style={{ backgroundColor: phase.color === '#fef3c7' ? '#fbbf24' : phase.color }}
              />
              <span>{ritual}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cristaux */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2">
          💎 Cristaux associés
        </h4>
        <div className="flex flex-wrap gap-2">
          {phase.crystals.map((crystal, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300"
            >
              {crystal}
            </span>
          ))}
        </div>
      </div>

      {/* Affirmation */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 text-center">
        <p className="text-xs text-slate-400 mb-1">Affirmation</p>
        <p className="text-sm text-white italic">
          "{phase.affirmation}"
        </p>
      </div>

      {/* CTA vers coffrets */}
      <button 
        onClick={onOpenCoffret}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
      >
        Découvrir les coffrets alignés avec cette énergie
      </button>
    </motion.div>
  );
}

export default LunarPhasesButton;
