// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/products', label: 'محصولات' },
  { href: '/consumables', label: 'مواد مصرفی' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/terms', label: 'قوانین' },
  { href: 'https://rubika.ir/neseron', label: 'محصول خودتون رو سفارش بدید!' },
];

export default function Navbar() {
  const { getTotalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight" onClick={closeMobileMenu}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              3D
            </span>
            <span className="text-white">Mart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
              onClick={closeMobileMenu}
            >
              <ShoppingCart size={20} className="text-zinc-300" />
              <span
                suppressHydrationWarning
                className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                  totalItems > 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
              aria-label="منوی موبایل"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-zinc-300" />
              ) : (
                <Menu size={24} className="text-zinc-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-16 right-0 bottom-0 w-full max-w-sm bg-zinc-950 border-l border-white/10 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-6 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className="text-base font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors px-4 py-3 rounded-xl"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex items-center justify-between text-base font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors px-4 py-3 rounded-xl"
            >
              <span>سبد خرید</span>
              {totalItems > 0 && (
                <span
                  suppressHydrationWarning
                  className="min-w-[24px] h-[24px] px-2 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}