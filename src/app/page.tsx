'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, Menu, X } from 'lucide-react';

// Dynamically import ParticleBackground to avoid SSR issues
const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground').then(mod => ({ default: mod.ParticleBackground })),
  { ssr: false }
);

// Dynamically import ChatInterfaceV2
const ChatInterfaceV2 = dynamic(
  () => import('@/components/ChatInterfaceV2').then(mod => ({ default: mod.ChatInterfaceV2 })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Initialisation de Nyxia V2...
          </p>
        </div>
      </div>
    )
  }
);

// Dynamically import ServicesSidebar
const ServicesSidebar = dynamic(
  () => import('@/components/ServicesSidebar').then(mod => ({ default: mod.ServicesSidebar })),
  { ssr: false }
);

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Animated particle background */}
      <ParticleBackground />
      
      {/* Services Sidebar */}
      <ServicesSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Floating Services Button - Always visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`
          fixed top-4 left-4 z-[100]
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-gradient-to-r from-violet-600/90 to-amber-600/90
          border border-violet-400/30
          text-white font-medium text-sm
          shadow-lg shadow-violet-500/20
          hover:shadow-violet-500/40 hover:scale-105
          transition-all duration-300
          backdrop-blur-md
        `}
      >
        {sidebarOpen ? (
          <>
            <X className="w-5 h-5" />
            <span>Fermer</span>
          </>
        ) : (
          <>
            <Menu className="w-5 h-5" />
            <span>Services</span>
          </>
        )}
      </button>
      
      {/* Main chat container */}
      <div className={`
        relative z-10 h-screen flex flex-col
        transition-all duration-300
        ${sidebarOpen ? 'mr-[280px]' : 'mr-0'}
      `}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900/50 to-transparent" />
          
          {/* Corner glows */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        
        {/* Chat interface V2 */}
        <div className="relative flex-1 min-h-0 max-w-3xl mx-auto w-full">
          <ChatInterfaceV2 />
        </div>
        
        {/* Footer */}
        <footer className="relative z-10 flex-shrink-0 py-2 px-4 text-center">
          <p className="text-xs text-slate-500">
            Propulsé par{' '}
            <span className="text-gradient-cyan-violet font-medium">Nyxia V2</span>
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
  );
}
