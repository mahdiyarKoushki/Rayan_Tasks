'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Check, Plus, Sparkles } from 'lucide-react';
import { Habit } from '@/lib/types';
import { CATEGORIES, PERSIAN_WEEK_DAYS, toPersianDigits } from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface HabitCardsProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onOpenNewHabit: () => void;
  persianDigits: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export default function HabitCards({
  habits,
  onToggleHabit,
  onOpenNewHabit,
  persianDigits,
  soundEnabled,
  hapticEnabled,
}: HabitCardsProps) {
  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playCelebration(soundEnabled);
    triggerHaptic('medium', hapticEnabled);
    onToggleHabit(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>عادت‌های روزانه و روتین‌ها</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تکرار پیوسته و ساخت هویت مثبت
          </p>
        </div>

        <button
          onClick={onOpenNewHabit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-xs font-semibold text-violet-600 dark:text-violet-300 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>عادت جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit, index) => {
          const cat = CATEGORIES[habit.category] || CATEGORIES.english;

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className={`rounded-3xl p-5 glass-panel glass-edge transition-all duration-300 relative overflow-hidden ${
                habit.completedToday
                  ? 'border-emerald-500/30 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]'
                  : 'hover:border-violet-400/30'
              }`}
            >
              {habit.completedToday && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="relative z-10 space-y-4">
                {/* Header: Emoji, Title, Streak */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 flex items-center justify-center text-2xl shadow-sm">
                      {cat.emoji}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-800 dark:text-white">
                        {habit.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {cat.title} • {habit.targetFrequency}
                      </span>
                    </div>
                  </div>

                  {/* Flame Streak Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
                    <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                    <span>{toPersianDigits(habit.streak, persianDigits)} روز</span>
                  </div>
                </div>

                {/* Persian Weekday Status Dots: ش ی د س چ پ ج */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between px-1">
                    {PERSIAN_WEEK_DAYS.map((day, dIdx) => (
                      <span key={dIdx} className="text-[11px] font-medium text-slate-400">
                        {day.short}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-1">
                    {habit.weeklyHistory.map((done, dIdx) => {
                      const isToday = dIdx === 6; // Last slot represents today
                      return (
                        <div
                          key={dIdx}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                            done
                              ? 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                              : isToday
                              ? 'bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-violet-400 text-transparent'
                              : 'bg-slate-200 dark:bg-slate-800 text-transparent'
                          }`}
                        >
                          {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Check Action Button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => handleToggle(habit.id, e)}
                  className={`w-full py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    habit.completedToday
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/25'
                  }`}
                >
                  {habit.completedToday ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>امروز انجام شد ✨</span>
                    </>
                  ) : (
                    <>
                      <span>ثبت انجام امروز</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
