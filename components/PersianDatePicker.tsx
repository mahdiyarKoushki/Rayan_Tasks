'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Check, CalendarDays } from 'lucide-react';
import {
  PERSIAN_MONTHS,
  PERSIAN_WEEK_DAYS,
  getCurrentJalaliDate,
  getJalaliDaysInMonth,
  getFirstWeekdayOfJalaliMonth,
  toPersianDigits,
} from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface PersianDatePickerProps {
  selectedDate?: string; // Format: "1403/06/29" or "۱۴۰۳/۰۶/۲۹"
  onSelectDate: (dateStr: string) => void;
  persianDigits?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export default function PersianDatePicker({
  selectedDate,
  onSelectDate,
  persianDigits = true,
  soundEnabled = true,
  hapticEnabled = true,
}: PersianDatePickerProps) {
  const today = getCurrentJalaliDate();

  // Parse initial selected date or default to today
  const parseInitial = (): { y: number; m: number; d: number } => {
    if (selectedDate) {
      // Normalize Persian digits to English digits for parsing
      const englishNum = selectedDate.replace(/[۰-۹]/g, (w) =>
        String(['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'].indexOf(w))
      );
      const parts = englishNum.split('/');
      if (parts.length === 3) {
        return {
          y: parseInt(parts[0], 10) || today.jy,
          m: parseInt(parts[1], 10) || today.jm,
          d: parseInt(parts[2], 10) || today.jd,
        };
      }
    }
    return { y: today.jy, m: today.jm, d: today.jd };
  };

  const initial = parseInitial();
  const [viewYear, setViewYear] = useState<number>(initial.y);
  const [viewMonth, setViewMonth] = useState<number>(initial.m);
  const [activeDay, setActiveDay] = useState<number>(initial.d);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Month navigation
  const handlePrevMonth = () => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Calculate day cells
  const daysInCurrentMonth = getJalaliDaysInMonth(viewYear, viewMonth);
  // Exact day-of-week index for 1st of month: 0 (شنبه) to 6 (جمعه)
  const firstDayOfWeek = getFirstWeekdayOfJalaliMonth(viewYear, viewMonth);

  const handlePickDay = (dayNum: number) => {
    setActiveDay(dayNum);
    soundFx.playSuccess(soundEnabled);
    triggerHaptic('medium', hapticEnabled);
    const mStr = viewMonth < 10 ? `0${viewMonth}` : `${viewMonth}`;
    const dStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const formatted = `${viewYear}/${mStr}/${dStr}`;
    onSelectDate(formatted);
  };

  const setQuickDate = (offsetDays: number) => {
    soundFx.playSuccess(soundEnabled);
    triggerHaptic('medium', hapticEnabled);
    let targetDay = today.jd + offsetDays;
    let targetMonth = today.jm;
    let targetYear = today.jy;

    const maxDays = getJalaliDaysInMonth(targetYear, targetMonth);
    if (targetDay > maxDays) {
      targetDay -= maxDays;
      targetMonth += 1;
      if (targetMonth > 12) {
        targetMonth = 1;
        targetYear += 1;
      }
    }

    setViewYear(targetYear);
    setViewMonth(targetMonth);
    setActiveDay(targetDay);

    const mStr = targetMonth < 10 ? `0${targetMonth}` : `${targetMonth}`;
    const dStr = targetDay < 10 ? `0${targetDay}` : `${targetDay}`;
    onSelectDate(`${targetYear}/${mStr}/${dStr}`);
  };

  const currentMonthName = PERSIAN_MONTHS[viewMonth - 1] || 'شهریور';

  return (
    <div className="rounded-3xl p-3.5 sm:p-4 bg-white/70 dark:bg-slate-900/80 border border-white/40 dark:border-white/10 shadow-lg space-y-3 backdrop-blur-xl select-none w-full">
      {/* Quick Date Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        <button
          type="button"
          onClick={() => setQuickDate(0)}
          className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeDay === today.jd && viewMonth === today.jm && viewYear === today.jy
              ? 'bg-violet-600 text-white shadow-md'
              : 'bg-violet-500/15 text-violet-600 dark:text-violet-300 hover:bg-violet-500/25'
          }`}
        >
          امروز
        </button>
        <button
          type="button"
          onClick={() => setQuickDate(1)}
          className="px-2.5 py-1 text-xs rounded-xl bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-white/10 hover:border-violet-400 transition-all whitespace-nowrap cursor-pointer"
        >
          فردا
        </button>
        <button
          type="button"
          onClick={() => setQuickDate(2)}
          className="px-2.5 py-1 text-xs rounded-xl bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-white/10 hover:border-violet-400 transition-all whitespace-nowrap cursor-pointer"
        >
          پس‌فردا
        </button>
        <button
          type="button"
          onClick={() => setQuickDate(7)}
          className="px-2.5 py-1 text-xs rounded-xl bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-white/10 hover:border-violet-400 transition-all whitespace-nowrap cursor-pointer mr-auto"
        >
          هفته آینده
        </button>
      </div>

      {/* Header: Month & Year Controls */}
      <div className="flex items-center justify-between px-1 bg-white/40 dark:bg-white/5 rounded-2xl p-1.5 border border-white/20 dark:border-white/10">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          title="ماه قبل"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {/* Month selector trigger */}
          <button
            type="button"
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-white/60 dark:bg-white/10 hover:bg-violet-500/20 hover:text-violet-600 dark:hover:text-violet-300 transition-all cursor-pointer flex items-center gap-1"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-violet-500" />
            <span>{currentMonthName}</span>
          </button>

          {/* Year selector trigger */}
          <button
            type="button"
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-violet-600 dark:text-violet-400 bg-white/60 dark:bg-white/10 hover:bg-violet-500/20 transition-all cursor-pointer"
          >
            {toPersianDigits(viewYear, persianDigits)}
          </button>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          title="ماه بعد"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Month Picker Grid Overlay */}
      {showMonthPicker && (
        <div className="p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-violet-500/30 shadow-lg">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">
            انتخاب ماه خورشیدی:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {PERSIAN_MONTHS.map((mName, idx) => {
              const mNum = idx + 1;
              const isSel = viewMonth === mNum;
              return (
                <button
                  key={mName}
                  type="button"
                  onClick={() => {
                    setViewMonth(mNum);
                    setShowMonthPicker(false);
                    soundFx.playClick(soundEnabled);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer truncate text-center ${
                    isSel
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-violet-500/15'
                  }`}
                >
                  {mName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Year Picker Grid Overlay */}
      {showYearPicker && (
        <div className="p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-violet-500/30 shadow-lg">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">
            انتخاب سال:
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[1403, 1404, 1405, 1406, 1407, 1408].map((y) => {
              const isSel = viewYear === y;
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setViewYear(y);
                    setShowYearPicker(false);
                    soundFx.playClick(soundEnabled);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                    isSel
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-violet-500/15'
                  }`}
                >
                  {toPersianDigits(y, persianDigits)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {PERSIAN_WEEK_DAYS.map((day, idx) => (
          <span
            key={idx}
            className={`text-xs font-semibold py-1 ${
              idx === 6
                ? 'text-rose-500 dark:text-rose-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {day.short}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isSelected =
            dayNum === activeDay && viewMonth === initial.m && viewYear === initial.y;
          const isToday =
            dayNum === today.jd && viewMonth === today.jm && viewYear === today.jy;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => handlePickDay(dayNum)}
              className={`h-8 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center cursor-pointer relative ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105 z-10'
                  : isToday
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'hover:bg-white/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{toPersianDigits(dayNum, persianDigits)}</span>
              {isToday && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Summary Line */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <CalendarDays className="w-3.5 h-3.5 text-violet-500" />
          <span>تاریخ انتخاب‌شده:</span>
        </span>
        <span className="font-bold text-violet-600 dark:text-violet-400 font-mono flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          {toPersianDigits(
            `${viewYear}/${viewMonth < 10 ? '0' + viewMonth : viewMonth}/${
              activeDay < 10 ? '0' + activeDay : activeDay
            }`,
            persianDigits
          )}
        </span>
      </div>
    </div>
  );
}
