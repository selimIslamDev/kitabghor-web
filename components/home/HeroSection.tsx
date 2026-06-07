"use client";

import Link from "next/link";
import { Search, ArrowRight, BookOpen, Star, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${search}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              Bangladesh's #1 Academic Book Shop
            </div>

            {/* Heading */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Your Learning
              <span className="text-blue-600 dark:text-blue-400"> Journey </span>
              Starts Here
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Find the perfect books and educational gadgets for Class 8 to University. 
              Trusted by thousands of students across Bangladesh.
            </p>

            {/* Search Bar */}
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

            {/* CTA Buttons */}
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

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content — Visual */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-80">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">KitabGhor</div>
                    <div className="text-sm text-gray-500">Academic Store</div>
                  </div>
                </div>
                {categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </div>
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-amber-400 text-white px-4 py-2 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-1">
                <Users className="w-4 h-4" />
                10k+ Students
              </div>

              {/* Floating rating */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">4.9/5 Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "5,000+", label: "Books Available" },
  { value: "10k+", label: "Happy Students" },
  { value: "50+", label: "Brands" },
];

const categories = [
  { name: "SSC Books", icon: "📘", count: "200+ books" },
  { name: "HSC Books", icon: "📙", count: "180+ books" },
  { name: "University", icon: "🎓", count: "500+ books" },
  { name: "Gadgets", icon: "🔢", count: "50+ items" },
];