import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

type ApiError = AxiosError<ApiErrorResponse>;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/login", data);
      return res.data.data as AuthResponse;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Welcome back! 👋");
      router.push("/");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Login failed!");
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; phone?: string }) => {
      const res = await api.post("/auth/register", data);
      return res.data.data as AuthResponse;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Account created successfully! 🎉");
      router.push("/");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Registration failed!");
    },
  });
}