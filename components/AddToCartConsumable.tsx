// components/AddToCartConsumable.tsx
'use client';

import Link from 'next/link';
import { useSyncExternalStore, useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

type Props = {
  consumableId: number;
  slug: string;
  name: string;
  sellingPrice: number;
  image?: string;
  stock: number;
  weightKg?: string | number;
  brand?: string;
};

export default function AddToCartConsumable({
  consumableId,
  slug,
  name,
  sellingPrice,
  image,
  stock,
  weightKg = 1,
  brand,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const hydrated = useHydrated();
  const { addItem, isInCart, getQuantity } = useCart();

  const alreadyInCart = hydrated ? isInCart(consumableId) : false;
  const cartQty = hydrated ? getQuantity(consumableId) : 0;

  const remainingStock = stock > 0 ? Math.max(0, stock - cartQty) : 99;
  const maxAllowed = remainingStock;

  const handleAddToCart = () => {
    if (stock > 0 && cartQty >= stock) {
      return;
    }

    const weightInKg = typeof weightKg === 'string' ? parseFloat(weightKg) || 1 : weightKg;
    const weightInGrams = Math.round(weightInKg * 1000);

    addItem(
      {
        id: consumableId,
        productId: consumableId,
        slug,
        name,
        price: sellingPrice,
        finalPrice: sellingPrice,
        image,
        stock,
        preparationTimeDays: 0,
        weightGrams: weightInGrams,
        brand,
        isConsumable: true,
        type: 'consumable',
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="mb-6 sm:mb-8">
      {hydrated && alreadyInCart && (
        <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
          <span className="text-violet-300 text-xs sm:text-sm font-bold">
            در سبد خرید: {cartQty} عدد
          </span>
          <Link
            href="/cart"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
          >
            مشاهده سبد
          </Link>
        </div>
      )}

      {stock > 0 && (
        <div className="mb-3 px-3 py-2 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <p className="text-amber-400/90 text-[10px] sm:text-xs text-center font-bold">
            {remainingStock > 0 ? (
              <>⚠ {remainingStock} عدد دیگر قابل سفارش</>
            ) : (
              <>✕ تمام موجودی در سبد شماست</>
            )}
          </p>
        </div>
      )}

      <div className="flex gap-3 sm:gap-4 mb-4">
        <div className="flex items-center bg-zinc-900/50 border border-white/10 rounded-2xl select-none">
          <button
            type="button"
            onClick={() => setQuantity((p) => Math.max(1, p - 1))}
            disabled={quantity <= 1}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:text-zinc-700 rounded-r-2xl"
          >
            <Minus size={18} />
          </button>

          <span className="w-10 sm:w-12 text-center font-black text-white text-base sm:text-lg">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => setQuantity((p) => Math.min(maxAllowed, p + 1))}
            disabled={quantity >= maxAllowed || maxAllowed === 0}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:text-zinc-700 rounded-l-2xl"
          >
            <Plus size={18} />
          </button>
        </div>

        {stock === 0 ? (
          <div className="flex-1 bg-zinc-800 text-zinc-500 py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base cursor-not-allowed">
            <ShoppingCart size={20} />
            ناموجود
          </div>
        ) : remainingStock === 0 ? (
          <div className="flex-1 bg-zinc-800 text-zinc-500 py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base cursor-not-allowed">
            <Check size={20} />
            همه در سبد است
          </div>
        ) : justAdded ? (
          <div className="flex-1 bg-emerald-600 text-white py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
            <Check size={20} />
            به سبد اضافه شد
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={remainingStock === 0}
            className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-lg shadow-violet-500/30 text-sm sm:text-base active:scale-95"
          >
            <ShoppingCart size={20} />
            افزودن به سبد خرید
          </button>
        )}
      </div>

      {stock > 0 ? (
        <p className="text-[10px] sm:text-xs text-emerald-400/80 text-center font-bold">
          ✓ موجود در انبار — {stock} عدد (باقی‌مانده: {remainingStock})
        </p>
      ) : (
        <p className="text-[10px] sm:text-xs text-amber-400/80 text-center">
          موجودی محدود — با ثبت سفارش تأمین می‌شود
        </p>
      )}
    </div>
  );
}