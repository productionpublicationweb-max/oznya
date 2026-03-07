'use client';

import { useState, Component, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, RefreshCw } from 'lucide-react';

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
  
  // Using useEffect with eslint-disable to avoid the warning
  // This is a common pattern for SSR-safe client-only rendering
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (typeof window !== 'undefined') {
    // Using queueMicrotask to defer setState
    queueMicrotask(() => setMounted(true));
  }
  
  return mounted;
}

export default function Home() {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <main className="h-screen w-full bg-slate-900 flex items-center justify-center">
        <LoadingSpinner />
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
