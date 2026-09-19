'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  Database,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { toPersianDigits, detectTimeSlotFromHour, DAY_TIME_SLOTS } from '@/lib/persian';
import { BackgroundStyle } from '@/lib/types';

interface HeaderHeroProps {
  userName: string;
  dateString: string;
  completionRate: number; // 0 - 100, e.g. 68
  completedCount: number;
  totalCount: number;
  focusMinutes: number;
  persianDigits: boolean;
  onOpenQuickAdd: () => void;
  onOpenBackgroundSelector?: () => void;
  backgroundStyle?: BackgroundStyle;
  dbSyncStatus?: 'synced' | 'syncing' | 'error';
  onLogout?: () => void;
}

export default function HeaderHero({
  userName,
  dateString,
  completionRate,
  completedCount,
  totalCount,
  focusMinutes,
  persianDigits,
  onOpenQuickAdd,
  onOpenBackgroundSelector,
  backgroundStyle = 'bubble-map',
  dbSyncStatus = 'synced',
  onLogout,
}: HeaderHeroProps) {
  // Live Iranian clock state
  const [liveTime, setLiveTime] = useState<string>('');
  const [currentSlotKey, setCurrentSlotKey] = useState<string>('afternoon');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${h}:${m}:${s}`);
      setCurrentSlotKey(detectTimeSlotFromHour(`${h}:${m}`));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // SVG circular calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  const currentSlot = DAY_TIME_SLOTS[currentSlotKey as keyof typeof DAY_TIME_SLOTS] || DAY_TIME_SLOTS.afternoon;

  const styleLabels: Record<BackgroundStyle, { label: string; icon: string }> = {
    'bubble-map': { label: 'بابل‌مپ تعاملی', icon: '🫧' },
    'liquid-aurora': { label: 'مایع آرورا', icon: '🌊' },
    'cosmic-nebula': { label: 'سحابی کیهانی', icon: '🌌' },
    'lofi-rain': { label: 'باران نئونی', icon: '🌧️' },
    'geometric-mesh': { label: 'مش هندسی', icon: '🕸️' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl glass-panel p-5 md:p-6 overflow-hidden glass-edge shadow-xl backdrop-blur-2xl"
    >
      {/* Ambient background glow inside the hero card */}
      <div className="absolute top-0 right-1/4 w-44 h-44 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-44 h-44 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Right side (Persian RTL): Greeting, Date, and Motivation */}
        <div className="w-full md:w-auto flex-1 space-y-3">
          {/* Status Capsule, Live Date, Live Clock, DB Sync, and Logout */}
          <div className="flex items-center justify-between md:justify-start gap-2 flex-wrap">
            {/* Live Clock */}
            {liveTime && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30">
                <Clock className="w-3.5 h-3.5 text-violet-500 animate-spin-slow" />
                <span>{toPersianDigits(liveTime, persianDigits)}</span>
              </div>
            )}

            {/* Current Day Time Slot */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <span>{currentSlot.emoji}</span>
              <span>{currentSlot.title}</span>
            </div>

            {/* Database Persistence Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                dbSyncStatus === 'syncing'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30'
                  : dbSyncStatus === 'error'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
              }`}
            >
              {dbSyncStatus === 'syncing' ? (
                <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
              ) : (
                <Database className="w-3 h-3 text-emerald-500" />
              )}
              <span>
                {dbSyncStatus === 'syncing'
                  ? 'ذخیره در دیتابیس...'
                  : dbSyncStatus === 'error'
                  ? 'خطای ذخیره دیتابیس'
                  : 'دیتابیس ذخیره شد ✓'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              <span>{dateString}</span>
            </div>

            {onOpenBackgroundSelector && (
              <button
                onClick={onOpenBackgroundSelector}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 hover:bg-violet-500/25 text-violet-600 dark:text-violet-300 border border-violet-500/30 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                title="تغییر استایل بک‌گراند و بابل‌مپ"
              >
                <span>{styleLabels[backgroundStyle]?.icon || '🫧'}</span>
                <span>{styleLabels[backgroundStyle]?.label || 'بابل‌مپ'}</span>
                <span className="text-[10px] text-violet-400 dark:text-violet-300">⚙️</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer mr-auto md:mr-0"
                title="خروج از حساب کاربری"
              >
                <LogOut className="w-3 h-3" />
                <span>خروج (mk)</span>
              </button>
            )}
          </div>

          {/* Main Greeting */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <span>سلام {userName || 'mk'}</span>
              <motion.span
                animate={{ rotate: [0, 15, -10, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block origin-bottom-right"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">
              امروز <span className="text-violet-600 dark:text-violet-400 font-bold">{toPersianDigits(completionRate, persianDigits)}٪</span> برنامه‌ات انجام شده.
            </p>
          </div>

          {/* Mini Stats Badges */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{toPersianDigits(completedCount, persianDigits)} از {toPersianDigits(totalCount, persianDigits)} تسک</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{toPersianDigits(focusMinutes, persianDigits)} دقیقه تمرکز</span>
            </div>
          </div>
        </div>

        {/* Left side: Circular Progress Visual */}
        <div className="relative flex items-center justify-center p-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Arc Progress */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-200/60 dark:text-slate-800/80"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Gradient Def */}
              <defs>
                <linearGradient id="heroProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {/* Active Animated Progress */}
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#heroProgressGrad)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                {toPersianDigits(completionRate, persianDigits)}٪
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                تکمیل روز
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
