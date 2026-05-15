// app/consumables/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Consumable } from '@/types';
import { Search, PackageX, Layers, Droplets } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

async function getConsumables(search?: string): Promise<Consumable[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    const res = await fetch(`${API_URL}/store/consumables/?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? data;
  } catch {
    return [];
  }
}

export default async function ConsumablesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const consumables = await getConsumables(search);
  const hasSearch = !!search;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-1">مواد مصرفی</h1>
          <p className="text-zinc-500 text-sm sm:text-base">
            {consumables.length} محصول موجود
          </p>
        </div>

        {/* Search */}
        <form method="GET" action="/consumables" className="relative mb-8">
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <input
            type="text"
            name="search"
            defaultValue={search ?? ''}
            placeholder="جستجو در مواد مصرفی..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3 sm:py-4 pr-12 pl-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors text-sm sm:text-base"
          />
        </form>

        {hasSearch && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-400 text-sm">
              <span className="text-white font-bold">{consumables.length}</span> نتیجه برای «{search}»
            </p>
            <Link
              href="/consumables"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors border border-violet-500/30 hover:border-violet-500/60 px-3 py-1.5 rounded-full"
            >
              پاک کردن جستجو
            </Link>
          </div>
        )}

        {consumables.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {consumables.map((item) => (
              <ConsumableCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState hasSearch={hasSearch} />
        )}
      </div>
    </div>
  );
}

function ConsumableCard({ item }: { item: Consumable }) {
  const isFilament = item.consumable_type === 'filament';

  return (
    <Link
      href={`/consumables/${item.slug}`}
      className="group bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col"
    >
      <div className="aspect-square bg-zinc-950 relative overflow-hidden">
        {item.image ? (
          <Image
            src={getImageUrl(item.image)}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            {item.color_hex ? (
              <div
                className="w-14 h-14 rounded-full border-4 border-white/10 shadow-lg"
                style={{ backgroundColor: item.color_hex }}
              />
            ) : isFilament ? (
              <Layers size={48} className="text-zinc-700" strokeWidth={1} />
            ) : (
              <Droplets size={48} className="text-zinc-700" strokeWidth={1} />
            )}
          </div>
        )}

        <div className="absolute top-2 right-2">
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              isFilament ? 'bg-cyan-500 text-white' : 'bg-fuchsia-500 text-white'
            }`}
          >
            {isFilament ? 'فیلامنت' : 'رزین'}
          </span>
        </div>

        {isFilament && item.filament_type && item.filament_type !== 'none' && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-white/10">
              {item.filament_type.toUpperCase()}
            </span>
          </div>
        )}

        {item.stock === 0 && (
          <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
            <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-white/10">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <span className="text-[10px] text-zinc-500 font-bold mb-1">{item.brand}</span>

        <h3 className="font-bold text-white text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-violet-400 transition-colors leading-snug flex-1">
          {item.name}
        </h3>

        {item.color && (
          <div className="flex items-center gap-1.5 mb-2">
            {item.color_hex && (
              <div
                className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"
                style={{ backgroundColor: item.color_hex }}
              />
            )}
            <span className="text-[10px] text-zinc-500">{item.color}</span>
          </div>
        )}

        <span className="text-[10px] text-zinc-600 mb-3">{item.weight_kg} کیلوگرم</span>

        <div className="mt-auto">
          {item.selling_price ? (
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-white">
                {item.selling_price.toLocaleString('fa-IR')}
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400">تومان</span>
            </div>
          ) : (
            <span className="text-sm text-zinc-500 font-bold">قیمت نامشخص</span>
          )}

          <div className="mt-1.5">
            {item.stock > 0 ? (
              <span className="text-[10px] text-emerald-400 font-bold">
                ✓ موجود — {item.stock} عدد
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 font-bold">✕ ناموجود</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
        {hasSearch ? (
          <Search size={40} className="text-zinc-600" />
        ) : (
          <PackageX size={40} className="text-zinc-600" />
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
        {hasSearch ? 'محصولی یافت نشد' : 'هنوز محصولی ثبت نشده'}
      </h3>
      <p className="text-zinc-500 text-sm sm:text-base max-w-xs mb-6">
        {hasSearch ? 'جستجوی دیگری امتحان کنید' : 'به زودی مواد مصرفی جدید اضافه خواهند شد'}
      </p>
      {hasSearch && (
        <Link
          href="/consumables"
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/30 text-sm"
        >
          پاک کردن جستجو
        </Link>
      )}
    </div>
  );
}