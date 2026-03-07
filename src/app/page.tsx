'use client';

import { useState, Component, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, RefreshCw, Moon, Sun, Star } from 'lucide-react';
import { getDailyEnergy, getTimeBasedGreeting, DailyEnergy } from '@/lib/dailyPrediction';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Error caught by boundary:', error);
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-2xl font-bold mb-2 text-cyan-400">Oups ! Une erreur s'est produite</h1>
          <p className="text-slate-400 mb-6 text-center max-w-md">
            Les étoiles se sont alignées de façon inattendue. 
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Rafraîchir
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        <p className="text-slate-400 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Chargement...
        </p>
      </div>
    </div>
  );
}

// Dynamically import components with error handling
const ChatInterfaceV2 = dynamic(
  () => import('@/components/ChatInterfaceV2').then(mod => ({ default: mod.ChatInterfaceV2 })),
  { 
    ssr: false,
    loading: LoadingSpinner
  }
);

// Hook to check if component is mounted (for SSR safety)
function useMounted() {
  const [mounted, setMounted] = useState(false);
  
  // Use queueMicrotask to defer setState (avoids lint warning)
  if (typeof window !== 'undefined' && !mounted) {
    queueMicrotask(() => setMounted(true));
  }
  
  return mounted;
}

// Enhanced welcome screen with daily energy
function WelcomeScreen({ onStart, dailyEnergy }: { onStart: () => void; dailyEnergy: DailyEnergy }) {
  const greeting = getTimeBasedGreeting();
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-4">
      {/* Avatar avec glow */}
      <div className="relative">
        <div className="absolute inset-0 blur-3xl opacity-40">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
        </div>
        <div className="relative text-7xl animate-pulse">🔮</div>
        {isNight && (
          <Moon className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-bounce" />
        )}
        {!isNight && hour >= 6 && hour < 18 && (
          <Sun className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
        )}
      </div>
      
      {/* Titre et salutation */}
      <div className="space-y-3 max-w-md">
        <h2 className="text-lg font-light text-slate-200">
          {greeting}, bienvenue dans l'univers de{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-semibold">
            Nyxia
          </span>
        </h2>
      </div>
      
      {/* Carte énergie du jour */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-cyan-500/20 backdrop-blur-sm shadow-xl shadow-cyan-500/5 w-full max-w-sm">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${dailyEnergy.luckyColorHex}, ${dailyEnergy.luckyColorHex}88)` 
            }}
          >
            {dailyEnergy.number}
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">{dailyEnergy.title}</div>
            <div className="text-xs text-cyan-400 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Énergie du jour
            </div>
          </div>
        </div>
        
        <p className="text-xs text-slate-300 text-left leading-relaxed mb-4">
          {dailyEnergy.description}
        </p>
        
        <div className="flex items-center gap-4 text-[11px] text-slate-400 border-t border-slate-700/50 pt-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: dailyEnergy.luckyColorHex }} />
            {dailyEnergy.luckyColor}
          </span>
          <span>•</span>
          <span>Nombre: {dailyEnergy.luckyNumber}</span>
          <span>•</span>
          <span>💎 {dailyEnergy.crystal}</span>
        </div>
      </div>
      
      {/* Conseil du jour */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 max-w-sm">
        <p className="text-xs text-slate-300 italic">
          💫 <span className="font-medium text-cyan-300">Conseil:</span> {dailyEnergy.advice}
        </p>
      </div>
      
      {/* Bouton Commencer */}
      <button 
        onClick={onStart}
        className="group relative overflow-hidden px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Commencer la conversation
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      
      {/* Lien vers Oznya */}
      <a 
        href="https://www.oznya.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
      >
        <span>Visiter</span>
        <span className="text-cyan-400">oznya.com</span>
        <span>→</span>
      </a>
    </div>
  );
}

export default function Home() {
  const mounted = useMounted();
  const [started, setStarted] = useState(false);
  const [dailyEnergy] = useState(() => getDailyEnergy());

  if (!mounted) {
    return (
      <main className="h-screen w-full bg-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  if (!started) {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Étoiles animées */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <WelcomeScreen onStart={() => setStarted(true)} dailyEnergy={dailyEnergy} />
        </div>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <main className="relative h-screen w-full overflow-hidden bg-slate-900">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Decorative glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 h-screen flex flex-col">
          <ErrorBoundary fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-slate-400">Erreur lors du chargement du chat.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-cyan-500 rounded text-white"
                >
                  Réessayer
                </button>
              </div>
            </div>
          }>
            <div className="flex-1 min-h-0 max-w-3xl mx-auto w-full">
              <ChatInterfaceV2 />
            </div>
          </ErrorBoundary>
          
          {/* Footer */}
          <footer className="flex-shrink-0 py-2 px-4 text-center bg-slate-900/80 backdrop-blur-sm">
            <p className="text-xs text-slate-500">
              Propulsé par{' '}
              <span className="text-cyan-400 font-medium">Nyxia V2</span>
              {' '}• Assistante de{' '}
              <a 
                href="https://www.oznya.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Diane Boyer
              </a>
            </p>
          </footer>
        </div>
      </main>
    </ErrorBoundary>
  );
}
