'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Gift, TrendingUp, Award, Activity, 
  RefreshCw, ChevronDown, ChevronUp, Mail,
  Calendar, CreditCard, BarChart3, Sparkles, Lock, Eye, EyeOff,
  MessageSquare, Send, Inbox, Check, X, Clock, AlertCircle, Search, Download,
  ShoppingBag
} from 'lucide-react';
import { FunnelAnalytics } from './FunnelAnalytics';

interface Stats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  referrals: {
    total: number;
    pending: number;
    completed: number;
    conversionRate: number;
  };
  rewards: {
    total: number;
    unused: number;
  };
}

interface RecentUser {
  id: string;
  email: string;
  name: string | null;
  referralCode: string;
  totalReferrals: number;
  credits: number;
  createdAt: string;
}

interface RecentReferral {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  referrer: { email: string; name: string | null };
  referred: { email: string; name: string | null };
}

interface TopReferrer {
  email: string;
  name: string | null;
  referralCode: string;
  totalReferrals: number;
  credits: number;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  isFromAdmin: boolean;
  priority: string;
  createdAt: string;
  readAt: string | null;
  sender: { id: string; email: string; name: string | null } | null;
  receiver: { id: string; email: string; name: string | null } | null;
}

type TabType = 'dashboard' | 'messages' | 'funnel';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentReferrals, setRecentReferrals] = useState<RecentReferral[]>([]);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('users');
  
  // Messages state
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageType, setMessageType] = useState<string>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyContent, setReplyContent] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  
  // New message compose state
  const [showCompose, setShowCompose] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composePriority, setComposePriority] = useState('NORMAL');
  const [composeRecipient, setComposeRecipient] = useState<string>('all'); // 'all' or user ID
  const [sendingCompose, setSendingCompose] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'messages') {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab, messageType]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/statistics', {
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });
      const json = await res.json();
      
      if (json.success) {
        setIsAuthenticated(true);
        setStats(json.stats);
        setRecentUsers(json.recentUsers);
        setRecentReferrals(json.recentReferrals);
        setTopReferrers(json.topReferrers);
      } else {
        setAuthError(json.error || 'Clé invalide');
      }
    } catch (err) {
      setAuthError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/statistics', {
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });
      const json = await res.json();
      
      if (json.success) {
        setStats(json.stats);
        setRecentUsers(json.recentUsers);
        setRecentReferrals(json.recentReferrals);
        setTopReferrers(json.topReferrers);
      } else {
        setError(json.error || 'Erreur de chargement');
        if (json.error === 'Non autorisé') {
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      setError('Impossible de charger les statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?type=${messageType}`, {
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });
      const json = await res.json();
      
      if (json.success) {
        setMessages(json.messages);
        setUnreadCount(json.unreadCount);
      }
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({ messageId, isRead: true })
      });
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, isRead: true } : m
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur marquer comme lu:', err);
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;
    
    setSendingReply(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({
          receiverId: selectedMessage.sender?.id,
          subject: replySubject || `Re: ${selectedMessage.subject}`,
          content: replyContent,
          parentId: selectedMessage.id
        })
      });
      
      if (res.ok) {
        setReplyContent('');
        setReplySubject('');
        alert('Réponse envoyée !');
      }
    } catch (err) {
      console.error('Erreur envoi réponse:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    
    try {
      await fetch(`/api/admin/messages?id=${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setSelectedMessage(null);
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const sendComposeMessage = async () => {
    if (!composeSubject.trim() || !composeContent.trim()) return;
    
    setSendingCompose(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({
          receiverId: composeRecipient === 'all' ? null : composeRecipient,
          subject: composeSubject,
          content: composeContent,
          priority: composePriority
        })
      });
      
      if (res.ok) {
        setComposeSubject('');
        setComposeContent('');
        setComposePriority('NORMAL');
        setComposeRecipient('all');
        setShowCompose(false);
        alert(composeRecipient === 'all' ? 'Message broadcast envoyé à tous les utilisateurs !' : 'Message envoyé !');
        fetchMessages();
      }
    } catch (err) {
      console.error('Erreur envoi message:', err);
    } finally {
      setSendingCompose(false);
    }
  };

  // Export users to CSV
  const exportUsersToCSV = () => {
    if (recentUsers.length === 0) {
      alert('Aucun utilisateur à exporter');
      return;
    }

    // Create CSV content
    const headers = ['Email', 'Nom', 'Code Parrainage', 'Parrainages', 'Crédits', 'Date Inscription'];
    const rows = recentUsers.map(user => [
      user.email,
      user.name || '',
      user.referralCode,
      user.totalReferrals.toString(),
      user.credits.toString(),
      new Date(user.createdAt).toLocaleDateString('fr-FR')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nyxia_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm mt-2">Nyxia - Connexion sécurisée</p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Clé secrète admin"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {authError && (
                <p className="text-red-400 text-sm text-center">{authError}</p>
              )}
              
              <button
                type="submit"
                disabled={loading || !adminKey}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            
            <p className="text-slate-600 text-xs text-center mt-6">
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-800 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-slate-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Dashboard Admin
            </h1>
            <p className="text-slate-400 text-sm mt-1">Nyxia - Tableau de bord</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Tab Navigation */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  activeTab === 'messages' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('funnel')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'funnel' 
                    ? 'bg-violet-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Funnel
              </button>
            </div>
            <button
              onClick={activeTab === 'messages' ? fetchMessages : fetchStats}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
            {activeTab === 'dashboard' && (
              <button
                onClick={exportUsersToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Message Type Filter + Compose Button */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setMessageType('inbox'); setShowCompose(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    messageType === 'inbox' && !showCompose
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  Boîte de réception
                </button>
                <button
                  onClick={() => { setMessageType('unread'); setShowCompose(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    messageType === 'unread' && !showCompose
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Non lus ({unreadCount})
                </button>
                <button
                  onClick={() => { setMessageType('sent'); setShowCompose(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    messageType === 'sent' && !showCompose
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Envoyés
                </button>
              </div>
              <button
                onClick={() => setShowCompose(!showCompose)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  showCompose
                    ? 'bg-violet-500 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:opacity-90'
                }`}
              >
                <Send className="w-4 h-4" />
                Nouveau Message
              </button>
            </div>

            {/* Compose New Message Form */}
            {showCompose && (
              <div className="bg-slate-900 rounded-xl border border-violet-500/30 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-violet-500/10">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-violet-400" />
                    Rédiger un nouveau message
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Envoyez un message à un utilisateur ou à tous les utilisateurs
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Recipient Selection */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Destinataire</label>
                    <select
                      value={composeRecipient}
                      onChange={(e) => setComposeRecipient(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="all">📢 Tous les utilisateurs (Broadcast)</option>
                      {recentUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          👤 {user.name || user.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Sujet *</label>
                    <input
                      type="text"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder="Objet du message..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Priorité</label>
                    <div className="flex gap-2">
                      {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setComposePriority(p)}
                          className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                            composePriority === p
                              ? p === 'URGENT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                p === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                p === 'LOW' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                                'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {p === 'LOW' ? 'Basse' : p === 'NORMAL' ? 'Normale' : p === 'HIGH' ? 'Haute' : 'Urgente'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Message *</label>
                    <textarea
                      value={composeContent}
                      onChange={(e) => setComposeContent(e.target.value)}
                      placeholder="Contenu de votre message..."
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">{composeContent.length} caractères</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowCompose(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={sendComposeMessage}
                      disabled={sendingCompose || !composeSubject.trim() || !composeContent.trim()}
                      className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {sendingCompose ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {composeRecipient === 'all' ? 'Envoyer à tous' : 'Envoyer'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages List and Detail */}
            {!showCompose && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Messages List */}
              <div className="lg:col-span-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden max-h-[600px] overflow-y-auto">
                <div className="p-3 border-b border-slate-800">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Rechercher par email..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                
                {messagesLoading ? (
                  <div className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 mx-auto animate-spin" />
                    <p className="mt-2">Chargement...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Inbox className="w-12 h-12 mx-auto opacity-30" />
                    <p className="mt-2">Aucun message</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {messages
                      .filter(m => !searchEmail || 
                        m.sender?.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
                        m.receiver?.email?.toLowerCase().includes(searchEmail.toLowerCase())
                      )
                      .map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.isRead && !msg.isFromAdmin) {
                            markAsRead(msg.id);
                          }
                        }}
                        className={`w-full p-4 text-left hover:bg-slate-800/50 transition-colors ${
                          selectedMessage?.id === msg.id ? 'bg-slate-800/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!msg.isRead && !msg.isFromAdmin && (
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                          )}
                          {msg.isRead && !msg.isFromAdmin && (
                            <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                          )}
                          {msg.isFromAdmin && (
                            <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-white truncate">
                                {msg.isFromAdmin 
                                  ? `→ ${msg.receiver?.email || 'Broadcast'}` 
                                  : msg.sender?.email || 'Anonyme'}
                              </p>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                msg.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' :
                                msg.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-slate-700 text-slate-400'
                              }`}>
                                {msg.priority}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 truncate mt-1">{msg.subject}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                {selectedMessage ? (
                  <div className="h-full flex flex-col">
                    {/* Message Header */}
                    <div className="p-4 border-b border-slate-800">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{selectedMessage.subject}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            <span>
                              {selectedMessage.isFromAdmin 
                                ? `De: Admin → ${selectedMessage.receiver?.email || 'Tous'}`
                                : `De: ${selectedMessage.sender?.email || 'Anonyme'}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(selectedMessage.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!selectedMessage.isFromAdmin && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              selectedMessage.isRead 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {selectedMessage.isRead ? 'Lu' : 'Non lu'}
                            </span>
                          )}
                          <button
                            onClick={() => deleteMessage(selectedMessage.id)}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <p className="text-slate-300 whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                    
                    {/* Reply Section */}
                    {!selectedMessage.isFromAdmin && selectedMessage.sender && (
                      <div className="p-4 border-t border-slate-800 bg-slate-800/30">
                        <h4 className="text-sm font-medium text-white mb-2">Répondre</h4>
                        <input
                          type="text"
                          placeholder="Sujet (optionnel)"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 mb-2"
                        />
                        <textarea
                          placeholder="Votre réponse..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={sendReply}
                            disabled={sendingReply || !replyContent.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sendingReply ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Envoi...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Envoyer
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="text-center text-slate-500">
                      <MessageSquare className="w-16 h-16 mx-auto opacity-30" />
                      <p className="mt-4">Sélectionnez un message</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Utilisateurs"
                value={stats?.users.total || 0}
                subLabel={`+${stats?.users.newToday || 0} aujourd'hui`}
                color="cyan"
              />
              <StatCard
                icon={<Gift className="w-5 h-5" />}
                label="Parrainages"
                value={stats?.referrals.total || 0}
                subLabel={`${stats?.referrals.conversionRate || 0}% convertis`}
                color="violet"
              />
              <StatCard
                icon={<Award className="w-5 h-5" />}
                label="Récompenses"
                value={stats?.rewards.unused || 0}
                subLabel="en attente"
                color="amber"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Ce mois"
                value={stats?.users.newThisMonth || 0}
                subLabel="nouveaux users"
                color="green"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Users Section */}
              <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('users')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Utilisateurs récents
                  </h2>
                  {expandedSection === 'users' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                
                {expandedSection === 'users' && (
                  <div className="border-t border-slate-800">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-800/50">
                          <tr className="text-left text-xs text-slate-400 uppercase">
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Parrainages</th>
                            <th className="px-4 py-3">Crédits</th>
                            <th className="px-4 py-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {recentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-800/30">
                              <td className="px-4 py-3 text-sm text-slate-300">{user.email}</td>
                              <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{user.referralCode}</td>
                              <td className="px-4 py-3 text-sm text-slate-300">{user.totalReferrals}</td>
                              <td className="px-4 py-3 text-sm text-amber-400">{user.credits}</td>
                              <td className="px-4 py-3 text-xs text-slate-500">{formatDate(user.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Referrers */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Top Parrains
                  </h2>
                </div>
                <div className="divide-y divide-slate-800">
                  {topReferrers.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">
                      Aucun parrainage encore
                    </div>
                  ) : (
                    topReferrers.map((user, index) => (
                      <div key={user.referralCode} className="p-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-amber-500 text-amber-950' :
                          index === 1 ? 'bg-slate-400 text-slate-900' :
                          index === 2 ? 'bg-amber-700 text-amber-100' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{user.name || user.email}</p>
                          <p className="text-xs text-slate-500">{user.totalReferrals} parrainages</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-amber-400">{user.credits} crédits</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Referrals Section */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => toggleSection('referrals')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-violet-400" />
                  Parrainages récents
                </h2>
                {expandedSection === 'referrals' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              
              {expandedSection === 'referrals' && (
                <div className="border-t border-slate-800 overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr className="text-left text-xs text-slate-400 uppercase">
                        <th className="px-4 py-3">Parrain</th>
                        <th className="px-4 py-3">Filleul</th>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {recentReferrals.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-800/30">
                          <td className="px-4 py-3 text-sm text-slate-300">{ref.referrer.name || ref.referrer.email}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{ref.referred.name || ref.referred.email}</td>
                          <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{ref.code}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              ref.status === 'REWARDED' ? 'bg-green-500/20 text-green-400' :
                              ref.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {ref.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{formatDate(ref.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Funnel Analytics Tab */}
        {activeTab === 'funnel' && (
          <FunnelAnalytics />
        )}

      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon, 
  label, 
  value, 
  subLabel, 
  color 
}: { 
  icon: React.ReactNode;
  label: string;
  value: number;
  subLabel: string;
  color: 'cyan' | 'violet' | 'amber' | 'green';
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400'
  };

  return (
    <div className={`bg-gradient-to-b ${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subLabel}</p>
    </div>
  );
}

// Quick stats bar for embedding
export function QuickStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(json => json.success && setStats(json.stats))
      .catch(console.error);
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className="bg-slate-800/50 rounded-lg p-2">
        <p className="text-lg font-bold text-cyan-400">{stats.users.total}</p>
        <p className="text-xs text-slate-500">Users</p>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-2">
        <p className="text-lg font-bold text-violet-400">{stats.referrals.total}</p>
        <p className="text-xs text-slate-500">Referrals</p>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-2">
        <p className="text-lg font-bold text-amber-400">{stats.rewards.unused}</p>
        <p className="text-xs text-slate-500">Rewards</p>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-2">
        <p className="text-lg font-bold text-green-400">{stats.referrals.conversionRate}%</p>
        <p className="text-xs text-slate-500">Conv.</p>
      </div>
    </div>
  );
}
