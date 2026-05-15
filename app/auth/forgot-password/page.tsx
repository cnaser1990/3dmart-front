'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Lock, Check, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/accounts'; // آدرس بک‌اند خود را تنظیم کنید

type Message = {
  type: 'success' | 'error';
  text: string;
};

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'phone' | 'reset'>('phone');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  // مرحله ۱: درخواست کد
  const handleRequestOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/password/forgot/`, { phone });
      showMessage('success', res.data.message || 'کد بازیابی ارسال شد');
      setStep('reset');
      startResendTimer();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'خطا در ارسال کد');
    } finally {
      setLoading(false);
    }
  };

  // مرحله ۲: تغییر رمز
  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMessage('error', 'رمز عبور جدید و تکرار آن مطابقت ندارد');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/password/reset/`, {
        phone,
        code: otpCode,
        new_password: newPassword,
      });

      showMessage('success', 'رمز عبور با موفقیت تغییر کرد');
      setTimeout(() => (window.location.href = '/auth/login'), 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      showMessage('error', error.response?.data?.error || 'کد تأیید یا اطلاعات نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || !phone) return;

    try {
      await axios.post(`${API_BASE}/otp/resend/`, {
        phone,
        purpose: 'reset_password',
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
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-2 text-4xl font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">3D</span>
            <span className="text-white">Mart</span>
          </Link>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-8 text-white">فراموشی رمز عبور</h1>

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

          {/* مرحله ۱: وارد کردن موبایل */}
          {step === 'phone' && (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">شماره موبایل</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none"
                    placeholder="۰۹xxxxxxxxx"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 py-4 rounded-2xl font-bold text-lg disabled:opacity-70 transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={24} />}
                دریافت کد بازیابی
              </button>
            </form>
          )}

          {/* مرحله ۲: وارد کردن کد و رمز جدید */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-6">
                <Check className="mx-auto text-emerald-500 mb-3" size={48} />
                <p className="text-zinc-400">کد به شمارهٔ</p>
                <p className="text-white font-medium text-xl mt-1">{phone}</p>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">کد تأیید</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 text-center text-2xl tracking-widest focus:border-violet-500 outline-none"
                  placeholder="۰۰۰۰۰۰"
                  maxLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">رمز عبور جدید</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">تکرار رمز عبور جدید</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-4 text-zinc-500" size={22} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-lg focus:border-violet-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-lg disabled:opacity-70 transition"
              >
                {loading ? 'در حال تغییر رمز...' : 'تغییر رمز عبور'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className="w-full flex items-center justify-center gap-2 text-violet-400 hover:text-violet-300 disabled:opacity-50 py-2 text-sm"
              >
                <RefreshCw size={18} className={resendTimer > 0 ? 'animate-spin' : ''} />
                {resendTimer > 0
                  ? `ارسال مجدد بعد از ${resendTimer} ثانیه`
                  : 'ارسال مجدد کد'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-8 flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            بازگشت به صفحه ورود
          </Link>
          <Link href="/" className="text-zinc-500 hover:text-zinc-400 text-sm">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}