'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Clock,
  Trash2,
  Edit2,
  Flame,
  SunMedium,
  Filter,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { Task, PriorityLevel, DayTimeSlot } from '@/lib/types';
import {
  CATEGORIES,
  PRIORITIES,
  DAY_TIME_SLOTS,
  toPersianDigits,
} from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

interface TimelineViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  persianDigits: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  onMakeCurrent: (taskId: string) => void;
}

export default function TimelineView({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  persianDigits,
  soundEnabled,
  hapticEnabled,
  onMakeCurrent,
}: TimelineViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [slotFilter, setSlotFilter] = useState<'all' | DayTimeSlot>('all');
  const [sortByPriority, setSortByPriority] = useState(false);

  // Filter tasks
  let filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'completed' && !t.completed) return false;
    if (statusFilter === 'pending' && t.completed) return false;
    if (priorityFilter !== 'all' && (t.priority || 'medium') !== priorityFilter) return false;
    if (slotFilter !== 'all' && (t.timeSlot || 'afternoon') !== slotFilter) return false;
    return true;
  });

  // Optional sorting by priority (urgent -> high -> medium -> low)
  if (sortByPriority) {
    const priorityWeight: Record<PriorityLevel, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    filteredTasks = [...filteredTasks].sort((a, b) => {
      const weightA = priorityWeight[a.priority || 'medium'];
      const weightB = priorityWeight[b.priority || 'medium'];
      return weightB - weightA;
    });
  }

  const handleCheck = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playSuccess(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    onToggleTask(taskId);
  };

  const handleDelete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(soundEnabled);
    triggerHaptic('medium', hapticEnabled);
    onDeleteTask(taskId);
  };

  const handleEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    onEditTask(task);
  };

  return (
    <div className="space-y-4">
      {/* Timeline Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>تایم‌لاین زنده و برنامه‌های روز</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold">
            {toPersianDigits(filteredTasks.length, persianDigits)} مورد
          </span>
        </div>

        {/* Sort & Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Priority Sort Button */}
          <button
            onClick={() => setSortByPriority(!sortByPriority)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all cursor-pointer border ${
              sortByPriority
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-400'
            }`}
            title="مرتب‌سازی بر اساس اولویت"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>{sortByPriority ? 'مرتب: اولویت' : 'مرتب: ساعت'}</span>
          </button>

          {/* Status Pills */}
          <div className="flex items-center gap-1 p-1 rounded-2xl glass-pill">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              پیش‌رو
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              انجام‌شده
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Filters: Time Slots & Priorities */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        {/* Day Time Slot Pills */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 font-bold ml-1">بازه روز:</span>
          <button
            onClick={() => setSlotFilter('all')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
              slotFilter === 'all'
                ? 'bg-slate-700 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-400'
            }`}
          >
            همه
          </button>
          {(['morning', 'noon', 'afternoon', 'evening', 'night'] as DayTimeSlot[]).map((slotKey) => {
            const slot = DAY_TIME_SLOTS[slotKey];
            const isSel = slotFilter === slotKey;
            return (
              <button
                key={slotKey}
                onClick={() => setSlotFilter(isSel ? 'all' : slotKey)}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-violet-400'
                }`}
              >
                <span>{slot.emoji}</span>
                <span>{slot.title}</span>
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 mr-auto">
          <span className="text-[11px] text-slate-400 font-bold ml-1">اولویت:</span>
          {(['urgent', 'high'] as PriorityLevel[]).map((priKey) => {
            const pri = PRIORITIES[priKey];
            const isSel = priorityFilter === priKey;
            return (
              <button
                key={priKey}
                onClick={() => setPriorityFilter(isSel ? 'all' : priKey)}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all border ${
                  isSel
                    ? pri.badgeClass + ' font-bold'
                    : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>{pri.emoji}</span>
                <span>{pri.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vertical Curved Timeline Container */}
      <div className="relative pl-2 pr-4 md:pr-6 py-2">
        {/* Curved / Gradient Vertical Progress Line */}
        <div className="absolute top-4 bottom-4 right-[25px] md:right-[33px] w-[2px] bg-gradient-to-b from-emerald-500 via-violet-500 to-slate-400/20 dark:to-slate-700/30 rounded-full pointer-events-none" />

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => {
              const cat = CATEGORIES[task.category] || CATEGORIES.work;
              const pri = PRIORITIES[task.priority || 'medium'];
              const slot = DAY_TIME_SLOTS[task.timeSlot || 'afternoon'];
              const isPast = task.completed;
              const isCurrent = task.isCurrent;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{
                    opacity: isPast ? 0.65 : 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="relative flex items-start gap-3 md:gap-4 group"
                >
                  {/* Timeline Status Node (Curved connection dot) */}
                  <div className="relative z-10 flex flex-col items-center mt-2.5">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => handleCheck(task.id, e)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        task.completed
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                          : isCurrent
                          ? 'bg-violet-600 text-white ring-4 ring-violet-500/30 animate-pulse'
                          : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 hover:border-violet-500 text-transparent'
                      }`}
                      title={task.completed ? 'تکمیل شده' : 'علامت زدن به عنوان انجام‌شده'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.button>

                    {/* Time indicator under node */}
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
                      {toPersianDigits(task.startTime, persianDigits)}
                    </span>
                  </div>

                  {/* Floating Liquid Glass Task Card */}
                  <div
                    onClick={() => onMakeCurrent(task.id)}
                    className={`flex-1 rounded-2xl p-4 transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? 'glass-panel border-violet-500/40 bg-violet-500/10 dark:bg-violet-950/30 shadow-[0_10px_25px_-5px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/30'
                        : isPast
                        ? 'glass-panel bg-white/40 dark:bg-slate-900/30 border-slate-200/50 dark:border-white/5'
                        : 'glass-panel hover:border-violet-400/40 hover:bg-white/80 dark:hover:bg-slate-900/70 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {/* Emoji & Category Badge */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${cat.bgDark} ${cat.borderDark}`}
                        >
                          {cat.emoji}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-sm md:text-base font-bold transition-all ${
                                task.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-800 dark:text-slate-100'
                              }`}
                            >
                              {task.title}
                            </h4>

                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-300 font-bold border border-violet-500/30 animate-pulse">
                                جاری
                              </span>
                            )}

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

                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="font-mono">
                              {toPersianDigits(task.startTime, persianDigits)} — {toPersianDigits(task.endTime, persianDigits)}
                            </span>
                            <span>•</span>
                            <span>{cat.title}</span>
                            {task.date && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{toPersianDigits(task.date, persianDigits)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={(e) => handleEdit(task, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-500/10 transition-colors"
                          title="ویرایش تسک"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(task.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="حذف تسک"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {task.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pr-11 line-clamp-1 border-r-2 border-violet-400/30 pr-2 mr-1">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              هیچ تسکی با این فیلترها وجود ندارد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
