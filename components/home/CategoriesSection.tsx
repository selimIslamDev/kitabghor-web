"use client";

import Link from "next/link";
import { useCategories, Category } from "@/lib/hooks";

const categoryConfig: Record<string, { icon: string; color: string; href: string }> = {
  "Class 8-9": { icon: "📗", color: "from-green-500 to-emerald-600", href: "/products?classLevel=Class 8-9" },
  "SSC": { icon: "📘", color: "from-blue-500 to-blue-600", href: "/products?classLevel=SSC" },
  "HSC": { icon: "📙", color: "from-orange-500 to-red-500", href: "/products?classLevel=HSC" },
  "University": { icon: "🎓", color: "from-purple-500 to-indigo-600", href: "/products?classLevel=University" },
  "Gadgets": { icon: "🔧", color: "from-amber-500 to-yellow-600", href: "/products?type=GADGET" },
  "Calculator": { icon: "🔢", color: "from-cyan-500 to-blue-500", href: "/products?type=GADGET" },
  "Geometry Box": { icon: "📐", color: "from-pink-500 to-rose-600", href: "/products?type=GADGET" },
  "Pen & Pencil": { icon: "✏️", color: "from-red-400 to-pink-500", href: "/products?type=GADGET" },
  "Art Supplies": { icon: "🎨", color: "from-violet-500 to-purple-600", href: "/products?type=GADGET" },
};

const defaultConfig = { icon: "📚", color: "from-blue-500 to-indigo-600", href: "/products" };

export default function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Browse by Category
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Find exactly what you need for your academic journey
          </p>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-28 h-32 bg-[var(--muted)] rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Categories */}
        {!isLoading && categories && categories.length > 0 && (
          <>
            {/* Mobile — Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 sm:hidden">
              {categories.map((cat: Category) => {
                const config = categoryConfig[cat.name] ?? defaultConfig;
                return (
                  <Link
                    key={cat.id}
                    href={config.href}
                    className="flex-shrink-0 flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1 w-28"
                  >
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {config.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
                      {cat.name}
                    </span>
                    {(cat._count?.products ?? 0) > 0 && (
                      <span className="text-xs text-gray-400">{cat._count?.products} items</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop — Grid */}
            <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((cat: Category) => {
                const config = categoryConfig[cat.name] ?? defaultConfig;
                return (
                  <Link
                    key={cat.id}
                    href={config.href}
                    className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      {config.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                      {cat.name}
                    </span>
                    {(cat._count?.products ?? 0) > 0 && (
                      <span className="text-xs text-gray-400">{cat._count?.products} items</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Empty */}
        {!isLoading && (!categories || categories.length === 0) && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No categories yet. Add categories from the Admin Dashboard.
          </div>
        )}
      </div>
    </section>
  );
}