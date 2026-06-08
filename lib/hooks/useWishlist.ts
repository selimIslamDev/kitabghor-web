import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get("/users/me/wishlist");
      return res.data.data;
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.post(`/users/me/wishlist/${productId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist! ❤️");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add to wishlist!");
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete(`/users/me/wishlist/${productId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove!");
    },
  });
}