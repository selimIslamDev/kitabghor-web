"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, Home, Package } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderSuccessClient() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {/* Animated Check */}
      <div className={`transition-all duration-700 ${show ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div className={`transition-all duration-700 delay-300 ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Thank you for your order. We'll send you a confirmation shortly.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          Order ID: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">ORD-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
        </p>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[
            { label: "Order Placed", icon: <CheckCircle className="w-5 h-5" />, done: true },
            { label: "Processing", icon: <Package className="w-5 h-5" />, done: false },
            { label: "Shipped", icon: <Package className="w-5 h-5" />, done: false },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${step.done ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-[var(--muted)] text-gray-400"}`}>
                {step.icon}
                <span className="hidden sm:block">{step.label}</span>
              </div>
              {i < 2 && <div className="w-6 h-0.5 bg-[var(--border)]" />}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">
            <ShoppingBag className="w-5 h-5" />
            Track Order
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 px-8 py-4 border border-[var(--border)] text-gray-600 dark:text-gray-300 hover:bg-[var(--muted)] rounded-xl font-semibold transition">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}