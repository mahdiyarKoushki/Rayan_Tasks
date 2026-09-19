'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Check, X, Sparkles } from 'lucide-react';
import { toPersianDigits } from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface PersianTimePickerProps {
  label: string;
  value: string; // "14:30" or "09:00" in 24h format
  onChange: (timeStr: string) => void;
  persianDigits?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

const COMMON_PRESETS = [
  { label: '۸:۰۰ صبح', time: '08:00' },
  { label: '۱۰:۳۰ کاری', time: '10:30' },
  { label: '۱۳:۰۰ ظهر', time: '13:00' },
  { label: '۱۵:۰۰ بعدازظهر', time: '15:00' },
  { label: '۱۷:۰۰ عصر', time: '17:00' },
  { label: '۱۹:۳۰ غروب', time: '19:30' },
  { label: '۲۱:۰۰ شب', time: '21:00' },
  { label: '۲۳:۰۰ استراحت', time: '23:00' },
];

const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export default function PersianTimePicker({
  label,
  value = '10:00',
  onChange,
  persianDigits = true,
  soundEnabled = true,
  hapticEnabled = true,
}: PersianTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize current value to [hour, minute] directly from controlled prop
  const [hStr, mStr] = (value || '10:00').split(':');
  const selectedHour = parseInt(hStr, 10) || 10;
  const selectedMinute = parseInt(mStr, 10) || 0;

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const applyTime = (hour: number, minute: number) => {
    const formattedH = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedM = minute < 10 ? `0${minute}` : `${minute}`;
    onChange(`${formattedH}:${formattedM}`);
  };

  const handleSelectHour = (hour: number) => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    applyTime(hour, selectedMinute);
  };

  const handleSelectMinute = (minute: number) => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    applyTime(selectedHour, minute);
  };

  const handleSelectPreset = (timeStr: string) => {
    soundFx.playSuccess(soundEnabled);
    triggerHaptic('medium', hapticEnabled);
    onChange(timeStr);
    setIsOpen(false);
  };

  // Formatted display string
  const displayH = selectedHour < 10 ? `0${selectedHour}` : `${selectedHour}`;
  const displayM = selectedMinute < 10 ? `0${selectedMinute}` : `${selectedMinute}`;
  const formattedDisplay = `${toPersianDigits(displayH, persianDigits)}:${toPersianDigits(
    displayM,
    persianDigits
  )}`;

  return (
    <div ref={containerRef} className="relative space-y-1 w-full">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {/* Button trigger that looks like a native input but styled in liquid glass */}
      <button
        type="button"
        onClick={() => {
          soundFx.playClick(soundEnabled);
          triggerHaptic('light', hapticEnabled);
          setIsOpen(!isOpen);
        }}
        className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
          isOpen
            ? 'bg-violet-500/10 border-violet-500 ring-2 ring-violet-500/20 text-violet-600 dark:text-violet-300'
            : 'bg-white/60 dark:bg-white/5 border-white/30 dark:border-white/10 hover:border-violet-400/50 text-slate-800 dark:text-white'
        }`}
      >
        <span className="font-mono text-sm font-bold tracking-wider">{formattedDisplay}</span>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-4 h-4 text-violet-500" />
          <span className="text-[11px]">انتخاب</span>
        </div>
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1 p-4 rounded-3xl glass-panel shadow-2xl border border-white/40 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl space-y-3.5 select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                <Clock className="w-4 h-4 text-violet-500" />
                <span>تنظیم ساعت ۲۴ ساعته ایرانی</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>زمان‌های پیشنهادی روز:</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {COMMON_PRESETS.map((preset) => (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => handleSelectPreset(preset.time)}
                    className="py-1 px-1.5 text-[11px] rounded-xl bg-white/40 dark:bg-white/5 hover:bg-violet-500/15 hover:text-violet-600 dark:hover:text-violet-300 border border-white/20 dark:border-white/10 transition-all font-mono text-center truncate cursor-pointer"
                  >
                    {toPersianDigits(preset.time, persianDigits)}
                  </button>
                ))}
              </div>
            </div>

            {/* Hour Selector (00 to 23) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>ساعت:</span>
                <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">
                  {toPersianDigits(displayH, persianDigits)}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1 max-h-28 overflow-y-auto pr-0.5 custom-scrollbar">
                {Array.from({ length: 24 }).map((_, i) => {
                  const isSel = selectedHour === i;
                  const str = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectHour(i)}
                      className={`h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                        isSel
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                          : 'bg-white/30 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
                      }`}
                    >
                      {toPersianDigits(str, persianDigits)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minute Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>دقیقه:</span>
                <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">
                  {toPersianDigits(displayM, persianDigits)}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {MINUTES.map((m) => {
                  const mNum = parseInt(m, 10);
                  const isSel = selectedMinute === mNum;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelectMinute(mNum)}
                      className={`h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                        isSel
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                          : 'bg-white/30 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
                      }`}
                    >
                      {toPersianDigits(m, persianDigits)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm button */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  soundFx.playSuccess(soundEnabled);
                  triggerHaptic('medium', hapticEnabled);
                  setIsOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>تایید ساعت {formattedDisplay}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
