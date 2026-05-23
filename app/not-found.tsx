// app/not-found.tsx
import Link from 'next/link';
import { SearchX, Home, ShoppingCart } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-black/20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <SearchX size={40} className="text-violet-300" />
          </div>

          <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4 text-white">
            404
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
            این صفحه پیدا نشد
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
            آدرس واردشده وجود ندارد، حذف شده یا به مسیر دیگری منتقل شده است. از مسیرهای زیر ادامه دهید.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/25"
            >
              <Home size={18} />
              صفحه اصلی
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-bold"
            >
              <ShoppingCart size={18} />
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}