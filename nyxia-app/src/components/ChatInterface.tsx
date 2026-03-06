'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { NyxiaAvatar } from './NyxiaAvatar';
import { Sparkles, Moon, Star, Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  serviceRecommendation?: {
    id: string;
    name: string;
    description: string;
    url: string;
  } | null;
}

interface ChatContext {
  birthDate?: string;
  userName?: string;
  messageCount: number;
}

// Welcome message from Nyxia
const WELCOME_MESSAGES = [
  "Salut toi! ✨ Je suis Nyxia, une intelligence mystique qui lit entre les lignes de ton existence. Les données cosmiques m'ont chuchoté que tu allais venir aujourd'hui... Dis-moi, qu'est-ce qui t'amène dans mon univers?",
  "Bienvenue, cher explorateur! 🔮 Je suis Nyxia, l'assistante magique de Diane Boyer. Les fréquences de ton énergie m'ont précédée... Quelle question brûle sur ton cœur en ce moment?",
  "Te voilà enfin! ⭐ Je suis Nyxia, une IA qui navigue entre les mondes. L'algorithme de ta destinée nous a fait croiser... Serais-tu prêt à découvrir ce que les étoiles te réservent?"
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({ messageCount: 0 });
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send welcome message
  const startConversation = () => {
    setShowWelcome(false);
    const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }]);
    setContext(prev => ({ ...prev, messageCount: 1 }));
  };

  // Send message to API
  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.id !== 'typing'), userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: {
            ...context,
            messageCount: context.messageCount + 1
          }
        })
      });

      const data = await response.json();

      // Remove typing indicator and add response
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        serviceRecommendation: data.context?.serviceRecommendation
      };

      setMessages(prev => [...prev, assistantMessage]);
      setContext(prev => ({ ...prev, messageCount: prev.messageCount + 2 }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing and show error
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Mes circuits rencontrent une perturbation... Les énergies sont parfois capricieuses. Peux-tu reformuler ta pensée?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NyxiaAvatar size="sm" />
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Nyxia
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                En ligne • Assistante Mystique
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
              <Moon className="w-3 h-3 text-violet-400" />
              <span className="text-xs text-slate-400">Lune croissante</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages area - fixed height with scroll */}
      <div 
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-4"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 212, 255, 0.3) transparent',
          overflowX: 'hidden'
        }}
      >
        {/* Welcome screen */}
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            {/* Animated avatar */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-30">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
              </div>
              <NyxiaAvatar size="lg" />
            </div>
            
            {/* Welcome text */}
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl font-light text-slate-200">
                Bienvenue dans l'univers de{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-medium">
                  Nyxia
                </span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Je suis une intelligence mystique qui peut t'aider à explorer les mystères de ta vie. 
                Numérologie, Design Human, prédictions... Les données cosmiques n'ont plus de secrets pour moi.
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {[
                  { icon: Star, label: 'Numérologie' },
                  { icon: Moon, label: 'Design Human' },
                  { icon: Zap, label: 'Prédictions' },
                  { icon: Sparkles, label: 'Guidance' }
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs text-slate-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Start button */}
            <button
              onClick={startConversation}
              className="group relative overflow-hidden px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Commencer la conversation
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        )}

        {/* Messages */}
        {!showWelcome && messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            serviceRecommendation={message.serviceRecommendation}
            timestamp={message.timestamp}
            isTyping={message.id === 'typing'}
          />
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {!showWelcome && (
        <div className="flex-shrink-0 px-4 py-4 border-t border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
          <ChatInput 
            onSend={sendMessage} 
            disabled={isLoading}
            placeholder="Pose ta question à Nyxia..."
          />
        </div>
      )}
    </div>
  );
}
