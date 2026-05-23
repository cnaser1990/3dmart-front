'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';

interface SliderProps {
  subtitle: string;
  href: string;
  linkText: string;
  itemCount: number;
  children: React.ReactNode;
}

export default function Slider({
  subtitle,
  href,
  linkText,
  itemCount,
  children,
}: SliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: 'right' | 'left') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isHovered || itemCount <= 4) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (Math.abs(scrollLeft) >= scrollWidth - clientWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, itemCount]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-zinc-300 text-xl font-bold tracking-tight">{subtitle}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-2">
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <Link href={href} className="hidden sm:flex items-center gap-3 text-white/80 hover:text-white font-medium group ml-4">
              {linkText}
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} />
              </div>
            </Link>
          </div>
        </div>

        {itemCount > 0 ? (
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none -ml-4" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none -mr-4" />

            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 pt-4 snap-x"
            >
              {children}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500">
            هنوز آیتمی اضافه نشده
          </div>
        )}

      </div>
    </section>
  );
}