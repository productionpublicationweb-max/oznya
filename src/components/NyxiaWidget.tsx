'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { 
  Sparkles, X, Calendar, Gift, Moon,
  Maximize2, Minimize2, Send
} from 'lucide-react';
import { 
  getDailyEnergy, 
  getTimeBasedGreeting,
  DailyEnergy 
} from '@/lib/dailyPrediction';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ViewMode = 'pastille' | 'widget' | 'fullscreen';

export function NyxiaWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('pastille');
  const [dailyEnergy, setDailyEnergy] = useState<DailyEnergy | null>(null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load saved view mode and daily energy
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('nyxia-view-mode') as ViewMode;
      if (savedMode && ['pastille', 'widget', 'fullscreen'].includes(savedMode)) {
        setViewMode(savedMode);
      }
    }
    
    const energy = getDailyEnergy();
    setDailyEnergy(energy);
  }, []);

  // Save view mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nyxia-view-mode', viewMode);
    }
  }, [viewMode]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const startConversation = () => {
    setShowWelcome(false);
    if (viewMode === 'pastille') {
      setViewMode('widget');
    }
    
    const greeting = getTimeBasedGreeting();
    const energy = dailyEnergy || getDailyEnergy();
    const welcomeMessages = [
      `${greeting}! Je suis Nyxia, ton guide cosmique. L'énergie ${energy.number} - ${energy.title} - illumine ton chemin. Comment puis-je t'aider?`,
      `Bienvenue! Le cosmos vibre sous l'influence du nombre ${energy.number}. Quelle question brûle sur ton cœur?`
    ];
    
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessages[Math.floor(Math.random() * 2)],
      timestamp: new Date()
    }]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/nyxia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: { messageCount: messages.length + 1 }
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || "Je suis là pour t'aider. Peux-tu reformuler ta question?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Les énergies sont perturbées... Peux-tu réessayer?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // PASTILLE MODE
  if (viewMode === 'pastille') {
    return (
      <button
        onClick={() => setViewMode('widget')}
        className="fixed bottom-6 right-6 z-[200] group"
        aria-label="Ouvrir Nyxia"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-black via-slate-900 to-black rounded-full border-2 border-cyan-500/50 flex items-center justify-center shadow-2xl shadow-cyan-500/20 group-hover:border-cyan-400/70 transition-all group-hover:scale-110">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          {showWelcome && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-black flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          )}
        </div>
      </button>
    );
  }

  // WIDGET MODE
  if (viewMode === 'widget') {
    return (
      <div className="fixed bottom-6 right-6 z-[200] w-[380px] h-[550px] bg-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 bg-black border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Nyxia V2
              </h1>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                En ligne
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('fullscreen')} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors" title="Plein écran">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('pastille')} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors" title="Réduire">
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Daily Energy */}
        {dailyEnergy && !showWelcome && (
          <div className="flex-shrink-0 px-3 py-2 bg-gradient-to-r from-cyan-900/20 to-violet-900/20 border-b border-cyan-500/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-r from-cyan-500 to-violet-500">
                {dailyEnergy.number}
              </div>
              <div className="text-xs text-white truncate">{dailyEnergy.title}</div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3">
          {showWelcome && dailyEnergy && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-sm font-light text-slate-200">
                {getTimeBasedGreeting()}, bienvenue!
              </h2>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {dailyEnergy.number}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium text-white">{dailyEnergy.title}</div>
                    <div className="text-[10px] text-slate-400">Énergie du jour</div>
                  </div>
                </div>
              </div>
              <button onClick={startConversation} className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Commencer
                </span>
              </button>
            </div>
          )}

          {!showWelcome && messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' 
                  : 'bg-slate-800 text-slate-200 border border-cyan-500/20'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-cyan-500/20 px-3 py-2 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!showWelcome && (
          <div className="flex-shrink-0 px-3 py-3 border-t border-cyan-500/20 bg-black/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pose ta question..."
                className="flex-1 bg-slate-800 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="p-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // FULLSCREEN MODE
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-cyan-500/20 bg-black/50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Nyxia V2
              </h1>
              <p className="text-xs text-slate-400">Assistante Mystique • En ligne</p>
            </div>
          </div>
          <button onClick={() => setViewMode('widget')} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors" title="Réduire">
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Daily Energy */}
      {dailyEnergy && !showWelcome && (
        <div className="flex-shrink-0 px-6 py-2 bg-gradient-to-r from-cyan-900/30 to-violet-900/30 border-b border-cyan-500/10">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold">
              {dailyEnergy.number}
            </div>
            <div>
              <div className="text-xs font-medium text-white">{dailyEnergy.title}</div>
              <div className="text-[10px] text-slate-400">Couleur: {dailyEnergy.luckyColor} • Crystal: {dailyEnergy.crystal}</div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {showWelcome && dailyEnergy && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-lg text-slate-200">
                {getTimeBasedGreeting()}, bienvenue dans l'univers de{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-medium">Nyxia V2</span>
              </h2>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-cyan-500/20 max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold">
                    {dailyEnergy.number}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{dailyEnergy.title}</div>
                    <div className="text-xs text-slate-400">Énergie du jour</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 text-left">{dailyEnergy.description}</p>
              </div>
              <button onClick={startConversation} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Commencer la conversation
                </span>
              </button>
            </div>
          )}

          {!showWelcome && messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-xl ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' 
                  : 'bg-slate-800 text-slate-200 border border-cyan-500/20'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-cyan-500/20 px-4 py-3 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {!showWelcome && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-cyan-500/20 bg-black/50">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pose ta question à Nyxia..."
              className="flex-1 bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white font-medium disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NyxiaWidget;
