"use client";

import { useProtectedRoute } from "@/lib/hooks";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  const { hydrated, checked, isAuthenticated } = useProtectedRoute(false);

  if (!hydrated || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <DashboardClient />
      </main>
      <Footer />
    </>
  );
}