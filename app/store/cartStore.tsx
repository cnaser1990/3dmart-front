import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number, type: 'product' | 'consumable') => void
  updateQuantity: (id: number, type: 'product' | 'consumable', quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemsCount: () => number
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id && i.type === item.type)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id && i.type === item.type ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (id, type) => {
        set({
          items: get().items.filter((i) => !(i.id === id && i.type === type)),
        })
      },

      updateQuantity: (id, type, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, type)
          return
        }

        set({
          items: get().items.map((i) => (i.id === id && i.type === type ? { ...i, quantity } : i)),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

export default useCartStore