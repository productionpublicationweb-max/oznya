'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

// Simple loading component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        <p className="text-slate-400 text-sm">Initialisation de Nyxia V2...</p>
      </div>
    </div>
  );
}

// Import the widget dynamically
let NyxiaWidgetComponent: React.ComponentType | null = null;

export default function Home() {
  const [Widget, setWidget] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Dynamic import on client side only
    import('@/components/NyxiaWidget')
      .then((mod) => {
        setWidget(() => mod.NyxiaWidget);
      })
      .catch((err) => {
        console.error('Failed to load widget:', err);
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erreur de chargement</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-cyan-500 rounded text-white"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!Widget) {
    return <LoadingScreen />;
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-slate-950 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Nyxia Widget */}
      <Widget />
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 py-4 px-4 text-center pointer-events-none">
        <p className="text-xs text-slate-600">
          Propulsé par <span className="text-cyan-600 font-medium">Nyxia V2</span>
          {' '}• Assistante de{' '}
          <a 
            href="https://www.oznya.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-500 hover:text-cyan-400 transition-colors pointer-events-auto"
          >
            Diane Boyer
          </a>
        </p>
      </footer>
    </main>
  );
}
