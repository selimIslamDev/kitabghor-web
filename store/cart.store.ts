import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);

const calcTotalItems = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      totalItems: 0,

      addItem: (newItem) => {
        const items = get().items;
        const existing = items.find((i) => i.id === newItem.id);

        // Stock check
        if (existing && existing.quantity >= newItem.stock) {
          return;
        }

        const updated = existing
          ? items.map((i) =>
              i.id === newItem.id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i
            )
          : [...items, { ...newItem, quantity: 1 }];

        set({
          items: updated,
          totalAmount: calcTotal(updated),
          totalItems: calcTotalItems(updated),
        });
      },

      removeItem: (id) => {
        const updated = get().items.filter((i) => i.id !== id);
        set({
          items: updated,
          totalAmount: calcTotal(updated),
          totalItems: calcTotalItems(updated),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeItem(id);
        const updated = get().items.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        );
        set({
          items: updated,
          totalAmount: calcTotal(updated),
          totalItems: calcTotalItems(updated),
        });
      },

      clearCart: () => set({ items: [], totalAmount: 0, totalItems: 0 }),
    }),
    { name: "kitabghor-cart" }
  )
);