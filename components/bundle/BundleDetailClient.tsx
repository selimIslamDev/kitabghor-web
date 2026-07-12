"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart, CheckCircle, Tag } from "lucide-react";
import { useBundle } from "@/lib/hooks";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";

interface BundleProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  author?: string | null;
}

interface BundleItem {
  id: string;
  quantity: number;
  product: BundleProduct;
}

interface Bundle {
  id: string;
  name: string;
  description?: string | null;
  discountPercent: number;
  totalPrice: number;
  bundlePrice: number;
  items: BundleItem[];
}

export default function BundleDetailClient({ id }: { id: string }) {
  const { data: bundle, isLoading } = useBundle(id) as { data: Bundle | undefined; isLoading: boolean };
  const { addItem } = useCartStore();

  const handleAddBundle = () => {
    if (!bundle) return;
    const discountMultiplier = 1 - bundle.discountPercent / 100;

    bundle.items.forEach((item: BundleItem) => {
      const bundlePrice = Math.round(item.product.price * discountMultiplier);
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          discountPrice: bundlePrice,
          image: item.product.images?.[0] || "📚",
          stock: item.product.stock,
        });
      }
    });

    toast.success(`${bundle.name} cart-এ add হয়েছে!`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-[var(--muted)] rounded w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-[var(--muted)] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">📦</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bundle পাওয়া যায়নি</h2>
        <Link href="/products" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Shop-এ ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Shop-এ ফিরে যান
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-10">
        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Tag className="w-3 h-3" />
          {bundle.discountPercent}% OFF Bundle
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          {bundle.name}
        </h1>
        {bundle.description && <p className="text-blue-100 mb-6">{bundle.description}</p>}

        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">৳{bundle.bundlePrice}</span>
          <div>
            <span className="text-lg text-blue-200 line-through block">৳{bundle.totalPrice}</span>
            <span className="text-sm text-green-300 font-medium">
              ৳{bundle.totalPrice - bundle.bundlePrice} সাশ্রয়
            </span>
          </div>
        </div>

        <button
          onClick={handleAddBundle}
          className="mt-6 flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition"
        >
          <ShoppingCart className="w-5 h-5" />
          Get This Bundle
        </button>
      </div>

      {/* Items */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        এই Bundle-এ যা যা আছে ({bundle.items.length} items)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundle.items.map((item: BundleItem) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 h-40 flex items-center justify-center">
              <span className="text-6xl">{item.product.images?.[0] || "📚"}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                {item.product.name}
              </h3>
              {item.product.author && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">by {item.product.author}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">৳{item.product.price}</span>
                {item.quantity > 1 && <span className="text-xs text-gray-400">x{item.quantity}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <CheckCircle className="w-4 h-4 text-green-500" />
        সব items bundle price সহ cart-এ যোগ হবে
      </div>
    </div>
  );
}