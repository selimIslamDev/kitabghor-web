"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
        Payment বাতিল করা হয়েছে
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        আপনি payment প্রক্রিয়াটি বাতিল করেছেন। আপনার অর্ডার এখনো unpaid অবস্থায় আছে।
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