'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPersianDigits } from '@/lib/persian';

interface CelebrationToastProps {
  consecutiveCount: number;
  message?: string;
  onClose: () => void;
  persianDigits?: boolean;
  soundEnabled?: boolean;
}

export default function CelebrationToast({
  consecutiveCount,
  message,
  onClose,
  persianDigits = true,
  soundEnabled = true,
}: CelebrationToastProps) {
  useEffect(() => {
    // Subtle, elegant confetti shower
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75, x: 0.5 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore
    }

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [consecutiveCount, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
      >
        <div className="rounded-2xl p-4 glass-panel glass-edge border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-violet-500/15 to-emerald-500/15 shadow-[0_15px_35px_rgba(245,158,11,0.25)] backdrop-blur-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
              <Flame className="w-5 h-5 fill-current animate-bounce" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>🔥 {toPersianDigits(consecutiveCount, persianDigits)} کار پشت سر هم انجام شد!</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {message || '✨ امروز عالی پیش رفتی و تمرکزت فوق‌العاده است'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
