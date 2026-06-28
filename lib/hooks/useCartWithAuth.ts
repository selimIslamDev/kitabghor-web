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
    if (item.stock === 0) {
      toast.error("This product is out of stock!");
      return false;
    }

    // Check current quantity in cart
    const currentItems = cartStore.items;
    const existingItem = currentItems.find((i) => i.id === item.id);
    if (existingItem && existingItem.quantity >= item.stock) {
      toast.error(`Only ${item.stock} available in stock!`);
      return false;
    }

    cartStore.addItem(item);
    return true;
  };

  return { ...cartStore, addItem };
}