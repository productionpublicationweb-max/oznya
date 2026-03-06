'use client';

import { useState } from 'react';
import { Mail, Send, X, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactAdminProps {
  userId?: string;
  onClose?: () => void;
  embedded?: boolean;
}

export function ContactAdmin({ userId, onClose, embedded = false }: ContactAdminProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || content.length < 5) {
      setError('Le message doit contenir au moins 5 caractères');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subject: subject || 'Message sans sujet',
          content: content.trim(),
          priority
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setSubject('');
        setContent('');
        setTimeout(() => {
          setSuccess(false);
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const content_render = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Contacter l'équipe</h3>
            <p className="text-xs text-slate-400">Nous répondons sous 24-48h</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-green-400 font-medium">Message envoyé !</p>
            <p className="text-green-400/70 text-sm">Nous vous répondrons rapidement.</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-sm text-slate-400 mb-1">Sujet</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Comment pouvons-nous vous aider ?"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm text-slate-400 mb-1">Priorité</label>
          <div className="flex gap-2">
            {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  priority === p
                    ? p === 'URGENT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      p === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      p === 'LOW' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
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
          <label className="block text-sm text-slate-400 mb-1">Message *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Décrivez votre question ou problème..."
            rows={5}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">{content.length} caractères</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={sending || !content.trim() || content.length < 5}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Envoyer le message
            </>
          )}
        </button>
      </form>
    </>
  );

  // Modal version
  if (!embedded) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
          {content_render}
        </div>
      </div>
    );
  }

  // Embedded version
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      {content_render}
    </div>
  );
}

// Simple trigger button
export function ContactButton({ userId }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
      >
        <Mail className="w-4 h-4" />
        Contacter
      </button>
      {isOpen && (
        <ContactAdmin userId={userId} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
