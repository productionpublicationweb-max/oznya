'use client';

import { useState, useEffect, Component, ReactNode } from 'react';
import { Sparkles, Send, Maximize2, Minimize2 } from 'lucide-react';

// Error Boundary
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-black flex items-center justify-center p-4">
          <div className="bg-red-900/50 border border-red-500 rounded-xl p-6 max-w-md text-center">
            <h1 className="text-red-400 text-xl mb-2">Erreur détectée</h1>
            <p className="text-red-200 text-sm mb-4">{this.state.error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 rounded text-white"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Simple daily energy without external import
function getSimpleEnergy() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const dateStr = `${day}${month}${year}`;
  let sum = 0;
  for (const char of dateStr) sum += parseInt(char, 10) || 0;
  while (sum > 9) {
    let temp = 0;
    for (const d of sum.toString()) temp += parseInt(d, 10);
    sum = temp;
  }
  return { number: sum, title: 'Énergie du jour' };
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Bonjour';
  if (h >= 12 && h < 17) return 'Bon après-midi';
  if (h >= 17 && h < 21) return 'Bonsoir';
  return 'Bonne nuit';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function NyxiaApp() {
  const [mode, setMode] = useState<'pastille' | 'widget' | 'fullscreen'>('pastille');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startChat = () => {
    setStarted(true);
    setMode('widget');
    const energy = getSimpleEnergy();
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `${getTimeGreeting()}! Je suis Nyxia. L'énergie du jour est ${energy.number}. Comment puis-je t'aider?`
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/nyxia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })), 
          context: { messageCount: messages.length + 1 } 
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.response || 'Je suis là pour t\'aider.' 
      }]);
    } catch {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: 'Les énergies sont perturbées...' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  // PASTILLE
  if (mode === 'pastille') {
    return (
      <main className="h-screen w-full bg-black">
        <button 
          onClick={() => started ? setMode('widget') : startChat()} 
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Ouvrir Nyxia"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 animate-pulse" />
            <div className="relative w-16 h-16 bg-black rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-400 transition-all hover:scale-110">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </button>
        <div className="fixed bottom-24 right-6 text-xs text-slate-500">
          Nyxia V2 - cliquez pour commencer
        </div>
      </main>
    );
  }

  // WIDGET
  if (mode === 'widget') {
    return (
      <main className="h-screen w-full bg-black">
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] bg-black/95 rounded-2xl border border-cyan-500/30 flex flex-col overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Nyxia V2</span>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setMode('fullscreen')} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                aria-label="Plein écran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setMode('pastille')} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                aria-label="Réduire"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-3 py-2 rounded-xl text-slate-400 text-sm">
                  Nyxia réfléchit...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-800 flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} 
              placeholder="Votre message..." 
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" 
            />
            <button 
              onClick={sendMessage} 
              disabled={loading} 
              className="p-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  // FULLSCREEN
  return (
    <main className="h-screen w-full bg-black flex flex-col">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span className="text-lg text-cyan-400 font-medium">Nyxia V2 - Plein écran</span>
        </div>
        <button 
          onClick={() => setMode('widget')} 
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-3 rounded-xl ${
              m.role === 'user' 
                ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' 
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-slate-400">Nyxia réfléchit...</div>}
      </div>
      <footer className="p-4 border-t border-slate-800 max-w-4xl mx-auto w-full flex gap-3 bg-slate-900/50">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} 
          placeholder="Posez votre question..." 
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500" 
        />
        <button 
          onClick={sendMessage} 
          disabled={loading} 
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white font-medium disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <NyxiaApp />
    </ErrorBoundary>
  );
}
