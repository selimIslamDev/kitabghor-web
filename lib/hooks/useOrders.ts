import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useMyOrders() {
  return useQuery({
    queryKey: ["orders", "my"],
    queryFn: async () => {
      const res = await api.get("/orders/my");
      return res.data.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const { clearCart } = useCartStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      items: { productId: string; quantity: number }[];
      shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        postalCode?: string;
      };
      paymentMethod: string;
      couponCode?: string;
    }) => {
      const res = await api.post("/orders", data);
      return res.data.data;
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully! 🎉");
      router.push("/orders/success");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order!");
    },
  });
}