'use client';

import { NyxiaAvatar } from './NyxiaAvatar';
import { User, ExternalLink } from 'lucide-react';

interface ServiceRecommendation {
  id: string;
  name: string;
  description: string;
  url: string;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  serviceRecommendation?: ServiceRecommendation | null;
  timestamp?: Date;
  isTyping?: boolean;
}

export function ChatMessage({ 
  role, 
  content, 
  serviceRecommendation,
  timestamp,
  isTyping = false 
}: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div className={`flex gap-3 ${isAssistant ? 'flex-row' : 'flex-row-reverse'} group`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isAssistant ? (
          <NyxiaAvatar size="md" isTyping={isTyping} />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border border-slate-500/30">
            <User className="w-5 h-5 text-slate-300" />
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col gap-2 max-w-[75%] ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div
          className={`
            relative px-4 py-3 rounded-2xl
            ${isAssistant 
              ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-violet-500/20 rounded-tl-sm' 
              : 'bg-gradient-to-br from-violet-600/20 to-amber-600/20 border border-violet-500/30 rounded-tr-sm'
            }
            backdrop-blur-sm
            shadow-lg
            ${isAssistant ? 'shadow-violet-500/5' : 'shadow-violet-500/5'}
          `}
        >
          {/* Holographic effect for assistant messages */}
          {isAssistant && (
            <div 
              className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent 50%, rgba(245, 158, 11, 0.1))'
              }}
            />
          )}
          
          {/* Message content */}
          <div className="relative text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
            {content}
          </div>
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-violet-400"
                  style={{
                    animation: 'bounce 1s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Service recommendation card */}
        {isAssistant && serviceRecommendation && (
          <a
            href={serviceRecommendation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-900/30 to-amber-900/30 border border-violet-500/20 p-3 hover:border-violet-400/40 transition-all duration-300 backdrop-blur-sm max-w-xs"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-amber-500/5 to-violet-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-medium text-violet-300 truncate">
                  {serviceRecommendation.name}
                </h4>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover/card:text-violet-400 transition-colors flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {serviceRecommendation.description}
              </p>
            </div>
          </a>
        )}

        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
