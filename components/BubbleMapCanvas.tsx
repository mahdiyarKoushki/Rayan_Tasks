'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { BackgroundStyle } from '@/lib/types';

interface BubbleNode {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  targetRadius: number;
  color: string;
  glowColor: string;
  category: string;
  pulsePhase: number;
  isDragging?: boolean;
}

interface Particle {
  x: number;
  y: number;
  z?: number;
  vx: number;
  vy: number;
  vz?: number;
  size: number;
  alpha: number;
  baseAlpha?: number;
  color: string;
  pulseSpeed?: number;
  phase?: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  color: string;
  active: boolean;
}

interface RainDroplet {
  x: number;
  y: number;
  radius: number;
  vy: number;
  alpha: number;
  trailLength: number;
}

interface BokehCircle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  pulsePhase: number;
}

interface BubbleMapCanvasProps {
  style: BackgroundStyle;
  isDark: boolean;
  interactive?: boolean;
  showFocusBubbles?: boolean;
}

const INITIAL_NODES: Array<{ label: string; emoji: string; category: string; color: string; glow: string; radius: number }> = [
  { label: 'تمرکز عمیق', emoji: '⚡', category: 'work', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.45)', radius: 46 },
  { label: 'English', emoji: '🇬🇧', category: 'english', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', radius: 42 },
  { label: 'Backend', emoji: '💻', category: 'coding', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.45)', radius: 48 },
  { label: 'ورزش و هیت', emoji: '🏋️', category: 'fitness', color: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', radius: 44 },
  { label: 'مطالعه و رشد', emoji: '🧠', category: 'learning', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)', radius: 40 },
  { label: 'هدف آیلتس ۷.۵', emoji: '🎯', category: 'goals', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', radius: 46 },
  { label: 'کارهای خانه', emoji: '🏠', category: 'home', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.45)', radius: 36 },
  { label: 'استراحت و بازی', emoji: '🎮', category: 'fun', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', radius: 38 },
  { label: 'خواب باکیفیت', emoji: '🌙', category: 'sleep', color: '#475569', glow: 'rgba(99, 102, 241, 0.35)', radius: 38 },
];

export default function BubbleMapCanvas({
  style,
  isDark,
  interactive = true,
  showFocusBubbles,
}: BubbleMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; isDown: boolean; grabbedNode: BubbleNode | null }>({
    x: -1000,
    y: -1000,
    isDown: false,
    grabbedNode: null,
  });

  const nodesRef = useRef<BubbleNode[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const rainDropletsRef = useRef<RainDroplet[]>([]);
  const bokehRef = useRef<BokehCircle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastShootingStarTime = useRef<number>(0);

  // Determine whether to draw focus bubbles
  const effectiveShowBubbles = showFocusBubbles ?? (style === 'bubble-map');

  // Initialize Elements based on style
  const initScene = useCallback((width: number, height: number) => {
    // 1. Nodes initialization (for bubble-map or when bubbles enabled)
    const nodes: BubbleNode[] = [];
    const count = INITIAL_NODES.length;
    for (let i = 0; i < count; i++) {
      const template = INITIAL_NODES[i];
      const angle = (i / count) * Math.PI * 2;
      const distFromCenter = Math.min(width, height) * (0.2 + (i % 3) * 0.1);
      const cx = width / 2 + Math.cos(angle) * distFromCenter;
      const cy = height / 2 + Math.sin(angle) * distFromCenter;

      nodes.push({
        id: `node-${i}`,
        label: template.label,
        emoji: template.emoji,
        x: Math.max(template.radius + 20, Math.min(width - template.radius - 20, cx)),
        y: Math.max(template.radius + 20, Math.min(height - template.radius - 20, cy)),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        baseRadius: template.radius,
        radius: template.radius,
        targetRadius: template.radius,
        color: template.color,
        glowColor: template.glow,
        category: template.category,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;

    // 2. Specific particles based on style
    const particles: Particle[] = [];

    if (style === 'cosmic-nebula') {
      // 180+ Twinkling Stars
      const starColors = isDark
        ? ['#ffffff', '#e0e7ff', '#fef08a', '#c7d2fe', '#fbcfe8']
        : ['#475569', '#334155', '#6366f1', '#4f46e5'];
      for (let p = 0; p < 180; p++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          size: Math.random() < 0.15 ? Math.random() * 2.2 + 1.2 : Math.random() * 1.2 + 0.6,
          alpha: Math.random() * 0.7 + 0.2,
          baseAlpha: Math.random() * 0.7 + 0.2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          pulseSpeed: Math.random() * 2 + 1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (style === 'lofi-rain') {
      // Falling Rain Streaks
      for (let p = 0; p < 90; p++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: -0.8 - Math.random() * 0.5,
          vy: Math.random() * 8 + 12,
          size: Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.5 + 0.2,
          color: isDark ? '#93c5fd' : '#60a5fa',
        });
      }

      // Glass surface condensation droplets
      const rainDroplets: RainDroplet[] = [];
      for (let d = 0; d < 30; d++) {
        rainDroplets.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 1.2,
          vy: Math.random() < 0.25 ? Math.random() * 0.4 + 0.1 : 0,
          alpha: Math.random() * 0.5 + 0.3,
          trailLength: Math.random() * 15 + 5,
        });
      }
      rainDropletsRef.current = rainDroplets;

      // Bokeh lights in the background
      const bokeh: BokehCircle[] = [];
      const bokehColors = ['#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];
      for (let b = 0; b < 14; b++) {
        bokeh.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.8 + height * 0.1,
          radius: Math.random() * 45 + 25,
          color: bokehColors[Math.floor(Math.random() * bokehColors.length)],
          alpha: Math.random() * 0.12 + 0.04,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      bokehRef.current = bokeh;
    } else if (style === 'geometric-mesh') {
      // 3D Spatial Grid Nodes
      const meshNodesCount = 45;
      for (let m = 0; m < meshNodesCount; m++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 400 - 200,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          vz: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 3 + 1.5,
          alpha: Math.random() * 0.6 + 0.25,
          color: isDark ? (m % 2 === 0 ? '#06b6d4' : '#8b5cf6') : (m % 2 === 0 ? '#0284c7' : '#7c3aed'),
        });
      }
    } else if (style === 'liquid-aurora') {
      // Floating Aurora Luminous Photon Orbs
      for (let p = 0; p < 32; p++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 5 + 2,
          alpha: Math.random() * 0.4 + 0.2,
          color: p % 3 === 0 ? '#10b981' : p % 3 === 1 ? '#06b6d4' : '#a855f7',
          pulseSpeed: Math.random() * 1.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else {
      // Default Bubble Map Ambient Dust
      for (let p = 0; p < 35; p++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.8,
          alpha: Math.random() * 0.5 + 0.2,
          color: isDark ? '#a5b4fc' : '#64748b',
        });
      }
    }

    particlesRef.current = particles;
  }, [style, isDark]);

  // Window Resize & Init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    initScene(width, height);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initScene(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initScene]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;

      // ==========================================
      // 1. STYLE: LIQUID AURORA WAVES
      // ==========================================
      if (style === 'liquid-aurora') {
        const waveLayers = [
          { yRatio: 0.35, amp: 55, freq: 0.002, speed: 0.0009, colors: ['rgba(6,182,212,0.18)', 'rgba(16,185,129,0.12)', 'transparent'] },
          { yRatio: 0.55, amp: 70, freq: 0.0016, speed: 0.0007, colors: ['rgba(139,92,246,0.16)', 'rgba(6,182,212,0.14)', 'transparent'] },
          { yRatio: 0.75, amp: 60, freq: 0.0022, speed: 0.0011, colors: ['rgba(16,185,129,0.15)', 'rgba(168,85,247,0.12)', 'transparent'] },
        ];

        waveLayers.forEach((wave) => {
          ctx.save();
          ctx.beginPath();
          const baseWaveY = height * wave.yRatio;
          ctx.moveTo(0, height);

          for (let x = 0; x <= width; x += 12) {
            let pointerDistortion = 0;
            if (interactive && pointer.x > 0) {
              const pDist = Math.abs(x - pointer.x);
              if (pDist < 160) {
                pointerDistortion = (1 - pDist / 160) * 35 * Math.sin(time * 0.005);
              }
            }

            const y =
              baseWaveY +
              Math.sin(x * wave.freq + time * wave.speed) * wave.amp +
              Math.cos(x * wave.freq * 1.7 - time * wave.speed * 0.8) * (wave.amp * 0.4) +
              pointerDistortion;

            if (x === 0) ctx.lineTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, baseWaveY - wave.amp, 0, height);
          grad.addColorStop(0, wave.colors[0]);
          grad.addColorStop(0.4, wave.colors[1]);
          grad.addColorStop(1, wave.colors[2]);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
        });

        // Floating bioluminescent orbs
        particlesRef.current.forEach((p) => {
          p.x += p.vx + Math.sin(time * 0.001 + (p.phase || 0)) * 0.4;
          p.y += p.vy + Math.cos(time * 0.0012 + (p.phase || 0)) * 0.3;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          const orbGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.8);
          orbGrad.addColorStop(0, p.color);
          orbGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = orbGrad;
          ctx.globalAlpha = p.alpha * (isDark ? 0.6 : 0.35);
          ctx.fill();
          ctx.restore();
        });
      }

      // ==========================================
      // 2. STYLE: COSMIC NEBULA & STARDUST
      // ==========================================
      if (style === 'cosmic-nebula') {
        // Deep Nebula Cloud Glows
        const nebulaBlobs = [
          { x: width * 0.3, y: height * 0.3, r: Math.min(width, height) * 0.45, c1: 'rgba(139, 92, 246, 0.16)', c2: 'rgba(236, 72, 153, 0.06)' },
          { x: width * 0.7, y: height * 0.65, r: Math.min(width, height) * 0.5, c1: 'rgba(59, 130, 246, 0.14)', c2: 'rgba(99, 102, 241, 0.05)' },
        ];

        nebulaBlobs.forEach((nebula) => {
          ctx.save();
          ctx.beginPath();
          const breathe = Math.sin(time * 0.0006) * 20;
          const rad = nebula.r + breathe;
          ctx.arc(nebula.x, nebula.y, rad, 0, Math.PI * 2);
          const nGrad = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, rad);
          nGrad.addColorStop(0, nebula.c1);
          nGrad.addColorStop(0.5, nebula.c2);
          nGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = nGrad;
          ctx.fill();
          ctx.restore();
        });

        // Twinkling stars
        const stars = particlesRef.current;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;

          const twinkle = Math.sin(time * 0.002 * (s.pulseSpeed || 1) + (s.phase || 0));
          const currentAlpha = Math.max(0.1, (s.baseAlpha || 0.5) + twinkle * 0.3);

          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = isDark ? currentAlpha : currentAlpha * 0.6;
          ctx.fill();

          // Star diffraction spike for brightest stars
          if (s.size > 2 && isDark) {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = currentAlpha * 0.4;
            ctx.beginPath();
            ctx.moveTo(s.x - s.size * 2.2, s.y);
            ctx.lineTo(s.x + s.size * 2.2, s.y);
            ctx.moveTo(s.x, s.y - s.size * 2.2);
            ctx.lineTo(s.x, s.y + s.size * 2.2);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Periodic Shooting Stars (Meteors)
        if (time - lastShootingStarTime.current > 3500 + Math.random() * 3000) {
          lastShootingStarTime.current = time;
          shootingStarsRef.current.push({
            x: Math.random() * width * 0.8 + width * 0.1,
            y: Math.random() * height * 0.4,
            length: Math.random() * 80 + 70,
            speed: Math.random() * 9 + 11,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
            opacity: 1,
            color: Math.random() > 0.5 ? '#e0e7ff' : '#a5b4fc',
            active: true,
          });
        }

        // Draw shooting stars
        for (let m = shootingStarsRef.current.length - 1; m >= 0; m--) {
          const s = shootingStarsRef.current[m];
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.opacity -= 0.022;

          if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
            shootingStarsRef.current.splice(m, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;
          const mGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          mGrad.addColorStop(0, 'transparent');
          mGrad.addColorStop(1, s.color);
          ctx.strokeStyle = mGrad;
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = Math.max(0, s.opacity);
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ==========================================
      // 3. STYLE: LO-FI RAIN & GLASS CONDENSATION
      // ==========================================
      if (style === 'lofi-rain') {
        // Distant blurred city bokeh
        bokehRef.current.forEach((b) => {
          const pulse = Math.sin(time * 0.001 + b.pulsePhase) * 0.03;
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = Math.max(0.01, b.alpha + pulse);
          ctx.fill();
          ctx.restore();
        });

        // Falling rain streaks
        const rainParticles = particlesRef.current;
        for (let i = 0; i < rainParticles.length; i++) {
          const r = rainParticles[i];
          r.x += r.vx;
          r.y += r.vy;

          if (r.y > height) {
            r.y = -20;
            r.x = Math.random() * width;

            // Spawn ground ripple on splash
            if (Math.random() < 0.15) {
              ripplesRef.current.push({
                x: r.x,
                y: height - Math.random() * 40,
                radius: 2,
                maxRadius: 24,
                alpha: 0.4,
                color: isDark ? 'rgba(147, 197, 253, 0.4)' : 'rgba(96, 165, 250, 0.4)',
              });
            }
          }
          if (r.x < 0) r.x = width;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + r.vx * 2.5, r.y + 16);
          ctx.strokeStyle = r.color;
          ctx.lineWidth = r.size;
          ctx.globalAlpha = isDark ? r.alpha : r.alpha * 0.7;
          ctx.stroke();
          ctx.restore();
        }

        // Condensation raindrops on glass pane
        rainDropletsRef.current.forEach((drop) => {
          drop.y += drop.vy;
          if (drop.y > height) {
            drop.y = Math.random() * -50;
            drop.x = Math.random() * width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(100, 116, 139, 0.55)';
          ctx.globalAlpha = drop.alpha;
          ctx.fill();

          // Droplet highlight reflection
          ctx.beginPath();
          ctx.arc(drop.x - drop.radius * 0.3, drop.y - drop.radius * 0.3, drop.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.8;
          ctx.fill();
          ctx.restore();
        });
      }

      // ==========================================
      // 4. STYLE: GEOMETRIC CYBER MESH
      // ==========================================
      if (style === 'geometric-mesh') {
        const meshNodes = particlesRef.current;
        const maxLinkDist = 175;

        // Update positions with 3D-like rotation
        for (let i = 0; i < meshNodes.length; i++) {
          const m = meshNodes[i];
          m.x += m.vx;
          m.y += m.vy;

          if (m.x < 0) m.x = width;
          if (m.x > width) m.x = 0;
          if (m.y < 0) m.y = height;
          if (m.y > height) m.y = 0;

          // Pointer gravitational warp
          if (interactive && pointer.x > 0) {
            const dx = pointer.x - m.x;
            const dy = pointer.y - m.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const pull = (1 - dist / 150) * 1.5;
              m.x += (dx / dist) * pull;
              m.y += (dy / dist) * pull;
            }
          }

          // Draw node
          ctx.save();
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.globalAlpha = m.alpha;
          ctx.fill();
          ctx.restore();
        }

        // Draw connections between neighboring nodes
        for (let i = 0; i < meshNodes.length; i++) {
          for (let j = i + 1; j < meshNodes.length; j++) {
            const n1 = meshNodes[i];
            const n2 = meshNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxLinkDist) {
              const alpha = (1 - dist / maxLinkDist) * (isDark ? 0.28 : 0.18);
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = n1.color;
              ctx.lineWidth = 1;
              ctx.globalAlpha = alpha;
              ctx.stroke();

              // High-tech travelling data pulse
              const pulsePos = ((time * 0.0006 + i * 0.3) % 1);
              const px = n1.x + (n2.x - n1.x) * pulsePos;
              const py = n1.y + (n2.y - n1.y) * pulsePos;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = alpha * 1.8;
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }

      // ==========================================
      // 5. UPDATE & DRAW RIPPLES (ALL STYLES)
      // ==========================================
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += dt * 140;
        r.alpha -= dt * 0.65;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2 * r.alpha;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 6. FOCUS BUBBLE MAP NODES (WHEN ENABLED)
      // ==========================================
      if (effectiveShowBubbles) {
        const nodes = nodesRef.current;

        // Draw connections (Curved organic bezier links between focus bubbles)
        const maxBubbleDist = 240;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxBubbleDist) {
              const linkStrength = 1 - dist / maxBubbleDist;
              const lineAlpha = linkStrength * (isDark ? 0.25 : 0.16);

              ctx.save();
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);

              // Organic bezier curved filament
              const mx = (n1.x + n2.x) / 2 + Math.sin(time * 0.001 + i) * 14;
              const my = (n1.y + n2.y) / 2 + Math.cos(time * 0.001 + j) * 14;
              ctx.quadraticCurveTo(mx, my, n2.x, n2.y);

              const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
              grad.addColorStop(0, n1.color);
              grad.addColorStop(1, n2.color);

              ctx.strokeStyle = grad;
              ctx.lineWidth = Math.max(1, linkStrength * 2.4);
              ctx.globalAlpha = lineAlpha;
              ctx.stroke();

              // Traveling photon on filament
              const pulsePos = ((time * 0.0007 + i * 0.2) % 1);
              const px = n1.x + (n2.x - n1.x) * pulsePos;
              const py = n1.y + (n2.y - n1.y) * pulsePos;

              ctx.beginPath();
              ctx.arc(px, py, 2.2, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = lineAlpha * 1.8;
              ctx.fill();
              ctx.restore();
            }
          }
        }

        // Draw Focus Bubble Spheres
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.pulsePhase += dt * 1.5;

          const pdx = node.x - pointer.x;
          const pdy = node.y - pointer.y;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

          if (interactive && pointer.x > 0 && pointer.y > 0) {
            if (node.isDragging) {
              node.x += (pointer.x - node.x) * 0.28;
              node.y += (pointer.y - node.y) * 0.28;
              node.vx = 0;
              node.vy = 0;
              node.targetRadius = node.baseRadius * 1.18;
            } else if (pDist < 140) {
              const force = (1 - pDist / 140) * 0.8;
              node.vx += (pdx / (pDist || 1)) * force;
              node.vy += (pdy / (pDist || 1)) * force;
              node.targetRadius = node.baseRadius * 1.12;
            } else {
              node.targetRadius = node.baseRadius;
            }
          } else {
            node.targetRadius = node.baseRadius;
          }

          node.radius += (node.targetRadius - node.radius) * 0.1;

          if (!node.isDragging) {
            node.x += node.vx;
            node.y += node.vy;
            node.vx *= 0.985;
            node.vy *= 0.985;
            node.vx += Math.sin(time * 0.0006 + i) * 0.02;
            node.vy += Math.cos(time * 0.0007 + i) * 0.02;

            const pad = node.radius + 10;
            if (node.x < pad) {
              node.x = pad;
              node.vx *= -0.7;
            } else if (node.x > width - pad) {
              node.x = width - pad;
              node.vx *= -0.7;
            }
            if (node.y < pad) {
              node.y = pad;
              node.vy *= -0.7;
            } else if (node.y > height - pad) {
              node.y = height - pad;
              node.vy *= -0.7;
            }
          }

          // Render Glass Bubble
          ctx.save();
          ctx.translate(node.x, node.y);
          const currentRadius = node.radius + Math.sin(node.pulsePhase) * 1.4;

          // Outer Glow
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius * 1.35, 0, Math.PI * 2);
          const glowGrad = ctx.createRadialGradient(0, 0, currentRadius * 0.6, 0, 0, currentRadius * 1.35);
          glowGrad.addColorStop(0, node.glowColor);
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.globalAlpha = isDark ? 0.38 : 0.22;
          ctx.fill();

          // Glass Body Fill
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          const bodyGrad = ctx.createRadialGradient(
            -currentRadius * 0.25,
            -currentRadius * 0.25,
            currentRadius * 0.15,
            0,
            0,
            currentRadius
          );
          bodyGrad.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.85)');
          bodyGrad.addColorStop(0.65, node.color + (isDark ? '33' : '22'));
          bodyGrad.addColorStop(1, node.color + (isDark ? '88' : '55'));
          ctx.fillStyle = bodyGrad;
          ctx.globalAlpha = 0.9;
          ctx.fill();

          // Glass Perimeter Border
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.9)';
          ctx.globalAlpha = 0.75;
          ctx.stroke();

          // Specular Light Highlight
          ctx.beginPath();
          ctx.ellipse(
            -currentRadius * 0.28,
            -currentRadius * 0.3,
            currentRadius * 0.38,
            currentRadius * 0.16,
            Math.PI / 4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.9)';
          ctx.globalAlpha = 0.65;
          ctx.fill();

          // Emoji & Label Text
          ctx.globalAlpha = 1;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.font = `${Math.round(currentRadius * 0.46)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
          ctx.fillText(node.emoji, 0, -currentRadius * 0.16);

          ctx.font = `bold ${Math.max(10, Math.round(currentRadius * 0.21))}px system-ui, -apple-system, sans-serif`;
          ctx.fillStyle = isDark ? '#ffffff' : '#1e293b';
          ctx.shadowColor = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)';
          ctx.shadowBlur = 4;
          ctx.fillText(node.label, 0, currentRadius * 0.34);

          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [style, isDark, interactive, effectiveShowBubbles]);

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerRef.current.x = x;
    pointerRef.current.y = y;
    pointerRef.current.isDown = true;

    // Check if clicked on a node when bubbles are enabled
    let clickedNode: BubbleNode | null = null;
    if (effectiveShowBubbles) {
      for (let i = nodesRef.current.length - 1; i >= 0; i--) {
        const n = nodesRef.current[i];
        const dx = n.x - x;
        const dy = n.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < n.radius + 10) {
          clickedNode = n;
          n.isDragging = true;
          pointerRef.current.grabbedNode = n;
          break;
        }
      }
    }

    // Spawn water ripple shockwave on click/tap!
    ripplesRef.current.push({
      x,
      y,
      radius: 8,
      maxRadius: 190,
      alpha: 0.85,
      color: clickedNode
        ? clickedNode.color
        : style === 'liquid-aurora'
        ? '#06b6d4'
        : style === 'cosmic-nebula'
        ? '#ec4899'
        : style === 'geometric-mesh'
        ? '#06b6d4'
        : isDark
        ? '#8b5cf6'
        : '#3b82f6',
    });

    // If clicked empty space, emit small repulsion wave
    if (!clickedNode && effectiveShowBubbles) {
      nodesRef.current.forEach((n) => {
        const dx = n.x - x;
        const dy = n.y - y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0 && d < 250) {
          const push = (1 - d / 250) * 4;
          n.vx += (dx / d) * push;
          n.vy += (dy / d) * push;
        }
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
  };

  const handlePointerUp = () => {
    pointerRef.current.isDown = false;
    if (pointerRef.current.grabbedNode) {
      pointerRef.current.grabbedNode.isDragging = false;
      pointerRef.current.grabbedNode.vx = (Math.random() - 0.5) * 1.5;
      pointerRef.current.grabbedNode.vy = (Math.random() - 0.5) * 1.5;
      pointerRef.current.grabbedNode = null;
    }
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = -1000;
    pointerRef.current.y = -1000;
    pointerRef.current.isDown = false;
    if (pointerRef.current.grabbedNode) {
      pointerRef.current.grabbedNode.isDragging = false;
      pointerRef.current.grabbedNode = null;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={`absolute inset-0 w-full h-full ${
        interactive ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
      style={{ touchAction: 'none' }}
    />
  );
}
