"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, Sun, Moon, Menu, X, BookOpen, Search, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { totalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
      setSearch("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-blue-700 dark:text-blue-400" style={{ fontFamily: "Poppins, sans-serif" }}>
              KitabGhor
            </span>
          </Link>

          {/* Search — Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books or gadgets..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {/* Nav Links — Desktop */}
            <div className="hidden md:flex items-center gap-1 mr-2">
              <Link href="/products" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition">
                Shop
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition">
                About
              </Link>
            </div>

            {/* Dark/Light Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                {/* Admin Panel Button */}
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}

                {/* Dashboard */}
                {user?.role === "CUSTOMER" && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition"
                  >
                    {user?.name?.split(" ")[0]}
                  </Link>
                )}

                <button
                  onClick={() => { logout(); router.push("/"); }}
                  className="text-sm text-red-500 hover:text-red-600 font-medium px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg border border-[var(--border)]"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books or gadgets..."
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>

            {/* Mobile Links */}
            <Link href="/products" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 dark:text-gray-300 py-2">Shop</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 dark:text-gray-300 py-2">About</Link>

            {isAuthenticated ? (
              <>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                {user?.role === "CUSTOMER" && (
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 dark:text-gray-300 py-2">
                    My Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); router.push("/"); setMenuOpen(false); }}
                  className="block text-sm text-red-500 font-medium py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-medium py-2">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block text-sm bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}