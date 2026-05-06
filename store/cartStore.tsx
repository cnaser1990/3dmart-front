import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  // اکشن‌ها
  addItem: (item: CartItem) => void;
  removeItem: (id: number, type: 'product' | 'consumable') => void;
  updateQuantity: (id: number, type: 'product' | 'consumable', quantity: number) => void;
  clearCart: () => void;
  // توابع محاسباتی
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // 1. اضافه کردن به سبد خرید
      addItem: (newItem) => {
        set((state) => {
          // بررسی می‌کنیم که آیا این آیتم قبلاً در سبد بوده یا نه
          // (نکته: چون ممکن است یک محصول و یک ماده مصرفی آیدی مشابه داشته باشند، هر دو را چک می‌کنیم)
          const existingItem = state.items.find(
            (item) => item.id === newItem.id && item.type === newItem.type
          );

          if (existingItem) {
            // اگر بود، فقط تعدادش را زیاد کن
            return {
              items: state.items.map((item) =>
                item.id === newItem.id && item.type === newItem.type
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }

          // اگر نبود، به عنوان آیتم جدید به آرایه اضافه کن
          return { items: [...state.items, newItem] };
        });
      },

      // 2. حذف از سبد خرید
      removeItem: (id, type) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.type === type)),
        }));
      },

      // 3. تغییر تعداد یک آیتم
      updateQuantity: (id, type, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.type === type ? { ...item, quantity } : item
          ),
        }));
      },

      // 4. خالی کردن کل سبد (معمولا بعد از پرداخت موفق استفاده می‌شود)
      clearCart: () => set({ items: [] }),

      // 5. محاسبه جمع کل سبد خرید
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // 6. محاسبه تعداد کل آیتم‌ها (برای نمایش روی آیکون سبد خرید در Navbar)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // نام کلیدی که در localStorage مرورگر ذخیره می‌شود
    }
  )
);

// این خط دقیقاً همان چیزی است که ارور شما را حل می‌کند!
export default useCartStore; 