'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Home, CalendarDays, CheckSquare, Target, Settings2, BarChart3 } from 'lucide-react';
import { soundFx, triggerHaptic } from '@/lib/audio';

export type TabId = 'today' | 'schedule' | 'analytics' | 'tasks' | 'goals' | 'more';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export default function BottomNav({
  activeTab,
  onChangeTab,
  soundEnabled,
  hapticEnabled,
}: BottomNavProps) {
  const tabs = [
    { id: 'today' as TabId, label: 'امروز', icon: Home },
    { id: 'schedule' as TabId, label: 'برنامه', icon: CalendarDays },
    { id: 'analytics' as TabId, label: 'تحلیل', icon: BarChart3 },
    { id: 'tasks' as TabId, label: 'کارها', icon: CheckSquare },
    { id: 'goals' as TabId, label: 'اهداف', icon: Target },
    { id: 'more' as TabId, label: 'بیشتر', icon: Settings2 },
  ];

  const handleSelect = (id: TabId) => {
    soundFx.playClick(soundEnabled);
    triggerHaptic('light', hapticEnabled);
    onChangeTab(id);
  };

  return (
    <div className="fixed bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl">
      <nav className="glass-nav rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between relative border border-white/20 dark:border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className="relative flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-0.5 rounded-full transition-colors cursor-pointer group"
            >
              {/* Active Background Capsule with LayoutId for ultra-smooth sliding */}
              {isActive && (
                <motion.div
                  layoutId="activeTabCapsule"
                  className="absolute inset-0 rounded-full bg-violet-600 dark:bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                <Icon
                  className={`w-4 h-4 md:w-4.5 md:h-4.5 transition-transform duration-200 ${
                    isActive
                      ? 'text-white scale-110'
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] md:text-[11px] font-bold transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
