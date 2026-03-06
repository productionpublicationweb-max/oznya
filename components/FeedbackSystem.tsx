// components/FeedbackSystem.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

type FeedbackType = 'success' | 'error' | 'loading' | 'magic';

interface FeedbackProps {
  type: FeedbackType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Feedback({ type, message, duration = 3000, onClose }: FeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const configs = {
    success: {
      icon: Check,
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50'
    },
    error: {
      icon: X,
      gradient: 'from-red-500 to-rose-500',
      glow: 'shadow-red-500/50'
    },
    loading: {
      icon: Loader2,
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/50',
      animate: 'animate-spin'
    },
    magic: {
      icon: Sparkles,
      gradient: 'from-violet-500 to-purple-500',
      glow: 'shadow-violet-500/50',
      animate: 'animate-pulse'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-[200] max-w-sm"
        >
          <div className={`
            flex items-center gap-3 px-4 py-3 rounded-xl
            bg-slate-900 border border-slate-700
            shadow-2xl ${config.glow}
          `}>
            <div className={`
              p-2 rounded-lg bg-gradient-to-r ${config.gradient}
            `}>
            <Icon className={`w-5 h-5 text-white ${'animate' in config ? config.animate : ''}`} />
            </div>
            <p className="text-sm text-white font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook pour utiliser facilement le feedback
export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackProps | null>(null);

  const show = (type: FeedbackType, message: string, duration?: number) => {
    setFeedback({ type, message, duration, onClose: () => setFeedback(null) });
  };

  return {
    show,
    showSuccess: (message: string) => show('success', message),
    showError: (message: string) => show('error', message),
    showLoading: (message: string) => show('loading', message, 0),
    showMagic: (message: string) => show('magic', message),
    feedback
  };
}
