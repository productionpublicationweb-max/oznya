'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { NyxiaAvatarV2, AvatarMood } from './NyxiaAvatarV2';
import { CalendlyModal } from './CalendlyModal';
import { StripeCheckout } from './StripeCheckout';
import { EmailModal } from './EmailModal';
import SubscriptionManager from './SubscriptionManager';
import { TarotReading } from './TarotReading';
import { RuneReading } from './RuneReading';
import { LunarPhasesButton } from './LunarPhases';
import { ReferralSystem } from './ReferralSystem';
import { AuthModal } from './AuthModal';
import { ProfileSidebar } from './ProfileSidebar';
import { useAuth } from '@/lib/auth-context';
import { CoffretModal } from './CoffretModal';
import { FunnelSidebar } from './FunnelSidebar';
import { SmartRecommendation } from './SmartRecommendation';
import { 
  Sparkles, History, Volume2, VolumeX, 
  Settings, Bell, BellOff, X, Calendar, 
  Gift, Clock, Mail, MailPlus, User, LogIn,
  ExternalLink, ChevronDown, Moon, ShoppingBag,
  Maximize2, Minimize2, MessageCircle
} from 'lucide-react';
import { 
  getSettings, 
  updateSettings, 
  checkDailyVisit,
  getConversations,
  updateCurrentConversation,
  getActivePromo,
  generatePromoCode
} from '@/lib/storage';
import { trackFeatureUse, trackProductInterest } from '@/lib/salesFunnel';
import { 
  getDailyEnergy, 
  getTimeBasedGreeting,
  DailyEnergy 
} from '@/lib/dailyPrediction';
import { soundManager } from '@/lib/sounds';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isFavorite?: boolean;
  suggestions?: string[];
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

const getWelcomeMessage = (energy: DailyEnergy, greeting: string) => [
  `${greeting}! Je suis Nyxia, ton guide cosmique. Aujourd'hui, l'énergie ${energy.number} - ${energy.title} - illumine ton chemin. ${energy.advice} Dis-moi, qu'est-ce qui t'amène dans mon univers?`,
  `Bienvenue, belle âme! Le cosmos vibre aujourd'hui sous l'influence du nombre ${energy.number}. ${energy.description} Comment puis-je t'aider à naviguer ces énergies?`,
  `${greeting}! Les étoiles m'ont chuchoté que tu viendrais aujourd'hui. L'énergie ${energy.number} t'accompagne: ${energy.title.toLowerCase()}. Quelle question brûle sur ton cœur?`
];

type ViewMode = 'pastille' | 'widget' | 'fullscreen';

