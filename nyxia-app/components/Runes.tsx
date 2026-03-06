// components/Runes.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface Rune {
  name: string;
  symbol: string;
  meaning: string;
  reversed: boolean;
  description: string;
  advice: string;
  keywords: string[];
  element: 'Terre' | 'Air' | 'Feu' | 'Eau' | 'Esprit';
}

const RUNES_DATABASE: Omit<Rune, 'reversed'>[] = [
  {
    name: 'Fehu',
    symbol: 'ᚠ',
    meaning: 'Richesse, Abondance',
    description: 'Fehu représente la richesse matérielle et spirituelle, l\'abondance et la prospérité.',
    advice: 'C\'est le moment d\'accueillir l\'abondance dans ta vie. Reste ouverte aux opportunités.',
    keywords: ['Prospérité', 'Nouveau départ', 'Énergie créative'],
    element: 'Terre'
  },
  {
    name: 'Uruz',
    symbol: 'ᚢ',
    meaning: 'Force, Vitalité',
    description: 'Uruz symbolise la force brute, la vitalité et l\'énergie primordiale.',
    advice: 'Connecte-toi à ta force intérieure. Tu as toutes les ressources nécessaires.',
    keywords: ['Force', 'Santé', 'Détermination'],
    element: 'Terre'
  },
  {
    name: 'Thurisaz',
    symbol: 'ᚦ',
    meaning: 'Protection, Transformation',
    description: 'Thurisaz est la rune de la protection et des transformations nécessaires.',
    advice: 'Une transformation est en cours. Protège ton énergie pendant ce processus.',
    keywords: ['Protection', 'Changement', 'Défense'],
    element: 'Feu'
  },
  {
    name: 'Ansuz',
    symbol: 'ᚨ',
    meaning: 'Communication, Sagesse',
    description: 'Ansuz représente la communication divine, la sagesse et les messages.',
    advice: 'Écoute les messages qui te parviennent. La sagesse te guide.',
    keywords: ['Sagesse', 'Communication', 'Inspiration'],
    element: 'Air'
  },
  {
    name: 'Raidho',
    symbol: 'ᚱ',
    meaning: 'Voyage, Mouvement',
    description: 'Raidho symbolise le voyage, tant physique que spirituel.',
    advice: 'Un voyage ou un changement de direction est favorable. Fais confiance au processus.',
    keywords: ['Voyage', 'Progression', 'Rythme'],
    element: 'Air'
  },
  {
    name: 'Kenaz',
    symbol: 'ᚲ',
    meaning: 'Illumination, Créativité',
    description: 'Kenaz est la rune de la lumière intérieure et de la créativité.',
    advice: 'Laisse ta créativité s\'exprimer. Une nouvelle compréhension émerge.',
    keywords: ['Créativité', 'Clarté', 'Transformation'],
    element: 'Feu'
  },
  {
    name: 'Gebo',
    symbol: 'ᚷ',
    meaning: 'Don, Partenariat',
    description: 'Gebo représente les dons, les échanges et les partenariats équilibrés.',
    advice: 'L\'équilibre dans le donner et recevoir est essentiel. Honore tes relations.',
    keywords: ['Générosité', 'Partenariat', 'Équilibre'],
    element: 'Air'
  },
  {
    name: 'Wunjo',
    symbol: 'ᚹ',
    meaning: 'Joie, Harmonie',
    description: 'Wunjo est la rune de la joie, du bonheur et de l\'harmonie.',
    advice: 'La joie est ton droit de naissance. Célèbre les petites victoires.',
    keywords: ['Joie', 'Succès', 'Harmonie'],
    element: 'Terre'
  },
  {
    name: 'Hagalaz',
    symbol: 'ᚺ',
    meaning: 'Disruption, Transformation',
    description: 'Hagalaz représente les changements soudains et les transformations nécessaires.',
    advice: 'Accueille le changement. Les disruptions mènent à de nouvelles opportunités.',
    keywords: ['Changement', 'Libération', 'Transformation'],
    element: 'Eau'
  },
  {
    name: 'Nauthiz',
    symbol: 'ᚾ',
    meaning: 'Besoin, Résistance',
    description: 'Nauthiz symbolise les besoins, les contraintes et la résilience.',
    advice: 'Les contraintes actuelles développent ta force. Reste patiente.',
    keywords: ['Résilience', 'Patience', 'Nécessité'],
    element: 'Feu'
  },
  {
    name: 'Isa',
    symbol: 'ᛁ',
    meaning: 'Pause, Gel',
    description: 'Isa représente la pause, le gel et le temps de réflexion.',
    advice: 'C\'est le moment de faire une pause. La clarté viendra dans le calme.',
    keywords: ['Pause', 'Réflexion', 'Patience'],
    element: 'Eau'
  },
  {
    name: 'Jera',
    symbol: 'ᛃ',
    meaning: 'Récolte, Cycle',
    description: 'Jera symbolise les cycles naturels et la récolte de ce qui a été semé.',
    advice: 'Tu récoltes ce que tu as semé. Le timing divin est à l\'œuvre.',
    keywords: ['Récolte', 'Patience', 'Cycles'],
    element: 'Terre'
  },
  {
    name: 'Eihwaz',
    symbol: 'ᛇ',
    meaning: 'Défense, Endurance',
    description: 'Eihwaz représente la défense, l\'endurance et la connexion entre les mondes.',
    advice: 'Ta résilience est testée. Reste ancrée dans ta vérité.',
    keywords: ['Endurance', 'Protection', 'Connexion'],
    element: 'Esprit'
  },
  {
    name: 'Perthro',
    symbol: 'ᛈ',
    meaning: 'Mystère, Destin',
    description: 'Perthro est la rune du mystère, des secrets et du destin.',
    advice: 'Fais confiance au mystère. Tout se révèle en son temps.',
    keywords: ['Mystère', 'Destin', 'Secrets'],
    element: 'Eau'
  },
  {
    name: 'Algiz',
    symbol: 'ᛉ',
    meaning: 'Protection Divine',
    description: 'Algiz symbolise la protection divine et la connexion spirituelle.',
    advice: 'Tu es protégée. Connecte-toi à ta guidance supérieure.',
    keywords: ['Protection', 'Connexion', 'Guidance'],
    element: 'Air'
  },
  {
    name: 'Sowilo',
    symbol: 'ᛊ',
    meaning: 'Soleil, Succès',
    description: 'Sowilo représente le soleil, le succès et la victoire.',
    advice: 'La victoire est proche. Rayonne ta lumière.',
    keywords: ['Succès', 'Victoire', 'Énergie'],
    element: 'Feu'
  },
  {
    name: 'Tiwaz',
    symbol: 'ᛏ',
    meaning: 'Victoire, Justice',
    description: 'Tiwaz symbolise la victoire, la justice et le courage.',
    advice: 'Agis avec courage et intégrité. La justice prévaudra.',
    keywords: ['Courage', 'Justice', 'Victoire'],
    element: 'Air'
  },
  {
    name: 'Berkano',
    symbol: 'ᛒ',
    meaning: 'Naissance, Croissance',
    description: 'Berkano représente la naissance, la croissance et la fertilité.',
    advice: 'Quelque chose de nouveau naît. Nourris cette croissance.',
    keywords: ['Naissance', 'Croissance', 'Fertilité'],
    element: 'Terre'
  },
  {
    name: 'Ehwaz',
    symbol: 'ᛖ',
    meaning: 'Mouvement, Progrès',
    description: 'Ehwaz symbolise le mouvement, le progrès et les partenariats.',
    advice: 'Le progrès est en marche. Collabore et avance.',
    keywords: ['Progrès', 'Mouvement', 'Partenariat'],
    element: 'Terre'
  },
  {
    name: 'Mannaz',
    symbol: 'ᛗ',
    meaning: 'Humanité, Soi',
    description: 'Mannaz représente l\'humanité, le soi et la conscience.',
    advice: 'Connecte-toi à ton essence. L\'humanité est en toi.',
    keywords: ['Conscience', 'Humanité', 'Soi'],
    element: 'Air'
  },
  {
    name: 'Laguz',
    symbol: 'ᛚ',
    meaning: 'Eau, Intuition',
    description: 'Laguz symbolise l\'eau, l\'intuition et le flux émotionnel.',
    advice: 'Fais confiance à ton intuition. Laisse-toi porter par le flux.',
    keywords: ['Intuition', 'Flux', 'Émotions'],
    element: 'Eau'
  },
  {
    name: 'Ingwaz',
    symbol: 'ᛜ',
    meaning: 'Fertilité, Nouveau départ',
    description: 'Ingwaz représente la fertilité, la gestation et les nouveaux départs.',
    advice: 'Une période de gestation se termine. Un nouveau cycle commence.',
    keywords: ['Fertilité', 'Nouveau départ', 'Gestation'],
    element: 'Terre'
  },
  {
    name: 'Dagaz',
    symbol: 'ᛞ',
    meaning: 'Aube, Transformation',
    description: 'Dagaz symbolise l\'aube, la transformation et la percée.',
    advice: 'Une percée majeure arrive. L\'aube se lève sur ta vie.',
    keywords: ['Transformation', 'Percée', 'Aube'],
    element: 'Feu'
  },
  {
    name: 'Othala',
    symbol: 'ᛟ',
    meaning: 'Héritage, Foyer',
    description: 'Othala représente l\'héritage, le foyer et les racines.',
    advice: 'Honore tes racines. Ton héritage est une force.',
    keywords: ['Héritage', 'Foyer', 'Racines'],
    element: 'Terre'
  }
];

