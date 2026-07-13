import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ProductPayload {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  productType: "BOOK" | "GADGET";
  categoryId: string;
  images: string[];
  author?: string;
  publisher?: string;
  edition?: string;
  classLevel?: string;
  subject?: string;
  isbn?: string;
  brand?: string;
  model?: string;
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data.data;
    },
  });
}

export function useAdminOrders(status?: string) {
  return useQuery({
    queryKey: ["admin", "orders", status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : "";
      const res = await api.get(`/admin/orders${params}`);
      return res.data;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status: string; trackingId?: string }) => {
      const res = await api.patch(`/admin/orders/${data.id}/status`, {
        status: data.status,
        trackingId: data.trackingId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update status!");
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductPayload) => {
      const res = await api.post("/products", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product created! ✅");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to create product!");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ProductPayload> & { id: string }) => {
      const { id, ...rest } = data;
      const res = await api.put(`/products/${id}`, rest);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated! ✅");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update product!");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete!");
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data;
    },
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const res = await api.get("/admin/analytics");
      return res.data.data;
    },
  });
}

export function useInventory() {
  return useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: async () => {
      const res = await api.get("/admin/inventory");
      return res.data.data;
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; stock: number }) => {
      const res = await api.patch(`/admin/inventory/${data.id}/stock`, { stock: data.stock });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock updated!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update stock!");
    },
  });
}

export function useAdminBundles() {
  return useQuery({
    queryKey: ["admin", "bundles"],
    queryFn: async () => {
      const res = await api.get("/bundles");
      return res.data.data;
    },
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; discountPercent: number; productIds: string[] }) => {
      const res = await api.post("/bundles", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      toast.success("Bundle created! ✅");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to create bundle!");
    },
  });
}

export function useUpdateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name?: string; description?: string; discountPercent?: number; productIds?: string[] }) => {
      const { id, ...rest } = data;
      const res = await api.put(`/bundles/${id}`, rest);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      toast.success("Bundle updated! ✅");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update bundle!");
    },
  });
}

export function useDeleteBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/bundles/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      toast.success("Bundle deleted!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete bundle!");
    },
  });
}