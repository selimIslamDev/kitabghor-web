import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async (data: { code: string; orderAmount: number }) => {
      const res = await api.post("/coupons/validate", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success(`Coupon applied! Save ৳${data.discountAmount} 🎉`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid coupon!");
    },
  });
}