import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export function useUpdateProfile() {
  const { setAuth, token, user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; phone?: string }) => {
      const res = await api.put("/users/me", data);
      return res.data.data;
    },
    onSuccess: (updatedUser) => {
      setAuth(updatedUser, token!);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated! ✅");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile!");
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      phone: string;
      address: string;
      city: string;
      district: string;
      postalCode?: string;
      isDefault?: boolean;
    }) => {
      const res = await api.post("/users/me/addresses", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added! ✅");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add address!");
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/users/me/addresses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete address!");
    },
  });
}