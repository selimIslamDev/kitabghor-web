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

interface AddItemResult {
  added: number; // how many units were actually added (0 if none)
  requested: number; // how many units were requested
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => AddItemResult;
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
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      addItem: (newItem, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === newItem.id);
        const currentQty = existing ? existing.quantity : 0;

        // How many more units can we actually add without exceeding stock?
        const maxAddable = Math.max(0, newItem.stock - currentQty);
        const qtyToAdd = Math.min(quantity, maxAddable);

        if (qtyToAdd <= 0) {
          return { added: 0, requested: quantity };
        }

        const updated = existing
          ? items.map((i) =>
              i.id === newItem.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
            )
          : [...items, { ...newItem, quantity: qtyToAdd }];

        set({
          items: updated,
          totalAmount: calcTotal(updated),
          totalItems: calcTotalItems(updated),
        });

        return { added: qtyToAdd, requested: quantity };
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

      clearCart: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("kitabghor-cart");
        }
        set({ items: [], totalAmount: 0, totalItems: 0 });
      },
    }),
    {
      name: "kitabghor-cart",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);