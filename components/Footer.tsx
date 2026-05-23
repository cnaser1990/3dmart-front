import Link from 'next/link';
import { Cuboid } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/5">
                <Cuboid size={22} strokeWidth={2} />
              </div>
              <span className="font-black text-2xl tracking-widest text-white">3DMART</span>
            </Link>

            <p className="text-zinc-500 leading-loose max-w-sm mb-6">
              مرجع تخصصی سفارش پرینت سه‌بعدی، خرید اکشن‌فیگور، قطعات کمیاب و تامین مواد مصرفی (فیلامنت و رزین) با بهترین کیفیت در ایران.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">دسترسی سریع</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-zinc-400 hover:text-white transition-colors">گالری محصولات</Link></li>
              <li><Link href="/consumables" className="text-zinc-400 hover:text-white transition-colors">خرید فیلامنت و رزین</Link></li>
              <li><Link href="/cart" className="text-zinc-400 hover:text-white transition-colors">سبد خرید</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">پشتیبانی</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-zinc-400 hover:text-white transition-colors">سوالات متداول</Link></li>
              <li><Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">قوانین و مقررات</Link></li>
            </ul>

            <a
              href="https://trustseal.enamad.ir/?id=730456&Code=WOwxcUz7m7k0l3oN6OZ44ZAxfzueuvMK"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="origin"
              className="inline-block mt-6"
            >
              <img
                src="https://trustseal.enamad.ir/logo.aspx?id=730456&Code=WOwxcUz7m7k0l3oN6OZ44ZAxfzueuvMK"
                alt="نماد اعتماد الکترونیکی"
                referrerPolicy="origin"
                style={{ cursor: 'pointer' }}
              />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} تمام حقوق برای 3DMART محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
