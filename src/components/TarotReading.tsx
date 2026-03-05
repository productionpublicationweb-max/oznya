'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Sparkles, RefreshCw, Star, Moon, Sun, 
  ChevronRight, Shuffle
} from 'lucide-react';
import { 
  tarotSpreads, 
  drawCards, 
  generateInterpretation,
  TarotCard,
  TarotSpread
} from '@/lib/tarot';
import { soundManager } from '@/lib/sounds';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  isFlipped: boolean;
}

interface TarotReadingProps {
  isOpen: boolean;
  onClose: () => void;
  onReadingComplete?: (interpretation: string) => void;
}

const CardBack = ({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`
      relative w-32 h-48 rounded-lg overflow-hidden shadow-xl
      ${!disabled ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : ''}
      transition-all duration-300
    `}
    style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      border: '2px solid rgba(139, 92, 246, 0.3)'
    }}
  >
    {/* Decorative pattern */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Star className="w-12 h-12 text-violet-300" />
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <Moon className="w-6 h-6 text-violet-300" />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Sun className="w-6 h-6 text-amber-300" />
      </div>
    </div>
    
    {/* Border decoration */}
    <div className="absolute inset-2 border border-violet-400/30 rounded" />
    <div className="absolute inset-4 border border-violet-400/20 rounded" />
    
    {/* Center symbol */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-amber-500/20 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-violet-300" />
      </div>
    </div>
  </div>
);

const TarotCardComponent = ({ 
  card, 
  isReversed, 
  isFlipped, 
  onFlip
}: { 
  card: TarotCard; 
  isReversed: boolean; 
  isFlipped: boolean;
  onFlip?: () => void;
}) => {
  const handleClick = () => {
    if (!isFlipped && onFlip) {
      soundManager.play('magic');
      onFlip();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`perspective-1000 ${!isFlipped ? 'cursor-pointer' : ''}`}
    >
      <motion.div
        className="relative w-32 h-48 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back of card */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardBack disabled={isFlipped} />
        </div>
        
        {/* Front of card */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div 
            className={`
              w-32 h-48 rounded-lg overflow-hidden shadow-xl
              ${isReversed ? 'rotate-180' : ''}
              transition-shadow hover:shadow-2xl
            `}
            style={{
              border: `2px solid ${isReversed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(139, 92, 246, 0.5)'}`
            }}
          >
            <img 
              src={card.image} 
              alt={card.nameFR}
              className="w-full h-full object-cover"
            />
            
            {/* Card name overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-xs text-white text-center font-medium">
                {card.nameFR}
              </p>
            </div>
            
            {/* Reversed indicator */}
            {isReversed && (
              <div className="absolute top-2 right-2 rotate-180">
                <div className="bg-red-500/80 rounded-full p-1">
                  <RefreshCw className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function TarotReading({ isOpen, onClose, onReadingComplete }: TarotReadingProps) {
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'select' | 'draw' | 'reveal' | 'result'>('select');
  const [revealedCount, setRevealedCount] = useState(0);
  const [interpretation, setInterpretation] = useState('');

  const resetReading = useCallback(() => {
    setSelectedSpread(null);
    setDrawnCards([]);
    setIsDrawing(false);
    setCurrentPhase('select');
    setRevealedCount(0);
    setInterpretation('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      soundManager.play('open');
      // Reset state when modal opens - this is intentional for modal behavior
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetReading();
    }
  }, [isOpen, resetReading]);

  const selectSpread = (spread: TarotSpread) => {
    soundManager.play('chime');
    setSelectedSpread(spread);
    setCurrentPhase('draw');
  };

  const performDraw = async () => {
    if (!selectedSpread) return;
    
    setIsDrawing(true);
    soundManager.play('magic');
    
    // Draw cards
    const cards = drawCards(selectedSpread.cardCount);
    setDrawnCards(cards.map(c => ({ ...c, isFlipped: false })));
    
    // Animate cards appearing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsDrawing(false);
    setCurrentPhase('reveal');
  };

  const showResults = useCallback(() => {
    if (!selectedSpread) return;
    
    const interp = generateInterpretation(
      selectedSpread, 
      drawnCards.map(d => ({ card: d.card, isReversed: d.isReversed }))
    );
    setInterpretation(interp);
    setCurrentPhase('result');
    soundManager.play('favorite');
    
    if (onReadingComplete) {
      onReadingComplete(interp);
    }
  }, [selectedSpread, drawnCards, onReadingComplete]);

  const revealCard = useCallback((index: number) => {
    setRevealedCount(prev => {
      const newCount = prev + 1;
      // Check if all cards revealed
      if (newCount === drawnCards.length) {
        setTimeout(() => {
          showResults();
        }, 500);
      }
      return newCount;
    });
    
    // Update the card to flipped
    setDrawnCards(prev => prev.map((c, i) => 
      i === index ? { ...c, isFlipped: true } : c
    ));
  }, [drawnCards.length, showResults]);

  const revealAllCards = () => {
    setDrawnCards(prev => prev.map(c => ({ ...c, isFlipped: true })));
    setRevealedCount(drawnCards.length);
    setTimeout(() => showResults(), 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl border border-violet-500/30 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-violet-500/20 bg-gradient-to-r from-violet-900/30 to-amber-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Tirage Tarot Mystique</h2>
              <p className="text-xs text-slate-400">Laissez les cartes vous guider</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Phase: Select Spread */}
          {currentPhase === 'select' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl text-white mb-2">Choisissez votre tirage</h3>
                <p className="text-sm text-slate-400">Chaque type de tirage offre une perspective unique</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tarotSpreads.map((spread) => (
                  <motion.button
                    key={spread.id}
                    onClick={() => selectSpread(spread)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{spread.name}</span>
                      <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                        {spread.cardCount} cartes
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{spread.description}</p>
                    <div className="flex items-center text-violet-400 text-xs group-hover:text-violet-300">
                      <span>Commencer</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Phase: Draw Cards */}
          {currentPhase === 'draw' && selectedSpread && (
            <div className="text-center space-y-8">
              <div>
                <h3 className="text-xl text-white mb-2">{selectedSpread.name}</h3>
                <p className="text-sm text-slate-400">{selectedSpread.description}</p>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  {/* Deck visualization */}
                  <div className="relative">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute"
                        style={{
                          top: i * 2,
                          left: i * 2,
                          zIndex: 5 - i
                        }}
                      >
                        <CardBack disabled />
                      </div>
                    ))}
                  </div>
                  
                  <motion.div
                    animate={isDrawing ? { x: 100, opacity: 0 } : {}}
                    className="relative z-10"
                  >
                    <CardBack disabled />
                  </motion.div>
                </div>
              </div>
              
              <button
                onClick={performDraw}
                disabled={isDrawing}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 mx-auto"
              >
                <Shuffle className="w-5 h-5" />
                {isDrawing ? 'Tirage en cours...' : 'Tirer les cartes'}
              </button>
            </div>
          )}

          {/* Phase: Reveal Cards */}
          {currentPhase === 'reveal' && selectedSpread && drawnCards.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl text-white mb-2">Retournez les cartes</h3>
                <p className="text-sm text-slate-400">Cliquez sur chaque carte pour la révéler ({revealedCount}/{drawnCards.length})</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {drawnCards.map((drawn, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-violet-300 font-medium">
                      {selectedSpread.positions[index]}
                    </span>
                    <TarotCardComponent
                      card={drawn.card}
                      isReversed={drawn.isReversed}
                      isFlipped={drawn.isFlipped}
                      onFlip={() => revealCard(index)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <button
                  onClick={revealAllCards}
                  className="text-sm text-slate-400 hover:text-white underline"
                >
                  Révéler toutes les cartes
                </button>
              </div>
            </div>
          )}

          {/* Phase: Results */}
          {currentPhase === 'result' && interpretation && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl text-white mb-2">Votre Interprétation</h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-violet-500 to-amber-500 mx-auto rounded-full" />
              </div>
              
              {/* Cards summary */}
              <div className="flex flex-wrap justify-center gap-3">
                {drawnCards.map((drawn, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 mb-1">
                      {selectedSpread?.positions[index]}
                    </span>
                    <img 
                      src={drawn.card.image} 
                      alt={drawn.card.nameFR}
                      className={`w-16 h-24 rounded object-cover shadow-lg ${drawn.isReversed ? 'rotate-180' : ''}`}
                      style={{ border: `1px solid ${drawn.isReversed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(139, 92, 246, 0.5)'}` }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Interpretation text */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="prose prose-invert prose-sm max-w-none">
                  {interpretation.split('\n').map((line, i) => (
                    <p key={i} className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                       dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-violet-300">$1</strong>') }} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetReading}
                  className="px-6 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-violet-500/50 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Nouveau tirage
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-amber-500 text-white font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Quick access button
export function QuickTarotButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-500/30 transition-all"
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>Tarot</span>
    </button>
  );
}
