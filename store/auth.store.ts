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
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);

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
            useCartStore.getState().clearCart();
          }
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");

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

          useCartStore.getState().clearCart();
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "kitabghor-auth",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);