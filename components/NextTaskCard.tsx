'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Task } from '@/lib/types';
import { CATEGORIES, toPersianDigits } from '@/lib/persian';

interface NextTaskCardProps {
  task: Task | null;
  persianDigits: boolean;
  onSelect?: (task: Task) => void;
}

export default function NextTaskCard({ task, persianDigits, onSelect }: NextTaskCardProps) {
  if (!task) {
    return null;
  }

  const cat = CATEGORIES[task.category] || CATEGORIES.english;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative rounded-2xl p-4 glass-panel glass-edge border border-white/20 dark:border-white/10 shadow-md backdrop-blur-xl flex items-center justify-between gap-3 group hover:border-emerald-500/30 transition-all cursor-pointer"
      onClick={() => onSelect && onSelect(task)}
    >
      <div className="flex items-center gap-3.5">
        {/* Next Tag Indicator Pill */}
        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">NEXT</span>
          <span className="text-lg">{cat.emoji}</span>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100">
              {task.title}
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-white/10 text-slate-600 dark:text-slate-400">
              {cat.title}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-emerald-500" />
              <span>{toPersianDigits(task.startTime, persianDigits)}</span>
            </span>
            <span>•</span>
            <span>{toPersianDigits(task.durationMinutes, persianDigits)} دقیقه</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 group-hover:text-emerald-400 transition-colors">
        <span className="hidden sm:inline text-xs font-medium">مشاهده</span>
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      </div>
    </motion.div>
  );
}
