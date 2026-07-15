"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
        Payment ব্যর্থ হয়েছে
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        আপনার payment সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন, অথবা অন্য payment method ব্যবহার করুন।
        {reason && <span className="block text-xs text-gray-400 mt-2">Reason: {reason}</span>}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/checkout"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          আবার চেষ্টা করুন
        </Link>
        <Link
          href="/cart"
          className="px-6 py-3 border border-[var(--border)] text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-[var(--muted)] transition"
        >
          Cart-এ ফিরে যান
        </Link>
      </div>
    </div>
  );
}