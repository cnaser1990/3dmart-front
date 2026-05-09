'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/products', label: 'محصولات' },
  { href: '/consumables', label: 'مواد مصرفی' },
  { href: '/track', label: 'پیگیری سفارش' },
  { href: '/contact-us', label: 'محصول خودتون رو سفارش بدید!' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-black text-xl tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            3D
          </span>
          <span className="text-white">Mart</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">

          {/* Cart */}
          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ShoppingCart size={20} className="text-zinc-300" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Profile */}
          <Link href="/auth/login" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <User size={20} className="text-zinc-300" />
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            {isOpen 
              ? <X size={20} className="text-white" /> 
              : <Menu size={20} className="text-white" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white font-medium py-3 border-b border-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white font-medium py-3 transition-colors"
          >
            ورود / ثبت‌نام
          </Link>
        </div>
      )}
    </header>
  );
}