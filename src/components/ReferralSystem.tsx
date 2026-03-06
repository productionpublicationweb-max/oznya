'use client';

import { useState, useEffect } from 'react';
import { 
  Gift, Users, Copy, Check, Share2, Mail, 
  Facebook, Twitter, Sparkles, Award, TrendingUp
} from 'lucide-react';

interface ReferralData {
  referralCode: string;
  credits: number;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  availableRewards: number;
  referredUsers: Array<{
    name: string | null;
    email: string;
    status: string;
    createdAt: string;
  }>;
}

interface ReferralSystemProps {
  userEmail?: string;
  onClose?: () => void;
}

export function ReferralSystem({ userEmail, onClose }: ReferralSystemProps) {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const referralLink = data 
    ? `https://nyxia.oznya.com?ref=${data.referralCode}` 
    : '';

  useEffect(() => {
    if (userEmail) {
      fetchReferralData(userEmail);
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchReferralData = async (email: string) => {
    try {
      const res = await fetch(`/api/referrals?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (json.success) {
        setData(json.user);
      }
    } catch (error) {
      console.error('Erreur chargement parrainage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEmail = async () => {
    if (!inputEmail || !inputEmail.includes('@')) return;
    setSubmitting(true);
    
    try {
      // Create or get user with this email
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail })
      });
      const json = await res.json();
      
      if (json.success) {
        // Now fetch the referral data
        await fetchReferralData(inputEmail);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent('Découvre Nyxia, ton assistante mystique ! Utilise mon code pour 15% de réduction 💫')}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Découvre Nyxia, ton assistante mystique ! Utilise mon code pour 15% de réduction 💫')}&url=${encodeURIComponent(referralLink)}`,
    email: `mailto:?subject=${encodeURIComponent('Invitation Nyxia - Assistante Mystique')}&body=${encodeURIComponent(`Découvre Nyxia, l\'assistante mystique de Diane Boyer !\n\nUtilise mon lien pour obtenir 15% de réduction sur ta première consultation :\n${referralLink}\n\nCode: ${data?.referralCode}`)}`
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-400">Chargement du programme de parrainage...</p>
      </div>
    );
  }

  if (!userEmail && !data) {
    return (
      <div className="p-8 text-center space-y-4">
        <Gift className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Programme de Parrainage</h3>
        <p className="text-slate-400 text-sm mb-4">
          Entrez votre email pour accéder à votre code de parrainage et gagner des récompenses !
        </p>
        <div className="flex gap-2 max-w-xs mx-auto">
          <input
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSubmitEmail}
            disabled={submitting || !inputEmail.includes('@')}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 disabled:opacity-50"
          >
            {submitting ? '...' : 'OK'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-1">Programme de Parrainage</h2>
        <p className="text-slate-400 text-sm">Invitez vos amis et gagnez des récompenses !</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Parrainages</span>
          </div>
          <p className="text-2xl font-bold text-white">{data?.totalReferrals || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-slate-400">Crédits</span>
          </div>
          <p className="text-2xl font-bold text-white">{data?.credits || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">Complétés</span>
          </div>
          <p className="text-2xl font-bold text-white">{data?.completedReferrals || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Récompenses</span>
          </div>
          <p className="text-2xl font-bold text-white">{data?.availableRewards || 0}%</p>
        </div>
      </div>

      {/* Code Section */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-violet-900/30 rounded-xl p-4 border border-cyan-500/30">
        <p className="text-xs text-slate-400 mb-2 text-center">Votre code de parrainage</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent tracking-wider">
            {data?.referralCode}
          </span>
        </div>
      </div>

      {/* Link Copy */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400">Lien de parrainage</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 truncate"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              copied 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié!' : 'Copier'}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => setShowShare(!showShare)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Partager
        </button>
        
        {showShare && (
          <div className="flex gap-2 justify-center">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={shareLinks.email}
              className="p-3 rounded-lg bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>

      {/* Rewards Info */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Comment ça fonctionne ?
        </h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
            <span>Partagez votre lien unique avec vos amis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
            <span>Ils reçoivent <strong className="text-white">15% de réduction</strong> sur leur première consultation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
            <span>Vous gagnez <strong className="text-white">10 crédits</strong> pour chaque parrainage complété</span>
          </li>
        </ul>
      </div>

      {/* Recent Referrals */}
      {data?.referredUsers && data.referredUsers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Vos filleuls récents</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.referredUsers.slice(0, 5).map((user, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-sm text-white">{user.name || 'Anonyme'}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                  user.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {user.status === 'COMPLETED' ? 'Complété' : 
                   user.status === 'PENDING' ? 'En attente' : user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Quick access button
export function ReferralButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-violet-500/30 transition-all text-sm"
    >
      <Gift className="w-4 h-4" />
      <span>Parrainage</span>
    </button>
  );
}
