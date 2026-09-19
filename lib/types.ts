export type CategoryType = 
  | 'work' 
  | 'learning' 
  | 'english' 
  | 'coding' 
  | 'home' 
  | 'fitness' 
  | 'entertainment' 
  | 'sleep';

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export type DayTimeSlot = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';

export interface CategoryInfo {
  id: CategoryType;
  title: string;
  emoji: string;
  color: string;
  bgLight: string;
  bgDark: string;
  borderDark: string;
  borderLight: string;
  glow: string;
}

export interface Task {
  id: string;
  title: string;
  category: CategoryType;
  startTime: string; // e.g., "16:00"
  endTime: string;   // e.g., "17:00"
  durationMinutes: number;
  completed: boolean;
  isCurrent?: boolean;
  isNext?: boolean;
  notes?: string;
  priority: PriorityLevel;
  timeSlot: DayTimeSlot;
  date?: string; // Persian date string e.g., "۱۴۰۵/۰۶/۲۹"
  completedAt?: string; // e.g. "17:15"
}

export interface Habit {
  id: string;
  title: string;
  category: CategoryType;
  streak: number;
  completedToday: boolean;
  weeklyHistory: boolean[]; // 7 days (شنبه تا جمعه)
  targetFrequency: string; // e.g., "هر روز"
}

export interface Goal {
  id: string;
  title: string;
  category: CategoryType;
  currentProgress: number; // percentage 0-100
  completedTasks: number;
  totalTasks: number;
  deadline: string;
  description?: string;
}

export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'auto';
export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'violet' | 'indigo' | 'emerald' | 'cyan' | 'rose' | 'amber';

export type BackgroundStyle = 
  | 'bubble-map'       // بابل‌مپ شناور و تعاملی
  | 'liquid-aurora'    // امواج مایع و نورهای نئونی
  | 'cosmic-nebula'    // ذرات معلق و سحابی فضایی
  | 'lofi-rain'        // گرگ‌ومیش و قطرات آرامش‌بخش
  | 'geometric-mesh';  // شبکه هندسی شیشه‌ای

export interface AppSettings {
  userName: string;
  theme: ThemeMode;
  timeOfDay: TimeOfDay;
  accentColor: AccentColor;
  backgroundStyle: BackgroundStyle;
  backgroundDim: number;
  interactiveBubbles: boolean;
  showFocusBubbles?: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  persianDigits: boolean;
  density: 'comfortable' | 'compact';
}

