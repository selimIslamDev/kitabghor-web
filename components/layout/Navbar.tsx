"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, Sun, Moon, Menu, X, BookOpen, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-bold text-primary-700 dark:text-primary-400">
              KitabGhor
            </span>
          </Link>

          {/* Search — Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search books or gadgets..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

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
            <Link href="/cart" className="relative p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition">
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                {user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    Admin
                  </Link>
                )}
                <span className="text-sm text-[var(--muted-foreground)]">{user?.name}</span>
                <button onClick={logout} className="text-sm text-red-500 hover:underline">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium hover:text-primary-600 transition">
                  Login
                </Link>
                <Link href="/register" className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
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
            <input
              type="text"
              placeholder="Search books or gadgets..."
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {isAuthenticated ? (
              <>
                <p className="text-sm text-[var(--muted-foreground)]">{user?.name}</p>
                {user?.role === "ADMIN" && (
                  <Link href="/admin" className="block text-sm text-primary-600 font-medium">Admin Panel</Link>
                )}
                <button onClick={logout} className="block text-sm text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-sm font-medium">Login</Link>
                <Link href="/register" className="block text-sm bg-primary-600 text-white px-4 py-2 rounded-lg text-center">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}