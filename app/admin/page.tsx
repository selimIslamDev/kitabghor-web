"use client";

import { useProtectedRoute } from "@/lib/hooks";
import AdminClient from "@/components/admin/AdminClient";

export default function AdminPage() {
  const { hydrated, isAuthenticated, user } = useProtectedRoute(true);

  if (!hydrated || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <AdminClient />;
}