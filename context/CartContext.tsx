'use client';

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from 'react';
import { CartItem } from '@/types';

const CART_KEY = 'cart';
const CART_CHANGE_EVENT = 'cart-change';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: number, variantId?: number | null) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number | null) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalWeightGrams: () => number;
  getQuantity: (productId: number, variantId?: number | null) => number;
  isInCart: (productId: number, variantId?: number | null) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ✅ Cache the server snapshot outside the component
const emptyCartSnapshot: CartItem[] = [];

// ✅ Normalize variantId to always be null or number (never undefined)
function normalizeVariantId(variantId?: number | null): number | null {
  return variantId ?? null;
}

// ✅ Create a store for cart state
const cartStore = {
  items: [] as CartItem[],
  listeners: new Set<() => void>(),

  getSnapshot() {
    return this.items;
  },

  getServerSnapshot() {
    return emptyCartSnapshot;
  },

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  },

  setItems(newItems: CartItem[]) {
    this.items = newItems;
    this.listeners.forEach((listener) => listener());
  },

  loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const newItems = Array.isArray(parsed) ? parsed : [];
        if (JSON.stringify(this.items) !== JSON.stringify(newItems)) {
          this.items = newItems;
          this.listeners.forEach((listener) => listener());
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      this.items = [];
    }
  },

  saveToStorage(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe.bind(cartStore),
    cartStore.getSnapshot.bind(cartStore),
    cartStore.getServerSnapshot.bind(cartStore)
  );

  useEffect(() => {
    cartStore.loadFromStorage();
    
    const handleStorageChange = () => {
      cartStore.loadFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CART_CHANGE_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CART_CHANGE_EVENT, handleStorageChange);
    };
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, qty: number = 1) => {
    const currentItems = cartStore.getSnapshot();
    const itemVariantId = normalizeVariantId(item.variantId);
    
    const existingIndex = currentItems.findIndex(
      (i) => i.productId === item.productId && 
             normalizeVariantId(i.variantId) === itemVariantId
    );

    let newItems: CartItem[];

    if (existingIndex > -1) {
      newItems = [...currentItems];
      const existingItem = newItems[existingIndex];
      newItems[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + qty,
      };
    } else {
      newItems = [
        ...currentItems,
        {
          ...item,
          variantId: itemVariantId,
          quantity: qty,
        },
      ];
    }

    cartStore.saveToStorage(newItems);
    cartStore.setItems(newItems);
  }, []);

  const removeItem = useCallback((productId: number, variantId?: number | null) => {
    const currentItems = cartStore.getSnapshot();
    const normalizedVariantId = normalizeVariantId(variantId);
    
    const newItems = currentItems.filter(
      (item) => !(item.productId === productId && 
                 normalizeVariantId(item.variantId) === normalizedVariantId)
    );
    
    cartStore.saveToStorage(newItems);
    cartStore.setItems(newItems);
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number, variantId?: number | null) => {
    const currentItems = cartStore.getSnapshot();
    const normalizedVariantId = normalizeVariantId(variantId);
    
    const newItems = currentItems
      .map((item) => {
        if (item.productId === productId && 
            normalizeVariantId(item.variantId) === normalizedVariantId) {
          return { ...item, quantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    cartStore.saveToStorage(newItems);
    cartStore.setItems(newItems);
  }, []);

  const clearCart = useCallback(() => {
    cartStore.saveToStorage([]);
    cartStore.setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0
    );
  }, [items]);

  const getTotalWeightGrams = useCallback(() => {
    return items.reduce(
      (total, item) => total + (item.weightGrams || 0) * item.quantity,
      0
    );
  }, [items]);

  const getQuantity = useCallback((productId: number, variantId?: number | null) => {
    const normalizedVariantId = normalizeVariantId(variantId);
    const item = items.find(
      (i) => i.productId === productId && 
             normalizeVariantId(i.variantId) === normalizedVariantId
    );
    return item?.quantity || 0;
  }, [items]);

  const isInCart = useCallback((productId: number, variantId?: number | null) => {
    const normalizedVariantId = normalizeVariantId(variantId);
    return items.some(
      (i) => i.productId === productId && 
             normalizeVariantId(i.variantId) === normalizedVariantId
    );
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalWeightGrams,
    getQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}