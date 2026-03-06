'use client';

import { useState, useEffect } from 'react';
import { 
  X, User, Mail, LogOut, Gift, MessageSquare, Send, Inbox, RefreshCw,
  Sparkles, Calendar, Star, Zap, Heart, Moon, Sun, ChevronRight,
  Copy, Check, Edit3, Save, Crown, Compass, Target,
  Shield, Eye, Brain, Waves, Wind, Flame, Leaf, BookOpen, Award, Trophy,
  ChevronLeft, Settings
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { calculateMiniHumanDesign, HumanDesignProfile } from '@/lib/humanDesign';
import { calculateLifePath, getLifePathInterpretation, calculateDayNumber, getDayEnergyInterpretation, getFormattedDate } from '@/lib/numerology';
import { DesignHumain } from './DesignHumain';
import { GamificationSystem } from './GamificationSystem';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  isFromAdmin: boolean;
  createdAt: string;
  sender?: { email: string; name: string | null } | null;
}

interface UserData {
  referralCode?: string;
  credits?: number;
  totalReferrals?: number;
  birthDate?: string;
}

// Types de Design Humain avec icônes, couleurs et descriptions enrichies
const HD_TYPES: Record<string, { 
  icon: React.ComponentType<{ className?: string }>; 
  color: string; 
  bg: string;
  signature: string;
  theme: string;
}> = {
  'Manifesteur': { 
    icon: Flame, 
    color: 'text-red-400', 
    bg: 'bg-red-500/20 border-red-500/30',
    signature: 'La Paix',
    theme: 'Initiateur puissant, vous êtes conçu pour déclencher et inspirer.'
  },
  'Générateur': { 
    icon: Sun, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/20 border-amber-500/30',
    signature: 'La Satisfaction',
    theme: 'Réservoir d\'énergie vitale, vous thrivez dans ce qui vous passionne.'
  },
  'Générateur Manifesteur': { 
    icon: Zap, 
    color: 'text-orange-400', 
    bg: 'bg-orange-500/20 border-orange-500/30',
    signature: 'La Satisfaction & La Paix',
    theme: 'Hybride dynamique, vous visualisez et agissez avec intensité.'
  },
  'Projecteur': { 
    icon: Eye, 
    color: 'text-violet-400', 
    bg: 'bg-violet-500/20 border-violet-500/30',
    signature: 'Le Succès',
    theme: 'Guide naturel, votre sagesse éclaire ceux qui vous invitent.'
  },
  'Reflecteur': { 
    icon: Moon, 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-500/20 border-cyan-500/30',
    signature: 'La Surprise',
    theme: 'Miroir de l\'humanité, vous reflétez l\'environnement autour de vous.'
  }
};

// Interprétations des nombres maîtres enrichies
const LIFE_PATH_DETAILS: Record<number, { title: string; subtitle: string; traits: string[] }> = {
  1: { title: 'Le Pionnier', subtitle: 'Leader et initiateur', traits: ['Indépendance', 'Innovation', 'Courage', 'Détermination'] },
  2: { title: 'Le Médiateur', subtitle: 'Harmonie et coopération', traits: ['Diplomatie', 'Intuition', 'Patience', 'Sensibilité'] },
  3: { title: 'L\'Expression', subtitle: 'Créativité et communication', traits: ['Art', 'Communication', 'Joie', 'Inspiration'] },
  4: { title: 'Le Bâtisseur', subtitle: 'Structure et fondation', traits: ['Organisation', 'Travail', 'Stabilité', 'Méthode'] },
  5: { title: 'L\'Explorateur', subtitle: 'Liberté et aventure', traits: ['Changement', 'Voyage', 'Adaptabilité', 'Curiosité'] },
  6: { title: 'Le Nourricier', subtitle: 'Amour et responsabilité', traits: ['Famille', 'Guérison', 'Harmonie', 'Protection'] },
  7: { title: 'Le Sage', subtitle: 'Sagesse et introspection', traits: ['Spiritualité', 'Analyse', 'Mystère', 'Recherche'] },
  8: { title: 'Le Maître', subtitle: 'Pouvoir et abondance', traits: ['Ambition', 'Autorité', 'Matérialité', 'Vision'] },
  9: { title: 'L\'Humanitaire', subtitle: 'Compassion universelle', traits: ['Sagesse', 'Générosité', 'Idéalisme', 'Complétion'] },
  11: { title: 'L\'Illuminateur', subtitle: 'Nombre Maître - Vision spirituelle', traits: ['Intuition', 'Inspiration', 'Réalisation', 'Éveil'] },
  22: { title: 'Le Maître Bâtisseur', subtitle: 'Nombre Maître - Vision matérialisée', traits: ['Vision', 'Réalisation', 'Héritage', 'Maîtrise'] },
  33: { title: 'Le Maître Enseignant', subtitle: 'Nombre Maître - Amour universel', traits: ['Guérison', 'Enseignement', 'Dévouement', 'Sagesse'] }
};

