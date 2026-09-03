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
  "bg-[#c9a227]/15",
  "bg-[#1c1915]",
  "bg-[#c9a227]/10",
  "bg-[#161411]",
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
    const trimmed = search.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#141210] text-[#f5f0e8] placeholder:text-[#6b6358] focus:outline-none focus:ring-1 focus:ring-[#c9a227]/40 text-sm transition"
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
                className="px-6 py-3 text-[#a89f8f] hover:text-[#f5f0e8] rounded-xl font-semibold text-sm transition"
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
                      className="rounded-xl bg-[#161411] px-5 py-4 h-[52px] animate-pulse"
                      style={{ marginLeft: `${i * 12}px`, marginRight: `${(3 - i) * 8}px` }}
                    />
                  ))
                ) : topCategories.length > 0 ? (
                  topCategories.map((cat, i) => {
                    const count = cat._count?.products ?? cat.productCount;
                    return (
                      <div
                        key={cat.id}
                        className={`${SPINES[i % SPINES.length]} rounded-xl px-5 py-4 flex items-center justify-between backdrop-blur-sm transition`}
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
                  <div className="rounded-xl px-5 py-6 text-center bg-[#141210]">
                    <span className="text-xs text-[#6b6358]">No categories yet</span>
                  </div>
                )}
              </div>

              {/* Floating testimonial card */}
              <div className="absolute -bottom-8 -left-6 bg-[#141210] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] p-4 w-56">
                <div className="flex -space-x-2 mb-2.5">
                  {["bg-[#c9a227]", "bg-[#b8921f]", "bg-[#a67c1a]", "bg-[#8a7120]"].map((c, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full ${c} flex items-center justify-center text-[#0c0b09] text-[10px] font-bold`}
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
              <div className="absolute -top-5 -right-2 bg-[#141210] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] px-4 py-3">
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

