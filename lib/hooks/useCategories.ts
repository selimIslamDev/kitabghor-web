import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Category {
  id: string;
  name: string;
  type: "BOOK" | "GADGET";
  parentId?: string;
  children?: Category[];
  _count?: { products: number };
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });
}