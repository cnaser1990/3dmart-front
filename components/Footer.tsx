import Link from 'next/link';
import Image from 'next/image';
import { Cuboid, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Brand Section */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 lg:mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/5">
                <Cuboid size={22} strokeWidth={2} />
              </div>
              <span className="font-black text-xl lg:text-2xl tracking-widest text-white">3DMART</span>
            </Link>

            <p className="text-zinc-500 text-sm lg:text-base leading-relaxed lg:leading-loose max-w-sm mb-6">
              مرجع تخصصی سفارش پرینت سه‌بعدی، خرید اکشن‌فیگور، قطعات کمیاب و تامین مواد مصرفی (فیلامنت و رزین) با بهترین کیفیت در ایران.
            </p>

            {/* Telegram Icon Only */}
            <a
              href="https://t.me/threeDmart"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-cyan-500/20 active:scale-95"
              title="Telegram: @threeDmart"
              aria-label="تماس با ما در تلگرام"
            >
              <Send size={18} />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 lg:mb-6 tracking-wide text-sm lg:text-base">دسترسی سریع</h4>
            <ul className="space-y-3 lg:space-y-4">
              <li>
                <Link href="/products" className="text-zinc-400 hover:text-white transition-colors text-sm lg:text-base">
                  گالری محصولات
                </Link>
              </li>
              <li>
                <Link href="/consumables" className="text-zinc-400 hover:text-white transition-colors text-sm lg:text-base">
                  خرید فیلامنت و رزین
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-zinc-400 hover:text-white transition-colors text-sm lg:text-base">
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link href="/#custom-order" className="text-zinc-400 hover:text-white transition-colors text-sm lg:text-base">
                  سفارش سفارشی
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-4 lg:mb-6 tracking-wide text-sm lg:text-base">پشتیبانی</h4>
            <ul className="space-y-3 lg:space-y-4 mb-6">
              <li>
                <Link href="/faq" className="text-zinc-400 hover:text-white transition-colors text-sm lg:text-base">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors text-sm lg:text-base">
                  قوانین و مقررات
                </Link>
              </li>
            </ul>

            {/* E-Namad Badge */}
            <a
              href="https://trustseal.enamad.ir/?id=730456&Code=WOwxcUz7m7k0l3oN6OZ44ZAxfzueuvMK"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="origin"
              className="inline-block"
            >
              <Image
                src="https://trustseal.enamad.ir/logo.aspx?id=730456&Code=WOwxcUz7m7k0l3oN6OZ44ZAxfzueuvMK"
                alt="نماد اعتماد الکترونیکی"
                width={100}
                height={100}
                className="w-24 lg:w-auto cursor-pointer"
                unoptimized
              />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 lg:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs lg:text-sm">
          <p className="text-center sm:text-right">
            © {new Date().getFullYear()} تمام حقوق برای 3DMART محفوظ است.
          </p>
          
          <div className="flex items-center gap-2 text-zinc-600">
            <span>ساخته شده با</span>
            <span className="text-rose-500">♥</span>
            <span>در ایران</span>
          </div>
        </div>
      </div>
    </footer>
  );
}