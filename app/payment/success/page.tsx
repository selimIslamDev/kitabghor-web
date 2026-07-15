"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
        Payment সফল হয়েছে! 🎉
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        আপনার অর্ডার কনফার্ম করা হয়েছে। খুব শীঘ্রই আমরা এটি প্রসেস করা শুরু করব।
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          >
            অর্ডার দেখুন
          </Link>
        )}
        <Link
          href="/products"
          className="px-6 py-3 border border-[var(--border)] text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-[var(--muted)] transition"
        >
          Shopping চালিয়ে যান
        </Link>
      </div>
    </div>
  );
}