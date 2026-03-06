// components/PWAInstallPrompt.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Hook PWA intégré directement
function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Vérifier si l'app est déjà installée
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setCanInstall(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setCanInstall(false);
      setIsInstalled(true);
      return true;
    }
    
    return false;
  };

  return { canInstall, isInstalled, promptInstall };
}

export function PWAInstallPrompt() {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (canInstall && !isInstalled) {
      // Afficher le prompt après 3 secondes
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  if (!canInstall || isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowPrompt(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-xl">
                <Download className="w-6 h-6 text-cyan-400" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  Installer l'application
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Accédez rapidement à Oznya depuis votre écran d'accueil
                </p>

                <button
                  onClick={handleInstall}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Installer maintenant
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
