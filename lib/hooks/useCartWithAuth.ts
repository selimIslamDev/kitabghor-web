import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useCartWithAuth() {
  const cartStore = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const addItem = (
    item: {
      id: string;
      name: string;
      price: number;
      discountPrice?: number;
      image: string;
      stock: number;
    },
    quantity: number = 1
  ) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      router.push("/login");
      return false;
    }
    if (item.stock === 0) {
      toast.error("This product is out of stock!");
      return false;
    }

    const currentItems = cartStore.items;
    const existingItem = currentItems.find((i) => i.id === item.id);
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty >= item.stock) {
      toast.error(`Only ${item.stock} available in stock — you already have the max in your cart!`);
      return false;
    }

    const result = cartStore.addItem(item, quantity);

    if (result.added === 0) {
      toast.error(`Only ${item.stock} available in stock!`);
      return false;
    }

    if (result.added < result.requested) {
      toast.error(`Only ${result.added} added — that's all the stock we have left!`);
      return true;
    }

    toast.success(`${result.added}x ${item.name} added to cart!`);
    return true;
  };

  return { ...cartStore, addItem };
}