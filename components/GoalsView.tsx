'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Target, Plus, Calendar, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Goal } from '@/lib/types';
import { CATEGORIES, toPersianDigits } from '@/lib/persian';
import Illustration from './Illustrations';

interface GoalsViewProps {
  goals: Goal[];
  onOpenNewGoal: () => void;
  persianDigits: boolean;
}

export default function GoalsView({ goals, onOpenNewGoal, persianDigits }: GoalsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-500" />
            <span>اهداف بلندمدت و فصلی</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ردیابی اهداف کلان و تبدیل آنها به کارهای روزانه
          </p>
        </div>

        <button
          onClick={onOpenNewGoal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>هدف جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, index) => {
          const cat = CATEGORIES[goal.category] || CATEGORIES.coding;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-3xl p-5 md:p-6 glass-panel glass-edge transition-all relative overflow-hidden group hover:border-violet-400/40"
            >
              {/* Dynamic Glow background */}
              <div
                className="absolute -top-10 -left-10 w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ backgroundColor: cat.glow }}
              />

              <div className="relative z-10 space-y-4">
                {/* Header: Title, Category, Percent */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.emoji}</span>
                      <h4 className="text-lg font-extrabold text-slate-800 dark:text-white">
                        {goal.title}
                      </h4>
                    </div>
                    {goal.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-violet-600 dark:text-violet-400 font-mono">
                      {toPersianDigits(goal.currentProgress, persianDigits)}٪
                    </span>
                  </div>
                </div>

                {/* Progress Bar (Visual) */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded-full bg-slate-200/50 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-white/20 dark:border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.currentProgress}%` }}
                      transition={{ duration: 1, delay: 0.1 * index, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color} shadow-[0_0_10px_rgba(139,92,246,0.4)]`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>
                        {toPersianDigits(goal.completedTasks, persianDigits)} از {toPersianDigits(goal.totalTasks, persianDigits)} تسک
                      </span>
                    </span>

                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>مهلت: {goal.deadline}</span>
                    </span>
                  </div>
                </div>

                {/* Micro Milestones */}
                <div className="pt-2 border-t border-white/10 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    وضعیت: {goal.currentProgress >= 100 ? 'تکمیل شد 🎉' : 'در مسیر پیشرفت'}
                  </span>
                  <span className="text-violet-500 font-medium inline-flex items-center gap-0.5 group-hover:-translate-x-1 transition-transform">
                    <span>جزئیات هدف</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
