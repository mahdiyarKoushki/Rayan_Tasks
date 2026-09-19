'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  CheckSquare,
  Sparkles,
  Target,
  Calendar,
  Flame,
  SunMedium,
} from 'lucide-react';
import {
  CategoryType,
  Task,
  Habit,
  Goal,
  PriorityLevel,
  DayTimeSlot,
} from '@/lib/types';
import {
  CATEGORIES,
  PRIORITIES,
  DAY_TIME_SLOTS,
  getCurrentJalaliDate,
  formatJalaliShort,
  toPersianDigits,
} from '@/lib/persian';
import PersianDatePicker from './PersianDatePicker';
import PersianTimePicker from './PersianTimePicker';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface NewItemModalProps {
  type: 'task' | 'habit' | 'goal' | null;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedToday' | 'streak' | 'weeklyHistory'>) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'currentProgress' | 'completedTasks'>) => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  persianDigits?: boolean;
}

export default function NewItemModal({
  type,
  onClose,
  onAddTask,
  onAddHabit,
  onAddGoal,
  soundEnabled,
  hapticEnabled,
  persianDigits = true,
}: NewItemModalProps) {
  const todayPersian = formatJalaliShort(getCurrentJalaliDate(), false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('learning');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [timeSlot, setTimeSlot] = useState<DayTimeSlot>('afternoon');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:00');
  const [date, setDate] = useState<string>(todayPersian);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [totalTasks, setTotalTasks] = useState(10);
  const [deadline, setDeadline] = useState('پایان ماه');

  // Lock background scrolling when modal is active
  useEffect(() => {
    if (!type) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [type]);

  if (!type) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    soundFx.playSuccess(soundEnabled);
    triggerHaptic('medium', hapticEnabled);

    if (type === 'task') {
      const startParts = startTime.split(':').map(Number);
      const endParts = endTime.split(':').map(Number);
      let dur = 60;
      if (startParts.length === 2 && endParts.length === 2) {
        const sMins = startParts[0] * 60 + startParts[1];
        const eMins = endParts[0] * 60 + endParts[1];
        dur = eMins >= sMins ? eMins - sMins : 24 * 60 - sMins + eMins;
      }

      onAddTask({
        title: title.trim(),
        category,
        priority,
        timeSlot,
        startTime,
        endTime,
        durationMinutes: dur > 0 ? dur : 60,
        date,
        notes: notes.trim() || undefined,
      });
    } else if (type === 'habit') {
      onAddHabit({
        title: title.trim(),
        category,
        targetFrequency: 'هر روز',
      });
    } else if (type === 'goal') {
      onAddGoal({
        title: title.trim(),
        category,
        totalTasks: Number(totalTasks) || 10,
        deadline: deadline || 'پایان ماه',
        description: notes.trim() || undefined,
      });
    }

    setTitle('');
    setNotes('');
    setShowDatePicker(false);
    onClose();
  };

  const titlesMap = {
    task: { label: 'تسک جدید', icon: CheckSquare },
    habit: { label: 'عادت جدید', icon: Sparkles },
    goal: { label: 'هدف جدید', icon: Target },
  };

  const CurrentIcon = titlesMap[type].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 350 }}
        className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] rounded-3xl glass-panel shadow-2xl z-10 glass-edge border border-white/30 dark:border-white/10 flex flex-col overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl"
      >
        {/* Sticky Header */}
        <div className="px-5 py-4 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/50 dark:bg-white/5">
          <div className="flex items-center gap-2.5 text-violet-600 dark:text-violet-400">
            <div className="w-9 h-9 rounded-2xl bg-violet-500/15 flex items-center justify-center">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                ایجاد {titlesMap[type].label}
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                {type === 'task' ? 'تعیین اولویت، بازه روز و زمان‌بندی' : 'افزودن به برنامه‌ریزی شخصی'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain custom-scrollbar">
          {/* Title input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              عنوان {titlesMap[type].label}:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'task'
                  ? 'مثلاً: طراحی کامپوننت‌های UI'
                  : type === 'habit'
                  ? 'مثلاً: مطالعه ۳۰ دقیقه کتاب'
                  : 'مثلاً: متخصص ارشد React'
              }
              className="w-full py-2.5 px-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-medium"
            />
          </div>

          {/* Priority selection for Task */}
          {type === 'task' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>سطح اولویت تسک:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['urgent', 'high', 'medium', 'low'] as PriorityLevel[]).map((priKey) => {
                  const pri = PRIORITIES[priKey];
                  const isSel = priority === priKey;
                  return (
                    <button
                      key={priKey}
                      type="button"
                      onClick={() => setPriority(priKey)}
                      className={`p-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isSel
                          ? pri.badgeClass + ' ring-2 ring-violet-500/40'
                          : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      <span>{pri.emoji}</span>
                      <span>{pri.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Time slot for Task */}
          {type === 'task' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                <span>بازه زمانی روز (چه زمانی انجام شود):</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(['morning', 'noon', 'afternoon', 'evening', 'night'] as DayTimeSlot[]).map((slotKey) => {
                  const slot = DAY_TIME_SLOTS[slotKey];
                  const isSel = timeSlot === slotKey;
                  return (
                    <button
                      key={slotKey}
                      type="button"
                      onClick={() => setTimeSlot(slotKey)}
                      className={`p-2 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                          : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-violet-400'
                      }`}
                    >
                      <span>{slot.emoji}</span>
                      <span className="font-bold text-[11px]">{slot.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Persian Date Picker for Task */}
          {type === 'task' && (
            <div className="space-y-2 p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <span>تاریخ شمسی:</span>
                  <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">
                    {toPersianDigits(date, persianDigits)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="text-xs px-3 py-1 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-300 font-bold hover:bg-violet-500/25 transition-all cursor-pointer"
                >
                  {showDatePicker ? 'بستن تقویم ✕' : 'انتخاب تاریخ 📅'}
                </button>
              </div>

              {showDatePicker && (
                <div className="pt-2">
                  <PersianDatePicker
                    selectedDate={date}
                    onSelectDate={(newDate) => {
                      setDate(newDate);
                      setShowDatePicker(false);
                    }}
                    persianDigits={persianDigits}
                    soundEnabled={soundEnabled}
                    hapticEnabled={hapticEnabled}
                  />
                </div>
              )}
            </div>
          )}

          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              دسته‌بندی:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSel = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`p-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      isSel
                        ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                        : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-violet-400/40'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific fields for Task Times via PersianTimePicker */}
          {type === 'task' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PersianTimePicker
                label="ساعت شروع:"
                value={startTime}
                onChange={setStartTime}
                persianDigits={persianDigits}
                soundEnabled={soundEnabled}
                hapticEnabled={hapticEnabled}
              />
              <PersianTimePicker
                label="ساعت پایان:"
                value={endTime}
                onChange={setEndTime}
                persianDigits={persianDigits}
                soundEnabled={soundEnabled}
                hapticEnabled={hapticEnabled}
              />
            </div>
          )}

          {/* Specific fields for Goal */}
          {type === 'goal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold">تعداد کل تسک‌ها:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={totalTasks}
                  onChange={(e) => setTotalTasks(Number(e.target.value))}
                  className="w-full py-2.5 px-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/10 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold">مهلت زمانی:</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="مثلاً: پایان تابستان"
                  className="w-full py-2.5 px-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/10 text-xs"
                />
              </div>
            </div>
          )}

          {/* Notes / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              توضیحات و یادداشت:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="نکات مهم مربوط به این مورد..."
              className="w-full py-2.5 px-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!title.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            ذخیره و ثبت ✨
          </button>
        </div>
      </motion.div>
    </div>
  );
}
