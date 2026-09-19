'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CornerDownLeft, Zap } from 'lucide-react';
import { CategoryType, Task } from '@/lib/types';
import { CATEGORIES, detectTimeSlotFromHour, formatJalaliShort, getCurrentJalaliDate } from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export default function QuickAddModal({
  isOpen,
  onClose,
  onAddTask,
  soundEnabled,
  hapticEnabled,
}: QuickAddModalProps) {
  const [input, setInput] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryType>('learning');

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const suggestions = [
    { text: 'امروز ساعت ۵ زبان انگلیسی', cat: 'english' as CategoryType },
    { text: 'یادگیری داکر و کوبرنتیز', cat: 'coding' as CategoryType },
    { text: 'ورزش و پیاده‌روی ۴۵ دقیقه', cat: 'fitness' as CategoryType },
    { text: 'مطالعه کتاب مدیریت زمان', cat: 'learning' as CategoryType },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    // Detect category from Persian keywords
    let detectedCat: CategoryType = selectedCat;
    const lower = input.toLowerCase();
    if (lower.includes('زبان') || lower.includes('انگلیسی') || lower.includes('english')) {
      detectedCat = 'english';
    } else if (lower.includes('کد') || lower.includes('برنامه') || lower.includes('پروژه') || lower.includes('backend')) {
      detectedCat = 'coding';
    } else if (lower.includes('ورزش') || lower.includes('باشگاه') || lower.includes('تمرین') || lower.includes('fitness')) {
      detectedCat = 'fitness';
    } else if (lower.includes('خواب') || lower.includes('استراحت')) {
      detectedCat = 'sleep';
    } else if (lower.includes('کار') || lower.includes('جلسه') || lower.includes('شرکت')) {
      detectedCat = 'work';
    } else if (lower.includes('خانه') || lower.includes('خرید')) {
      detectedCat = 'home';
    }

    soundFx.playSuccess(soundEnabled);
    triggerHaptic('medium', hapticEnabled);

    const detectedSlot = detectTimeSlotFromHour('18:00');

    onAddTask({
      title: input.trim(),
      category: detectedCat,
      startTime: '18:00',
      endTime: '19:00',
      durationMinutes: 60,
      priority: 'medium',
      timeSlot: detectedSlot,
      date: formatJalaliShort(getCurrentJalaliDate(), false),
    });

    setInput('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative w-full max-w-lg rounded-3xl glass-panel p-5 sm:p-6 shadow-2xl z-10 glass-edge border border-white/30 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  افزودن سریع تسک
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='مثلاً: "امروز ساعت ۵ زبان"'
                  autoFocus
                  className="w-full py-3 px-4 pr-4 pl-12 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-violet-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violet-500 transition-all cursor-pointer"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">پیشنهادهای هوشمند:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInput(s.text);
                        setSelectedCat(s.cat);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-300 transition-all cursor-pointer"
                    >
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">انتخاب دسته‌بندی:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => {
                    const cat = CATEGORIES[catKey];
                    const isSel = selectedCat === catKey;
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setSelectedCat(catKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                          isSel
                            ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                            : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/60'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-600/30 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-all cursor-pointer"
                >
                  افزودن به برنامه امروز ✨
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
