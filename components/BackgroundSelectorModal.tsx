'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Layers,
  MousePointer,
  Sliders,
  Check,
  CircleDot,
  Eye,
} from 'lucide-react';
import { BackgroundStyle, AppSettings } from '@/lib/types';
import { toPersianDigits } from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface BackgroundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

const STYLES_LIST: {
  id: BackgroundStyle;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  tag: string;
}[] = [
  {
    id: 'bubble-map',
    title: 'بابل‌مپ تعاملی و هوشمند (Bubble Map)',
    subtitle: 'گوی‌های شیشه‌ای متحرک با دسته‌بندی تسک‌ها، فیزیک شناور و خطوط ارتباطی',
    icon: '🫧',
    color: 'from-violet-500 to-indigo-500',
    tag: 'اصلی',
  },
  {
    id: 'liquid-aurora',
    title: 'مایع شیشه‌ای و آرورا (Liquid Aurora)',
    subtitle: 'امواج نوری سیال و پیوسته با ذرات بیولومینسانس و رنگ‌های زمردی-فیروزه‌ای',
    icon: '🌊',
    color: 'from-emerald-500 to-cyan-500',
    tag: 'آرامش‌بخش',
  },
  {
    id: 'cosmic-nebula',
    title: 'سحابی و کهکشان کیهانی (Cosmic Nebula)',
    subtitle: 'آسمان پرستاره با ۱۸۰+ ستاره چشمک‌زن، صورت‌های فلکی و شهاب‌های متحرک',
    icon: '🌌',
    color: 'from-purple-500 to-pink-500',
    tag: 'عمیق',
  },
  {
    id: 'lofi-rain',
    title: 'باران نئونی و Lo-Fi (Twilight Rain)',
    subtitle: 'قطرات باران بر شیشه پنجره، امواج آب و نورهای گرم بوکه در پس‌زمینه گرگ‌ومیش',
    icon: '🌧️',
    color: 'from-blue-600 to-indigo-800',
    tag: 'تمرکز شبانه',
  },
  {
    id: 'geometric-mesh',
    title: 'شبکه هندسی و سایبرنتیک (Geometric Mesh)',
    subtitle: 'ماتریس سه‌بعدی کریستالی با پالس‌های دیجیتال و کشش گرانشی به سمت موس',
    icon: '🕸️',
    color: 'from-cyan-500 to-violet-600',
    tag: 'مدرن',
  },
];

export default function BackgroundSelectorModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: BackgroundSelectorModalProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectStyle = (style: BackgroundStyle) => {
    soundFx.playClick(settings.soundEnabled);
    triggerHaptic('medium', settings.hapticEnabled);
    onUpdateSettings({ backgroundStyle: style });
  };

  const handleInteractiveToggle = () => {
    const nextVal = !settings.interactiveBubbles;
    soundFx.playClick(settings.soundEnabled);
    triggerHaptic('light', settings.hapticEnabled);
    onUpdateSettings({ interactiveBubbles: nextVal });
  };

  const handleShowBubblesToggle = () => {
    const current = settings.showFocusBubbles ?? (settings.backgroundStyle === 'bubble-map');
    const nextVal = !current;
    soundFx.playClick(settings.soundEnabled);
    triggerHaptic('light', settings.hapticEnabled);
    onUpdateSettings({ showFocusBubbles: nextVal });
  };

  const isBubblesActive = settings.showFocusBubbles ?? (settings.backgroundStyle === 'bubble-map');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
        {/* Soft Transparent Backdrop so background changes are immediately visible behind */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] rounded-3xl glass-panel glass-edge border border-white/30 dark:border-white/10 shadow-2xl backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 z-10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/50 dark:bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    استایل پس‌زمینه و بابل‌مپ
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <Eye className="w-3 h-3" />
                    <span>پیش‌نمایش زنده</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  با کلیک روی هر استایل، تغییرات فوراً در صفحه اعمال و در دیتابیس ذخیره می‌شود
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain custom-scrollbar">
            {/* Style Cards */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-violet-500" />
                  <span>انتخاب سبک گرافیکی پس‌زمینه (۵ سبک زنده):</span>
                </span>
                <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold">
                  استایل فعلی: {STYLES_LIST.find((s) => s.id === settings.backgroundStyle)?.title.split(' ')[0]}
                </span>
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {STYLES_LIST.map((item) => {
                  const isSelected = settings.backgroundStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectStyle(item.id)}
                      className={`relative p-3.5 rounded-2xl text-right flex items-center justify-between gap-3 border transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'border-violet-500 ring-2 ring-violet-500/30 bg-violet-500/15 shadow-md shadow-violet-500/10'
                          : 'border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:border-violet-400/40 hover:bg-white/60 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center text-2xl shadow-md shrink-0`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                              {item.title}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                              {item.tag}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600 text-white flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>فعال شده</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-violet-600 text-white shadow'
                              : 'border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Focus Bubbles Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  <CircleDot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                    نمایش گوی‌های حبابی تمرکز (Focus Bubbles)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    نمایش گوی‌های شیشه‌ای دسته‌بندی تسک‌ها (تمرکز، English، Backend، ورزش و ...)
                  </p>
                </div>
              </div>

              <button
                onClick={handleShowBubblesToggle}
                className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1 shrink-0 ${
                  isBubblesActive ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isBubblesActive ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Interactive Physics Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  <MousePointer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                    فیزیک تعاملی لمسی / اشاره‌گر
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    واکنش گوی‌ها و امواج به حرکت موس، ضربه، کشیدن و رها کردن و موج ضربه
                  </p>
                </div>
              </div>

              <button
                onClick={handleInteractiveToggle}
                className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1 shrink-0 ${
                  settings.interactiveBubbles ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.interactiveBubbles ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Dimming Slider */}
            <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-violet-500" />
                  <span>شدت محوشدگی برای خوانایی متون:</span>
                </span>
                <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
                  {toPersianDigits(settings.backgroundDim || 25, settings.persianDigits)}٪
                </span>
              </div>

              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={settings.backgroundDim || 25}
                onChange={(e) => onUpdateSettings({ backgroundDim: Number(e.target.value) })}
                className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>شفاف و با وضوح بالا (۵٪)</span>
                <span>متعادل (۲۵٪)</span>
                <span>بسیار تیره (۷۰٪)</span>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-5 py-3.5 border-t border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>تایید و بازگشت به برنامه</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
