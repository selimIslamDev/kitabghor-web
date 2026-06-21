import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useCartWithAuth() {
  const cartStore = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const addItem = (item: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
    stock: number;
  }) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      router.push("/login");
      return false;
    }
    cartStore.addItem(item);
    return true;
  };

  return { ...cartStore, addItem };
}