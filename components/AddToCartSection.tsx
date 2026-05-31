'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, useSyncExternalStore, useEffect } from 'react';
import { Check, Minus, Plus, ShoppingCart, AlertCircle } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';

const MAX_QUANTITY = 99;

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function isLight(hex?: string | null): boolean {
  if (!hex) return false;
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;

  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);

  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function formatPrice(value: number) {
  return value.toLocaleString('fa-IR');
}

export default function AddToCartSection({ product }: { product: Product }) {
  const hydrated = useHydrated();
  const { addItem, isInCart, getQuantity } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<number | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (!product.has_variants || !product.variants?.length) return null;
    return (
      product.variants.find((v) => v.is_active && v.stock > 0) ??
      product.variants.find((v) => v.is_active) ??
      null
    );
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const hasVariants = Boolean(product.has_variants && (product.variants?.length ?? 0) > 0);

  const activePrice = hasVariants && selectedVariant ? selectedVariant.price : product.final_price;
  const activeStock = hasVariants && selectedVariant ? selectedVariant.stock : product.stock;
  const activeImage = hasVariants && selectedVariant?.image ? selectedVariant.image : product.primary_image;

  const isProductActive = product.is_active && (hasVariants ? !!selectedVariant?.is_active : true);

  const alreadyInCart = hydrated
    ? isInCart(product.id, hasVariants ? (selectedVariant?.id ?? null) : null)
    : false;

  const cartQty = hydrated
    ? getQuantity(product.id, hasVariants ? (selectedVariant?.id ?? null) : null)
    : 0;

  const stockText = useMemo(() => {
    if (activeStock > 0) return `${activeStock} عدد موجود`;
    return `${product.preparation_time_days} روز آماده‌سازی`;
  }, [activeStock, product.preparation_time_days]);

  const canAdd = isProductActive && (!hasVariants || !!selectedVariant);

  const handleAddToCart = () => {
    if (!canAdd) return;

    // ✅ Check if selected variant is out of stock
    if (hasVariants && selectedVariant && selectedVariant.stock <= 0) {
      alert('این رنگ موجود نیست اما می‌توانید سفارش دهید (نیاز به آماده‌سازی دارد)');
    }

    addItem(
      {
        id: product.id,
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        variantName: selectedVariant?.color_name ?? undefined,
        variantColor: selectedVariant?.color_name ?? undefined,
        variantColorHex: selectedVariant?.color_code ?? undefined,
        slug: product.slug,
        name: product.name,
        price: product.price,
        finalPrice: activePrice,
        image: activeImage,
        stock: activeStock,
        preparationTimeDays: product.preparation_time_days,
        weightGrams: product.weight_grams ? Math.round(product.weight_grams) : 0,
        brand: product.brand,
        isConsumable: false,
        type: 'product',
      },
      quantity
    );

    setJustAdded(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4 shadow-lg shadow-black/10 sm:p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-zinc-500">قیمت</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">
                {formatPrice(activePrice)}
              </span>
              <span className="text-sm text-zinc-400">تومان</span>
            </div>
          </div>

          <div className="pt-1 text-left text-sm text-zinc-400">{stockText}</div>
        </div>

        {hasVariants && product.variants && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">رنگ</span>
              {selectedVariant?.color_name && (
                <span className="text-sm text-zinc-300">{selectedVariant.color_name}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {product.variants
                .filter((variant) => variant.is_active)
                .map((variant) => {
                  const selected = selectedVariant?.id === variant.id;
                  const outOfStock = variant.stock <= 0;
                  const variantQty = hydrated ? getQuantity(product.id, variant.id) : 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      // ✅ Allow clicking even if out of stock, just show visual feedback
                      disabled={false}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1);
                      }}
                      className={[
                        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all relative',
                        selected
                          ? 'border-violet-500 bg-violet-500/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.05]',
                        // ✅ Show visual feedback for out of stock but allow click
                        outOfStock && !selected ? 'opacity-60' : '',
                      ].join(' ')}
                      title={variant.color_name}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: variant.color_code ?? '#6b7280' }}
                      />
                      <span>{variant.color_name}</span>
                      {selected && (
                        <Check
                          size={13}
                          strokeWidth={3}
                          color={isLight(variant.color_code) ? '#000' : '#fff'}
                        />
                      )}
                      {variantQty > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-violet-500 text-white text-[10px] rounded-full">
                          {variantQty}
                        </span>
                      )}
                      {/* ✅ Show out of stock badge */}
                      {outOfStock && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center" title="نیاز به آماده‌سازی">
                          <AlertCircle size={10} />
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* ✅ Show message if selected variant is out of stock */}
            {selectedVariant && selectedVariant.stock <= 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <AlertCircle size={14} />
                <span>
                  این رنگ نیاز به آماده‌سازی دارد ({product.preparation_time_days} روز کاری)
                </span>
              </div>
            )}
          </div>
        )}

        {hydrated && alreadyInCart && (
          <div className="flex items-center justify-between rounded-2xl border border-violet-500/15 bg-violet-500/5 px-4 py-3">
            <span className="text-sm text-violet-100">
              این محصول در سبد شماست: <span className="font-semibold">{cartQty}</span>
            </span>
            <Link href="/cart" className="text-sm text-violet-300 hover:text-violet-200">
              مشاهده سبد
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 sm:w-36">
            <button
              type="button"
              onClick={() => setQuantity((p) => Math.max(1, p - 1))}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="کاهش تعداد"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-6 select-none text-center text-sm font-medium text-white">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((p) => Math.min(MAX_QUANTITY, p + 1))}
              disabled={quantity >= MAX_QUANTITY}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="افزایش تعداد"
            >
              <Plus size={16} />
            </button>
          </div>

          {!isProductActive ? (
            <div className="flex min-h-12 w-full flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-500">
              ناموجود
            </div>
          ) : hasVariants && !selectedVariant ? (
            <div className="flex min-h-12 w-full flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-500">
              ابتدا رنگ را انتخاب کنید
            </div>
          ) : justAdded ? (
            <div className="flex min-h-12 w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white">
              <Check size={16} />
              اضافه شد
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex min-h-12 w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 active:scale-[0.99]"
            >
              <ShoppingCart size={16} />
              افزودن به سبد خرید
            </button>
          )}
        </div>
      </div>
    </section>
  );
}