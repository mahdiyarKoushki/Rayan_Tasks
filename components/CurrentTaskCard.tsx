'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, CheckCircle2, Clock, Flame, RotateCcw, Edit2 } from 'lucide-react';
import { Task } from '@/lib/types';
import { CATEGORIES, PRIORITIES, DAY_TIME_SLOTS, toPersianDigits } from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface CurrentTaskCardProps {
  task: Task | null;
  onComplete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  persianDigits: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export default function CurrentTaskCard({
  task,
  onComplete,
  onEdit,
  persianDigits,
  soundEnabled,
  hapticEnabled,
}: CurrentTaskCardProps) {
  // Timer state (countdown in seconds: default 32 minutes = 1920s)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(32 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  if (!task) {
    return null;
  }

  const cat = CATEGORIES[task.category] || CATEGORIES.learning;
  const pri = PRIORITIES[task.priority || 'medium'];
  const slot = DAY_TIME_SLOTS[task.timeSlot || 'afternoon'];
  const totalSeconds = task.durationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)));

  const minutesLeft = Math.floor(secondsRemaining / 60);
  const secsLeft = secondsRemaining % 60;
  const formattedSeconds = `${minutesLeft}:${secsLeft < 10 ? '0' : ''}${secsLeft}`;

  const toggleTimer = () => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    setIsRunning(!isRunning);
  };

  const handleFinish = () => {
    soundFx.playSuccess(soundEnabled);
    triggerHaptic('medium', hapticEnabled);
    onComplete(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl p-5 md:p-6 overflow-hidden glass-edge transition-all duration-300 shadow-[0_20px_45px_-15px_rgba(139,92,246,0.25)] border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900/40 to-slate-900/60 dark:from-violet-950/40 dark:via-slate-900/80 dark:to-slate-950/90 backdrop-blur-2xl"
    >
      {/* Dynamic Ambient Glow inside card */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-violet-600/25 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header line: Tag & Live Indicator */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <span className="text-sm">{cat.emoji}</span>
              <span>در حال انجام</span>
            </div>

            <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold ${pri.badgeClass}`}>
              {pri.emoji} {pri.shortTitle}
            </span>

            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/60 text-slate-300 font-medium">
              {slot.emoji} {slot.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-violet-300/80 font-mono">
              <span className="relative flex h-2 w-2">
                {isRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              <span>{toPersianDigits(task.startTime, persianDigits)} — {toPersianDigits(task.endTime, persianDigits)}</span>
            </div>

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
                title="ویرایش تسک جاری"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Task Title and Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{task.title}</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              {cat.title} • فوکوس عمیق
            </p>
          </div>

          {/* Big Category Emoji Bubble */}
          <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 flex items-center justify-center text-3xl shadow-inner shadow-white/10">
            {cat.emoji}
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>{toPersianDigits(minutesLeft, persianDigits)} دقیقه باقی مانده</span>
              {isRunning && <span className="text-[10px] text-violet-400 font-mono">({toPersianDigits(formattedSeconds, persianDigits)})</span>}
            </span>
            <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">
              {toPersianDigits(progressPercent, persianDigits)}٪
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-200/50 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-white/20 dark:border-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>توقف موقت</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>ادامه تایمر</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium text-sm transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>پایان تسک</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
