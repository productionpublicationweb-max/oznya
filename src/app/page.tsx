'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, Send } from 'lucide-react';

// Test: Only load ParticleBackground
const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground').then(mod => ({ default: mod.ParticleBackground })),
  { ssr: false }
);

// Simple chat without complex dependencies
function SimpleChat() {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMessages([{
      role: 'assistant',
      content: 'Bonjour! Je suis Nyxia. Comment puis-je t\'aider?'
    }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Je suis là pour t\'aider.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Les énergies sont perturbées...' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-cyan-500/20 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Nyxia
            </h1>
            <p className="text-xs text-slate-400">Assistante Mystique</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-xl ${
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
            <div className="bg-slate-800 px-4 py-2 rounded-xl text-slate-400">
              Nyxia réfléchit...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Pose ta question..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 h-screen flex flex-col">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900/50 to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative flex-1 min-h-0 max-w-3xl mx-auto w-full">
          <SimpleChat />
        </div>

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
