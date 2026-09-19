'use client';

import React from 'react';
import { motion } from 'motion/react';

export type IllustrationType = 
  | 'focus' 
  | 'empty' 
  | 'streak' 
  | 'goalCompleted' 
  | 'sleep' 
  | 'dayCompleted';

interface IllustrationProps {
  type: IllustrationType;
  className?: string;
  size?: number;
}

export default function Illustration({ type, className = '', size = 120 }: IllustrationProps) {
  switch (type) {
    case 'focus':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl animate-pulse" />
          
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            <defs>
              <linearGradient id="grad-focus-sphere" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="60%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
              <linearGradient id="grad-focus-ring" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Soft Orbital Rings */}
            <motion.ellipse
              cx="50"
              cy="50"
              rx="40"
              ry="18"
              fill="none"
              stroke="url(#grad-focus-ring)"
              strokeWidth="2"
              transform="rotate(-25 50 50)"
              animate={{ rotate: [-25, -20, -25] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Core 3D Sphere */}
            <motion.circle
              cx="50"
              cy="50"
              r="22"
              fill="url(#grad-focus-sphere)"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Glass Specular Highlight */}
            <ellipse cx="44" cy="42" rx="7" ry="4" fill="#ffffff" fillOpacity="0.45" transform="rotate(-30 44 42)" />
            {/* Floating Sparkles */}
            <circle cx="28" cy="30" r="2" fill="#38bdf8" />
            <circle cx="72" cy="68" r="2.5" fill="#e879f9" />
          </svg>
        </div>
      );

    case 'streak':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-xl animate-pulse" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            <defs>
              <linearGradient id="grad-fire" x1="0%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
              <linearGradient id="grad-fire-inner" x1="0%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            {/* Flame outer */}
            <motion.path
              d="M50 15 C58 32, 75 42, 75 62 C75 78, 62 88, 50 88 C38 88, 25 78, 25 62 C25 45, 42 30, 50 15 Z"
              fill="url(#grad-fire)"
              animate={{ scale: [1, 1.05, 0.98, 1], y: [0, -2, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Flame inner heart */}
            <path
              d="M50 45 C54 54, 62 60, 62 70 C62 78, 56 82, 50 82 C44 82, 38 78, 38 70 C38 60, 46 54, 50 45 Z"
              fill="url(#grad-fire-inner)"
              opacity="0.9"
            />
            {/* Sparkle Embers */}
            <circle cx="34" cy="36" r="1.5" fill="#fde047" />
            <circle cx="68" cy="40" r="2" fill="#fde047" />
          </svg>
        </div>
      );

    case 'goalCompleted':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-xl" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            <defs>
              <linearGradient id="grad-emerald-pedestal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="grad-star" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            {/* Floating 3D Diamond / Shield */}
            <motion.path
              d="M50 20 L78 35 L78 65 L50 82 L22 65 L22 35 Z"
              fill="url(#grad-emerald-pedestal)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              animate={{ rotateY: [0, 180, 360], y: [0, -3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Inner checkmark */}
            <path
              d="M40 50 L47 57 L62 42"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'dayCompleted':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            <defs>
              <linearGradient id="grad-sun" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="28" fill="url(#grad-sun)" />
            <ellipse cx="44" cy="40" rx="8" ry="4" fill="#ffffff" fillOpacity="0.4" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '50px', originY: '50px' }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="14"
                  x2="50"
                  y2="8"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
            </motion.g>
          </svg>
        </div>
      );

    case 'sleep':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            <defs>
              <linearGradient id="grad-moon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            {/* Crescent moon */}
            <motion.path
              d="M62 25 C45 28 32 42 32 60 C32 78 46 90 62 90 C48 85 40 72 40 60 C40 46 48 33 62 25 Z"
              fill="url(#grad-moon)"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Little stars */}
            <path d="M68 35 L70 30 L72 35 L77 37 L72 39 L70 44 L68 39 L63 37 Z" fill="#c7d2fe" />
            <circle cx="75" cy="55" r="2" fill="#a5b4fc" />
          </svg>
        </div>
      );

    case 'empty':
    default:
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full bg-slate-500/10 blur-xl" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            <rect
              x="25"
              y="25"
              width="50"
              height="50"
              rx="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="text-slate-400/40"
            />
            <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400/60" />
            <path d="M50 44 V56 M44 50 H56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400/80" />
          </svg>
        </div>
      );
  }
}
