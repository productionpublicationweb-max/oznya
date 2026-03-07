'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

// Simple page for debugging
export default function Home() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <main className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">🔮</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Nyxia
          </h1>
          <p className="text-slate-400">
            Ton assistante mystique IA
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Commencer
            </span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-4xl">✨</div>
        <h2 className="text-xl text-white">Nyxia fonctionne!</h2>
        <p className="text-slate-400 text-sm">
          Le problème venait des composants dynamiques.
        </p>
        <p className="text-cyan-400 text-xs">
          Demande à Diane de vérifier ses amies!
        </p>
      </div>
    </main>
  );
}
