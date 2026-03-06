'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, Gift, Moon, Mail, Calendar, Menu, X, LogIn, Send } from 'lucide-react';

const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground').then(mod => ({ default: mod.ParticleBackground })),
  { ssr: false }
);

const NyxiaAvatarV2 = dynamic(
  () => import('@/components/NyxiaAvatarV2').then(mod => ({ default: mod.NyxiaAvatarV2 })),
  { ssr: false }
);

const CoffretModal = dynamic(
  () => import('@/components/CoffretModal').then(mod => ({ default: mod.CoffretModal })),
  { ssr: false }
);

const TarotReading = dynamic(
  () => import('@/components/TarotReading').then(mod => ({ default: mod.TarotReading })),
  { ssr: false }
);

const CalendlyModal = dynamic(
  () => import('@/components/CalendlyModal').then(mod => ({ default: mod.CalendlyModal })),
  { ssr: false }
);

const EmailModal = dynamic(
  () => import('@/components/EmailModal').then(mod => ({ default: mod.EmailModal })),
  { ssr: false }
);

const ReferralSystem = dynamic(
  () => import('@/components/ReferralSystem').then(mod => ({ default: mod.ReferralSystem })),
  { ssr: false }
);

const AuthModal = dynamic(
  () => import('@/components/AuthModal').then(mod => ({ default: mod.AuthModal })),
  { ssr: false }
);

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCoffret, setShowCoffret] = useState(false);
  const [showTarot, setShowTarot] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: { messageCount: messages.length + 1 }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Une erreur s'est produite. Réessaie..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = () => {
    setChatStarted(true);
    setMessages([{ role: 'assistant', content: "Bonjour ! Je suis Nyxia, ton guide mystique. Comment puis-je t'aider aujourd'hui ? ✨" }]);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <ParticleBackground />
      
      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-l border-cyan-500/20 z-50 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-cyan-400">Services</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <a href="https://www.oznya.com/consultations/express1q1r" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 text-sm">
                <Mail className="w-4 h-4 text-cyan-400" />
                1 Question | 1 Réponse
              </a>
              <a href="https://premium.chat/Oznya/903857" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Chat 10 min
              </a>
              <a href="https://premium.chat/Oznya/903845" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 text-sm">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Appel 10 min
              </a>
            </div>
          </div>
        </>
      )}
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 px-4 py-3 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NyxiaAvatarV2 size="sm" mood="mystical" />
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Nyxia
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  En ligne • Assistante Mystique
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAuth(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700">
                <LogIn className="w-4 h-4" />
                Connexion
              </button>
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <div className="flex-1 flex flex-col min-h-0">
          {!chatStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <NyxiaAvatarV2 size="lg" mood="mystical" showGlow={true} />
              <h2 className="text-xl text-slate-200 mt-6 mb-2">Bienvenue dans l'univers de <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-medium">Nyxia</span></h2>
              <p className="text-slate-400 text-sm mb-6 flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> Ton guide mystique personnel</p>
              <button onClick={startChat} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg hover:shadow-cyan-500/40 transition-all">
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Commencer la conversation</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' : 'bg-slate-800/80 text-slate-200'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/80 p-3 rounded-2xl text-slate-400">Nyxia réfléchit...</div>
                  </div>
                )}
              </div>
              
              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t border-cyan-500/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Pose ta question à Nyxia..."
                    className="flex-1 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button onClick={sendMessage} disabled={isLoading} className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white disabled:opacity-50">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-cyan-500/10 bg-slate-900/30">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button onClick={() => setShowCalendly(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20">
              <Calendar className="w-4 h-4" /> Réserver
            </button>
            <button onClick={() => setShowCoffret(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20">
              <Gift className="w-4 h-4" /> Coffret
            </button>
            <button onClick={() => setShowTarot(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20">
              <Moon className="w-4 h-4" /> Tarot
            </button>
            <button onClick={() => setShowEmail(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20">
              <Mail className="w-4 h-4" /> Récap
            </button>
            <button onClick={() => setShowReferral(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20">
              <Sparkles className="w-4 h-4" /> Parrainage
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CoffretModal isOpen={showCoffret} onClose={() => setShowCoffret(false)} />
      <TarotReading isOpen={showTarot} onClose={() => setShowTarot(false)} onReadingComplete={() => {}} />
      <CalendlyModal isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
      <EmailModal isOpen={showEmail} onClose={() => setShowEmail(false)} type="summary" data={{ messages: [], promoCode: '', discount: 15 }} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      
      {showReferral && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 p-4 border-b border-cyan-500/20 flex items-center justify-between z-10">
              <h3 className="text-lg font-medium text-white">Programme de Parrainage</h3>
              <button onClick={() => setShowReferral(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ReferralSystem onClose={() => setShowReferral(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
