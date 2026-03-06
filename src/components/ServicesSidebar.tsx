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
  Star
} from 'lucide-react';
import { SERVICES, Service } from '@/lib/services';

interface ServicesSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  products: <Sparkles className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  chat: <MessageSquare className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  appointment: <Calendar className="w-4 h-4" />
};

const categoryLabels: Record<string, string> = {
  products: 'Produits',
  email: 'Consultations Email',
  chat: 'Chat',
  phone: 'Téléphone',
  video: 'Vidéo',
  appointment: 'Rendez-vous'
};

function ServiceCard({ service, isCompact }: { service: Service; isCompact: boolean }) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group block rounded-lg border transition-all duration-300
        ${service.recommended 
          ? 'bg-gradient-to-br from-cyan-900/30 to-violet-900/30 border-cyan-500/30 hover:border-cyan-400/50' 
          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
        }
        ${isCompact ? 'p-2' : 'p-3'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className={`font-medium text-slate-200 truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {service.name}
            </h4>
            {service.recommended && (
              <Star className="w-3 h-3 text-cyan-400 fill-cyan-400 flex-shrink-0" />
            )}
          </div>
          {!isCompact && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {service.description}
            </p>
          )}
        </div>
        <ExternalLink className={`text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
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
      {/* Toggle Button - Always visible */}
      <button
        onClick={onToggle}
        className={`
          fixed top-1/2 -translate-y-1/2 z-[100]
          flex items-center justify-center
          w-8 h-16 rounded-l-lg
          bg-gradient-to-r from-cyan-900/90 to-violet-900/90
          border border-cyan-500/40
          text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60
          transition-all duration-300 ease-in-out
          backdrop-blur-md
          shadow-lg shadow-cyan-500/10
          ${isOpen ? 'right-[280px]' : 'right-0'}
        `}
        aria-label={isOpen ? 'Fermer le panneau' : 'Ouvrir le panneau des services'}
      >
        {isOpen ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[280px]
          bg-gradient-to-b from-slate-900/98 to-slate-950/98
          border-l border-cyan-500/20
          backdrop-blur-lg
          transition-transform duration-300 ease-in-out
          z-[90]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Services
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Accédez aux consultations de Diane
            </p>
          </div>

          {/* Category Tabs */}
          <div className="p-2 border-b border-cyan-500/10 overflow-x-auto">
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`
                  px-2 py-1 rounded-md text-xs transition-all
                  ${activeCategory === null 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                  }
                `}
              >
                Tous
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-2 py-1 rounded-md text-xs transition-all flex items-center gap-1
                    ${activeCategory === cat 
                      ? 'bg-cyan-500/20 text-cyan-300' 
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                    }
                  `}
                >
                  {categoryIcons[cat]}
                  <span>{categoryLabels[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {(activeCategory ? [activeCategory] : categories).map(category => (
              <div key={category}>
                {activeCategory === null && (
                  <div className="flex items-center gap-2 mb-2 mt-2 first:mt-0">
                    <span className="text-slate-500">{categoryIcons[category]}</span>
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {categoryLabels[category]}
                    </h3>
                  </div>
                )}
                <div className="space-y-2">
                  {servicesByCategory[category].map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      isCompact={activeCategory === null}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-cyan-500/20">
            <a
              href="https://www.oznya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Visiter oznya.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
