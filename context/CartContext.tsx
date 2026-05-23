// context/CartContext.tsx
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import type { CartItem } from '@/types';

type CartContextType = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  isInCart: (productId: number) => boolean;
  getQuantity: (productId: number) => number;
  getTotalItems: () => number;
  getTotalWeightGrams: () => number;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'cart';
const CART_CHANGE_EVENT = 'cart-change';
const EMPTY_CART: CartItem[] = [];

let cachedCartRaw: string | null = null;
let cachedCartValue: CartItem[] = EMPTY_CART;

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return EMPTY_CART;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return EMPTY_CART;

  const raw = localStorage.getItem(CART_KEY);

  if (raw === cachedCartRaw) {
    return cachedCartValue;
  }

  cachedCartRaw = raw;
  cachedCartValue = safeParseCart(raw);
  return cachedCartValue;
}

function writeCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;

  const raw = JSON.stringify(items);
  cachedCartRaw = raw;
  cachedCartValue = items;
  localStorage.setItem(CART_KEY, raw);
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function subscribe(listener: () => void) {
  if (typeof window === 'undefined') return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === CART_KEY) {
      listener();
    }
  };

  const onCartChange = () => {
    listener();
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener(CART_CHANGE_EVENT, onCartChange);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CART_CHANGE_EVENT, onCartChange);
  };
}

function getSnapshot() {
  return readCartFromStorage();
}

function getServerSnapshot() {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const currentItems = readCartFromStorage();

    const nextItems = currentItems.some((item) => item.productId === product.productId)
      ? currentItems.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...currentItems, { ...product, quantity }];

    writeCartToStorage(nextItems);
  }, []);

  const removeItem = useCallback((productId: number) => {
    const currentItems = readCartFromStorage();
    const nextItems = currentItems.filter((item) => item.productId !== productId);

    writeCartToStorage(nextItems);
  }, []);

  const clearCart = useCallback(() => {
    writeCartToStorage([]);
  }, []);

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.productId === productId),
    [items]
  );

  const getQuantity = useCallback(
    (productId: number) => {
      const item = items.find((i) => i.productId === productId);
      return item?.quantity || 0;
    },
    [items]
  );

  const getTotalItems = useCallback(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const getTotalWeightGrams = useCallback(
    () => items.reduce((total, item) => total + (item.weightGrams || 0) * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      isInCart,
      getQuantity,
      getTotalItems,
      getTotalWeightGrams,
      removeItem,
      clearCart,
    }),
    [items, addItem, isInCart, getQuantity, getTotalItems, getTotalWeightGrams, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};