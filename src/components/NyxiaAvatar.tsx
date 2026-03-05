'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NyxiaAvatarProps {
  isTyping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NyxiaAvatar({ isTyping = false, size = 'md', className = '' }: NyxiaAvatarProps) {
  const [pulsePhase, setPulsePhase] = useState(0);
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };
  
  const sizePixels = {
    sm: 40,
    md: 56,
    lg: 80
  };

  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setPulsePhase(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer glow rings */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from ${pulsePhase}deg, rgba(0, 212, 255, 0.3), rgba(157, 78, 221, 0.3), rgba(0, 212, 255, 0.3))`,
          filter: 'blur(8px)',
          animation: isTyping ? 'spin 2s linear infinite' : 'spin 8s linear infinite'
        }}
      />
      
      {/* Inner glow */}
      <div 
        className="absolute inset-1 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(224, 231, 255, 0.4), transparent 60%)',
        }}
      />
      
      {/* Avatar container */}
      <div className="absolute inset-1 rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30">
        {/* Generated avatar image */}
        <Image
          src="/nyxia-avatar.png"
          alt="Nyxia"
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="w-full h-full object-cover"
          style={{
            filter: `drop-shadow(0 0 ${isTyping ? '8px' : '4px'} rgba(0, 212, 255, 0.6))`
          }}
          priority
        />
        
        {/* Holographic overlay effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-violet-500/10"
          style={{
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Typing indicator dots */}
      {isTyping && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{
                animation: 'bounce 1s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
