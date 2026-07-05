
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cart.store"; // 👈 কার্ট স্টোরটি ইমপোর্ট করো

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
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        
        // 🛠️ ফিক্স: ম্যানুয়াল রিমুভ না করে Zustand-এর মেথড দিয়ে কার্ট পুরোপুরি ক্লিয়ার করো
        useCartStore.getState().clearCart(); 

        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "kitabghor-auth" }
  )
);














// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role: "CUSTOMER" | "ADMIN";
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   setAuth: (user: User, token: string) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,

//       setAuth: (user, token) => {
//         if (typeof window !== "undefined") {
//           localStorage.setItem("token", token);
//         }
//         set({ user, token, isAuthenticated: true });
//       },

//       logout: () => {
//         if (typeof window !== "undefined") {
//           localStorage.removeItem("token");
//         }
//         // Cart clear করো
//         try {
//           localStorage.removeItem("kitabghor-cart");
//         } catch (e) {}
//         set({ user: null, token: null, isAuthenticated: false });
//       },
//     }),
//     { name: "kitabghor-auth" }
//   )
// );