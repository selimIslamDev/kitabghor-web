"use client";

import Link from "next/link";
import { Search, ArrowRight, Sparkles, Truck, ShieldCheck, Headset } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCategories } from "@/lib/hooks";

interface Category {
  id: string;
  name: string;
  type: "BOOK" | "GADGET";
  parentId?: string | null;
  _count?: { products: number };
  productCount?: number;
}

const SPINES = [
  "bg-[#c9a227]/15 border-[#c9a227]/25",
  "bg-[#1c1915] border-white/[0.08]",
  "bg-[#c9a227]/10 border-[#c9a227]/20",
  "bg-[#161411] border-white/[0.06]",
];

const TRUST_ITEMS = [
  { icon: Truck, label: "Free Shipping", sub: "On orders above ৳500" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "SSLCommerz protected" },
  { icon: Headset, label: "Fast Support", sub: "We're here to help" },
];

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
      setSearch("");
    }
  };

  const { data: categories, isLoading: categoriesLoading } = useCategories() as {
    data?: Category[];
    isLoading: boolean;
  };
  const topCategories = (categories || [])
    .filter((c) => c.type === "BOOK" && !c.parentId)
    .slice(0, 4);

  const { data: bookCount } = useQuery({
    queryKey: ["hero-stats", "book-count"],
    queryFn: async (): Promise<number | null> => {
      const res = await api.get("/products", { params: { type: "BOOK", limit: 1 } });
      return res.data?.total ?? res.data?.pagination?.total ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="relative overflow-hidden bg-[#0c0b09]">
      {/* Subtle gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(201,162,39,0.07)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(201,162,39,0.04)_0%,transparent_45%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 text-[#c9a227] text-xs font-semibold tracking-wide uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Discover Your Next Favorite Book
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-[3.25rem] font-semibold text-[#f5f0e8] leading-[1.15] mb-5 tracking-tight">
              Books that
              <br />
              <span className="italic text-[#c9a227] font-serif">inspire</span> every
              <br />
              chapter of learning
            </h1>

            <p className="text-[15px] text-[#a89f8f] mb-8 leading-relaxed max-w-md">
              Explore academic books, bestsellers, and study gadgets from Class 8
              to University — all in one place.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6358] pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search books, subjects, authors..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/[0.08] bg-[#141210] text-[#f5f0e8] placeholder:text-[#6b6358] focus:outline-none focus:border-[#c9a227]/40 text-sm transition"
                />
              </div>
              <button
                type="submit"
                disabled={!search.trim()}
                aria-label="Search"
                className="shrink-0 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#b8921f] hover:from-[#d4b84a] hover:to-[#c9a227] text-[#0c0b09] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link
                href="/products?type=BOOK"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c9a227] to-[#b8921f] hover:from-[#d4b84a] hover:to-[#c9a227] text-[#0c0b09] rounded-xl font-semibold text-sm transition shadow-lg shadow-[#c9a227]/20"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?type=GADGET"
                className="px-6 py-3 border border-white/[0.1] text-[#a89f8f] hover:text-[#f5f0e8] hover:border-[#c9a227]/30 rounded-xl font-semibold text-sm transition"
              >
                Explore Categories
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-6">
              {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#c9a227]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#c9a227]" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-semibold text-[#f5f0e8]">{label}</div>
                    <div className="text-[11px] text-[#6b6358]">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Stacked books visual */}
          <div className="relative hidden lg:block">
            <div className="relative max-w-xs mx-auto">
              <div className="space-y-2.5">
                {categoriesLoading ? (
                  // Genuine loading skeleton
                  [0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.06] bg-[#161411] px-5 py-4 h-[52px] animate-pulse"
                      style={{ marginLeft: `${i * 12}px`, marginRight: `${(3 - i) * 8}px` }}
                    />
                  ))
                ) : topCategories.length > 0 ? (
                  topCategories.map((cat, i) => {
                    const count = cat._count?.products ?? cat.productCount;
                    return (
                      <div
                        key={cat.id}
                        className={`${SPINES[i % SPINES.length]} rounded-xl border px-5 py-4 flex items-center justify-between backdrop-blur-sm transition hover:border-[#c9a227]/35`}
                        style={{ marginLeft: `${i * 12}px`, marginRight: `${(3 - i) * 8}px` }}
                      >
                        <span className="font-medium text-[#f5f0e8] text-sm">{cat.name}</span>
                        {count != null && (
                          <span className="text-xs font-mono text-[#6b6358]">{count} books</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Genuinely empty — no book categories yet
                  <div className="rounded-xl border border-dashed border-white/[0.08] px-5 py-6 text-center">
                    <span className="text-xs text-[#6b6358]">No categories yet</span>
                  </div>
                )}
              </div>

              {/* Floating testimonial card */}
              <div className="absolute -bottom-8 -left-6 bg-[#141210] rounded-2xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.4)] p-4 w-56">
                <div className="flex -space-x-2 mb-2.5">
                  {["bg-[#c9a227]", "bg-[#b8921f]", "bg-[#a67c1a]", "bg-[#8a7120]"].map((c, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full ${c} border-2 border-[#141210] flex items-center justify-center text-[#0c0b09] text-[10px] font-bold`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#a89f8f] leading-snug">
                  Loved by students preparing for SSC, HSC & admission tests
                </p>
              </div>

              {/* Book count badge */}
              <div className="absolute -top-5 -right-2 bg-[#141210] rounded-2xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.35)] px-4 py-3">
                {bookCount != null ? (
                  <>
                    <div className="text-lg font-semibold text-[#c9a227] leading-none">{bookCount}+</div>
                    <div className="text-[10px] text-[#6b6358] mt-1">Books in stock</div>
                  </>
                ) : (
                  <div className="h-8 w-16 bg-[#1c1915] rounded animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}













// "use client";

// import Link from "next/link";
// import { Search, ArrowRight, Sparkles, Truck, ShieldCheck, Headset } from "lucide-react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api";
// import { useCategories } from "@/lib/hooks";

// interface Category {
//   id: string;
//   name: string;
//   type: "BOOK" | "GADGET";
//   parentId?: string | null;
//   _count?: { products: number };
//   productCount?: number;
// }

// // Pastel spine colors for the stacked-book visual
// const SPINES = [
//   "bg-violet-200 dark:bg-violet-900/50",
//   "bg-sky-200 dark:bg-sky-900/50",
//   "bg-rose-200 dark:bg-rose-900/50",
//   "bg-amber-200 dark:bg-amber-900/50",
// ];

// const TRUST_ITEMS = [
//   { icon: Truck, label: "Free Shipping", sub: "On orders above ৳500" },
//   { icon: ShieldCheck, label: "Secure Payment", sub: "SSLCommerz protected" },
//   { icon: Headset, label: "Fast Support", sub: "We're here to help" },
// ];

// export default function HeroSection() {
//   const [search, setSearch] = useState("");
//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (search.trim()) router.push(`/products?search=${search}`);
//   };

//   // Real categories — power the stacked-book visual on the right
//   const { data: categories } = useCategories() as { data?: Category[] };
//   const topCategories = (categories || []).filter((c) => !c.parentId).slice(0, 4);

//   // Real total book count
//   const { data: bookCount } = useQuery({
//     queryKey: ["hero-stats", "book-count"],
//     queryFn: async (): Promise<number | null> => {
//       const res = await api.get("/products", { params: { type: "BOOK", limit: 1 } });
//       return res.data?.total ?? res.data?.pagination?.total ?? null;
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-rose-50/60 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <div>
//             <div className="inline-flex items-center gap-2 text-violet-700 dark:text-violet-300 text-xs font-semibold tracking-wide uppercase mb-5">
//               <Sparkles className="w-3.5 h-3.5" />
//               Discover Your Next Favorite Book
//             </div>

//             <h1
//               className="text-4xl lg:text-5xl xl:text-[3.4rem] font-bold text-gray-900 dark:text-white leading-[1.12] mb-5"
//               style={{ fontFamily: "Poppins, sans-serif" }}
//             >
//               Books that
//               <br />
//               <span className="italic text-violet-600 dark:text-violet-400 font-serif">inspire</span> every
//               <br />
//               chapter of learning
//             </h1>

//             <p className="text-base text-gray-600 dark:text-gray-300 mb-7 leading-relaxed max-w-md">
//               Explore academic books, bestsellers, and study gadgets from Class 8
//               to University — all in one place.
//             </p>

//             <form onSubmit={handleSearch} className="flex gap-2 mb-7 max-w-md">
//               <div className="relative flex-1">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search books, subjects, authors..."
//                   className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[var(--border)] bg-white/80 dark:bg-slate-800/80 backdrop-blur text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm text-sm"
//                 />
//               </div>
//             </form>

//             <div className="flex flex-wrap items-center gap-3 mb-10">
//               <Link
//                 href="/products?type=BOOK"
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold text-sm transition shadow-sm"
//               >
//                 Shop Now
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//               <Link
//                 href="/products?type=GADGET"
//                 className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-800 rounded-full font-semibold text-sm transition"
//               >
//                 Explore Categories
//               </Link>
//             </div>

//             {/* Trust row */}
//             <div className="flex flex-wrap gap-6">
//               {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
//                 <div key={label} className="flex items-center gap-2.5">
//                   <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
//                   <div className="leading-tight">
//                     <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{label}</div>
//                     <div className="text-[11px] text-gray-500 dark:text-gray-400">{sub}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Content — Stacked-book visual */}
//           <div className="relative hidden lg:block">
//             <div className="relative max-w-xs mx-auto">
//               {/* Stacked book spines, built from real categories when available */}
//               <div className="space-y-2">
//                 {(topCategories.length > 0
//                   ? topCategories
//                   : [
//                       { id: "a", name: "Loading category…" } as Category,
//                       { id: "b", name: "Loading category…" } as Category,
//                       { id: "c", name: "Loading category…" } as Category,
//                     ]
//                 ).map((cat, i) => {
//                   const count = cat._count?.products ?? cat.productCount;
//                   return (
//                     <div
//                       key={cat.id}
//                       className={`${SPINES[i % SPINES.length]} rounded-xl shadow-lg px-5 py-4 flex items-center justify-between backdrop-blur-sm`}
//                       style={{ marginLeft: `${i * 10}px`, marginRight: `${i * 10}px` }}
//                     >
//                       <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{cat.name}</span>
//                       {count != null && (
//                         <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{count} books</span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Floating testimonial / stat card */}
//               <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 w-56 border border-[var(--border)]">
//                 <div className="flex -space-x-2 mb-2">
//                   {["bg-violet-400", "bg-sky-400", "bg-rose-400", "bg-amber-400"].map((c, i) => (
//                     <div
//                       key={i}
//                       className={`w-7 h-7 rounded-full ${c} border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-bold`}
//                     >
//                       {String.fromCharCode(65 + i)}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
//                   Loved by students preparing for SSC, HSC & admission tests
//                 </p>
//               </div>

//               {/* Live book count badge */}
//               <div className="absolute -top-6 -right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-3 border border-[var(--border)]">
//                 {bookCount != null ? (
//                   <>
//                     <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">{bookCount}+</div>
//                     <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Books in stock</div>
//                   </>
//                 ) : (
//                   <div className="h-8 w-16 bg-[var(--muted)] rounded animate-pulse" />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }