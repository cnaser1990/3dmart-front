'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Phone, Lock, LogOut, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

type Profile = {
  name?: string;
  phone: string;
  is_verified?: boolean;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError('خطا در دریافت اطلاعات پروفایل');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/auth/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        در حال بارگذاری...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white gap-6">
        <p className="text-red-400">{error || 'خطا در دریافت اطلاعات'}</p>
        <Link
          href="/auth/login"
          className="px-8 py-3 bg-violet-600 rounded-2xl font-bold hover:bg-violet-500 transition"
        >
          ورود به حساب
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-md mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>بازگشت</span>
          </Link>
          <h1 className="text-3xl font-black">پروفایل من</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-400 hover:text-rose-500 transition-colors font-medium"
          >
            <LogOut size={20} />
            خروج
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="flex justify-center -mt-2 mb-8">
            <div className="w-28 h-28 bg-zinc-800 rounded-3xl flex items-center justify-center border-4 border-zinc-700">
              <User size={64} className="text-violet-400" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-zinc-500 text-sm mb-2">نام کامل</div>
              <div className="bg-zinc-800 rounded-2xl px-5 py-4 text-white font-medium">
                {profile.name || 'ثبت نشده'}
              </div>
            </div>

            <div>
              <div className="text-zinc-500 text-sm mb-2 flex items-center gap-2">
                <Phone size={18} />
                شماره موبایل
              </div>
              <div className="bg-zinc-800 rounded-2xl px-5 py-4 text-white font-medium">
                {profile.phone}
              </div>
            </div>

            {profile.is_verified && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                حساب کاربری شما تأیید شده است
              </div>
            )}
          </div>

          {/* Change Password Button */}
          <Link
            href="/profile/change-password"
            className="mt-10 w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 py-4 rounded-2xl font-bold transition-all"
          >
            <Lock size={22} />
            تغییر رمز عبور
          </Link>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-10">
          برای ویرایش نام و سایر اطلاعات با پشتیبانی تماس بگیرید
        </p>
      </div>
    </div>
  );
}