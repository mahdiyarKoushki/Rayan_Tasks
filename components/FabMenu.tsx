'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CheckSquare, Sparkles, Target, Zap } from 'lucide-react';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface FabMenuProps {
  onSelectAction: (action: 'task' | 'habit' | 'goal' | 'quick') => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export default function FabMenu({ onSelectAction, soundEnabled, hapticEnabled }: FabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    setIsOpen(!isOpen);
  };

  const handleAction = (action: 'task' | 'habit' | 'goal' | 'quick') => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('medium', hapticEnabled);
    setIsOpen(false);
    onSelectAction(action);
  };

  const items = [
    { id: 'quick' as const, label: 'ثبت سریع با هوشمندی', icon: Zap, color: 'from-amber-500 to-orange-500' },
    { id: 'task' as const, label: 'تسک جدید (Task)', icon: CheckSquare, color: 'from-violet-600 to-indigo-600' },
    { id: 'habit' as const, label: 'عادت جدید (Habit)', icon: Sparkles, color: 'from-emerald-500 to-teal-500' },
    { id: 'goal' as const, label: 'هدف جدید (Goal)', icon: Target, color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="fixed bottom-24 md:bottom-28 left-6 md:left-10 z-50">
      {/* Backdrop when menu is expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Actions Stack */}
      <div className="relative flex flex-col items-start gap-2.5 mb-3">
        <AnimatePresence>
          {isOpen &&
            items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(item.id)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel glass-edge border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Main Glass Floating Action Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_35px_rgba(139,92,246,0.5)] transition-all cursor-pointer border border-white/30 backdrop-blur-xl ${
          isOpen ? 'bg-slate-800 dark:bg-slate-700 rotate-45' : 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500'
        }`}
      >
        <Plus className="w-7 h-7 stroke-[2.5] transition-transform duration-300" />
      </motion.button>
    </div>
  );
}
