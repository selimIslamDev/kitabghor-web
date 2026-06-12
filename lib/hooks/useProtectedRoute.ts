import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function useProtectedRoute(requireAdmin = false) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (requireAdmin && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [hydrated, isAuthenticated, user, router, requireAdmin]);

  return { hydrated, isAuthenticated, user };
}