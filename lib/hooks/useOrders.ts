import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorResponse)?.message || fallback;
  }
  return fallback;
}

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

      // Cash on Delivery — no gateway involved, order is already confirmed
      // on the backend. Just send the user straight to the order page.
      if (variables.paymentMethod === "cod") {
        toast.success("Order placed successfully! Pay on delivery. 🎉");
        router.push(`/orders/${order.id}`);
        return;
      }

      // Online Payment — Card, bKash, Nagad, Rocket, etc.
      // SSLCommerz's own hosted gateway already shows all these tabs,
      // so no separate manual bKash/Nagad logic is needed.
      if (variables.paymentMethod === "sslcommerz") {
        try {
          const res = await api.post(`/payments/sslcommerz/initiate/${order.id}`);
          const gatewayUrl = res.data?.data?.gatewayUrl;

          if (gatewayUrl) {
            // Full page redirect — SSLCommerz's own hosted payment page
            window.location.href = gatewayUrl;
            return;
          }

          toast.error("Payment gateway URL পাওয়া যায়নি, আবার চেষ্টা করুন");
          router.push(`/orders/${order.id}`);
        } catch (error: unknown) {
          toast.error(getErrorMessage(error, "Payment শুরু করা যায়নি"));
          router.push(`/orders/${order.id}`);
        }
        return;
      }

      // Fallback — future-proofing for any other payment method
      toast.success("Order placed successfully! 🎉");
      router.push(`/orders/${order.id}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to place order!"));
    },
  });
}