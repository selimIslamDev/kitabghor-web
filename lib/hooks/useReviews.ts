import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

type ApiError = AxiosError<ApiErrorResponse>;

export interface FeaturedReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string };
  product: { id: string; name: string };
}

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

export function useFeaturedReviews(limit = 12) {
  return useQuery({
    queryKey: ["reviews", "featured", limit],
    queryFn: async () => {
      const res = await api.get(`/reviews/featured?limit=${limit}`);
      return res.data as {
        data: FeaturedReview[];
        meta: { total: number; averageRating: number };
      };
    },
    staleTime: 5 * 60 * 1000,
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
    onError: (error: ApiError) => {
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
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete review!");
    },
  });
}