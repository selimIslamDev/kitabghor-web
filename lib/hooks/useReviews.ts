import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}/reviews`);
      return res.data;
    },
    enabled: !!productId,
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { rating: number; comment?: string }) => {
      const res = await api.post(`/products/${productId}/reviews`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Review submitted! ⭐");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review!");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await api.delete(`/reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete review!");
    },
  });
}