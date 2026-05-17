// app/403/page.tsx

import Link from 'next/link';
import { ShieldAlert, Home } from 'lucide-react';

export const metadata = {
  title: '403 | دسترسی غیرمجاز',
  description: 'شما اجازه دسترسی به این صفحه را ندارید.',
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-black/20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ShieldAlert size={40} className="text-rose-400" />
          </div>

          <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4 text-white">
            403
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
            دسترسی به این صفحه مجاز نیست
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
            شما اجازه مشاهده این بخش را ندارید. ممکن است نیاز به ورود داشته باشید یا این صفحه فقط برای کاربران خاص در دسترس باشد.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/25 w-full sm:w-auto"
            >
              <Home size={18} />
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}