'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSend, 
  disabled = false, 
  placeholder = "Partage ce qui t'habite..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full">
      {/* Decorative glow */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-30 blur-lg transition-opacity"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(157, 78, 221, 0.3))',
          opacity: message ? 0.5 : 0.2
        }}
      />
      
      <div className="relative flex items-end gap-2 p-3 rounded-2xl bg-slate-800/80 border border-cyan-500/20 backdrop-blur-sm">
        {/* Sparkle icon */}
        <Sparkles className="w-5 h-5 text-cyan-400/50 flex-shrink-0 mb-1" />
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm resize-none focus:outline-none min-h-[24px] max-h-[120px] py-1"
          style={{ lineHeight: '1.5' }}
        />
        
        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className={`
            flex-shrink-0 p-2 rounded-xl transition-all duration-300
            ${message.trim() && !disabled
              ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
              : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      
      {/* Hint text */}
      <div className="flex justify-between items-center mt-2 px-2">
        <span className="text-xs text-slate-500">
          Appuie sur Entrée pour envoyer
        </span>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Nyxia t'écoute
        </span>
      </div>
    </div>
  );
}