// Badges de gamification
const BADGES = [
  { id: 'premier_pas', name: 'Premier Pas', emoji: '🌟', gradient: 'from-cyan-400 to-blue-500', description: 'Première connexion', threshold: 1 },
  { id: 'curieux', name: 'Curieux', emoji: '🔮', gradient: 'from-violet-400 to-purple-500', description: '5 conversations', threshold: 5 },
  { id: 'explorateur', name: 'Explorateur', emoji: '🌙', gradient: 'from-indigo-400 to-violet-500', description: '10 conversations', threshold: 10 },
  { id: 'passionne', name: 'Passionné', emoji: '✨', gradient: 'from-pink-400 to-rose-500', description: '25 conversations', threshold: 25 },
  { id: 'initie', name: 'Initié', emoji: '💫', gradient: 'from-amber-400 to-orange-500', description: '50 conversations', threshold: 50 },
  { id: 'maitre', name: 'Maître', emoji: '👑', gradient: 'from-yellow-400 to-amber-500', description: '100 conversations', threshold: 100 }
];

export function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'messages' | 'new'>('profile');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // User data
  const [userData, setUserData] = useState<UserData>({});
  const [userDataLoading, setUserDataLoading] = useState(true);
  
  // Birth date
  const [birthDate, setBirthDate] = useState('');
  const [showBirthDateForm, setShowBirthDateForm] = useState(false);
  const [savingBirthDate, setSavingBirthDate] = useState(false);
  
  // Calculated values
  const [humanDesign, setHumanDesign] = useState<HumanDesignProfile | null>(null);
  const [lifePath, setLifePath] = useState<number | null>(null);
  const [dayEnergy, setDayEnergy] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState<{ formatted: string; weekday: string } | null>(null);
  
  // Message form
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState('NORMAL');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // Gamification
  const [conversationCount, setConversationCount] = useState(0);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchUserData();
      // Utiliser le timezone Paris
      const dateInfo = getFormattedDate();
      setCurrentDate(dateInfo);
      setDayEnergy(calculateDayNumber());
      
      const storedBirthDate = localStorage.getItem(`nyxia_birthdate_${user.id}`);
      if (storedBirthDate) {
        setBirthDate(storedBirthDate);
      }
      
      // Load conversation count for badges
      const storedCount = localStorage.getItem(`nyxia_conversation_count_${user.id}`);
      if (storedCount) {
        setConversationCount(parseInt(storedCount, 10));
      } else {
        // Initialize with 1 for first login (Premier Pas badge)
        localStorage.setItem(`nyxia_conversation_count_${user.id}`, '1');
        setConversationCount(1);
      }
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (activeTab === 'messages' && user?.id) {
      fetchMessages();
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (birthDate) {
      // Fix timezone: add noon time to avoid UTC midnight offset
      const date = new Date(birthDate + 'T12:00:00');
      if (!isNaN(date.getTime())) {
        setHumanDesign(calculateMiniHumanDesign(date));
        setLifePath(calculateLifePath(date));
      }
    }
  }, [birthDate]);

  const fetchUserData = async () => {
    if (!user?.id) return;
    setUserDataLoading(true);
    try {
      const res = await fetch(`/api/messages?userId=${user.id}&userData=true`);
      const data = await res.json();
      if (data.userData) {
        setUserData(data.userData);
      }
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setUserDataLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveBirthDate = async () => {
    if (!birthDate || !user?.id) return;
    setSavingBirthDate(true);
    try {
      localStorage.setItem(`nyxia_birthdate_${user.id}`, birthDate);
      setShowBirthDateForm(false);
      setUserData(prev => ({ ...prev, birthDate }));
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    } finally {
      setSavingBirthDate(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const copyReferralCode = async () => {
    if (userData.referralCode) {
      await navigator.clipboard.writeText(userData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendMessage = async () => {
    if (!newContent.trim() || newContent.length < 5) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          subject: newSubject || 'Message sans sujet',
          content: newContent.trim(),
          priority: newPriority
        })
      });
      const data = await res.json();
      if (data.success) {
        setSendSuccess(true);
        setNewSubject('');
        setNewContent('');
        setTimeout(() => {
          setSendSuccess(false);
          setActiveTab('messages');
        }, 1500);
      }
    } catch (err) {
      console.error('Erreur envoi:', err);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hdTypeInfo = humanDesign ? HD_TYPES[humanDesign.type] : null;
  const lifePathInfo = lifePath ? LIFE_PATH_DETAILS[lifePath] : null;

  return (
    <>
      {/* Overlay sombre */}
      <div 
        className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 z-[201] h-full w-full sm:w-[420px] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.99) 0%, rgba(2, 6, 23, 1) 100%)'
        }}
      >
        {/* Bordure gauche lumineuse */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/50 to-pink-500/50" />
        
        {/* Header */}
        <div className="relative p-5 border-b border-cyan-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-cyan-500/5" />
          <div className="absolute top-0 left-0 w-64 h-32 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-3xl opacity-30" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                    <User className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{user?.name || 'Explorateur'}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {user?.email}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50 bg-slate-900/30">
          <button
            onClick={() => setActiveTab('profile')}
            className={`relative flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mon Univers
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'messages' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Messages
            {messages.filter(m => !m.isRead).length > 0 && (
              <span className="absolute top-2 right-4 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
            {activeTab === 'messages' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`relative flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'new' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            Contacter
            {activeTab === 'new' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />
            )}
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 h-[calc(100vh-180px)] overflow-y-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              
              {/* Date de naissance - Compact */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/20">
                    <Calendar className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date de naissance</p>
                    {showBirthDateForm ? (
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="text-sm text-white bg-transparent border-none focus:outline-none"
                      />
                    ) : birthDate ? (
                      <p className="text-sm text-white">{new Date(birthDate + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">Non renseignée</p>
                    )}
                  </div>
                </div>
                {showBirthDateForm ? (
                  <div className="flex gap-2">
                    <button onClick={() => setShowBirthDateForm(false)} className="p-1.5 rounded-lg bg-slate-700 text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                    <button onClick={saveBirthDate} disabled={savingBirthDate || !birthDate} className="p-1.5 rounded-lg bg-violet-500 text-white">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowBirthDateForm(true)} className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Design Humain avec Bodygraph SVG */}
              <DesignHumain birthDate={birthDate} onEditProfile={() => setShowBirthDateForm(true)} />

              {/* Numérologie - TOUJOURS AFFICHÉ */}
              <div className="relative p-5 rounded-2xl overflow-hidden border border-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                      <Moon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Numérologie</h4>
                      <p className="text-xs text-slate-400">Votre chemin de vie spirituel</p>
                    </div>
                    {lifePath && (
                      <div className="ml-auto px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <span className="text-xs text-green-400">✓ Calculé</span>
                      </div>
                    )}
                  </div>
                  
                  {lifePath && lifePathInfo ? (
                    <div className="space-y-4">
                      {/* Nombre principal */}
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                            <span className="text-3xl font-bold text-white">{lifePath}</span>
                          </div>
                          {[11, 22, 33].includes(lifePath) && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Chemin de Vie</p>
                          <p className="text-xl text-white font-semibold">{lifePathInfo.title}</p>
                          <p className="text-sm text-cyan-400">{lifePathInfo.subtitle}</p>
                        </div>
                      </div>

                      {/* Traits */}
                      <div className="flex flex-wrap gap-2">
                        {lifePathInfo.traits.map((trait) => (
                          <span key={trait} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
                            {trait}
                          </span>
                        ))}
                      </div>

                      {/* Interprétation */}
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {getLifePathInterpretation(lifePath)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Aperçu des chemins de vie */}
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <div key={num} className="p-2 rounded-xl bg-slate-800/30 border border-slate-700/20 text-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center mx-auto mb-1">
                              <span className="text-cyan-400 font-bold text-sm">{num}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 truncate">{LIFE_PATH_DETAILS[num].title}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                        <div className="flex gap-1">
                          {[11, 22, 33].map((num) => (
                            <div key={num} className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-500/30 flex items-center justify-center">
                              <span className="text-amber-400 font-bold text-xs">{num}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-amber-300">Nombres Maîtres</p>
                      </div>
                      <div className="text-center py-3 rounded-xl bg-slate-800/20 border border-dashed border-slate-600/30">
                        <p className="text-slate-400 text-sm">Ajoutez votre date de naissance pour découvrir votre chemin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Énergie du Jour */}
              {dayEnergy && currentDate && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/20">
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 capitalize">{currentDate.weekday} • {currentDate.formatted}</p>
                        <p className="text-white font-medium">Énergie du jour : Nombre {dayEnergy}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{dayEnergy}</span>
                    </div>
                  </div>
                  <p className="text-sm text-yellow-200/80 mt-2">{getDayEnergyInterpretation(dayEnergy)}</p>
                </div>
              )}

              {/* Parrainage et Crédits */}
              <div className="grid grid-cols-2 gap-3">
                {userData.referralCode && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/5 to-rose-500/5 border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-pink-400" />
                      <span className="text-xs text-slate-400">Code parrainage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-base text-white font-mono font-semibold">{userData.referralCode}</code>
                      <button onClick={copyReferralCode} className="p-1 rounded bg-pink-500/10 hover:bg-pink-500/20">
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-pink-400" />}
                      </button>
                    </div>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">Crédits</span>
                  </div>
                  <p className="text-xl font-bold text-white">{userData.credits || 0}</p>
                </div>
              </div>

              {/* Badges Gamification */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-white">Tes Badges</span>
                  <span className="ml-auto text-xs text-slate-400">{conversationCount} conversations</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BADGES.map((badge) => {
                    const isEarned = conversationCount >= badge.threshold;
                    const isNext = !isEarned && BADGES.findIndex(b => conversationCount < b.threshold) === BADGES.indexOf(badge);
                    return (
                      <div 
                        key={badge.id}
                        className={`relative p-2 rounded-lg text-center transition-all ${
                          isEarned 
                            ? `bg-gradient-to-br ${badge.gradient} bg-opacity-20` 
                            : isNext
                              ? 'bg-slate-700/30 border border-dashed border-slate-600'
                              : 'bg-slate-800/30 opacity-40'
                        }`}
                        title={badge.description}
                      >
                        <div className={`text-2xl mb-1 ${isEarned ? '' : 'grayscale'}`}>
                          {badge.emoji}
                        </div>
                        <p className={`text-[10px] font-medium truncate ${
                          isEarned ? 'text-white' : 'text-slate-500'
                        }`}>
                          {badge.name}
                        </p>
                        {!isEarned && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-slate-900/80 flex items-center justify-center">
                              <span className="text-[8px] text-slate-400">🔒</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Système de Gamification avec points de fidélité */}
              <GamificationSystem 
                userId={user?.id || ''} 
                conversationCount={conversationCount}
                onReward={(reward) => {
                  console.log('Récompense obtenue:', reward);
                  // Ici on pourrait créditer les points sur le serveur
                }}
              />

              {/* Déconnexion */}
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-400">Messages de l'équipe de Diane Boyer</p>
                <button onClick={fetchMessages} className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-slate-500">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-cyan-400" />
                  <p className="mt-3 text-sm">Chargement...</p>
                </div>
              ) : selectedMessage ? (
                <div className="space-y-3">
                  <button onClick={() => setSelectedMessage(null)} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    ← Retour aux messages
                  </button>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
                    <h4 className="font-medium text-white text-lg">{selectedMessage.subject}</h4>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(selectedMessage.createdAt)}</p>
                    <p className="text-slate-300 mt-4 whitespace-pre-wrap leading-relaxed">{selectedMessage.content}</p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('new'); setNewSubject(`Re: ${selectedMessage.subject}`); setSelectedMessage(null); }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-400 text-sm hover:from-cyan-500/30 hover:to-violet-500/30 transition-all"
                  >
                    Répondre à ce message
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Inbox className="w-16 h-16 mx-auto opacity-20 mb-4" />
                  <p className="font-medium text-slate-300">Aucun message</p>
                  <p className="text-sm mt-1">Les messages de Diane Boyer apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        msg.isRead 
                          ? 'bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/20' 
                          : 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/30 hover:from-cyan-500/15 hover:to-violet-500/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!msg.isRead && <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full mt-1.5 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{msg.subject}</p>
                          <p className="text-sm text-slate-400 truncate mt-1">{msg.content}</p>
                          <p className="text-xs text-slate-500 mt-2">{formatDate(msg.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* New Message Tab */}
          {activeTab === 'new' && (
            <div className="space-y-4">
              {sendSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <Send className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-green-400 font-semibold text-lg">Message envoyé !</p>
                  <p className="text-sm text-slate-400 mt-2">Nous vous répondrons rapidement.</p>
                </div>
              ) : (
                <>
                  <div className="text-center py-3">
                    <p className="text-slate-300">Une question ? Besoin d'aide ?</p>
                    <p className="text-sm text-slate-400 mt-1">Diane Boyer et Nyxia sont là pour vous accompagner</p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Sujet</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Priorité</label>
                    <div className="flex gap-2">
                      {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            newPriority === p
                              ? p === 'URGENT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                p === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                p === 'LOW' ? 'bg-slate-600/20 text-slate-400 border border-slate-500/30' :
                                'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/30'
                          }`}
                        >
                          {p === 'LOW' ? 'Basse' : p === 'NORMAL' ? 'Normale' : p === 'HIGH' ? 'Haute' : 'Urgente'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Message *</label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Décrivez votre question en détail..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={sending || !newContent.trim() || newContent.length < 5}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
                  >
                    {sending ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer mon message
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
