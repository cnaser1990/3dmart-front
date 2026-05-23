// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: "3DMart | بازارگاه پرینت سه‌بعدی",
  description: "سفارش پرینت، فیگور، دکوری و خرید مواد مصرفی پرینتر سه‌بعدی",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased min-h-screen flex flex-col bg-zinc-950 text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
