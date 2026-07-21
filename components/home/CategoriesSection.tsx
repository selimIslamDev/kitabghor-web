"use client";

import Link from "next/link";
import { useCategories } from "@/lib/hooks";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Sparkles, BookOpen, Wrench } from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: "BOOK" | "GADGET";
  _count?: {
    products: number;
  };
}

// Color cycles by position — no name guessing, works for any category the admin creates
const COLOR_CYCLE = [
  "from-blue-500 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-violet-700",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
];

export default function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-36 mx-auto mb-3 animate-pulse" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-64 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-36 h-40 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 animate-pulse flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Top Subjects</span>
            </div>
            <h2
              className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Browse by Category
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Find exactly what you need for your academic journey
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 shadow-sm active:scale-95"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 shadow-sm active:scale-95"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-5 overflow-x-auto scrollbar-none py-3 px-1 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat: Category, index: number) => {
              const color = COLOR_CYCLE[index % COLOR_CYCLE.length];
              // Real category id drives the filter — every category links to its own products
              const href = `/products?categoryId=${cat.id}`;

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className="group/card flex-shrink-0 flex flex-col items-center p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1.5 w-36 sm:w-40 relative"
                >
                  {cat._count?.products !== undefined && cat._count.products > 0 && (
                    <span className="absolute top-3 right-3 bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-600">
                      {cat._count.products}
                    </span>
                  )}

                  <div className="relative mb-4">
                    <div
                      className={`w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-tr ${color} rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 dark:shadow-none group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-300`}
                    >
                      {cat.type === "BOOK" ? (
                        <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      ) : (
                        <Wrench className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 pointer-events-none" />
                  </div>

                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 text-center line-clamp-1 group-hover/card:text-emerald-600 dark:group-hover/card:text-emerald-400 transition-colors">
                    {cat.name}
                  </span>

                  <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium flex items-center gap-1">
                    Explore <ChevronRight className="w-3 h-3 group-hover/card:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>View All Categories</span>
          </Link>
        </div>
      </div>
    </section>
  );
}












// "use client";

// import Link from "next/link";
// import { useCategories } from "@/lib/hooks";
// import { useEffect, useRef } from "react";

// const categoryConfig: Record<string, { icon: string; color: string; href: string }> = {
//   "Class 8-9": { icon: "📗", color: "from-green-500 to-emerald-600", href: "/products?classLevel=Class 8-9" },
//   "SSC": { icon: "📘", color: "from-blue-500 to-blue-600", href: "/products?classLevel=SSC" },
//   "HSC": { icon: "📙", color: "from-orange-500 to-red-500", href: "/products?classLevel=HSC" },
//   "University": { icon: "🎓", color: "from-purple-500 to-indigo-600", href: "/products?classLevel=University" },
//   "Gadgets": { icon: "🔧", color: "from-amber-500 to-yellow-600", href: "/products?type=GADGET" },
//   "Calculator": { icon: "🔢", color: "from-cyan-500 to-blue-500", href: "/products?type=GADGET" },
//   "Geometry Box": { icon: "📐", color: "from-pink-500 to-rose-600", href: "/products?type=GADGET" },
//   "Pen & Pencil": { icon: "✏️", color: "from-red-400 to-pink-500", href: "/products?type=GADGET" },
//   "Art Supplies": { icon: "🎨", color: "from-violet-500 to-purple-600", href: "/products?type=GADGET" },
// };

// const defaultConfig = { icon: "📚", color: "from-blue-500 to-indigo-600", href: "/products" };

// export default function CategoriesSection() {
//   const { data: categories, isLoading } = useCategories();
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const isPaused = useRef(false);

//   // Auto scroll
//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     let animationId: number;
//     let scrollAmount = 0;

//     const scroll = () => {
//       if (!isPaused.current && el) {
//         scrollAmount += 0.5;
//         // Reset when reached end — infinite loop
//         if (scrollAmount >= el.scrollWidth / 2) {
//           scrollAmount = 0;
//         }
//         el.scrollLeft = scrollAmount;
//       }
//       animationId = requestAnimationFrame(scroll);
//     };

//     animationId = requestAnimationFrame(scroll);

//     // Pause on hover/touch
//     el.addEventListener("mouseenter", () => { isPaused.current = true; });
//     el.addEventListener("mouseleave", () => { isPaused.current = false; });
//     el.addEventListener("touchstart", () => { isPaused.current = true; });
//     el.addEventListener("touchend", () => {
//       setTimeout(() => { isPaused.current = false; }, 2000);
//     });

//     return () => cancelAnimationFrame(animationId);
//   }, [categories]);

//   if (isLoading) {
//     return (
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-10">
//             <div className="h-8 bg-[var(--muted)] rounded w-48 mx-auto mb-3 animate-pulse" />
//             <div className="h-4 bg-[var(--muted)] rounded w-72 mx-auto animate-pulse" />
//           </div>
//           <div className="flex gap-4 overflow-hidden">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="flex-shrink-0 w-28 h-32 bg-[var(--muted)] rounded-2xl animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!categories || categories.length === 0) return null;

//   // Duplicate categories for infinite scroll effect
//   const doubled = [...categories, ...categories];

//   return (
//     <section className="py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
//             Browse by Category
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400">
//             Find exactly what you need for your academic journey
//           </p>
//         </div>

//         {/* Auto Scroll Row */}
//         <div
//           ref={scrollRef}
//           className="flex gap-4 overflow-x-auto pb-2"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           {doubled.map((cat: any, index: number) => {
//             const config = categoryConfig[cat.name] || defaultConfig;
//             return (
//               <Link
//                 key={`${cat.id}-${index}`}
//                 href={config.href}
//                 className="flex-shrink-0 flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group w-28 sm:w-32"
//               >
//                 <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
//                   {config.icon}
//                 </div>
//                 <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
//                   {cat.name}
//                 </span>
//                 {cat._count?.products > 0 && (
//                   <span className="text-xs text-gray-400">{cat._count.products} items</span>
//                 )}
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }