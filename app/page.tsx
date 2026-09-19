'use client';

import React, { useState, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DynamicBackground from '@/components/DynamicBackground';
import HeaderHero from '@/components/HeaderHero';
import CurrentTaskCard from '@/components/CurrentTaskCard';
import NextTaskCard from '@/components/NextTaskCard';
import TimelineView from '@/components/TimelineView';
import WeeklyOverview from '@/components/WeeklyOverview';
import HabitCards from '@/components/HabitCards';
import GoalsView from '@/components/GoalsView';
import BottomNav, { TabId } from '@/components/BottomNav';
import FabMenu from '@/components/FabMenu';
import QuickAddModal from '@/components/QuickAddModal';
import NewItemModal from '@/components/NewItemModal';
import CelebrationToast from '@/components/CelebrationToast';
import SettingsView from '@/components/SettingsView';
import BackgroundSelectorModal from '@/components/BackgroundSelectorModal';
import EditTaskModal from '@/components/EditTaskModal';
import AnalyticsView from '@/components/AnalyticsView';
import LoginScreen from '@/components/LoginScreen';

import { Task, Habit, Goal, AppSettings } from '@/lib/types';
import { getPersianDateString, getCurrentJalaliDate, formatJalaliShort } from '@/lib/persian';
import { soundFx, triggerHaptic } from '@/lib/audio';

const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'ورزش صبحگاهی و تمرینات کششی',
    category: 'fitness',
    startTime: '08:00',
    endTime: '08:45',
    durationMinutes: 45,
    completed: true,
    priority: 'high',
    timeSlot: 'morning',
    date: '۱۴۰۳/۰۶/۲۹',
    notes: 'تمرین هیت و نرمش‌های بیداری',
  },
  {
    id: 't-2',
    title: 'جلسه بازبینی اسپرینت تیم',
    category: 'work',
    startTime: '09:30',
    endTime: '10:30',
    durationMinutes: 60,
    completed: true,
    priority: 'urgent',
    timeSlot: 'morning',
    date: '۱۴۰۳/۰۶/۲۹',
    notes: 'هماهنگی ویژگی‌های ریلیز جدید محصول',
  },
  {
    id: 't-3',
    title: 'طراحی معماری سیستم کش Redis',
    category: 'coding',
    startTime: '11:00',
    endTime: '12:30',
    durationMinutes: 90,
    completed: true,
    priority: 'high',
    timeSlot: 'morning',
    date: '۱۴۰۳/۰۶/۲۹',
    notes: 'بهینه‌سازی تاخیر پاسخ‌دهی به کوئری‌ها',
  },
  {
    id: 't-4',
    title: 'یادگیری عمیق Backend',
    category: 'learning',
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 60,
    completed: false,
    isCurrent: true,
    priority: 'urgent',
    timeSlot: 'afternoon',
    date: '۱۴۰۳/۰۶/۲۹',
    notes: 'مفاهیم پیشرفته پایگاه‌داده و ایندکس‌گذاری',
  },
  {
    id: 't-5',
    title: 'English تمرین مکالمه و لیسنینگ',
    category: 'english',
    startTime: '17:00',
    endTime: '17:30',
    durationMinutes: 30,
    completed: false,
    isNext: true,
    priority: 'medium',
    timeSlot: 'afternoon',
    date: '۱۴۰۳/۰۶/۲۹',
    notes: 'تکنیک Shadowing با پادکست‌های تخصصی',
  },
  {
    id: 't-6',
    title: 'پروژه شخصی: پیاده‌سازی Liquid Glass UI',
    category: 'coding',
    startTime: '18:30',
    endTime: '20:00',
    durationMinutes: 90,
    completed: false,
    priority: 'high',
    timeSlot: 'evening',
    date: '۱۴۰۳/۰۶/۲۹',
    notes: 'تنظیم افکت‌های بلور و ترنسپرنسی لایه‌ای',
  },
  {
    id: 't-7',
    title: 'استراحت، شام و بازی آنلاین',
    category: 'entertainment',
    startTime: '20:30',
    endTime: '21:30',
    durationMinutes: 60,
    completed: false,
    priority: 'low',
    timeSlot: 'evening',
    date: '۱۴۰۳/۰۶/۲۹',
  },
  {
    id: 't-8',
    title: 'خواب آرام و ریکاوری شبانه',
    category: 'sleep',
    startTime: '23:30',
    endTime: '07:30',
    durationMinutes: 480,
    completed: false,
    priority: 'medium',
    timeSlot: 'night',
    date: '۱۴۰۳/۰۶/۲۹',
  },
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    title: 'English (تمرین روزانه زبان)',
    category: 'english',
    streak: 12,
    completedToday: true,
    weeklyHistory: [true, true, true, true, true, true, true],
    targetFrequency: 'هر روز ۳۰ دقیقه',
  },
  {
    id: 'h-2',
    title: 'ورزش و تناسب اندام',
    category: 'fitness',
    streak: 8,
    completedToday: true,
    weeklyHistory: [true, true, false, true, true, true, true],
    targetFrequency: 'حداقل ۴۵ دقیقه فعالیت',
  },
  {
    id: 'h-3',
    title: 'مطالعه تخصصی و تکنولوژی',
    category: 'learning',
    streak: 5,
    completedToday: false,
    weeklyHistory: [true, false, true, true, true, false, false],
    targetFrequency: 'هر روز ۲۰ صفحه',
  },
  {
    id: 'h-4',
    title: 'کدنویسی و کامیت در گیت‌هاب',
    category: 'coding',
    streak: 24,
    completedToday: true,
    weeklyHistory: [true, true, true, true, true, true, true],
    targetFrequency: 'حداقل ۱ کامیت مفید',
  },
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-1',
    title: 'Backend Developer متخصص',
    category: 'coding',
    currentProgress: 72,
    completedTasks: 12,
    totalTasks: 16,
    deadline: 'پایان مهر ماه',
    description: 'تسلط عمیق بر معماری میکروسرویس و کارایی دیتابیس',
  },
  {
    id: 'g-2',
    title: 'آیلتس آکادمیک نمره ۷.۵',
    category: 'english',
    currentProgress: 65,
    completedTasks: 18,
    totalTasks: 28,
    deadline: 'آبان ماه ۱۴۰۳',
    description: 'تمرکز بر بخش اسپیکینگ و رایتینگ تسک ۲',
  },
  {
    id: 'g-3',
    title: 'تناسب اندام و چربی‌سوزی ۱۰٪',
    category: 'fitness',
    currentProgress: 80,
    completedTasks: 24,
    totalTasks: 30,
    deadline: 'پایان پاییز',
    description: 'رژیم غذایی منظم به همراه تمرینات قدرتی',
  },
  {
    id: 'g-4',
    title: 'انتشار کتابچه معماری نرم‌افزار',
    category: 'learning',
    currentProgress: 40,
    completedTasks: 4,
    totalTasks: 10,
    deadline: 'زمستان امسال',
    description: 'گردآوری تجربیات طراحی سیستم‌های توزیع‌شده',
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  userName: 'mk',
  theme: 'dark',
  timeOfDay: 'afternoon',
  accentColor: 'violet',
  backgroundStyle: 'bubble-map',
  backgroundDim: 25,
  interactiveBubbles: true,
  showFocusBubbles: true,
  soundEnabled: true,
  hapticEnabled: true,
  persianDigits: true,
  density: 'comfortable',
};

export default function Home() {
  // Authentication State
  const [user, setUser] = useState<{ username: string; displayName: string } | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored =
          localStorage.getItem('rayan_auth_user') || sessionStorage.getItem('rayan_auth_user');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return null;
  });

  // Database Synchronization State
  const [dbSyncStatus, setDbSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Core App State
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rayan_tasks');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rayan_habits');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_HABITS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rayan_goals');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_GOALS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rayan_settings');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newItemType, setNewItemType] = useState<'task' | 'habit' | 'goal' | null>(null);
  const [isBgSelectorOpen, setIsBgSelectorOpen] = useState(false);

  // Edit Task State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Confetti / Celebration trigger
  const [showCelebration, setShowCelebration] = useState(false);
  const [consecutiveCount, setConsecutiveCount] = useState(0);

  // 1. Fetch data from persistent server database when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchDatabase = async () => {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (Array.isArray(json.data.tasks)) setTasks(json.data.tasks);
            if (Array.isArray(json.data.habits)) setHabits(json.data.habits);
            if (Array.isArray(json.data.goals)) setGoals(json.data.goals);
            if (json.data.settings) setSettings(json.data.settings);
          }
        }
        setDbSyncStatus('synced');
      } catch (err) {
        console.error('Error fetching database:', err);
        setDbSyncStatus('error');
      } finally {
        setIsInitialLoadDone(true);
      }
    };

    fetchDatabase();
  }, [user]);

  // 2. PERSIST EVERY CHANGE TO SERVER DATABASE AUTOMATICALLY
  useEffect(() => {
    if (!user || !isInitialLoadDone) return;

    // Fast local persistence
    try {
      localStorage.setItem('rayan_tasks', JSON.stringify(tasks));
      localStorage.setItem('rayan_habits', JSON.stringify(habits));
      localStorage.setItem('rayan_goals', JSON.stringify(goals));
      localStorage.setItem('rayan_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }

    // Debounced automatic database persistence to disk
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = setTimeout(async () => {
      try {
        setDbSyncStatus('syncing');
        const res = await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tasks,
            habits,
            goals,
            settings,
          }),
        });

        if (res.ok) {
          setDbSyncStatus('synced');
        } else {
          setDbSyncStatus('error');
        }
      } catch (err) {
        console.error('Failed to save to database:', err);
        setDbSyncStatus('error');
      }
    }, 350);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [tasks, habits, goals, settings, user, isInitialLoadDone]);

  // Derived task counts
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const completionRate =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Active current & next task
  const currentTask = useMemo(() => {
    return tasks.find((t) => t.isCurrent) || tasks.find((t) => !t.completed) || null;
  }, [tasks]);

  const nextTask = useMemo(() => {
    if (!currentTask) return null;
    const pendingTasks = tasks.filter((t) => !t.completed && t.id !== currentTask.id);
    return pendingTasks[0] || null;
  }, [tasks, currentTask]);

  // Toggle task complete status
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            setConsecutiveCount((c) => c + 1);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3500);
          }
          return { ...t, completed: nextState, isCurrent: false };
        }
        return t;
      })
    );
  };

  const handleMakeCurrent = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        isCurrent: t.id === taskId,
        isNext: false,
      }))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleToggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const nextCompleted = !h.completedToday;
          const nextWeekly = [...h.weeklyHistory];
          nextWeekly[6] = nextCompleted;
          return {
            ...h,
            completedToday: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
            weeklyHistory: nextWeekly,
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title: habitData.title || 'عادت جدید',
      category: habitData.category || 'work',
      streak: 1,
      completedToday: true,
      weeklyHistory: [false, false, false, false, false, false, true],
      targetFrequency: habitData.targetFrequency || 'هر روز',
    };
    setHabits((prev) => [newHabit, ...prev]);
    soundFx.playSuccess(settings.soundEnabled);
  };

  const handleAddGoal = (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      title: goalData.title || 'هدف جدید',
      category: goalData.category || 'coding',
      currentProgress: 0,
      completedTasks: 0,
      totalTasks: 10,
      deadline: goalData.deadline || 'پایان ماه',
      description: goalData.description || '',
    };
    setGoals((prev) => [newGoal, ...prev]);
    soundFx.playSuccess(settings.soundEnabled);
  };

  const handleAddTask = (taskData: Partial<Task>) => {
    const defaultDate = getCurrentJalaliDate();
    const formattedDate = formatJalaliShort(defaultDate, settings.persianDigits);

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: taskData.title || 'کار جدید',
      category: taskData.category || 'work',
      startTime: taskData.startTime || '12:00',
      endTime: taskData.endTime || '13:00',
      durationMinutes: taskData.durationMinutes || 60,
      completed: false,
      priority: taskData.priority || 'medium',
      timeSlot: taskData.timeSlot || 'afternoon',
      date: taskData.date || formattedDate,
      notes: taskData.notes || '',
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const handleResetData = async () => {
    try {
      setDbSyncStatus('syncing');
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setTasks(json.data.tasks);
          setHabits(json.data.habits);
          setGoals(json.data.goals);
          setSettings(json.data.settings);
        }
      }
      setDbSyncStatus('synced');
      soundFx.playSuccess(settings.soundEnabled);
    } catch {
      setDbSyncStatus('error');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('rayan_auth_user');
      localStorage.removeItem('rayan_auth_token');
      sessionStorage.removeItem('rayan_auth_user');
      sessionStorage.removeItem('rayan_auth_token');
    } catch {
      // ignore
    }
    setUser(null);
    setIsInitialLoadDone(false);
    soundFx.playClick(settings.soundEnabled);
    triggerHaptic('medium', settings.hapticEnabled);
  };

  const handleFabAction = (action: 'task' | 'habit' | 'goal' | 'quick') => {
    if (action === 'quick') setIsQuickAddOpen(true);
    if (action === 'task') setNewItemType('task');
    if (action === 'habit') setNewItemType('habit');
    if (action === 'goal') setNewItemType('goal');
  };

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // SSR hydration gatekeeper
  if (!isMounted) {
    return null;
  }

  // If not authenticated, display the dedicated Login Screen for "mk"
  if (!user) {
    return (
      <LoginScreen
        onSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setSettings((prev) => ({ ...prev, userName: loggedInUser.username }));
        }}
        soundEnabled={settings.soundEnabled}
        hapticEnabled={settings.hapticEnabled}
      />
    );
  }

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200 transition-colors duration-500 ${
        settings.theme === 'dark' ? 'dark text-slate-100' : 'text-slate-800'
      }`}
    >
      {/* Dynamic Ambient Background Graphics */}
      <DynamicBackground
        timeOfDay={settings.timeOfDay}
        isDark={settings.theme === 'dark'}
        style={settings.backgroundStyle}
        backgroundDim={settings.backgroundDim}
        interactiveBubbles={settings.interactiveBubbles}
        showFocusBubbles={settings.showFocusBubbles}
      />

      {/* Floating Celebration Overlay on Task Complete */}
      {showCelebration && (
        <CelebrationToast
          consecutiveCount={consecutiveCount}
          onClose={() => setShowCelebration(false)}
          soundEnabled={settings.soundEnabled}
          persianDigits={settings.persianDigits}
        />
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-28 space-y-6">
        {/* TAB 1: امروز (Today Dashboard) */}
        {activeTab === 'today' && (
          <motion.div
            key="today-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header Hero Banner with Live Persian Clock, Persian Date, DB Sync & Logout */}
            <HeaderHero
              userName={settings.userName || 'mk'}
              dateString={getPersianDateString(settings.persianDigits)}
              completionRate={completionRate}
              completedCount={completedTasksCount}
              totalCount={totalTasksCount}
              focusMinutes={145}
              persianDigits={settings.persianDigits}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              onOpenBackgroundSelector={() => setIsBgSelectorOpen(true)}
              backgroundStyle={settings.backgroundStyle}
              dbSyncStatus={dbSyncStatus}
              onLogout={handleLogout}
            />

            {/* Current Task (Prominent Glass + Glow Card) */}
            {currentTask && (
              <CurrentTaskCard
                task={currentTask}
                onComplete={handleToggleTask}
                onEdit={handleOpenEditTask}
                persianDigits={settings.persianDigits}
                soundEnabled={settings.soundEnabled}
                hapticEnabled={settings.hapticEnabled}
              />
            )}

            {/* Next Task (Dedicated Preview Card) */}
            {nextTask && (
              <NextTaskCard
                task={nextTask}
                persianDigits={settings.persianDigits}
                onSelect={(t) => handleMakeCurrent(t.id)}
              />
            )}

            {/* Curved Floating Timeline */}
            <TimelineView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleOpenEditTask}
              persianDigits={settings.persianDigits}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
              onMakeCurrent={handleMakeCurrent}
            />
          </motion.div>
        )}

        {/* TAB 2: برنامه (Schedule / Weekly Overview) */}
        {activeTab === 'schedule' && (
          <motion.div
            key="schedule-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <WeeklyOverview persianDigits={settings.persianDigits} />
          </motion.div>
        )}

        {/* TAB 3: تحلیل (Comprehensive Analytics Dashboard) */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <AnalyticsView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onEditTask={handleOpenEditTask}
              persianDigits={settings.persianDigits}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
            />
          </motion.div>
        )}

        {/* TAB 4: کارها (Tasks & Habits) */}
        {activeTab === 'tasks' && (
          <motion.div
            key="tasks-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Habit UI Cards with Flame Streaks & Weekday status dots */}
            <HabitCards
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onOpenNewHabit={() => setNewItemType('habit')}
              persianDigits={settings.persianDigits}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
            />

            {/* Full Task List */}
            <div className="pt-2">
              <TimelineView
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleOpenEditTask}
                persianDigits={settings.persianDigits}
                soundEnabled={settings.soundEnabled}
                hapticEnabled={settings.hapticEnabled}
                onMakeCurrent={handleMakeCurrent}
              />
            </div>
          </motion.div>
        )}

        {/* TAB 5: اهداف (Goals) */}
        {activeTab === 'goals' && (
          <motion.div
            key="goals-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <GoalsView
              goals={goals}
              onOpenNewGoal={() => setNewItemType('goal')}
              persianDigits={settings.persianDigits}
            />
          </motion.div>
        )}

        {/* TAB 6: بیشتر (Settings & Personalization) */}
        {activeTab === 'more' && (
          <motion.div
            key="more-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <SettingsView
              settings={settings}
              onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
              onResetData={handleResetData}
              user={user}
              onLogout={handleLogout}
              dbSyncStatus={dbSyncStatus}
            />
          </motion.div>
        )}
      </main>

      {/* Expandable Floating Action Button (FAB) */}
      <FabMenu
        onSelectAction={handleFabAction}
        soundEnabled={settings.soundEnabled}
        hapticEnabled={settings.hapticEnabled}
      />

      {/* Floating Glass Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        soundEnabled={settings.soundEnabled}
        hapticEnabled={settings.hapticEnabled}
      />

      {/* Quick Add Bottom Sheet / Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
        soundEnabled={settings.soundEnabled}
        hapticEnabled={settings.hapticEnabled}
      />

      {/* Detailed New Item Modal (Task, Habit, Goal) */}
      <NewItemModal
        type={newItemType}
        onClose={() => setNewItemType(null)}
        onAddTask={handleAddTask}
        onAddHabit={handleAddHabit}
        onAddGoal={handleAddGoal}
        soundEnabled={settings.soundEnabled}
        hapticEnabled={settings.hapticEnabled}
        persianDigits={settings.persianDigits}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveEditedTask}
        onDeleteTask={handleDeleteTask}
        persianDigits={settings.persianDigits}
        soundEnabled={settings.soundEnabled}
        hapticEnabled={settings.hapticEnabled}
      />

      {/* Background & Bubble Map Selector Modal */}
      <BackgroundSelectorModal
        isOpen={isBgSelectorOpen}
        onClose={() => setIsBgSelectorOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
      />
    </div>
  );
}