export function NyxiaWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({ messageCount: 0 });
  const [showWelcome, setShowWelcome] = useState(true);
  const [avatarMood, setAvatarMood] = useState<AvatarMood>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // View mode: pastille (small bubble) -> widget (medium) -> fullscreen
  const [viewMode, setViewMode] = useState<ViewMode>('pastille');
  
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDailyPrediction, setShowDailyPrediction] = useState(true);
  const [showCalendly, setShowCalendly] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showTarot, setShowTarot] = useState(false);
  const [showRunes, setShowRunes] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showCoffret, setShowCoffret] = useState(false);
  const [emailType, setEmailType] = useState<'summary' | 'promo' | 'prediction'>('summary');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  
  const [dailyEnergy, setDailyEnergy] = useState<DailyEnergy | null>(null);
  const [isFirstVisitToday, setIsFirstVisitToday] = useState(false);
  const [daysSinceLastVisit, setDaysSinceLastVisit] = useState(0);
  const [promo, setPromo] = useState<{ code: string; discount: number } | null>(null);
  
  const { user, isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showFunnelSidebar, setShowFunnelSidebar] = useState(false);
  
  // Context pour le tunnel de vente
  const [funnelContext, setFunnelContext] = useState({
    conversationCount: 0,
    hasCompletedProfile: false,
    hasUsedTarot: false,
    hasUsedRunes: false,
    hasViewedLunar: false
  });

  // Load saved view mode
  useEffect(() => {
    const savedMode = localStorage.getItem('nyxia-view-mode') as ViewMode;
    if (savedMode && ['pastille', 'widget', 'fullscreen'].includes(savedMode)) {
      setViewMode(savedMode);
    }
  }, []);

  // Save view mode
  useEffect(() => {
    localStorage.setItem('nyxia-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const settings = getSettings();
    setSoundEnabled(settings.soundEnabled);
    setReminderEnabled(settings.reminderEnabled);
    soundManager.setEnabled(settings.soundEnabled);

    const visitInfo = checkDailyVisit();
    setIsFirstVisitToday(visitInfo.isFirstVisitToday);
    setDaysSinceLastVisit(visitInfo.daysSinceLastVisit);

    const energy = getDailyEnergy();
    setDailyEnergy(energy);

    const activePromo = getActivePromo();
    if (activePromo) {
      setPromo({ code: activePromo.code, discount: activePromo.discount });
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    soundManager.setEnabled(newValue);
    updateSettings({ soundEnabled: newValue });
    if (newValue) soundManager.play('chime');
  };

  const toggleReminders = () => {
    const newValue = !reminderEnabled;
    setReminderEnabled(newValue);
    updateSettings({ reminderEnabled: newValue });
  };

  const handleGeneratePromo = () => {
    const newPromo = generatePromoCode();
    setPromo({ code: newPromo.code, discount: newPromo.discount });
    soundManager.play('magic');
  };

  const startConversation = () => {
    soundManager.play('open');
    setShowWelcome(false);
    // Auto-expand to widget when starting conversation
    if (viewMode === 'pastille') {
      setViewMode('widget');
    }
    
    const greeting = getTimeBasedGreeting();
    const energy = dailyEnergy || getDailyEnergy();
    const welcomeMessage = getWelcomeMessage(energy, greeting)[Math.floor(Math.random() * 3)];
    
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }]);
    setContext(prev => ({ ...prev, messageCount: 1 }));
    setAvatarMood('happy');
    setTimeout(() => setAvatarMood('neutral'), 2000);
  };

  const openWidget = () => {
    soundManager.play('open');
    setViewMode('widget');
  };

  const expandToFullscreen = () => {
    soundManager.play('open');
    setViewMode('fullscreen');
  };

  const minimizeToWidget = () => {
    setViewMode('widget');
  };

  const minimizeToPastille = () => {
    setViewMode('pastille');
  };

  const sendMessage = async (content: string) => {
    soundManager.play('message-sent');
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setAvatarMood('thinking');

    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('/api/nyxia', {
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
          },
          userId: user?.id
        })
      });

      const data = await response.json();

      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        serviceRecommendation: data.context?.serviceRecommendation
      };

      setMessages(prev => [...prev, assistantMessage]);
      setContext(prev => ({ ...prev, messageCount: prev.messageCount + 2 }));
      
      setFunnelContext(prev => ({
        ...prev,
        conversationCount: prev.conversationCount + 1
      }));

      const allMessages = [...messages.filter(m => m.id !== 'typing'), userMessage, assistantMessage];
      updateCurrentConversation(allMessages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        isFavorite: m.isFavorite || false,
        serviceRecommendation: m.serviceRecommendation
      })));

      soundManager.play('message-received');
      setAvatarMood('mystical');
      setTimeout(() => setAvatarMood('neutral'), 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Mes circuits rencontrent une perturbation... Les énergies sont parfois capricieuses. Peux-tu reformuler ta pensée?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setAvatarMood('neutral');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = (conversation: any) => {
    setMessages(conversation.messages.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
      isFavorite: m.isFavorite || false
    })));
    setShowHistory(false);
    setShowWelcome(false);
    soundManager.play('open');
  };

  const conversations = getConversations();

  // PASTILLE MODE - Small floating bubble
  if (viewMode === 'pastille') {
    return (
      <>
        {/* Floating pastille/bubble */}
        <button
          onClick={openWidget}
          className="fixed bottom-6 right-6 z-[200] group"
          aria-label="Ouvrir Nyxia"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
            
            {/* Main bubble */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-black via-slate-900 to-black rounded-full border-2 border-cyan-500/50 flex items-center justify-center shadow-2xl shadow-cyan-500/20 group-hover:border-cyan-400/70 transition-all group-hover:scale-110">
              <NyxiaAvatarV2 size="xs" mood="mystical" />
            </div>
            
            {/* Notification dot */}
            {showWelcome && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-black flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/90 border border-cyan-500/30 rounded-lg px-3 py-2 shadow-xl">
              <p className="text-sm text-white whitespace-nowrap">Discuter avec Nyxia</p>
              <p className="text-xs text-slate-400">Cliquez pour agrandir</p>
            </div>
          </div>
        </button>
      </>
    );
  }

  // WIDGET MODE - Medium size chat window
  if (viewMode === 'widget') {
    return (
      <>
        {/* Widget container */}
        <div className="fixed bottom-6 right-6 z-[200] w-[380px] h-[550px] bg-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden">
          {/* Widget Header */}
          <div className="flex-shrink-0 px-4 py-3 bg-black border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NyxiaAvatarV2 size="sm" mood={avatarMood} isTyping={isLoading} />
              <div>
                <h1 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Nyxia
                </h1>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  En ligne
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Expand to fullscreen button */}
              <button 
                onClick={expandToFullscreen}
                className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                title="Agrandir en plein écran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              
              {/* Minimize to pastille button */}
              <button 
                onClick={minimizeToPastille}
                className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                title="Réduire"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Daily Energy Banner */}
          {showDailyPrediction && dailyEnergy && !showWelcome && (
            <div className="flex-shrink-0 px-3 py-2 bg-gradient-to-r from-cyan-900/20 to-violet-900/20 border-b border-cyan-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: dailyEnergy.luckyColorHex }}
                  >
                    {dailyEnergy.number}
                  </div>
                  <div className="text-xs text-white truncate">{dailyEnergy.title}</div>
                </div>
                <button onClick={() => setShowDailyPrediction(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Messages area */}
          <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6, 182, 212, 0.3) transparent' }}>
            {/* Welcome screen */}
            {showWelcome && dailyEnergy && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 blur-2xl opacity-30">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
                  </div>
                  <NyxiaAvatarV2 size="md" mood="mystical" showGlow={true} />
                </div>
                
                <div className="space-y-2 max-w-[280px]">
                  <h2 className="text-sm font-light text-slate-200">
                    {getTimeBasedGreeting()}, bienvenue dans l'univers de{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-medium">
                      Nyxia
                    </span>
                  </h2>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: dailyEnergy.luckyColorHex }}
                      >
                        {dailyEnergy.number}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-medium text-white">{dailyEnergy.title}</div>
                        <div className="text-[10px] text-slate-400">Énergie du jour</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button onClick={startConversation} className="group relative overflow-hidden px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Commencer
                  </span>
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
                suggestions={message.suggestions}
                timestamp={message.timestamp}
                isTyping={message.id === 'typing'}
                onSuggestionClick={(suggestion) => sendMessage(suggestion)}
              />
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - Compact */}
          {!showWelcome && (
            <div className="flex-shrink-0 px-2 py-2 border-t border-cyan-500/10 bg-black/50">
              <div className="flex items-center justify-center gap-1 flex-wrap">
                <button 
                  onClick={() => { setShowCalendly(true); trackFeatureUse('calendly'); }} 
                  className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] hover:bg-cyan-500/20 transition-colors"
                >
                  <Calendar className="w-3 h-3" />
                  Réserver
                </button>
                <button 
                  onClick={() => { setShowTarot(true); trackFeatureUse('tarot'); }} 
                  className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] hover:bg-cyan-500/20 transition-colors"
                >
                  <Moon className="w-3 h-3" />
                  Tarot
                </button>
                <button 
                  onClick={() => { setShowRunes(true); trackFeatureUse('runes'); }} 
                  className="flex items-center gap-1 px-2 py-1 rounded bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] hover:bg-violet-500/20 transition-colors"
                >
                  ᚱ Runes
                </button>
              </div>
            </div>
          )}

          {/* Input area */}
          {!showWelcome && (
            <div className="flex-shrink-0 px-3 py-3 border-t border-cyan-500/20 bg-black/50">
              <ChatInput onSend={sendMessage} disabled={isLoading} placeholder="Pose ta question..." />
            </div>
          )}
        </div>

        {/* Modals */}
        <CalendlyModal isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
        <StripeCheckout isOpen={showStripe} onClose={() => setShowStripe(false)} service={selectedService} promoCode={promo?.code} />
        <TarotReading isOpen={showTarot} onClose={() => setShowTarot(false)} onReadingComplete={(interpretation) => { 
          const tarotMessage: Message = { id: `tarot-${Date.now()}`, role: 'assistant', content: interpretation, timestamp: new Date() }; 
          setMessages(prev => [...prev, tarotMessage]); 
        }} />
        <RuneReading isOpen={showRunes} onClose={() => setShowRunes(false)} onReadingComplete={(interpretation) => { 
          const runeMessage: Message = { id: `rune-${Date.now()}`, role: 'assistant', content: interpretation, timestamp: new Date() }; 
          setMessages(prev => [...prev, runeMessage]); 
        }} />
      </>
    );
  }

  // FULLSCREEN MODE - Full page chat
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      {/* Fullscreen Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <NyxiaAvatarV2 size="md" mood={avatarMood} isTyping={isLoading} />
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Nyxia V2
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                En ligne • Assistante Mystique
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHistory(true)} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors" title="Historique">
              <History className="w-4 h-4" />
            </button>
            <SmartRecommendation 
              userId={user?.id}
              context={funnelContext}
            />
            <button onClick={toggleSound} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors" title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}>
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors" title="Paramètres">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={() => setShowFunnelSidebar(true)} className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-violet-500/30 text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/20" title="Boutique">
              <ShoppingBag className="w-4 h-4" />
            </button>
            
            {/* Minimize button */}
            <button 
              onClick={minimizeToWidget}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              title="Réduire en widget"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            
            {isLoggedIn ? (
              <button onClick={() => setShowUserProfile(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors">
                <User className="w-4 h-4" />
                <span>{user?.name?.split(' ')[0] || 'Profil'}</span>
              </button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors">
                <LogIn className="w-4 h-4" />
                Connexion
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Daily Prediction Banner */}
      {showDailyPrediction && dailyEnergy && !showWelcome && (
        <div className="flex-shrink-0 px-6 py-2 bg-gradient-to-r from-cyan-900/30 to-violet-900/30 border-b border-cyan-500/10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: dailyEnergy.luckyColorHex }}
              >
                {dailyEnergy.number}
              </div>
              <div>
                <div className="text-xs font-medium text-white">{dailyEnergy.title}</div>
                <div className="text-[10px] text-slate-400">
                  Couleur: {dailyEnergy.luckyColor} • Crystal: {dailyEnergy.crystal}
                </div>
              </div>
            </div>
            <button onClick={() => setShowDailyPrediction(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Promo Banner */}
      {!promo && messages.length >= 3 && (
        <div className="flex-shrink-0 px-6 py-2 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-500/20">
          <div className="max-w-4xl mx-auto">
            <button onClick={handleGeneratePromo} className="flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 w-full">
              <Gift className="w-4 h-4" />
              <span>Génère un code promo exclusif de 15% !</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {promo && (
        <div className="flex-shrink-0 px-6 py-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-b border-green-500/20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-300">
              <Gift className="w-4 h-4" />
              <span>Code promo: <strong className="text-white">{promo.code}</strong> (-{promo.discount}%)</span>
            </div>
            <button onClick={() => setShowStripe(true)} className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-2 py-1 rounded">
              Utiliser
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6, 182, 212, 0.3) transparent' }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Welcome screen */}
          {showWelcome && dailyEnergy && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-30">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
                </div>
                <NyxiaAvatarV2 size="lg" mood="mystical" showGlow={true} />
              </div>
              
              <div className="space-y-3 max-w-md">
                <h2 className="text-base font-light text-slate-200">
                  {getTimeBasedGreeting()}, bienvenue dans l'univers de{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-medium">
                    Nyxia V2
                  </span>
                </h2>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${dailyEnergy.luckyColorHex}, ${dailyEnergy.luckyColorHex}88)` }}
                    >
                      {dailyEnergy.number}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{dailyEnergy.title}</div>
                      <div className="text-xs text-slate-400">Énergie du jour</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 text-left">{dailyEnergy.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400">
                    <span>Couleur: {dailyEnergy.luckyColor}</span>
                    <span>Nombre: {dailyEnergy.luckyNumber}</span>
                    <span>Crystal: {dailyEnergy.crystal}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={startConversation} className="group relative overflow-hidden px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
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
              suggestions={message.suggestions}
              timestamp={message.timestamp}
              isTyping={message.id === 'typing'}
              onSuggestionClick={(suggestion) => sendMessage(suggestion)}
            />
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions Bar */}
      {!showWelcome && (
        <div className="flex-shrink-0 px-6 py-2 border-t border-cyan-500/10 bg-black/30">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <button 
              onClick={() => { setShowCalendly(true); trackFeatureUse('calendly'); }} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Calendar className="w-4 h-4" />
              Réserver
            </button>
            
            <button
              onClick={() => { setShowCoffret(true); trackProductInterest('coffret-serenite'); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Gift className="w-4 h-4" />
              Coffret
            </button>
            
            <button 
              onClick={() => { setShowTarot(true); setFunnelContext(prev => ({ ...prev, hasUsedTarot: true })); trackFeatureUse('tarot'); }} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Moon className="w-4 h-4" />
              Tarot
            </button>
            
            <LunarPhasesButton onOpenCoffret={() => { setShowCoffret(true); setFunnelContext(prev => ({ ...prev, hasViewedLunar: true })); trackFeatureUse('lunar'); }} />
            
            <button 
              onClick={() => { setShowRunes(true); setFunnelContext(prev => ({ ...prev, hasUsedRunes: true })); trackFeatureUse('runes'); }} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-500/20 hover:text-violet-200 transition-colors shadow-lg shadow-violet-500/10"
            >
              <span className="text-base">ᚱ</span>
              Runes
            </button>
            
            <button 
              onClick={() => { setEmailType('summary'); setShowEmail(true); trackFeatureUse('email_recap'); }} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Mail className="w-4 h-4" />
              Récap
            </button>
            
            <button 
              onClick={() => { setShowReferral(true); trackFeatureUse('referral'); }} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Sparkles className="w-4 h-4" />
              Parrainage
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      {!showWelcome && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-cyan-500/20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={sendMessage} disabled={isLoading} placeholder="Pose ta question à Nyxia..." />
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden">
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white flex items-center gap-2"><History className="w-5 h-5 text-cyan-400" />Historique</h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400"><Clock className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">Aucune conversation sauvegardée</p></div>
              ) : (
                conversations.map((conv: any) => (
                  <button key={conv.id} onClick={() => loadConversation(conv)} className="w-full p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-left mb-1 transition-colors">
                    <div className="text-sm text-white truncate">{conv.preview}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>{new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}</span><span>•</span><span>{conv.messageCount} messages</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden">
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white flex items-center gap-2"><Settings className="w-5 h-5 text-cyan-400" />Paramètres</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span className="text-sm text-slate-200">Sons mystiques</span>
                </div>
                <button onClick={toggleSound} className={`w-10 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {reminderEnabled ? <Bell className="w-4 h-4 text-cyan-400" /> : <BellOff className="w-4 h-4 text-slate-400" />}
                  <span className="text-sm text-slate-200">Rappels quotidiens</span>
                </div>
                <button onClick={toggleReminders} className={`w-10 h-6 rounded-full transition-colors ${reminderEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reminderEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <button onClick={() => { setShowSettings(false); setShowReferral(true); }} className="w-full py-2 mb-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                  <Gift className="w-4 h-4" />Programme de Parrainage
                </button>
                <button onClick={() => { setShowSettings(false); setShowSubscription(true); }} className="w-full py-2 mb-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                  <MailPlus className="w-4 h-4" />S'abonner aux notifications email
                </button>
                <button onClick={handleGeneratePromo} className="w-full py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                  <Gift className="w-4 h-4" />Générer un nouveau code promo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CalendlyModal isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
      <StripeCheckout isOpen={showStripe} onClose={() => setShowStripe(false)} service={selectedService} promoCode={promo?.code} />
      <EmailModal isOpen={showEmail} onClose={() => setShowEmail(false)} type={emailType} data={{ messages: messages.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp.toISOString() })), promoCode: promo?.code || '', discount: promo?.discount || 15, dailyEnergy: dailyEnergy ? { number: dailyEnergy.number, title: dailyEnergy.title, description: dailyEnergy.description, advice: dailyEnergy.advice, luckyColor: dailyEnergy.luckyColor, luckyNumber: dailyEnergy.luckyNumber, crystal: dailyEnergy.crystal } : undefined }} />
      {showSubscription && <SubscriptionManager onClose={() => setShowSubscription(false)} />}
      <TarotReading isOpen={showTarot} onClose={() => setShowTarot(false)} onReadingComplete={(interpretation) => { const tarotMessage: Message = { id: `tarot-${Date.now()}`, role: 'assistant', content: interpretation, timestamp: new Date() }; setMessages(prev => [...prev, tarotMessage]); }} />
      <RuneReading isOpen={showRunes} onClose={() => setShowRunes(false)} onReadingComplete={(interpretation) => { const runeMessage: Message = { id: `rune-${Date.now()}`, role: 'assistant', content: interpretation, timestamp: new Date() }; setMessages(prev => [...prev, runeMessage]); }} />
      
      {showReferral && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 p-4 border-b border-cyan-500/20 flex items-center justify-between z-10">
              <h3 className="text-lg font-medium text-white">Programme de Parrainage</h3>
              <button onClick={() => setShowReferral(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <ReferralSystem userEmail={user?.email || undefined} onClose={() => setShowReferral(false)} />
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ProfileSidebar isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} />
      <CoffretModal isOpen={showCoffret} onClose={() => setShowCoffret(false)} />
      
      <FunnelSidebar
        isOpen={showFunnelSidebar}
        onClose={() => setShowFunnelSidebar(false)}
        userId={user?.id}
        context={funnelContext}
      />
    </div>
  );
}
