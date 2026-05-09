import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "3DMart | پلتفرم هوشمند پرینت سه‌بعدی",
  description: "سفارش پرینت، فیگور، دکوری و خرید مواد مصرفی پرینتر سه‌بعدی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      {/* 
        رنگ پس‌زمینه کل سایت را روی تم Dark (مشکی) گذاشتیم 
        تا با صفحه اصلی هماهنگ باشد 
      */}
      <body className="antialiased min-h-screen flex flex-col bg-zinc-950 text-white">
        
        {/* نوار ناوبری ثابت بالا */}
        <Navbar />

        {/* محتوای متغیر هر صفحه */}
        <main className="flex-grow">
          {children}
        </main>

        {/* پاورقی سایت */}
        <Footer />

        {/* برای نمایش پیام‌های موفقیت/ارور */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'bg-zinc-900 text-white border border-white/10 font-vazirmatn',
          }} 
        />

      </body>
    </html>
  );
}