'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Clock, BarChart3, Flame } from 'lucide-react';
import { toPersianDigits } from '@/lib/persian';

interface WeeklyOverviewProps {
  persianDigits: boolean;
}

export default function WeeklyOverview({ persianDigits }: WeeklyOverviewProps) {
  // Category growth hours
  const categories = [
    { title: 'زبان انگلیسی', emoji: '🇬🇧', hours: '۱۴س ۲۰د', percent: 85, color: 'from-emerald-500 to-teal-500' },
    { title: 'یادگیری Backend', emoji: '🧠', hours: '۱۰س ۴۵د', percent: 70, color: 'from-purple-500 to-violet-600' },
    { title: 'پروژه و کدنویسی', emoji: '💻', hours: '۸س ۱۵د', percent: 55, color: 'from-cyan-500 to-blue-600' },
    { title: 'ورزش و تندرستی', emoji: '🏋️', hours: '۵س ۳۰د', percent: 45, color: 'from-rose-500 to-red-500' },
  ];

  // 7 days of the Persian week completion stats
  const weeklyDays = [
    { day: 'شنبه', short: 'ش', percent: 90, active: true },
    { day: 'یک‌شنبه', short: 'ی', percent: 75, active: false },
    { day: 'دوشنبه', short: 'د', percent: 85, active: false },
    { day: 'سه‌شنبه', short: 'س', percent: 60, active: false },
    { day: 'چهارشنبه', short: 'چ', percent: 95, active: false },
    { day: 'پنج‌شنبه', short: 'پ', percent: 80, active: false },
    { day: 'جمعه', short: 'ج', percent: 50, active: false },
  ];

  // Heatmap matrix: 7 days x 4 time periods (صبح, ظهر, عصر, شب)
  const heatmapData = [
    [3, 2, 4, 3], // شنبه
    [2, 3, 3, 1], // یک‌شنبه
    [4, 4, 2, 3], // دوشنبه
    [1, 2, 3, 2], // سه‌شنبه
    [4, 3, 4, 4], // چهارشنبه
    [3, 3, 2, 1], // پنج‌شنبه
    [1, 1, 2, 0], // جمعه
  ];

  const timeSlots = ['صبح', 'ظهر', 'عصر', 'شب'];

  return (
    <div className="space-y-6">
      {/* Top Banner: +14h 30m رشد شخصی */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 glass-panel glass-edge shadow-xl backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>گزارش عملکرد هفتگی</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              این هفته
            </h2>
            <div className="text-xl md:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-mono">
              <span>{toPersianDigits('+14h 30m', persianDigits)}</span>
              <span className="text-base font-normal text-slate-700 dark:text-slate-200">رشد شخصی</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 text-center">
              <span className="block text-xs text-slate-500 dark:text-slate-400">میانگین روزانه</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">
                {toPersianDigits('۴س ۱۵د', persianDigits)}
              </span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium">بهره‌وری</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {toPersianDigits('۷۸٪', persianDigits)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Growth Breakdown Bars */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 md:p-6 glass-panel space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-500" />
            <span>تفکیک تمرکز بر دسته‌ها</span>
          </h3>
          <span className="text-xs text-slate-400">۴ حوزه فعال</span>
        </div>

        <div className="space-y-3.5">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.title}</span>
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  {toPersianDigits(cat.hours, persianDigits)}
                </span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-slate-200/50 dark:bg-slate-800/80 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.1 + idx * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Completion Chart (7 days) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-5 md:p-6 glass-panel space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span>Weekly Completion (نرخ تحقق روزانه)</span>
          </h3>
          <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>هفته فوق‌العاده</span>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44">
          {weeklyDays.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center h-full justify-end gap-2 group">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {toPersianDigits(item.percent, persianDigits)}٪
              </span>
              <div className="w-full max-w-[32px] bg-slate-200/40 dark:bg-slate-800/50 rounded-2xl h-28 flex items-end p-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.percent}%` }}
                  transition={{ duration: 0.7, delay: 0.05 * idx, ease: 'easeOut' }}
                  className={`w-full rounded-xl transition-all ${
                    item.active
                      ? 'bg-gradient-to-t from-violet-600 to-indigo-400 shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                      : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                  }`}
                />
              </div>
              <span className={`text-xs font-medium ${item.active ? 'text-violet-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.short}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Heatmap Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl p-5 md:p-6 glass-panel space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            نقشه حرارتی تمرکز در طول هفته
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span>کمتر</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-800/50" />
            <span className="w-2.5 h-2.5 rounded bg-violet-900/60" />
            <span className="w-2.5 h-2.5 rounded bg-violet-600" />
            <span className="w-2.5 h-2.5 rounded bg-violet-400" />
            <span>بیشتر</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="min-w-[280px] space-y-1.5">
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] text-slate-400 pb-1">
              <span>روز</span>
              {timeSlots.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>

            {weeklyDays.map((d, dIdx) => (
              <div key={dIdx} className="grid grid-cols-5 gap-1.5 items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                  {d.short}
                </span>
                {heatmapData[dIdx].map((level, lIdx) => {
                  const color =
                    level === 4
                      ? 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]'
                      : level === 3
                      ? 'bg-violet-600'
                      : level === 2
                      ? 'bg-violet-800/60'
                      : level === 1
                      ? 'bg-slate-300 dark:bg-slate-800'
                      : 'bg-slate-200 dark:bg-slate-900/60';
                  return (
                    <div
                      key={lIdx}
                      className={`h-6 rounded-lg transition-all ${color}`}
                      title={`${d.day} ${timeSlots[lIdx]}: سطح تمرکز ${level}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
