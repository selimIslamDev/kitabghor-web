"use client";

import Link from "next/link";
import { ShoppingCart, Star, ArrowRight, Zap } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useFeaturedProducts } from "@/lib/hooks";
import toast from "react-hot-toast";

const badgeColors: Record<number, string> = {
  0: "bg-amber-500",
  1: "bg-blue-500",
  2: "bg-green-500",
  3: "bg-purple-500",
};

const badgeLabels: Record<number, string> = {
  0: "Best Seller",
  1: "Popular",
  2: "New",
  3: "Top Rated",
};

export default function GadgetsSection() {
  const { addItem } = useCartStore();
  const { data: products, isLoading } = useFeaturedProducts();

  const gadgets = products?.filter((p: any) => p.productType === "GADGET").slice(0, 4) || [];

  const handleAddToCart = (e: React.MouseEvent, gadget: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: gadget.id,
      name: gadget.name,
      price: gadget.price,
      discountPrice: gadget.discountPrice,
      image: gadget.images?.[0] || "🔧",
      stock: gadget.stock,
    });
    toast.success(`${gadget.name} added to cart!`);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Zap className="w-3 h-3" />
              Educational Gadgets
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Top Gadgets for Students
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Essential tools to boost your learning</p>
          </div>
          <Link href="/products?type=GADGET" className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
                <div className="h-48 bg-[var(--muted)]" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[var(--muted)] rounded w-1/3" />
                  <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
                  <div className="h-8 bg-[var(--muted)] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gadgets.length > 0 ? gadgets.map((gadget: any, index: number) => (
              <Link
                key={gadget.id}
                href={`/products/${gadget.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
              >
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-700 dark:to-slate-600 h-48 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-200">
                    {gadget.images?.[0] || "🔧"}
                  </span>
                  <div className={`absolute top-3 left-3 ${badgeColors[index % 4]} text-white text-xs font-bold px-2 py-1 rounded-lg`}>
                    {badgeLabels[index % 4]}
                  </div>
                  {gadget.discountPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {Math.round(((gadget.price - gadget.discountPrice) / gadget.price) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {gadget.brand && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{gadget.brand}</p>}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 text-sm">{gadget.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {gadget._count?.reviews > 0 ? "4.8" : "New"}
                    </span>
                    <span className="text-xs text-gray-400">({gadget._count?.reviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ৳{gadget.discountPrice || gadget.price}
                    </span>
                    {gadget.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">৳{gadget.price}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, gadget)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </Link>
            )) : (
              <div className="col-span-4 text-center py-10 text-gray-500 dark:text-gray-400">
                No gadgets available yet.
              </div>
            )}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/products?type=GADGET" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
            View All Gadgets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}