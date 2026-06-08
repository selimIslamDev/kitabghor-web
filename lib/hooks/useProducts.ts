import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  productType: "BOOK" | "GADGET";
  categoryId: string;
  category?: { id: string; name: string };
  images: string[];
  author?: string;
  publisher?: string;
  edition?: string;
  classLevel?: string;
  subject?: string;
  isbn?: string;
  brand?: string;
  model?: string;
  _count?: { reviews: number };
}

export interface ProductFilter {
  type?: string;
  categoryId?: string;
  classLevel?: string;
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useProducts(filters: ProductFilter = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== "ALL") {
          params.append(key, String(value));
        }
      });
      const res = await api.get(`/products?${params.toString()}`);
      return res.data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data.data as Product;
    },
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await api.get("/products/featured");
      return res.data.data as Product[];
    },
  });
}