export function RuneReading() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnRunes, setDrawnRunes] = useState<Rune[]>([]);
  const [spreadType, setSpreadType] = useState<'single' | 'three' | 'five'>('three');
  const [showInterpretation, setShowInterpretation] = useState(false);

  const drawRunes = () => {
    setIsDrawing(true);
    setShowInterpretation(false);
    
    setTimeout(() => {
      const numberOfRunes = spreadType === 'single' ? 1 : spreadType === 'three' ? 3 : 5;
      const shuffled = [...RUNES_DATABASE].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, numberOfRunes).map(rune => ({
        ...rune,
        reversed: Math.random() > 0.5
      }));
      
      setDrawnRunes(drawn);
      setIsDrawing(false);
      
      // Afficher l'interprétation après l'animation
      setTimeout(() => setShowInterpretation(true), 1000);
    }, 2000);
  };

  const elementColors = {
    'Terre': 'from-amber-500 to-yellow-500',
    'Air': 'from-cyan-500 to-blue-500',
    'Feu': 'from-red-500 to-orange-500',
    'Eau': 'from-blue-500 to-indigo-500',
    'Esprit': 'from-violet-500 to-purple-500'
  };

  return (
    <div className="space-y-6">
      {/* Sélection du type de tirage */}
      {drawnRunes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white text-center">
            Choisis ton tirage de Runes
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'single' as const, label: 'Rune du Jour', desc: 'Guidance quotidienne' },
              { type: 'three' as const, label: 'Tirage à 3', desc: 'Passé-Présent-Futur' },
              { type: 'five' as const, label: 'Tirage à 5', desc: 'Lecture approfondie' }
            ].map(({ type, label, desc }) => (
              <button
                key={type}
                onClick={() => setSpreadType(type)}
                className={`
                  p-4 rounded-xl border-2 transition-all text-center
                  ${spreadType === type
                    ? 'bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border-cyan-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <div className="text-sm font-medium text-white mb-1">
                  {label}
                </div>
                <div className="text-xs text-slate-400">
                  {desc}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bouton de tirage */}
      <motion.button
        onClick={drawRunes}
        disabled={isDrawing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isDrawing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span>Tirage en cours...</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-5 h-5" />
            <span>{drawnRunes.length > 0 ? 'Nouveau tirage' : 'Tirer les Runes'}</span>
          </>
        )}
      </motion.button>

      {/* Animation du tirage */}
      <AnimatePresence mode="wait">
        {isDrawing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <div className="relative">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border-2 border-cyan-500/30"
                  style={{
                    left: `${i * 20}px`,
                    top: `${i * 10}px`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affichage des runes tirées */}
      <AnimatePresence>
        {drawnRunes.length > 0 && !isDrawing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Runes visuelles */}
            <div className="flex justify-center gap-4 flex-wrap">
              {drawnRunes.map((rune, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateY: 180 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateY: rune.reversed ? 180 : 0 
                  }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.6,
                    type: "spring"
                  }}
                  className="relative group"
                >
                  <div className={`
                    w-24 h-32 rounded-xl border-2 flex items-center justify-center
                    bg-gradient-to-br ${elementColors[rune.element]}
                    shadow-lg cursor-pointer
                    ${rune.reversed ? 'border-red-500/50' : 'border-white/20'}
                  `}>
                    <span 
                      className="text-5xl text-white font-bold"
                      style={{ transform: rune.reversed ? 'rotate(180deg)' : 'none' }}
                    >
                      {rune.symbol}
                    </span>
                  </div>
                  
                  {/* Label position */}
                  {spreadType === 'three' && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
                      {['Passé', 'Présent', 'Futur'][index]}
                    </div>
                  )}
                  
                  {/* Indicateur inversé */}
                  {rune.reversed && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      R
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Interprétations */}
            <AnimatePresence>
              {showInterpretation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {drawnRunes.map((rune, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-12 h-16 rounded-lg flex items-center justify-center
                          bg-gradient-to-br ${elementColors[rune.element]} flex-shrink-0
                        `}>
                          <span 
                            className="text-2xl text-white font-bold"
                            style={{ transform: rune.reversed ? 'rotate(180deg)' : 'none' }}
                          >
                            {rune.symbol}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-white">
                              {rune.name}
                            </h4>
                            {rune.reversed && (
                              <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300">
                                Inversée
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-cyan-400 mb-2">
                            {rune.meaning}
                          </p>

                          <p className="text-sm text-slate-300 mb-3">
                            {rune.description}
                          </p>

                          <div className="p-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg mb-3">
                            <p className="text-sm text-white">
                              💫 {rune.advice}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {rune.keywords.map((keyword, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
                              >
                                {keyword}
                              </span>
                            ))}
                            <span className={`
                              px-2 py-1 rounded text-xs text-white
                              bg-gradient-to-r ${elementColors[rune.element]}
                            `}>
                              {rune.element}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Synthèse globale */}
                  {spreadType === 'three' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="p-4 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-xl"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <h4 className="text-sm font-semibold text-white">
                          Synthèse de ton tirage
                        </h4>
                      </div>
                      <p className="text-sm text-slate-300">
                        {generateSynthesis(drawnRunes)}
                      </p>
                    </motion.div>
                  )}

                  {/* CTA */}
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    Approfondir avec une séance personnalisée
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateSynthesis(runes: Rune[]): string {
  if (runes.length !== 3) return '';
  
  const [past, present, future] = runes;
  
  return `Ton passé, représenté par ${past.name}, montre ${past.meaning.toLowerCase()}. 
  Actuellement, ${present.name} indique ${present.meaning.toLowerCase()} dans ta vie. 
  L'avenir, révélé par ${future.name}, t'invite à ${future.advice.toLowerCase()}`;
}
