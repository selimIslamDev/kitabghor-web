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
    onSuccess: async (order, variables) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Card, bKash, Nagad — sob SSLCommerz gateway diye jabe.
      // SSLCommerz-er nijer gateway e Mobile Banking tab already ache,
      // tai alada manual bKash/Nagad logic banānor দরকার নেই।
      if (["sslcommerz", "bkash", "nagad"].includes(variables.paymentMethod)) {
        try {
          const res = await api.post(`/payments/sslcommerz/initiate/${order.id}`);
          const gatewayUrl = res.data?.data?.gatewayUrl;

          if (gatewayUrl) {
            // Full page redirect — SSLCommerz-er own hosted payment page
            window.location.href = gatewayUrl;
            return;
          }

          toast.error("Payment gateway URL পাওয়া যায়নি, আবার চেষ্টা করুন");
          router.push(`/orders/${order.id}`);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Payment শুরু করা যায়নি");
          router.push(`/orders/${order.id}`);
        }
        return;
      }

      // Fallback — onno kono payment method thakle (future-proofing)
      toast.success("Order placed successfully! 🎉");
      router.push("/orders/success");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order!");
    },
  });
}