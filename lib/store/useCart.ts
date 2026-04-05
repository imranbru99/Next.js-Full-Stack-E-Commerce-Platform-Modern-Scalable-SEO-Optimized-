import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.variantId === item.variantId);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (variantId) => set((state) => ({
        items: state.items.filter((i) => i.variantId !== variantId),
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'nextecommerce-cart' }
  )
)