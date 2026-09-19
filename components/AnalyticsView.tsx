'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  AlertCircle,
  SunMedium,
  Sunset,
  Moon,
  Sparkles,
  BarChart3,
  PieChart,
  ListOrdered,
  Calendar,
  Zap,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { Task, CategoryType, PriorityLevel, DayTimeSlot } from '@/lib/types';
import {
  CATEGORIES,
  PRIORITIES,
  DAY_TIME_SLOTS,
  toPersianDigits,
  getPersianDateString,
} from '@/lib/persian';

interface AnalyticsViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  persianDigits?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export default function AnalyticsView({
  tasks,
  onToggleTask,
  onEditTask,
  persianDigits = true,
}: AnalyticsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Basic stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedCount = completedTasks.length;
  const pendingCount = pendingTasks.length;

  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Total completed focus minutes
  const totalCompletedMinutes = completedTasks.reduce(
    (acc, t) => acc + (t.durationMinutes || 60),
    0
  );
  const completedHours = Math.floor(totalCompletedMinutes / 60);
  const remainingMins = totalCompletedMinutes % 60;
  const formattedFocusTime =
    completedHours > 0
      ? `${completedHours}س ${remainingMins}د`
      : `${remainingMins} دقیقه`;

  // Priority breakdown
  const priorityStats = (['urgent', 'high', 'medium', 'low'] as PriorityLevel[]).map((pri) => {
    const list = tasks.filter((t) => (t.priority || 'medium') === pri);
    const done = list.filter((t) => t.completed).length;
    const total = list.length;
    const rate = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      pri,
      info: PRIORITIES[pri],
      total,
      done,
      rate,
    };
  });

  // Time Slot breakdown
  const timeSlotStats = (['morning', 'noon', 'afternoon', 'evening', 'night'] as DayTimeSlot[]).map(
    (slot) => {
      const list = tasks.filter((t) => (t.timeSlot || 'afternoon') === slot);
      const done = list.filter((t) => t.completed).length;
      const total = list.length;
      const rate = total > 0 ? Math.round((done / total) * 100) : 0;
      return {
        slot,
        info: DAY_TIME_SLOTS[slot],
        total,
        done,
        rate,
      };
    }
  );

  // Find best performing slot
  const activeSlots = timeSlotStats.filter((s) => s.total > 0);
  const bestSlot = activeSlots.sort((a, b) => b.rate - a.rate)[0];

  // Category breakdown
  const categoryStats = (Object.keys(CATEGORIES) as CategoryType[])
    .map((catKey) => {
      const list = tasks.filter((t) => t.category === catKey);
      const done = list.filter((t) => t.completed).length;
      const total = list.length;
      const minutes = list
        .filter((t) => t.completed)
        .reduce((acc, t) => acc + (t.durationMinutes || 60), 0);
      return {
        catKey,
        info: CATEGORIES[catKey],
        total,
        done,
        minutes,
      };
    })
    .filter((c) => c.total > 0);

  // Productivity score calculation (0 - 100)
  // Weighted: completionRate (70%) + urgent/high priority bonus (30%)
  const urgentHighTasks = tasks.filter(
    (t) => (t.priority || 'medium') === 'urgent' || (t.priority || 'medium') === 'high'
  );
  const urgentHighDone = urgentHighTasks.filter((t) => t.completed).length;
  const urgentHighRate =
    urgentHighTasks.length > 0 ? urgentHighDone / urgentHighTasks.length : 1;
  const productivityScore = Math.min(
    100,
    Math.round(completionRate * 0.7 + urgentHighRate * 100 * 0.3)
  );

  const displayedTasks =
    activeFilter === 'completed'
      ? completedTasks
      : activeFilter === 'pending'
      ? pendingTasks
      : tasks;

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner: Productivity Score & Progress */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 glass-panel glass-edge shadow-xl backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-0 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پنل تحلیل جامع و عملکرد امروز</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              گزارش پیشرفت روزانه
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
              {completionRate >= 80
                ? 'فوق‌العاده! بیش از ۸۰٪ برنامه‌ها انجام شده و راندمان شما در بالاترین سطح ممکن است.'
                : completionRate >= 50
                ? 'روند بسیار خوبی دارید! نیمی از کارها انجام شده و با تمرکز عصرگاهی به هدف ۱۰۰٪ می‌رسید.'
                : 'شروع خوب، کارهای با اولویت فوری را اولویت دهید تا نرخ راندمان جهش کند.'}
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{getPersianDateString(persianDigits)}</span>
            </div>
          </div>

          {/* Productivity Score Gauge */}
          <div className="flex items-center gap-4 bg-white/40 dark:bg-white/5 p-4 rounded-3xl border border-white/40 dark:border-white/10">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  className="text-slate-200 dark:text-slate-800"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  stroke="url(#analyticsGrad)"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - productivityScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="analyticsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white font-mono">
                  {toPersianDigits(productivityScore, persianDigits)}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">نمره راندمان</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                نرخ کل تحقق:
              </div>
              <div className="text-2xl font-black text-emerald-500 font-mono">
                {toPersianDigits(completionRate, persianDigits)}٪
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {toPersianDigits(completedCount, persianDigits)} از {toPersianDigits(totalTasks, persianDigits)} تسک
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Quick Metric Pods */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total */}
        <div className="rounded-2xl p-4 glass-panel space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">کل برنامه‌ها</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <ListOrdered className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white font-mono">
            {toPersianDigits(totalTasks, persianDigits)}
          </div>
          <span className="text-[11px] text-slate-400">تسک برنامه‌ریزی‌شده</span>
        </div>

        {/* Metric 2: Completed */}
        <div className="rounded-2xl p-4 glass-panel space-y-1.5 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">تکمیل‌شده</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {toPersianDigits(completedCount, persianDigits)}
          </div>
          <span className="text-[11px] text-emerald-500/80 font-bold">
            {toPersianDigits(completionRate, persianDigits)}٪ محقق شده
          </span>
        </div>

        {/* Metric 3: Pending */}
        <div className="rounded-2xl p-4 glass-panel space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500">باقی‌مانده</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {toPersianDigits(pendingCount, persianDigits)}
          </div>
          <span className="text-[11px] text-slate-400">در انتظار انجام</span>
        </div>

        {/* Metric 4: Focus Time */}
        <div className="rounded-2xl p-4 glass-panel space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-500">زمان فوکوس عمیق</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {toPersianDigits(formattedFocusTime, persianDigits)}
          </div>
          <span className="text-[11px] text-slate-400">مدت کار انجام‌شده</span>
        </div>
      </div>

      {/* Priority Matrix & Analysis (تحلیل بر اساس اولویت‌ها) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 md:p-6 glass-panel space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>تحلیل تحقق بر اساس اولویت‌ها (Priority Matrix)</span>
            </h3>
            <p className="text-xs text-slate-400">
              بررسی وضعیت کارهای فوری، بااهمیت، متوسط و عادی
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {priorityStats.map((item) => (
            <div
              key={item.pri}
              className={`p-4 rounded-2xl border transition-all space-y-2.5 ${item.info.badgeClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{item.info.emoji}</span>
                  <span className="font-bold text-xs">{item.info.title}</span>
                </div>
                <span className="text-xs font-mono font-bold">
                  {toPersianDigits(item.rate, persianDigits)}٪
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.rate}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-current"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] opacity-85">
                <span>انجام‌شده:</span>
                <span className="font-mono font-bold">
                  {toPersianDigits(item.done, persianDigits)} از {toPersianDigits(item.total, persianDigits)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Time Slot Performance (تحلیل بازه‌های روز) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl p-5 md:p-6 glass-panel space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <SunMedium className="w-4 h-4 text-amber-500" />
              <span>عملکرد در بازه‌های زمانی روز (Time Slots)</span>
            </h3>
            <p className="text-xs text-slate-400">
              کدام بازه روز بیشترین نرخ انجام و راندمان را داشته است؟
            </p>
          </div>

          {bestSlot && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <span>بازه طلایی: {bestSlot.info.emoji} {bestSlot.info.title}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
          {timeSlotStats.map((slotItem) => (
            <div
              key={slotItem.slot}
              className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{slotItem.info.emoji}</span>
                <span className="text-xs font-mono font-black text-violet-600 dark:text-violet-400">
                  {toPersianDigits(slotItem.rate, persianDigits)}٪
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  {slotItem.info.title}
                </div>
                <div className="text-[10px] text-slate-400">{slotItem.info.timeRange}</div>
              </div>

              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${slotItem.rate}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-emerald-500"
                />
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {toPersianDigits(slotItem.done, persianDigits)} از {toPersianDigits(slotItem.total, persianDigits)} تسک
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category Breakdown (تمرکز بر حوزه‌های زندگی) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-5 md:p-6 glass-panel space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span>تفکیک انجام بر اساس دسته‌بندی موضوعی</span>
          </h3>
          <span className="text-xs text-slate-400">
            {toPersianDigits(categoryStats.length, persianDigits)} حوزه فعال
          </span>
        </div>

        <div className="space-y-3">
          {categoryStats.map((c) => {
            const percent = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
            return (
              <div key={c.catKey} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <span>{c.info.emoji}</span>
                    <span>{c.info.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">
                      {toPersianDigits(c.done, persianDigits)} از {toPersianDigits(c.total, persianDigits)} تسک
                    </span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">
                      {toPersianDigits(percent, persianDigits)}٪
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-200/50 dark:bg-slate-800/80 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full bg-gradient-to-r ${c.info.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Detailed Tasks Breakdown & Log (چه کارها انجام شده و چه کارهایی مانده) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl p-5 md:p-6 glass-panel space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>ریزگزارش کارها و وضعیت تسک‌ها</span>
            </h3>
            <p className="text-xs text-slate-400">
              مشاهده کارنامه دقیق امروز، ویرایش و پیگیری کارها
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-2xl glass-pill self-start sm:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              همه ({toPersianDigits(totalTasks, persianDigits)})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              انجام‌شده ({toPersianDigits(completedCount, persianDigits)})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              مانده ({toPersianDigits(pendingCount, persianDigits)})
            </button>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="space-y-2.5 pt-2">
          {displayedTasks.map((t) => {
            const cat = CATEGORIES[t.category] || CATEGORIES.work;
            const pri = PRIORITIES[t.priority || 'medium'];
            const slot = DAY_TIME_SLOTS[t.timeSlot || 'afternoon'];

            return (
              <div
                key={t.id}
                onClick={() => onEditTask(t)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  t.completed
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 hover:border-violet-400/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(t.id);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      t.completed
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-violet-500'
                    }`}
                  >
                    {t.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-bold ${
                          t.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {t.title}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold ${pri.badgeClass}`}
                      >
                        {pri.emoji} {pri.shortTitle}
                      </span>

                      {/* Time Slot Badge */}
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {slot.emoji} {slot.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      <span>{toPersianDigits(t.startTime, persianDigits)} تا {toPersianDigits(t.endTime, persianDigits)}</span>
                      <span>•</span>
                      <span>{cat.emoji} {cat.title}</span>
                      {t.date && (
                        <>
                          <span>•</span>
                          <span>{toPersianDigits(t.date, persianDigits)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-xl font-bold whitespace-nowrap ${
                      t.completed
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {t.completed ? 'انجام شد ✓' : 'در انتظار'}
                  </span>
                </div>
              </div>
            );
          })}

          {displayedTasks.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              موردی در این دسته وجود ندارد.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
