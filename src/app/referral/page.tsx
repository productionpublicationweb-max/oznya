'use client';

import { useState } from 'react';
import { ReferralSystem } from '@/components/ReferralSystem';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ReferralPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à Nyxia</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Programme de Parrainage
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {!submitted ? (
          <div className="bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden">
            <div className="p-6 text-center border-b border-cyan-500/20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎁</span>
              </div>
              <h1 className="text-xl font-semibold text-white mb-2">Programme de Parrainage</h1>
              <p className="text-sm text-slate-400">
                Invitez vos amis et gagnez des récompenses !
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Entrez votre email pour accéder à votre code de parrainage
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Accéder à mon espace
              </button>
            </form>

            <div className="px-6 pb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-white mb-3">Comment ça fonctionne ?</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                    <span>Partagez votre lien unique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                    <span>Vos amis reçoivent <strong className="text-white">15% de réduction</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                    <span>Vous gagnez <strong className="text-white">10 crédits</strong> par parrainage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-cyan-500/20 overflow-hidden">
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Mon espace parrainage</h2>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Changer d'email
              </button>
            </div>
            <ReferralSystem userEmail={email} />
          </div>
        )}
      </main>
    </div>
  );
}
