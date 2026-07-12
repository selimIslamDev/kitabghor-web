import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useBundles = () => {
  return useQuery({
    queryKey: ["bundles"],
    queryFn: async () => {
      const res = await api.get("/bundles");
      return res.data.data;
    },
  });
};

export const useBundle = (id: string) => {
  return useQuery({
    queryKey: ["bundle", id],
    queryFn: async () => {
      const res = await api.get(`/bundles/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};