"use client";

import Link from "next/link";
import { Tag, ArrowRight, Package } from "lucide-react";
import { useBundles } from "@/lib/hooks";

interface BundleProduct {
  id: string;
  name: string;
  images: string[];
}

interface BundleItem {
  id: string;
  product: BundleProduct;
}

interface Bundle {
  id: string;
  name: string;
  description?: string;
  discountPercent: number;
  totalPrice: number;
  bundlePrice: number;
  items: BundleItem[];
}

const styleVariants = [
  { icon: "📦", color: "from-blue-500 to-indigo-600", badge: "Most Popular" },
  { icon: "🎒", color: "from-purple-500 to-pink-600", badge: "Best Value" },
  { icon: "🎨", color: "from-amber-500 to-orange-600", badge: "New Arrival" },
];

export default function ComboSection() {
  const { data: bundles, isLoading } = useBundles() as { data: Bundle[] | undefined; isLoading: boolean };

  if (isLoading) {
    return (
      <section className="py-16 bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-6 bg-[var(--muted)] rounded w-32 mx-auto mb-3 animate-pulse" />
            <div className="h-8 bg-[var(--muted)] rounded w-64 mx-auto mb-3 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-[var(--muted)] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bundles || bundles.length === 0) return null;

  return (
    <section className="py-16 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <Package className="w-3 h-3" />
            Combo Offers
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            Save More with Bundles
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Get everything you need in one pack and save up to 25% compared to buying individually
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundles.slice(0, 3).map((bundle, index) => {
            const style = styleVariants[index % styleVariants.length];
            const savings = bundle.totalPrice - bundle.bundlePrice;

            return (
              <div
                key={bundle.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group"
              >
                {/* Top Banner */}
                <div className={`bg-gradient-to-r ${style.color} p-6 text-white relative`}>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {style.badge}
                  </div>
                  <span className="text-5xl mb-3 block">{style.icon}</span>
                  <h3 className="text-xl font-bold mb-1">{bundle.name}</h3>
                  {bundle.description && (
                    <p className="text-sm text-white/80 line-clamp-2">{bundle.description}</p>
                  )}
                </div>

                {/* Items */}
                <div className="p-4 border-b border-[var(--border)]">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Includes</p>
                  <ul className="space-y-1">
                    {bundle.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        {item.product.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price + CTA */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ৳{bundle.bundlePrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through">৳{bundle.totalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Tag className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Save ৳{savings}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-2 py-1 rounded-lg">
                        {bundle.discountPercent}% OFF
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/bundles/${bundle.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
                  >
                    Get This Bundle
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}