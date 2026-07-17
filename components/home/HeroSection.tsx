"use client";

import Link from "next/link";
import { Search, ArrowRight, BookOpen, GraduationCap, Cpu, CheckCircle2 } from "lucide-react";
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

const ACCENTS = [
  { chip: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", dot: "bg-blue-600" },
  { chip: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300", dot: "bg-teal-600" },
  { chip: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300", dot: "bg-violet-600" },
  { chip: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", dot: "bg-amber-600" },
];

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${search}`);
  };

  const { data: categories } = useCategories() as { data?: Category[] };
  const topCategories = (categories || []).filter((c) => !c.parentId).slice(0, 4);

  const { data: bookCount } = useQuery({
    queryKey: ["hero-stats", "book-count"],
    queryFn: async (): Promise<number | null> => {
      const res = await api.get("/products", { params: { type: "BOOK", limit: 1 } });
      return res.data?.total ?? res.data?.pagination?.total ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] dark:bg-[#0B1220]">
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(37,99,235,0.12) 28px)",
        }}
      />
      <div className="absolute top-0 bottom-0 left-10 w-px bg-rose-300/40 dark:bg-rose-400/20 pointer-events-none hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-slate-900/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-mono tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              SESSION 2026 · ADMISSION & ACADEMIC BOOKS
            </div>

            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Your Learning
              <br />
              <span className="text-blue-600 dark:text-blue-400">Journey</span> Starts Here
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
              Find every book and study essential from Class 8 to University —
              all in one place. Trusted by thousands of students on KitabGhor.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search books, subjects, authors..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] bg-white dark:bg-slate-800 text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/products?type=BOOK"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-sm"
              >
                Browse Books
              </Link>
              <Link
                href="/products?type=GADGET"
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-semibold transition"
              >
                Shop Gadgets
              </Link>
            </div>

            <div className="flex items-center gap-2 font-mono text-sm text-gray-500 dark:text-gray-400">
              <BookOpen className="w-4 h-4" />
              {bookCount != null ? (
                <span>
                  <span className="font-bold text-gray-900 dark:text-white">{bookCount}+</span> books currently in stock
                </span>
              ) : (
                <span className="inline-block h-4 w-40 bg-[var(--muted)] rounded animate-pulse" />
              )}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-7 w-80 border border-[var(--border)]">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">KitabGhor</div>
                      <div className="text-xs font-mono text-gray-400">STORE ID · KG-2026</div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-3">
                  Stock by Category
                </p>

                <div className="space-y-1">
                  {topCategories.length > 0 ? (
                    topCategories.map((cat, i) => {
                      const accent = ACCENTS[i % ACCENTS.length];
                      const count = cat._count?.products ?? cat.productCount ?? null;
                      return (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-mono ${accent.chip}`}>
                            {count != null ? `${count}` : "—"}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="h-9 my-1 bg-[var(--muted)] rounded animate-pulse" />
                    ))
                  )}
                </div>
              </div>

              <div className="absolute -top-5 -right-6 w-24 h-24 rounded-full border-2 border-rose-500/70 dark:border-rose-400/70 flex items-center justify-center rotate-[18deg] bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <div className="text-center leading-tight">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 dark:text-rose-400 mx-auto mb-0.5" />
                  <span className="block text-[9px] font-bold text-rose-600 dark:text-rose-400 font-mono">
                    VERIFIED
                  </span>
                  <span className="block text-[8px] text-rose-500/80 dark:text-rose-400/80 font-mono">STORE</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-lg border border-[var(--border)] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-300">+ Study Gadgets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}