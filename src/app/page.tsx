'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Send, Maximize2, Minimize2 } from 'lucide-react';
import { getDailyEnergy, getTimeBasedGreeting, DailyEnergy } from '@/lib/dailyPrediction';

// Simple message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [mode, setMode] = useState<'pastille' | 'widget' | 'fullscreen'>('pastille');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [energy, setEnergy] = useState<DailyEnergy | null>(null);

  // Initialize on mount
  useEffect(() => {
    setEnergy(getDailyEnergy());
  }, []);

  const startChat = () => {
    setStarted(true);
    setMode('widget');
    const greeting = getTimeBasedGreeting();
    const e = getDailyEnergy();
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `${greeting}! Je suis Nyxia. L'énergie du jour est ${e.number} - ${e.title}. Comment puis-je t'aider?`
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
        body: JSON.stringify({ messages: [...messages, userMsg], context: { messageCount: messages.length + 1 } })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response || 'Je suis là pour t\'aider.' }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Les énergies sont perturbées...' }]);
    } finally {
      setLoading(false);
    }
  };

  // PASTILLE MODE
  if (mode === 'pastille') {
    return (
      <main className="h-screen w-full bg-black">
        <button onClick={() => started ? setMode('widget') : startChat()} className="fixed bottom-6 right-6 z-50 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 animate-pulse" />
            <div className="relative w-16 h-16 bg-black rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-400 transition-all hover:scale-110">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </button>
      </main>
    );
  }

  // WIDGET MODE
  if (mode === 'widget') {
    return (
      <main className="h-screen w-full bg-black">
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] bg-black/95 rounded-2xl border border-cyan-500/30 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-400">Nyxia V2</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMode('fullscreen')} className="p-1 text-slate-400 hover:text-white"><Maximize2 className="w-4 h-4" /></button>
              <button onClick={() => setMode('pastille')} className="p-1 text-slate-400 hover:text-white"><Minimize2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-slate-400 text-sm">Nyxia réfléchit...</div>}
          </div>
          <div className="p-3 border-t border-cyan-500/20 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Votre message..." className="flex-1 bg-slate-800 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-white" />
            <button onClick={sendMessage} disabled={loading} className="p-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </main>
    );
  }

  // FULLSCREEN MODE
  return (
    <main className="h-screen w-full bg-black flex flex-col">
      <header className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span className="text-lg text-cyan-400">Nyxia V2 - Plein écran</span>
        </div>
        <button onClick={() => setMode('widget')} className="p-2 text-slate-400 hover:text-white"><Minimize2 /></button>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-3 rounded-xl ${m.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' : 'bg-slate-800 text-slate-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-slate-400">Nyxia réfléchit...</div>}
      </div>
      <footer className="p-4 border-t border-cyan-500/20 max-w-4xl mx-auto w-full flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Posez votre question..." className="flex-1 bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-white" />
        <button onClick={sendMessage} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white"><Send /></button>
      </footer>
    </main>
  );
}
