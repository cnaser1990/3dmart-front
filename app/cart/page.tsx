'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useSyncExternalStore } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Cuboid,
  Truck,
  ShieldCheck,
  Weight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const SHIPPING_THRESHOLD_GRAMS = 500;
const SHIPPING_LIGHT = 100_000;
const SHIPPING_HEAVY = 150_000;

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

function formatPrice(value: number) {
  return value.toLocaleString('fa-IR');
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalWeightGrams,
    updateQuantity,
  } = useCart();
  
  const isHydrated = useHydrated();

  const totalItems = getTotalItems();
  const totalWeightGrams = getTotalWeightGrams();

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    );
  }, [items]);

  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    return totalWeightGrams < SHIPPING_THRESHOLD_GRAMS ? SHIPPING_LIGHT : SHIPPING_HEAVY;
  }, [items.length, totalWeightGrams]);

  const totalPrice = subtotal + shippingCost;

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-20">
        <div className="border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
                خانه
              </Link>
              <span>/</span>
              <span className="text-white whitespace-nowrap">سبد خرید</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                سبد خرید
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2">در حال بارگذاری...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
              خانه
            </Link>
            <span>/</span>
            <span className="text-white whitespace-nowrap">سبد خرید</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              سبد خرید
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2" suppressHydrationWarning>
              {totalItems > 0
                ? `${totalItems} عدد محصول داخل سبد شماست`
                : 'سبد شما در حال حاضر خالی است'}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-bold w-fit"
          >
            <ArrowLeft size={18} />
            ادامه خرید
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-white/10 rounded-3xl p-6 sm:p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <ShoppingCart size={34} className="text-violet-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-3">سبد خرید خالی است</h2>
            <p className="text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید. از صفحه محصولات، آیتم‌های موردنظر
              را انتخاب کنید و سفارش خود را ادامه دهید.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/25"
            >
              <ShoppingCart size={18} />
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-black">اقلام سبد</h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs sm:text-sm text-rose-400 hover:text-rose-300 transition-colors font-bold"
                >
                  خالی کردن سبد
                </button>
              </div>

              {items.map((item) => {
                const itemTotal = item.finalPrice * item.quantity;
                const isConsumableItem = item.isConsumable === true;
                const stock = item.stock ?? 9999;
                const canIncrease = isConsumableItem ? item.quantity < stock : true;

                const uniqueKey = item.variantId 
                  ? `${item.productId}-${item.variantId}` 
                  : `${item.productId}`;

                return (
                  <div
                    key={uniqueKey}
                    className="bg-zinc-900/40 border border-white/10 rounded-3xl p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/${isConsumableItem ? 'consumables' : 'products'}/${item.slug}`}
                        className="relative shrink-0 w-full sm:w-28 md:w-32 aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-white/5"
                      >
                        {item.image ? (
                          <Image
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Cuboid size={42} className="text-zinc-700" strokeWidth={1} />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/${isConsumableItem ? 'consumables' : 'products'}/${item.slug}`}
                              className="text-lg sm:text-xl font-black hover:text-violet-400 transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            {item.brand && (
                              <p className="text-xs text-zinc-500 mt-0.5">{item.brand}</p>
                            )}
                            {item.variantColor && (
                              <div className="flex items-center gap-2 mt-1">
                                {item.variantColorHex && (
                                  <span 
                                    className="inline-block w-3 h-3 rounded-full border border-white/20" 
                                    style={{ backgroundColor: item.variantColorHex }}
                                  />
                                )}
                                <span className="text-xs text-violet-400">
                                  رنگ: {item.variantColor}
                                </span>
                              </div>
                            )}
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isConsumableItem
                                  ? 'bg-cyan-500/10 text-cyan-400'
                                  : 'bg-violet-500/10 text-violet-400'
                              }`}
                            >
                              {isConsumableItem ? 'مواد مصرفی' : 'محصول'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="inline-flex items-center gap-2 self-start px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs sm:text-sm font-bold transition-colors"
                          >
                            <Trash2 size={16} />
                            حذف
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-5">
                          <div className="flex items-center bg-zinc-950 border border-white/10 rounded-2xl w-fit">
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = item.quantity - 1;
                                if (newQty > 0) {
                                  updateQuantity(item.productId, newQty, item.variantId);
                                } else {
                                  removeItem(item.productId, item.variantId);
                                }
                              }}
                              className="w-11 h-11 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/5 transition-colors rounded-r-2xl"
                            >
                              <Minus size={18} />
                            </button>

                            <span className="w-12 text-center font-black text-white">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                const newQty = item.quantity + 1;
                                if (canIncrease) {
                                  updateQuantity(item.productId, newQty, item.variantId);
                                }
                              }}
                              disabled={!canIncrease}
                              title={!canIncrease ? 'محدودیت موجودی' : 'افزایش تعداد'}
                              className="w-11 h-11 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/5 transition-colors rounded-l-2xl disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Plus size={18} />
                            </button>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-zinc-400 text-xs sm:text-sm mb-1">
                              قیمت واحد
                            </div>
                            <div className="font-black text-white text-lg">
                              {formatPrice(item.finalPrice)} تومان
                            </div>
                            <div className="text-zinc-500 text-xs mt-1">
                              مجموع آیتم: {formatPrice(itemTotal)} تومان
                            </div>
                            {isConsumableItem && item.stock && item.stock < 9999 && (
                              <div className="text-[10px] text-emerald-400 mt-2">
                                موجودی: {item.stock} عدد
                              </div>
                            )}
                            {!isConsumableItem && (
                              <div className="text-[10px] text-violet-400 mt-2">
                                ⚡ قابل تولید (بدون محدودیت)
                              </div>
                            )}
                            {!isConsumableItem && item.preparationTimeDays > 0 && (
                              <div className="text-[10px] text-amber-400 mt-1">
                                زمان آماده‌سازی: {item.preparationTimeDays} روز
                              </div>
                            )}
                            {item.weightGrams > 0 && (
                              <div className="text-[10px] text-cyan-400 mt-1">
                                وزن واحد:{' '}
                                {item.weightGrams >= 1000
                                  ? `${(item.weightGrams / 1000).toFixed(1)} کیلو`
                                  : `${item.weightGrams} گرم`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6">
                <h2 className="text-xl font-black mb-5">خلاصه سفارش</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-zinc-400">تعداد کالا</span>
                    <span className="font-bold" suppressHydrationWarning>
                      {totalItems} عدد
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-zinc-400">جمع جزء</span>
                    <span className="font-bold" suppressHydrationWarning>
                      {formatPrice(subtotal)} تومان
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-zinc-400">هزینه ارسال</span>
                    <span className="font-bold" suppressHydrationWarning>
                      {formatPrice(shippingCost)} تومان
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Weight size={12} />
                      <span>وزن کل سفارش</span>
                    </div>
                    <span suppressHydrationWarning>
                      {totalWeightGrams >= 1000
                        ? `${(totalWeightGrams / 1000).toFixed(2)} کیلوگرم`
                        : `${totalWeightGrams} گرم`}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-base sm:text-lg font-black">مبلغ نهایی</span>
                    <span
                      className="text-xl sm:text-2xl font-black text-white"
                      suppressHydrationWarning
                    >
                      {formatPrice(totalPrice)} تومان
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-violet-500/10 border border-violet-500/15">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Truck size={18} className="text-violet-300" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">هزینه ارسال</div>
                      <div className="text-[11px] text-zinc-400" suppressHydrationWarning>
                        {totalWeightGrams < SHIPPING_THRESHOLD_GRAMS
                          ? `زیر ${SHIPPING_THRESHOLD_GRAMS}گرم: ${formatPrice(SHIPPING_LIGHT)} تومان`
                          : `بالای ${SHIPPING_THRESHOLD_GRAMS}گرم: ${formatPrice(SHIPPING_HEAVY)} تومان`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/15">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} className="text-cyan-300" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">تضمین کیفیت</div>
                      <div className="text-[11px] text-zinc-400">
                        مطابق مشخصات ثبت‌شده در محصول
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/checkout"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/25"
                  >
                    ثبت سفارش
                  </Link>

                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-bold"
                  >
                    ادامه خرید
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}