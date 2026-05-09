import Link from 'next/link';
import { Cuboid, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* بخش برند */}
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
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-cyan-600 transition-all border border-white/5">
                <Send size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-green-600 transition-all border border-white/5">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">دسترسی سریع</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-zinc-400 hover:text-white transition-colors">گالری محصولات</Link></li>
              <li><Link href="/consumables" className="text-zinc-400 hover:text-white transition-colors">خرید فیلامنت و رزین</Link></li>
              <li><Link href="/cart" className="text-zinc-400 hover:text-white transition-colors">سبد خرید</Link></li>
              <li><Link href="/track" className="text-zinc-400 hover:text-white transition-colors">پیگیری سفارش</Link></li>
            </ul>
          </div>

          {/* پشتیبانی */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">پشتیبانی</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-zinc-400 hover:text-white transition-colors">سوالات متداول</Link></li>
              <li><Link href="/rules" className="text-zinc-400 hover:text-white transition-colors">قوانین و مقررات</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} تمام حقوق برای 3DMART محفوظ است.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">حریم خصوصی</span>
            <span className="hover:text-white cursor-pointer transition-colors">شرایط استفاده</span>
          </div>
        </div>
      </div>
    </footer>
  );
}