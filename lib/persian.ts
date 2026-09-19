import { CategoryInfo, CategoryType, DayTimeSlot, PriorityLevel } from './types';

export function toPersianDigits(num: number | string, enabled = true): string {
  if (!enabled) return String(num);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  work: {
    id: 'work',
    title: 'کار و بیزینس',
    emoji: '💼',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50 text-blue-700',
    bgDark: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    borderDark: 'border-blue-500/30',
    borderLight: 'border-blue-200',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  learning: {
    id: 'learning',
    title: 'یادگیری و مهارت',
    emoji: '🧠',
    color: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50 text-purple-700',
    bgDark: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    borderDark: 'border-purple-500/30',
    borderLight: 'border-purple-200',
    glow: 'rgba(168, 85, 247, 0.35)',
  },
  english: {
    id: 'english',
    title: 'زبان انگلیسی',
    emoji: '🇬🇧',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50 text-emerald-700',
    bgDark: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    borderDark: 'border-emerald-500/30',
    borderLight: 'border-emerald-200',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  coding: {
    id: 'coding',
    title: 'برنامه‌نویسی و پروژه',
    emoji: '💻',
    color: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50 text-cyan-700',
    bgDark: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    borderDark: 'border-cyan-500/30',
    borderLight: 'border-cyan-200',
    glow: 'rgba(6, 182, 212, 0.35)',
  },
  home: {
    id: 'home',
    title: 'خانه و زندگی',
    emoji: '🏠',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 text-amber-700',
    bgDark: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    borderDark: 'border-amber-500/30',
    borderLight: 'border-amber-200',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  fitness: {
    id: 'fitness',
    title: 'ورزش و سلامتی',
    emoji: '🏋️',
    color: 'from-rose-500 to-red-600',
    bgLight: 'bg-rose-50 text-rose-700',
    bgDark: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    borderDark: 'border-rose-500/30',
    borderLight: 'border-rose-200',
    glow: 'rgba(244, 63, 94, 0.35)',
  },
  entertainment: {
    id: 'entertainment',
    title: 'تفریح و استراحت',
    emoji: '🎮',
    color: 'from-fuchsia-500 to-pink-600',
    bgLight: 'bg-pink-50 text-pink-700',
    bgDark: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    borderDark: 'border-pink-500/30',
    borderLight: 'border-pink-200',
    glow: 'rgba(217, 70, 239, 0.35)',
  },
  sleep: {
    id: 'sleep',
    title: 'خواب و ریکاوری',
    emoji: '😴',
    color: 'from-indigo-500 to-slate-700',
    bgLight: 'bg-indigo-50 text-indigo-700',
    bgDark: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    borderDark: 'border-indigo-500/30',
    borderLight: 'border-indigo-200',
    glow: 'rgba(99, 102, 241, 0.35)',
  },
};

// Priority definitions with distinct styling and Persian labels
export interface PriorityInfo {
  id: PriorityLevel;
  title: string;
  shortTitle: string;
  emoji: string;
  colorClass: string;
  badgeClass: string;
  borderClass: string;
  glowColor: string;
  level: number; // 1 (lowest) to 4 (urgent)
}

export const PRIORITIES: Record<PriorityLevel, PriorityInfo> = {
  urgent: {
    id: 'urgent',
    title: 'فوری و حیاتی',
    shortTitle: 'فوری',
    emoji: '🚨',
    colorClass: 'text-rose-500',
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    borderClass: 'border-rose-500/40',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    level: 4,
  },
  high: {
    id: 'high',
    title: 'اولویت بالا',
    shortTitle: 'بالا',
    emoji: '🔥',
    colorClass: 'text-amber-500',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    borderClass: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    level: 3,
  },
  medium: {
    id: 'medium',
    title: 'اولویت متوسط',
    shortTitle: 'متوسط',
    emoji: '⚡',
    colorClass: 'text-blue-500',
    badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    borderClass: 'border-blue-500/20',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    level: 2,
  },
  low: {
    id: 'low',
    title: 'اولویت عادی و پایین',
    shortTitle: 'عادی',
    emoji: '🌿',
    colorClass: 'text-emerald-500',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    level: 1,
  },
};

// Day Time Slots (بازه های روز)
export interface DayTimeSlotInfo {
  id: DayTimeSlot;
  title: string;
  timeRange: string;
  emoji: string;
  description: string;
  color: string;
  badgeClass: string;
}

export const DAY_TIME_SLOTS: Record<DayTimeSlot, DayTimeSlotInfo> = {
  morning: {
    id: 'morning',
    title: 'صبح',
    timeRange: '۰۶:۰۰ تا ۱۱:۵۹',
    emoji: '🌅',
    description: 'آغاز پرانرژی، تمرینات و وظایف نیازمند هوشیاری',
    color: 'text-amber-500',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  noon: {
    id: 'noon',
    title: 'ظهر',
    timeRange: '۱۲:۰۰ تا ۱۴:۲۹',
    emoji: '☀️',
    description: 'بررسی پروژه‌ها، هماهنگی‌ها و ناهار',
    color: 'text-yellow-500',
    badgeClass: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  },
  afternoon: {
    id: 'afternoon',
    title: 'بعدازظهر',
    timeRange: '۱۴:۳۰ تا ۱۷:۵۹',
    emoji: '🌤️',
    description: 'جلسات عمیق، کدنویسی، یادگیری و زبان',
    color: 'text-orange-500',
    badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  },
  evening: {
    id: 'evening',
    title: 'عصر و غروب',
    timeRange: '۱۸:۰۰ تا ۲۰:۵۹',
    emoji: '🌇',
    description: 'ورزش، کارهای خلاقانه و پایان ساعت کاری',
    color: 'text-purple-500',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  night: {
    id: 'night',
    title: 'شب',
    timeRange: '۲۱:۰۰ تا ۰۵:۵۹',
    emoji: '🌙',
    description: 'آرامش، خانواده، تفریح و ریکاوری خواب',
    color: 'text-indigo-400',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
};

export function detectTimeSlotFromHour(timeStr: string): DayTimeSlot {
  if (!timeStr) return 'afternoon';
  const hour = parseInt(timeStr.split(':')[0], 10) || 0;
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14.5) return 'noon';
  if (hour >= 14.5 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
}

export const PERSIAN_WEEK_DAYS = [
  { short: 'ش', name: 'شنبه', index: 0 },
  { short: 'ی', name: 'یک‌شنبه', index: 1 },
  { short: 'د', name: 'دوشنبه', index: 2 },
  { short: 'س', name: 'سه‌شنبه', index: 3 },
  { short: 'چ', name: 'چهارشنبه', index: 4 },
  { short: 'پ', name: 'پنج‌شنبه', index: 5 },
  { short: 'ج', name: 'جمعه', index: 6 },
];

export const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

// High-precision Gregorian to Jalali (Solar Hijri) calendar converter
export interface JalaliDate {
  jy: number; // Jalali year (e.g. 1403 or 1405)
  jm: number; // Jalali month (1 - 12)
  jd: number; // Jalali day (1 - 31)
  dayOfWeek: number; // 0 for Saturday (شنبه), 6 for Friday (جمعه)
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  // Calculate day of week: Saturday = 0, Friday = 6
  // Gregorian date day of week: Sunday = 0, Saturday = 6
  const gDate = new Date(gy > 1600 ? gy : gy + 1600, gm - 1, gd);
  const gDow = gDate.getDay(); // 0 is Sun, 6 is Sat
  const persianDow = (gDow + 1) % 7; // Saturday becomes 0, Sunday becomes 1

  return { jy, jm, jd, dayOfWeek: persianDow };
}

// Convert Jalali back to Gregorian with mathematical precision
export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  let gy: number;
  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }
  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 13 && days >= sal_a[gm]) {
    days -= sal_a[gm];
    gm++;
  }
  return { gy, gm, gd: days + 1 };
}

// Get the exact day-of-week index for the 1st day of a given Jalali month (0 = شنبه, 6 = جمعه)
export function getFirstWeekdayOfJalaliMonth(jy: number, jm: number): number {
  const g = jalaliToGregorian(jy, jm, 1);
  const d = new Date(g.gy, g.gm - 1, g.gd);
  const gDow = d.getDay(); // 0 is Sun, 6 is Sat
  return (gDow + 1) % 7; // 0 = Sat (شنبه), 6 = Fri (جمعه)
}

export function getCurrentJalaliDate(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function formatJalaliDateString(jDate: JalaliDate, enabledPersianDigits = true): string {
  const weekdayName = PERSIAN_WEEK_DAYS[jDate.dayOfWeek]?.name || 'شنبه';
  const monthName = PERSIAN_MONTHS[jDate.jm - 1] || 'شهریور';
  const dayStr = toPersianDigits(jDate.jd, enabledPersianDigits);
  const yearStr = toPersianDigits(jDate.jy, enabledPersianDigits);
  return `${weekdayName}، ${dayStr} ${monthName} ${yearStr}`;
}

export function formatJalaliShort(jDate: JalaliDate, enabledPersianDigits = true): string {
  const m = jDate.jm < 10 ? `0${jDate.jm}` : `${jDate.jm}`;
  const d = jDate.jd < 10 ? `0${jDate.jd}` : `${jDate.jd}`;
  return toPersianDigits(`${jDate.jy}/${m}/${d}`, enabledPersianDigits);
}

export function getJalaliDaysInMonth(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  // Esfand leap calculation
  const r = year % 33;
  const isLeap = r === 1 || r === 5 || r === 9 || r === 13 || r === 17 || r === 22 || r === 26 || r === 30;
  return isLeap ? 30 : 29;
}

export function getPersianDateString(enabledPersianDigits = true): string {
  const current = getCurrentJalaliDate();
  return formatJalaliDateString(current, enabledPersianDigits);
}
