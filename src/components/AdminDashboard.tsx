'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Gift, TrendingUp, Award, Activity, 
  RefreshCw, ChevronDown, ChevronUp, Mail,
  Calendar, CreditCard, BarChart3, Sparkles, Lock, Eye, EyeOff, Download
} from 'lucide-react';

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
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

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
          <div className="flex gap-2">
            <button
              onClick={async () => {
                setExporting(true);
                try {
                  const res = await fetch('/api/admin/export-users', {
                    headers: { 'Authorization': `Bearer ${adminKey}` }
                  });
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `nyxia-users-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                } catch (err) {
                  console.error('Export error:', err);
                }
                setExporting(false);
              }}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Export...' : 'Export CSV'}
            </button>
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

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
