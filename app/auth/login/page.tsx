'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Lock, Check, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/accounts';

type Message = {
  type: 'success' | 'error';
  text: string;
};

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'initial' | 'otp'>('initial');

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetForm = () => {
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    setStep('initial');
    setMessage(null);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showMessage('error', 'رمز عبور و تکرار آن مطابقت ندارد');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/register/`, { phone, password });
      showMessage('success', res.data.message || 'کد تأیید ارسال شد');
      setStep('otp');
      startResendTimer();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'خطا در ارسال کد تأیید');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/register/verify/`, {
        phone,
        code: otpCode,
      });
      localStorage.setItem('access_token', res.data.tokens.access);
      localStorage.setItem('refresh_token', res.data.tokens.refresh);
      showMessage('success', 'ثبت‌نام با موفقیت انجام شد');
      setTimeout(() => (window.location.href = '/'), 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'کد تأیید نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/login/password/`, { phone, password });
      localStorage.setItem('access_token', res.data.tokens.access);
      localStorage.setItem('refresh_token', res.data.tokens.refresh);
      showMessage('success', 'ورود با موفقیت انجام شد');
      setTimeout(() => (window.location.href = '/'), 1200);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'شماره موبایل یا رمز عبور اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOTPRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/login/otp/`, { phone });
      showMessage('success', res.data.message || 'کد تأیید ارسال شد');
      setStep('otp');
      startResendTimer();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'خطا در ارسال کد تأیید');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOTPVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/login/otp/verify/`, {
        phone,
        code: otpCode,
      });
      localStorage.setItem('access_token', res.data.tokens.access);
      localStorage.setItem('refresh_token', res.data.tokens.refresh);
      showMessage('success', 'ورود با موفقیت انجام شد');
      setTimeout(() => (window.location.href = '/'), 1200);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'کد تأیید نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || !phone) return;
    try {
      await axios.post(`${API_BASE}/otp/resend/`, {
        phone,
        purpose: mode === 'register' ? 'register' : 'login',
      });
      showMessage('success', 'کد جدید ارسال شد');
      startResendTimer();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'خطا در ارسال مجدد کد');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-2 text-4xl font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              3D
            </span>
            <span className="text-white">Mart</span>
          </Link>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* ── Mode Tabs (ورود / ثبت‌نام) ── */}
          <div className="flex border-b border-white/10 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); resetForm(); }}
              className={`flex-1 pb-4 text-lg font-bold transition-all ${
                mode === 'login'
                  ? 'text-white border-b-2 border-violet-500'
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); resetForm(); }}
              className={`flex-1 pb-4 text-lg font-bold transition-all ${
                mode === 'register'
                  ? 'text-white border-b-2 border-violet-500'
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          {/* ── Login Method Switcher ── خارج از form */}
          {mode === 'login' && step === 'initial' && (
            <div className="flex gap-2 mb-6 bg-zinc-950 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => { setLoginMethod('password'); resetForm(); }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  loginMethod === 'password'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                ورود با رمز عبور
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('otp'); resetForm(); }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  loginMethod === 'otp'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                ورود با کد یکبارمصرف
              </button>
            </div>
          )}

          {/* ── Message ── */}
          {message && (
            <div
              className={`p-4 rounded-2xl mb-6 text-sm border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* ── Register Form ── */}
          {mode === 'register' && step === 'initial' && (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">شماره موبایل</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none text-white"
                    placeholder="۰۹xxxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">رمز عبور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">تکرار رمز عبور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 rounded-2xl font-bold text-lg disabled:opacity-70 flex items-center justify-center gap-2 text-white"
              >
                {loading && <Loader2 className="animate-spin" size={24} />}
                دریافت کد تأیید
              </button>
            </form>
          )}

          {/* ── Login Password Form ── */}
          {mode === 'login' && loginMethod === 'password' && step === 'initial' && (
            <form onSubmit={handleLoginPassword} className="space-y-6">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">شماره موبایل</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none text-white"
                    placeholder="۰۹xxxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">رمز عبور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none text-white"
                    required
                  />
                </div>
              </div>

              <div className="text-left">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-zinc-500 hover:text-violet-400 transition-colors"
                >
                  فراموشی رمز عبور؟
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 py-4 rounded-2xl font-bold text-lg disabled:opacity-70 hover:bg-violet-500 transition text-white flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={24} />}
                ورود به حساب کاربری
              </button>
            </form>
          )}

          {/* ── Login OTP Request Form ── */}
          {mode === 'login' && loginMethod === 'otp' && step === 'initial' && (
            <form onSubmit={handleLoginOTPRequest} className="space-y-6">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">شماره موبایل</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none text-white"
                    placeholder="۰۹xxxxxxxxx"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 py-4 rounded-2xl font-bold text-lg disabled:opacity-70 hover:bg-violet-500 transition text-white flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={24} />}
                دریافت کد تأیید
              </button>
            </form>
          )}

          {/* ── OTP Verify Form ── */}
          {step === 'otp' && (
            <form
              onSubmit={mode === 'register' ? handleRegisterVerify : handleLoginOTPVerify}
              className="space-y-6"
            >
              <div className="text-center">
                <Check className="mx-auto text-emerald-500 mb-3" size={48} />
                <p className="text-zinc-400">کد تأیید به شمارهٔ</p>
                <p className="text-white font-medium text-xl mt-1">{phone}</p>
                <p className="text-zinc-500 text-sm mt-1">ارسال شد</p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-5 text-center text-3xl tracking-[12px] focus:border-violet-500 outline-none text-white"
                placeholder="------"
                maxLength={6}
                required
                dir="ltr"
              />

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-emerald-600 py-4 rounded-2xl font-bold text-lg disabled:opacity-70 hover:bg-emerald-500 transition text-white flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={24} />}
                تأیید کد و ادامه
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className="w-full flex items-center justify-center gap-2 text-violet-400 hover:text-violet-300 disabled:opacity-50 py-2 text-sm transition-colors"
              >
                <RefreshCw
                  size={18}
                  className={resendTimer > 0 ? 'animate-spin' : ''}
                />
                {resendTimer > 0
                  ? `ارسال مجدد بعد از ${resendTimer} ثانیه`
                  : 'ارسال مجدد کد تأیید'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('initial'); setOtpCode(''); setMessage(null); }}
                className="w-full text-center text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
              >
                ← ویرایش شماره موبایل
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-400 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}