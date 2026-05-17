// components/AddToCartSection.tsx
'use client';

import Link from 'next/link';
import { useSyncExternalStore, useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

const MAX_QUANTITY = 99;

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const hydrated = useHydrated();
  const { addItem, isInCart, getQuantity } = useCart();

  const alreadyInCart = hydrated ? isInCart(product.id) : false;
  const cartQty = hydrated ? getQuantity(product.id) : 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(MAX_QUANTITY, prev + 1));
  };

  const handleAddToCart = () => {
    const weightInGrams = product.weight_grams && product.weight_grams > 0 
      ? Math.round(product.weight_grams) 
      : 0;

    addItem(
      {
        id: product.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        finalPrice: product.final_price,
        image: product.primary_image,
        stock: product.stock,
        preparationTimeDays: product.preparation_time_days,
        weightGrams: weightInGrams,
        brand: product.brand,
        isConsumable: false,
        type: 'product',
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

      <div className="flex gap-3 sm:gap-4 mb-4">
        <div className="flex items-center bg-zinc-900/50 border border-white/10 rounded-2xl select-none">
          <button
            type="button"
            onClick={handleDecrease}
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
            onClick={handleIncrease}
            disabled={quantity >= MAX_QUANTITY}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:text-zinc-700 rounded-l-2xl"
          >
            <Plus size={18} />
          </button>
        </div>

        {!product.is_active ? (
          <div className="flex-1 bg-zinc-800 text-zinc-500 py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
            <ShoppingCart size={20} />
            محصول ناموجود است
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
            className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-lg shadow-violet-500/30 text-sm sm:text-base active:scale-95"
          >
            <ShoppingCart size={20} />
            افزودن به سبد خرید
          </button>
        )}
      </div>

      <p className="text-[10px] sm:text-xs text-zinc-500 text-center leading-relaxed">
        در صورت کمبود یا عدم موجودی{' '}
        <span className="text-amber-400">با توجه به زمان آماده سازی و تعداد سفارش شما</span>{' '}
        تولید می‌شود.
        <br />
        زمان آماده‌سازی:{' '}
        <span className="font-medium text-zinc-400">
          {product.preparation_time_days} روز کاری
        </span>
      </p>
    </div>
  );
}