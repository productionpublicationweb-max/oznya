'use client';

import dynamic from 'next/dynamic';

// Dynamically import NyxiaWidget to avoid SSR issues
const NyxiaWidget = dynamic(
  () => import('@/components/NyxiaWidget').then(mod => ({ default: mod.NyxiaWidget })),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <p className="text-slate-400 text-sm">
            Initialisation de Nyxia V2...
          </p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-slate-950 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Nyxia Widget with 3 modes: pastille -> widget -> fullscreen */}
      <NyxiaWidget />
      
      {/* Footer - only visible in pastille mode */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 py-4 px-4 text-center pointer-events-none">
        <p className="text-xs text-slate-600">
          Propulsé par{' '}
          <span className="text-cyan-600 font-medium">Nyxia V2</span>
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
