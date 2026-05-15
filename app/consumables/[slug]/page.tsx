// app/consumables/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Consumable } from '@/types';
import {
  Layers,
  Droplets,
  Truck,
  ShieldCheck,
  ExternalLink,
  TrendingDown,
  Clock,
} from 'lucide-react';
import AddToCartConsumable from '@/components/AddToCartConsumable';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

async function getConsumable(slug: string): Promise<Consumable | null> {
  try {
    const res = await fetch(`${API_URL}/store/consumables/${slug}/`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedConsumables(
  consumableType: string,
  currentSlug: string
): Promise<Consumable[]> {
  try {
    const res = await fetch(
      `${API_URL}/store/consumables/?consumable_type=${consumableType}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? data)
      .filter((c: Consumable) => c.slug !== currentSlug)
      .slice(0, 4);
  } catch {
    return [];
  }
}

export default async function ConsumableDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const consumable = await getConsumable(slug);

  if (!consumable) notFound();

  const related = await getRelatedConsumables(consumable.consumable_type, slug);
  const isFilament = consumable.consumable_type === 'filament';

  const prices = consumable.price_history?.map((h) => h.price) ?? [];
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">

      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
              خانه
            </Link>
            <span>/</span>
            <Link href="/consumables" className="hover:text-white transition-colors whitespace-nowrap">
              مواد مصرفی
            </Link>
            <span>/</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                isFilament
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'bg-fuchsia-500/10 text-fuchsia-400'
              }`}
            >
              {isFilament ? 'فیلامنت' : 'رزین'}
            </span>
            <span>/</span>
            <span className="text-white truncate">{consumable.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-20">

          {/* ── Image ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden relative">
              {consumable.image ? (
                <Image
                  src={getImageUrl(consumable.image)}
                  alt={consumable.name}
                  fill
                  className="object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                  {consumable.color_hex ? (
                    <>
                      <div
                        className="w-32 h-32 rounded-full border-8 border-white/10 shadow-2xl"
                        style={{ backgroundColor: consumable.color_hex }}
                      />
                      <span className="text-zinc-500 text-sm">{consumable.color}</span>
                    </>
                  ) : isFilament ? (
                    <Layers size={80} className="text-zinc-700" strokeWidth={1} />
                  ) : (
                    <Droplets size={80} className="text-zinc-700" strokeWidth={1} />
                  )}
                </div>
              )}
            </div>

            {/* Price history chart */}
            {prices.length > 1 && minPrice !== null && maxPrice !== null && (
              <div className="mt-4 bg-zinc-900/50 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold text-zinc-300">تاریخچه قیمت</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {consumable.price_history
                    ?.slice(0, 20)
                    .reverse()
                    .map((h, i) => {
                      const range = maxPrice - minPrice || 1;
                      const heightPct = ((h.price - minPrice) / range) * 100;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-violet-500/30 hover:bg-violet-500/60 rounded-sm transition-all cursor-default"
                          style={{ height: `${Math.max(heightPct, 10)}%` }}
                          title={h.price.toLocaleString('fa-IR')}
                        />
                      );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-zinc-600">
                  <span>{minPrice.toLocaleString('fa-IR')} تومان</span>
                  <span>{maxPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full border border-white/10">
                {consumable.brand}
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  isFilament
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20'
                }`}
              >
                {isFilament ? 'فیلامنت' : 'رزین'}
              </span>
              {isFilament &&
                consumable.filament_type &&
                consumable.filament_type !== 'none' && (
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-200 text-xs font-black rounded-full border border-white/10">
                    {consumable.filament_type.toUpperCase()}
                  </span>
                )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black mb-6 leading-tight">
              {consumable.name}
            </h1>

            {/* Price Box */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-4 sm:p-6 mb-6">
              {consumable.selling_price ? (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {consumable.selling_price.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-zinc-400 text-lg">تومان</span>
                  </div>
                  {consumable.last_crawled_at && (
                    <div className="flex items-center gap-1.5 text-zinc-600 text-xs mt-1">
                      <Clock size={12} />
                      <span>
                        آخرین بروزرسانی:{' '}
                        {new Date(consumable.last_crawled_at).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-zinc-500 font-bold">قیمت در دسترس نیست</p>
              )}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                <div className="text-zinc-500 text-xs mb-1">برند</div>
                <div className="font-bold text-white text-sm sm:text-base">
                  {consumable.brand}
                </div>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                <div className="text-zinc-500 text-xs mb-1">وزن</div>
                <div className="font-bold text-white text-sm sm:text-base">
                  {consumable.weight_kg} کیلوگرم
                </div>
              </div>
              {consumable.color && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                  <div className="text-zinc-500 text-xs mb-1">رنگ</div>
                  <div className="flex items-center gap-2">
                    {consumable.color_hex && (
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0"
                        style={{ backgroundColor: consumable.color_hex }}
                      />
                    )}
                    <span className="font-bold text-white text-sm sm:text-base">
                      {consumable.color}
                    </span>
                  </div>
                </div>
              )}
              {isFilament && consumable.filament_type !== 'none' && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                  <div className="text-zinc-500 text-xs mb-1">نوع فیلامنت</div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {consumable.filament_type.toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart - Client Component */}
            {consumable.selling_price ? (
              <AddToCartConsumable
                consumableId={consumable.id}
                slug={consumable.slug}
                name={consumable.name}
                sellingPrice={consumable.selling_price}
                image={consumable.image}
                stock={consumable.stock}
              />
            ) : (
              <div className="mb-6 sm:mb-8">
                <div className="w-full bg-zinc-800 text-zinc-500 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 cursor-not-allowed">
                  قیمت در دسترس نیست
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-6 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck size={20} className="text-violet-400" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">ارسال سریع</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">تحویل ۳ روزه</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} className="text-cyan-400" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">اصالت کالا</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">ضمانت کیفیت</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ExternalLink size={20} className="text-rose-400" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">قیمت روز</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">آپدیت خودکار</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {consumable.description && (
          <div className="mb-12 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">توضیحات</h2>
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 sm:p-8">
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {consumable.description}
              </p>
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8">محصولات مشابه</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/consumables/${item.slug}`}
                  className="group bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all"
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
                      <div className="w-full h-full flex items-center justify-center">
                        {item.color_hex ? (
                          <div
                            className="w-12 h-12 rounded-full border-4 border-white/10"
                            style={{ backgroundColor: item.color_hex }}
                          />
                        ) : item.consumable_type === 'filament' ? (
                          <Layers size={40} className="text-zinc-700" strokeWidth={1} />
                        ) : (
                          <Droplets size={40} className="text-zinc-700" strokeWidth={1} />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <span className="text-[10px] text-zinc-500 font-bold">{item.brand}</span>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-violet-400 transition-colors">
                      {item.name}
                    </h3>
                    {item.selling_price ? (
                      <div className="text-base sm:text-lg font-black text-white">
                        {item.selling_price.toLocaleString('fa-IR')}
                        <span className="text-[10px] sm:text-xs font-medium text-zinc-400 mr-1">
                          تومان
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-500">قیمت نامشخص</span>
                    )}
                    <div className="mt-1">
                      {item.stock > 0 ? (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          ✓ موجود — {item.stock} عدد
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-bold">
                          ✕ ناموجود
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}