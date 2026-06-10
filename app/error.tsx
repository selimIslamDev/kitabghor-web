"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">An unexpected error occurred. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          >
            Try Again
          </button>
          <Link href="/" className="px-6 py-3 border border-[var(--border)] text-gray-600 dark:text-gray-300 hover:bg-[var(--muted)] rounded-xl font-semibold transition">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}