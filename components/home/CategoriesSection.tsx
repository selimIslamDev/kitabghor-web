"use client";

import Link from "next/link";
import { useCategories } from "@/lib/hooks";
import { useEffect, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  // Auto scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollAmount = 0;

    const scroll = () => {
      if (!isPaused.current && el) {
        scrollAmount += 0.5;
        // Reset when reached end — infinite loop
        if (scrollAmount >= el.scrollWidth / 2) {
          scrollAmount = 0;
        }
        el.scrollLeft = scrollAmount;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on hover/touch
    el.addEventListener("mouseenter", () => { isPaused.current = true; });
    el.addEventListener("mouseleave", () => { isPaused.current = false; });
    el.addEventListener("touchstart", () => { isPaused.current = true; });
    el.addEventListener("touchend", () => {
      setTimeout(() => { isPaused.current = false; }, 2000);
    });

    return () => cancelAnimationFrame(animationId);
  }, [categories]);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-8 bg-[var(--muted)] rounded w-48 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-[var(--muted)] rounded w-72 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-28 h-32 bg-[var(--muted)] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  // Duplicate categories for infinite scroll effect
  const doubled = [...categories, ...categories];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            Browse by Category
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Find exactly what you need for your academic journey
          </p>
        </div>

        {/* Auto Scroll Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {doubled.map((cat: any, index: number) => {
            const config = categoryConfig[cat.name] || defaultConfig;
            return (
              <Link
                key={`${cat.id}-${index}`}
                href={config.href}
                className="flex-shrink-0 flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group w-28 sm:w-32"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  {config.icon}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
                  {cat.name}
                </span>
                {cat._count?.products > 0 && (
                  <span className="text-xs text-gray-400">{cat._count.products} items</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}