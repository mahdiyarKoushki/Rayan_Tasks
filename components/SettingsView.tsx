'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Sun,
  Moon,
  Smartphone,
  Palette,
  Clock,
  User,
  RefreshCw,
  Sliders,
  Layers,
  Database,
  ShieldCheck,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { AppSettings, TimeOfDay, ThemeMode, AccentColor, BackgroundStyle } from '@/lib/types';
import { soundFx, triggerHaptic } from '@/lib/audio';
import { toPersianDigits } from '@/lib/persian';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
  user?: { username: string; displayName: string } | null;
  onLogout?: () => void;
  dbSyncStatus?: 'synced' | 'syncing' | 'error';
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetData,
  user,
  onLogout,
  dbSyncStatus = 'synced',
}: SettingsViewProps) {
  const bgStyles: { id: BackgroundStyle; title: string; desc: string; icon: string }[] = [
    {
      id: 'bubble-map',
      title: 'بابل‌مپ تعاملی (Bubble Map)',
      desc: 'گوی‌های شیشه‌ای متحرک، خطوط اتصال شبکه و واکنش به موس',
      icon: '🫧',
    },
    {
      id: 'liquid-aurora',
      title: 'مایع شیشه‌ای و آرورا (Liquid Aurora)',
      desc: 'امواج آرام نوری و لایه‌های ژرف نئونی',
      icon: '🌊',
    },
    {
      id: 'cosmic-nebula',
      title: 'سحابی و ذرات کیهانی (Cosmic Nebula)',
      desc: 'ذرات ستاره‌ای معلق در فضای تاریک عمیق',
      icon: '🌌',
    },
    {
      id: 'lofi-rain',
      title: 'باران نئونی و Lo-Fi (Twilight Rain)',
      desc: 'رد قطرات ملایم آب بر سطح شیشه‌ای',
      icon: '🌧️',
    },
    {
      id: 'geometric-mesh',
      title: 'شبکه هندسی مدرن (Geometric Mesh)',
      desc: 'اتصالات خطی سه‌بعدی با پالس نوری',
      icon: '🕸️',
    },
  ];

  const accentColors: { id: AccentColor; name: string; bg: string }[] = [
    { id: 'violet', name: 'بنفش سلطنتی', bg: 'bg-violet-500' },
    { id: 'indigo', name: 'نیلی مدرن', bg: 'bg-indigo-500' },
    { id: 'emerald', name: 'زمردی زنده', bg: 'bg-emerald-500' },
    { id: 'cyan', name: 'فیروزه‌ای شفاف', bg: 'bg-cyan-500' },
    { id: 'rose', name: 'سرخ گلی', bg: 'bg-rose-500' },
    { id: 'amber', name: 'کهربایی گرم', bg: 'bg-amber-500' },
  ];

  const timeProfiles: { id: TimeOfDay; label: string; desc: string }[] = [
    { id: 'auto', label: 'خودکار (Auto)', desc: 'تغییر هوشمند بر اساس ساعت واقعی' },
    { id: 'morning', label: 'صبح (Morning)', desc: 'نور گرم، آرام و انرژی‌بخش' },
    { id: 'noon', label: 'ظهر (Noon)', desc: 'شفاف، درخشان و پروضوح' },
    { id: 'night', label: 'شب (Night)', desc: 'تاریک، عمیق و محافظ چشم' },
  ];

  const handleSoundToggle = () => {
    const nextVal = !settings.soundEnabled;
    if (nextVal) soundFx.playSuccess(true);
    onUpdateSettings({ soundEnabled: nextVal });
  };

  const handleHapticToggle = () => {
    const nextVal = !settings.hapticEnabled;
    if (nextVal) triggerHaptic('medium', true);
    onUpdateSettings({ hapticEnabled: nextVal });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-violet-500" />
          <span>تنظیمات، حساب کاربری و پایگاه‌داده</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          مدیریت ذخیره‌سازی ابری، وضعیت احراز هویت و شخصی‌سازی فضای کاری
        </p>
      </div>

      {/* User Account & Database Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-4 border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-white/5 to-slate-900/40"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-violet-600/30">
              {user?.username?.toUpperCase() || 'MK'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  حساب کاربری: {user?.displayName || 'کاربر mk'}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>دسترسی ادمین</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ورود موفق با نام کاربری mk
              </p>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از حساب</span>
            </button>
          )}
        </div>

        {/* Database Status indicator */}
        <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              وضعیت دیتابیس اختصاصی:
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{dbSyncStatus === 'syncing' ? 'در حال ذخیره‌سازی...' : 'پایدار و ذخیره‌شده روی سرور'}</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            ذخیره خودکار در هر تغییر (Auto-Save)
          </span>
        </div>
      </motion.div>

      {/* User Profile Name Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-3"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
          <User className="w-4 h-4 text-violet-500" />
          <span>نام شما در پیام خوش‌آمدگویی:</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={settings.userName}
            onChange={(e) => onUpdateSettings({ userName: e.target.value })}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-violet-500 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* Theme Mode (Light / Dark) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-slate-800 dark:text-white">حالت تم (Dark / Light)</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تنظیم کنتراست تیره برای تمرکز شبانه یا تم روشن برای روز
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-pill">
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                settings.theme === 'light'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                settings.theme === 'dark'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Background Graphic Styles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-3"
      >
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-500" />
            <span>سبک گرافیکی پس‌زمینه (Background Styles)</span>
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            انتخاب بین بابل‌مپ شناور، مایع آرورا، سحابی کیهانی یا باران نئونی
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {bgStyles.map((item) => {
            const isSel = settings.backgroundStyle === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick(settings.soundEnabled);
                  triggerHaptic('medium', settings.hapticEnabled);
                  onUpdateSettings({ backgroundStyle: item.id });
                }}
                className={`p-3 rounded-2xl text-right flex items-start gap-2.5 border transition-all cursor-pointer ${
                  isSel
                    ? 'border-violet-500 bg-violet-500/15 ring-2 ring-violet-500/20'
                    : 'border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 hover:border-violet-400/40'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Dimming Slider & Physics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-4"
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-violet-500" />
              <span>شدت محوشدگی بک‌گراند برای خوانایی:</span>
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
        </div>

        {/* Focus Bubbles & Physics Toggles */}
        <div className="pt-2 border-t border-slate-200/40 dark:border-white/10 space-y-2">
          {/* Show Focus Bubbles Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/30 dark:bg-white/5">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white">نمایش گوی‌های حبابی تمرکز</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                نمایش گوی‌های شناور دسته‌بندی کارها (تمرکز عمیق، زبان، بک‌اند و ...)
              </p>
            </div>
            <button
              onClick={() => {
                const current = settings.showFocusBubbles ?? (settings.backgroundStyle === 'bubble-map');
                soundFx.playClick(settings.soundEnabled);
                triggerHaptic('light', settings.hapticEnabled);
                onUpdateSettings({ showFocusBubbles: !current });
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                (settings.showFocusBubbles ?? (settings.backgroundStyle === 'bubble-map'))
                  ? 'bg-violet-600'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  (settings.showFocusBubbles ?? (settings.backgroundStyle === 'bubble-map'))
                    ? '-translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Interactive Physics Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/30 dark:bg-white/5">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white">تعامل لمسی و فیزیک موس</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                واکنش گوی‌ها و امواج نوری به حرکت موس، کشیدن و رها کردن و موج ضربه
              </p>
            </div>
            <button
              onClick={() => {
                const nextVal = !settings.interactiveBubbles;
                soundFx.playClick(settings.soundEnabled);
                triggerHaptic('light', settings.hapticEnabled);
                onUpdateSettings({ interactiveBubbles: nextVal });
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
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
        </div>
      </motion.div>

      {/* Time of Day Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-3"
      >
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-500" />
            <span>پروفایل نورپردازی زمان روز (Lighting Profile)</span>
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            سازگاری روشنایی و تم رنگ با ساعات مختلف شبانه‌روز
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {timeProfiles.map((p) => {
            const isSel = settings.timeOfDay === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onUpdateSettings({ timeOfDay: p.id })}
                className={`p-3 rounded-2xl text-right transition-all cursor-pointer border ${
                  isSel
                    ? 'border-violet-500 bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold shadow-md'
                    : 'border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-violet-400/40'
                }`}
              >
                <div className="text-xs">{p.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Accent Colors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-3"
      >
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-slate-800 dark:text-white">رنگ تاکیدی (Accent Color)</span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تعیین رنگ نئونی عناصر فعال، دکمه‌ها و سایه‌ها
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          {accentColors.map((color) => {
            const isSel = settings.accentColor === color.id;
            return (
              <button
                key={color.id}
                onClick={() => onUpdateSettings({ accentColor: color.id })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                  isSel
                    ? 'border-violet-500 bg-violet-500/15'
                    : 'border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{color.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Audio & Haptic Sensory Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-3xl p-5 glass-panel glass-edge space-y-4"
      >
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-slate-800 dark:text-white">تنظیمات حس چندگانه و تعاملات</span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            بازخورد صوتی شیشه‌ای، لرزش لمسی و نمایش ارقام فارسی
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🔔</span>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white">افکت‌های صوتی شیشه‌ای</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  صدای ملایم کلیک، موفقیت در انجام کار و باز کردن مودال‌ها
                </p>
              </div>
            </div>

            <button
              onClick={handleSoundToggle}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1 ${
                settings.soundEnabled ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white">لرزش لمسی (Haptic Feedback)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  بازخورد ویبره ظریف در تلفن همراه هنگام تیک زدن کارها
                </p>
              </div>
            </div>

            <button
              onClick={handleHapticToggle}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1 ${
                settings.hapticEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.hapticEnabled ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Persian digits toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-mono font-bold text-violet-500">۱۲۳</span>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white">اعداد فارسی</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  نمایش اعداد به صورت ارقام فارسی (۰ تا ۹)
                </p>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ persianDigits: !settings.persianDigits })}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1 ${
                settings.persianDigits ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.persianDigits ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Reset to sample defaults */}
      <div className="pt-2 text-center">
        <button
          onClick={onResetData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بازنشانی داده‌های اولیه نمونه (Reset Sample Data)</span>
        </button>
      </div>
    </div>
  );
}
