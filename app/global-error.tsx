'use client';

import Link from 'next/link';
import { AlertTriangle, Home, ShoppingCart } from 'lucide-react';

export default function GlobalError() {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-black/20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle size={40} className="text-amber-400" />
            </div>

            <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4 text-white">
              500
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
              خطایی در سرور رخ داده
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
              مشکلی در پردازش درخواست پیش آمده است. لطفاً به صفحه اصلی برگردید و دوباره تلاش کنید.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/25 w-full sm:w-auto"
              >
                <Home size={18} />
                بازگشت به خانه
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-bold w-full sm:w-auto"
              >
                <ShoppingCart size={18} />
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}