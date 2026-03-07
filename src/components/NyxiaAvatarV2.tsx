'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';

export type AvatarMood = 'neutral' | 'happy' | 'thinking' | 'excited' | 'mystical' | 'listening';

interface NyxiaAvatarV2Props {
  isTyping?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  mood?: AvatarMood;
  className?: string;
  showGlow?: boolean;
}

const moodColors: Record<AvatarMood, { primary: string; secondary: string; glow: string }> = {
  neutral: { primary: 'rgba(0, 212, 255, 0.4)', secondary: 'rgba(157, 78, 221, 0.4)', glow: '#00d4ff' },
  happy: { primary: 'rgba(250, 204, 21, 0.5)', secondary: 'rgba(34, 197, 94, 0.4)', glow: '#facc15' },
  thinking: { primary: 'rgba(139, 92, 246, 0.5)', secondary: 'rgba(59, 130, 246, 0.4)', glow: '#8b5cf6' },
  excited: { primary: 'rgba(236, 72, 153, 0.5)', secondary: 'rgba(249, 115, 22, 0.4)', glow: '#ec4899' },
  mystical: { primary: 'rgba(147, 51, 234, 0.5)', secondary: 'rgba(6, 182, 212, 0.4)', glow: '#9333ea' },
  listening: { primary: 'rgba(34, 197, 94, 0.5)', secondary: 'rgba(14, 165, 233, 0.4)', glow: '#22c55e' }
};

export function NyxiaAvatarV2({ 
  isTyping = false, 
  size = 'md', 
  mood = 'neutral',
  className = '',
  showGlow = true
}: NyxiaAvatarV2Props) {
  const [pulsePhase, setPulsePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24'
  };
  
  const sizePixels = {
    xs: 32,
    sm: 40,
    md: 56,
    lg: 96
  };

  const colors = moodColors[mood];

  // Generate particle positions with useMemo (stable across renders)
  const particlePositions = useMemo(() => 
    Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    })), []
  );

  // Animate rotation based on mood
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, mood === 'thinking' ? 30 : 50);
    
    return () => clearInterval(interval);
  }, [mood]);

  return (
    <div ref={containerRef} className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Floating particles */}
      {showGlow && isTyping && particlePositions.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: colors.glow,
            boxShadow: `0 0 6px ${colors.glow}`,
            animation: `float ${1.5 + particle.delay}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Outer glow rings */}
      {showGlow && (
        <>
          <div 
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background: `conic-gradient(from ${pulsePhase}deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
              filter: 'blur(10px)',
              animation: isTyping ? 'spin 2s linear infinite' : 'spin 10s linear infinite'
            }}
          />
          
          <div 
            className="absolute -inset-1 rounded-full opacity-40"
            style={{
              background: `conic-gradient(from ${pulsePhase + 180}deg, ${colors.secondary}, ${colors.primary}, ${colors.secondary})`,
              filter: 'blur(15px)',
              animation: 'spin 15s linear infinite reverse'
            }}
          />
        </>
      )}
      
      {/* Inner glow */}
      <div 
        className="absolute inset-1 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(224, 231, 255, 0.3), transparent 60%)',
        }}
      />
      
      {/* Avatar container */}
      <div className={`
        absolute inset-1 rounded-full overflow-hidden 
        bg-gradient-to-br from-slate-800 to-slate-900 
        border transition-all duration-300
        ${isTyping ? 'border-cyan-400/50 shadow-lg shadow-cyan-500/20' : 'border-cyan-500/30'}
      `}
      style={{
        boxShadow: isTyping ? `0 0 20px ${colors.glow}40` : undefined
      }}
      >
        {/* Generated avatar image */}
        <Image
          src="/nyxia-avatar.png"
          alt="Nyxia"
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            filter: `drop-shadow(0 0 ${isTyping ? '8px' : '4px'} ${colors.glow})`,
            transform: mood === 'happy' ? 'scale(1.05)' : mood === 'thinking' ? 'scale(0.98)' : 'scale(1)'
          }}
          priority
        />
        
        {/* Holographic overlay effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}20, transparent 50%, ${colors.secondary}20)`,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />

        {/* Mood indicator overlay */}
        {mood !== 'neutral' && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at center, ${colors.glow}, transparent 70%)`,
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        )}
      </div>
      
      {/* Typing indicator dots */}
      {isTyping && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 bg-slate-900/80 px-2 py-1 rounded-full">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: colors.glow,
                boxShadow: `0 0 8px ${colors.glow}`,
                animation: 'bounce 1s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Mood ring indicator */}
      {mood !== 'neutral' && (
        <div 
          className="absolute -inset-2 rounded-full border-2 opacity-50"
          style={{
            borderColor: colors.glow,
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.8; }
          50% { transform: translateY(-5px) translateX(3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
