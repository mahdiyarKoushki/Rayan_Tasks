'use client';

import React from 'react';
import { TimeOfDay, BackgroundStyle } from '@/lib/types';
import BubbleMapCanvas from './BubbleMapCanvas';

interface DynamicBackgroundProps {
  timeOfDay: TimeOfDay;
  isDark: boolean;
  style?: BackgroundStyle;
  backgroundDim?: number; // 0 to 80
  interactiveBubbles?: boolean;
  showFocusBubbles?: boolean;
}

export default function DynamicBackground({
  timeOfDay,
  isDark,
  style = 'bubble-map',
  backgroundDim = 25,
  interactiveBubbles = true,
  showFocusBubbles,
}: DynamicBackgroundProps) {
  // Resolve effective time of day
  const effectiveTime = React.useMemo(() => {
    if (timeOfDay !== 'auto') return timeOfDay;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'noon';
    return 'night';
  }, [timeOfDay]);

  // Dynamic visual profiles tuned to EACH background style, time, and dark/light mode
  const config = React.useMemo(() => {
    if (!isDark) {
      // --- LIGHT MODE PALETTES ---
      switch (style) {
        case 'liquid-aurora':
          return {
            bg: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-cyan-50/80',
            blob1: 'bg-emerald-300/35',
            blob2: 'bg-cyan-300/30',
            blob3: 'bg-teal-200/30',
            accentGlow: 'from-emerald-400/20 via-cyan-400/15 to-transparent',
          };
        case 'cosmic-nebula':
          return {
            bg: 'bg-gradient-to-br from-slate-50 via-purple-50/50 to-indigo-50/70',
            blob1: 'bg-purple-300/30',
            blob2: 'bg-fuchsia-300/25',
            blob3: 'bg-indigo-300/25',
            accentGlow: 'from-purple-400/20 via-indigo-400/15 to-transparent',
          };
        case 'lofi-rain':
          return {
            bg: 'bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-200/70',
            blob1: 'bg-slate-400/25',
            blob2: 'bg-blue-300/25',
            blob3: 'bg-amber-300/25', // cozy streetlamp warmth
            accentGlow: 'from-slate-400/15 via-amber-300/15 to-transparent',
          };
        case 'geometric-mesh':
          return {
            bg: 'bg-gradient-to-br from-slate-50 via-cyan-50/40 to-slate-100',
            blob1: 'bg-cyan-300/30',
            blob2: 'bg-indigo-300/25',
            blob3: 'bg-blue-200/30',
            accentGlow: 'from-cyan-400/20 via-indigo-400/15 to-transparent',
          };
        case 'bubble-map':
        default:
          switch (effectiveTime) {
            case 'morning':
              return {
                bg: 'bg-gradient-to-br from-amber-50/80 via-rose-50/50 to-slate-100',
                blob1: 'bg-amber-300/30',
                blob2: 'bg-rose-300/25',
                blob3: 'bg-orange-200/25',
                accentGlow: 'from-amber-400/15 to-rose-400/10',
              };
            case 'noon':
              return {
                bg: 'bg-gradient-to-br from-sky-50/85 via-indigo-50/50 to-slate-100',
                blob1: 'bg-sky-300/30',
                blob2: 'bg-indigo-300/25',
                blob3: 'bg-teal-200/25',
                accentGlow: 'from-sky-400/15 to-indigo-400/10',
              };
            case 'night':
            default:
              return {
                bg: 'bg-gradient-to-br from-slate-100 via-indigo-50/40 to-purple-50/30',
                blob1: 'bg-indigo-300/25',
                blob2: 'bg-purple-300/20',
                blob3: 'bg-blue-300/20',
                accentGlow: 'from-indigo-400/15 to-purple-400/10',
              };
          }
      }
    } else {
      // --- DARK MODE PALETTES (DEEP ATMOSPHERIC IMMERSION) ---
      switch (style) {
        case 'liquid-aurora':
          return {
            bg: 'bg-[#021319]', // deep oceanic teal
            blob1: 'bg-emerald-500/24',
            blob2: 'bg-cyan-500/26',
            blob3: 'bg-violet-600/20',
            accentGlow: 'from-emerald-600/20 via-cyan-600/18 to-transparent',
          };
        case 'cosmic-nebula':
          return {
            bg: 'bg-[#030611]', // starlit obsidian space
            blob1: 'bg-purple-600/26',
            blob2: 'bg-fuchsia-600/20',
            blob3: 'bg-indigo-700/24',
            accentGlow: 'from-fuchsia-900/25 via-purple-900/20 to-transparent',
          };
        case 'lofi-rain':
          return {
            bg: 'bg-[#080d1a]', // rainy twilight indigo
            blob1: 'bg-blue-600/20',
            blob2: 'bg-slate-700/26',
            blob3: 'bg-amber-600/18', // warm distant neon streetlamp
            accentGlow: 'from-amber-600/15 via-blue-900/20 to-transparent',
          };
        case 'geometric-mesh':
          return {
            bg: 'bg-[#040814]', // cybernetic deep dark
            blob1: 'bg-cyan-500/24',
            blob2: 'bg-indigo-600/24',
            blob3: 'bg-slate-800/30',
            accentGlow: 'from-cyan-600/20 via-indigo-700/15 to-transparent',
          };
        case 'bubble-map':
        default:
          switch (effectiveTime) {
            case 'morning':
              return {
                bg: 'bg-[#0a0d18]',
                blob1: 'bg-amber-500/20',
                blob2: 'bg-rose-500/16',
                blob3: 'bg-indigo-600/20',
                accentGlow: 'from-amber-600/15 via-rose-600/10 to-transparent',
              };
            case 'noon':
              return {
                bg: 'bg-[#090e1c]',
                blob1: 'bg-cyan-500/20',
                blob2: 'bg-blue-600/20',
                blob3: 'bg-emerald-500/15',
                accentGlow: 'from-cyan-600/15 via-blue-600/10 to-transparent',
              };
            case 'night':
            default:
              return {
                bg: 'bg-[#070a14]',
                blob1: 'bg-indigo-600/24',
                blob2: 'bg-purple-600/18',
                blob3: 'bg-blue-700/18',
                accentGlow: 'from-purple-900/20 via-indigo-900/15 to-transparent',
              };
          }
      }
    }
  }, [style, effectiveTime, isDark]);

  return (
    <div
      className={`fixed inset-0 -z-10 transition-colors duration-700 ${config.bg} overflow-hidden select-none`}
    >
      {/* 1. Ambient Fluid Mesh Blobs (Organic Morphing) */}
      <div
        className={`absolute -top-32 -right-32 w-[540px] h-[540px] rounded-full blur-[110px] ${config.blob1} animate-ambient-1 transition-all duration-700 pointer-events-none`}
      />
      <div
        className={`absolute top-1/3 -left-40 w-[580px] h-[580px] rounded-full blur-[120px] ${config.blob2} animate-ambient-2 transition-all duration-700 pointer-events-none`}
      />
      <div
        className={`absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[115px] ${config.blob3} animate-ambient-3 transition-all duration-700 pointer-events-none`}
      />

      {/* 2. Specific Atmospheric Visual FX for Each Style */}
      {style === 'liquid-aurora' && (
        <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen">
          <div className="absolute top-1/4 left-1/5 w-[650px] h-[340px] bg-gradient-to-r from-emerald-500/25 via-cyan-500/30 to-violet-500/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/5 w-[550px] h-[300px] bg-gradient-to-r from-purple-500/25 via-teal-500/25 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      )}

      {style === 'cosmic-nebula' && (
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen">
          <div className="absolute top-1/6 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/25 via-fuchsia-600/20 to-transparent rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-1/5 left-1/4 w-[450px] h-[450px] bg-gradient-to-r from-blue-600/25 via-indigo-600/20 to-transparent rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
      )}

      {style === 'lofi-rain' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Glass Rain Window Steam / Blur Texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-950/10 to-slate-950/40 backdrop-blur-[0.5px]" />
          {/* Ambient Warm Neon Bokeh in the distance */}
          <div className="absolute bottom-16 left-1/4 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl animate-pulse" />
          <div className="absolute top-24 right-1/3 w-40 h-40 rounded-full bg-rose-500/12 blur-2xl animate-pulse delay-1000" />
        </div>
      )}

      {style === 'geometric-mesh' && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
        </div>
      )}

      {/* 3. Interactive Canvas Render (Bubbles, Aurora, Nebula, Rain, Mesh) */}
      <BubbleMapCanvas
        style={style}
        isDark={isDark}
        interactive={interactiveBubbles}
        showFocusBubbles={showFocusBubbles}
      />

      {/* 4. Radial Accent & Caustics Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${config.accentGlow} opacity-60 pointer-events-none`}
      />

      {/* 5. Custom Dimming / Contrast Shield */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: isDark ? '#040711' : '#ffffff',
          opacity: backgroundDim / 100,
        }}
      />

      {/* 6. Subtle Microdot Grid (Architectural tactile luxury) */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}
