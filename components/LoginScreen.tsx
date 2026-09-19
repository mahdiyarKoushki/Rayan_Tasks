'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Database,
} from 'lucide-react';
import { soundFx, triggerHaptic } from '@/lib/audio';
import DynamicBackground from './DynamicBackground';

interface LoginScreenProps {
  onSuccess: (user: { username: string; displayName: string }) => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export default function LoginScreen({
  onSuccess,
  soundEnabled = true,
  hapticEnabled = true,
}: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      soundFx.playClick(soundEnabled);
      triggerHaptic('medium', hapticEnabled);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        soundFx.playSuccess(soundEnabled);
        triggerHaptic('medium', hapticEnabled);

        if (rememberMe) {
          localStorage.setItem('rayan_auth_user', JSON.stringify(data.user));
          localStorage.setItem('rayan_auth_token', data.token);
        } else {
          sessionStorage.setItem('rayan_auth_user', JSON.stringify(data.user));
          sessionStorage.setItem('rayan_auth_token', data.token);
        }

        onSuccess(data.user);
      } else {
        soundFx.playClick(soundEnabled);
        triggerHaptic('heavy', hapticEnabled);
        setErrorMsg(data.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch {
      // Local fallback in case network issues occur
      if (username.trim() === 'mk' && password.trim() === 'mk') {
        soundFx.playSuccess(soundEnabled);
        triggerHaptic('medium', hapticEnabled);
        const user = { username: 'mk', displayName: 'کاربر mk' };
        localStorage.setItem('rayan_auth_user', JSON.stringify(user));
        localStorage.setItem('rayan_auth_token', 'local_fallback_token');
        onSuccess(user);
      } else {
        setErrorMsg('نام کاربری یا رمز عبور نادرست است.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Ambient background with interactive liquid / bubble physics */}
      <DynamicBackground
        timeOfDay="afternoon"
        isDark={true}
        style="bubble-map"
        backgroundDim={30}
        interactiveBubbles={true}
      />

      {/* Decorative ambient radial glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-3xl glass-panel glass-edge p-6 sm:p-8 shadow-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl z-10"
      >
        {/* App Logo & Header */}
        <div className="text-center space-y-2 mb-6">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-violet-600/30 border border-white/20"
          >
            <Lock className="w-8 h-8" />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>حفاظت از اطلاعات دیتابیس اختصاصی</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ورود به پنل شخصی رایان
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            برای دسترسی به دیتابیس پایدار و ثبت تغییرات برنامه‌ریزی، لطفاً وارد شوید.
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-violet-500" />
              <span>نام کاربری:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                dir="ltr"
                className="w-full py-3 px-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono font-bold transition-all text-left"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-500" />
              <span>رمز عبور:</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                className="w-full py-3 pr-4 pl-11 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono font-bold transition-all text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me option */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 text-xs">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-violet-600 cursor-pointer"
              />
              <span>مرا به خاطر بسپار</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>ورود به سیستم و همگام‌سازی</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer info: Database notice */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>پایگاه‌داده اختصاصی فعال</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span>احراز هویت امن</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
