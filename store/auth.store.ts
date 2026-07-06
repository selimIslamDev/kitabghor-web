import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cart.store";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);

          // আগের user এর cart clear করো
          // নতুন user এর cart restore করো
          const userCartKey = `kitabghor-cart-${user.id}`;
          const savedCart = localStorage.getItem(userCartKey);
          if (savedCart) {
            try {
              const cartData = JSON.parse(savedCart);
              useCartStore.setState({
                items: cartData.items || [],
                totalAmount: cartData.totalAmount || 0,
                totalItems: cartData.totalItems || 0,
              });
            } catch (e) {}
          } else {
            // নতুন user এর জন্য cart clear করো
            useCartStore.getState().clearCart();
          }
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");

          // Current user এর cart save করো
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            const cartState = useCartStore.getState();
            const userCartKey = `kitabghor-cart-${currentUser.id}`;
            localStorage.setItem(userCartKey, JSON.stringify({
              items: cartState.items,
              totalAmount: cartState.totalAmount,
              totalItems: cartState.totalItems,
            }));
          }

          // Cart clear করো
          useCartStore.getState().clearCart();
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "kitabghor-auth" }
  )
);