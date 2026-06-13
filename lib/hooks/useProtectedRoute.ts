import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function useProtectedRoute(requireAdmin = false) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requireAdmin && user?.role !== "ADMIN") {
        router.push("/");
      }
      setChecked(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [hydrated, isAuthenticated, user, router, requireAdmin]);

  return { hydrated, checked, isAuthenticated, user };
}