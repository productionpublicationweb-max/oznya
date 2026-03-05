'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Video, 
  Phone, 
  MessageSquare, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Star,
  Gift,
  Heart,
  X
} from 'lucide-react';
import { SERVICES, Service } from '@/lib/services';

interface ServicesSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  products: <Gift className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  chat: <MessageSquare className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  appointment: <Calendar className="w-4 h-4" />
};

const categoryLabels: Record<string, string> = {
  products: '🎁 Produits & Coffrets',
  email: '📧 Consultations Email',
  chat: '💬 Chat en Direct',
  phone: '📞 Téléphone',
  video: '📹 Vidéo',
  appointment: '📅 Rendez-vous'
};

function ServiceCard({ service }: { service: Service }) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group block rounded-xl transition-all duration-300
        ${service.recommended 
          ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-400/30 hover:border-cyan-400/50' 
          : 'bg-white/5 border border-white/10 hover:border-cyan-400/30'
        }
        p-3 hover:bg-cyan-500/5
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-cyan-100 truncate text-sm">
              {service.name}
            </h4>
            {service.recommended && (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-cyan-200/60 mt-1 line-clamp-2">
            {service.description}
          </p>
        </div>
        <ExternalLink className="text-cyan-400/50 group-hover:text-cyan-400 transition-colors flex-shrink-0 w-4 h-4" />
      </div>
    </a>
  );
}

export function ServicesSidebar({ isOpen, onToggle }: ServicesSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Group services by category
  const servicesByCategory = SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  
  const categories = Object.keys(servicesByCategory);

  return (
    <>
      {/* Toggle Button - Côté droit */}
      <button
        onClick={onToggle}
        className={`
          fixed top-1/2 -translate-y-1/2 z-[100]
          flex items-center justify-center
          w-10 h-24 rounded-l-2xl
          bg-gradient-to-b from-cyan-400/20 to-violet-400/20
          border-y border-l border-cyan-400/40
          text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/60
          transition-all duration-300 ease-in-out
          backdrop-blur-md
          shadow-lg shadow-cyan-500/10
          hover:shadow-cyan-500/20
          ${isOpen ? 'right-[320px]' : 'right-0'}
        `}
        aria-label={isOpen ? 'Fermer le panneau' : 'Ouvrir le panneau des services'}
      >
        {isOpen ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar Panel - Cyan transparent avec mauve céleste */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[320px]
          bg-gradient-to-b from-cyan-950/90 via-slate-900/95 to-violet-950/90
          border-l border-cyan-400/30
          backdrop-blur-xl
          transition-transform duration-300 ease-in-out
          z-[90]
          shadow-2xl shadow-cyan-500/10
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Mes Services
              </h2>
              <button 
                onClick={onToggle}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-cyan-200/60 mt-2">
              Consultations & Produits de Diane Boyer
            </p>
          </div>

          {/* Category Tabs */}
          <div className="p-3 border-b border-cyan-400/10 overflow-x-auto bg-black/20">
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${activeCategory === null 
                    ? 'bg-gradient-to-r from-cyan-500/30 to-violet-500/30 text-cyan-200 border border-cyan-400/40' 
                    : 'text-cyan-300/60 hover:text-cyan-200 hover:bg-white/5'
                  }
                `}
              >
                ✨ Tous
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5
                    ${activeCategory === cat 
                      ? 'bg-gradient-to-r from-cyan-500/30 to-violet-500/30 text-cyan-200 border border-cyan-400/40' 
                      : 'text-cyan-300/60 hover:text-cyan-200 hover:bg-white/5'
                    }
                  `}
                >
                  {categoryIcons[cat]}
                  <span>{categoryLabels[cat]?.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(activeCategory ? [activeCategory] : categories).map(category => (
              <div key={category}>
                {activeCategory === null && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-cyan-400">{categoryIcons[category]}</span>
                    <h3 className="text-sm font-semibold text-cyan-200">
                      {categoryLabels[category]}
                    </h3>
                  </div>
                )}
                <div className="space-y-2">
                  {servicesByCategory[category].map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cyan-400/20 bg-gradient-to-r from-cyan-500/5 to-violet-500/5">
            <a
              href="https://www.oznya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 transition-colors bg-white/5 hover:bg-white/10 rounded-xl py-2.5"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              Visiter oznya.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
