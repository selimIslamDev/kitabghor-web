"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ShoppingCart, Sun, Moon, Menu, X, BookOpen, Search,
  LayoutDashboard, User, ShoppingBag, Heart, LogOut, ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { totalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Outside click এ dropdown বন্ধ করো
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
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
              <div className="hidden md:block relative" ref={profileRef}>
                {/* Profile Button */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[80px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-[var(--border)] bg-blue-50 dark:bg-blue-900/20">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === "ADMIN" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
                        {user?.role === "ADMIN" ? "Admin" : "Customer"}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {user?.role === "ADMIN" ? (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Admin Dashboard
                          </Link>
                          <Link
                            href="/admin?tab=orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition"
                          >
                            <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Manage Orders
                          </Link>
                          <Link
                            href="/admin?tab=products"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition"
                          >
                            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            Manage Products
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard?tab=profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition"
                          >
                            <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                            My Profile
                          </Link>
                          <Link
                            href="/dashboard?tab=orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition"
                          >
                            <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            My Orders
                          </Link>
                          <Link
                            href="/dashboard?tab=wishlist"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition"
                          >
                            <Heart className="w-4 h-4 text-red-500" />
                            Wishlist
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[var(--border)] py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition">
                  Login
                </Link>
                <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
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
          <div className="md:hidden py-4 border-t border-[var(--border)] space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books or gadgets..."
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>

            <Link href="/products" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 py-2">Shop</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 py-2">About</Link>

            {isAuthenticated ? (
              <>
                <div className="border-t border-[var(--border)] pt-3 mt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {user?.role === "ADMIN" ? (
                    <>
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2 text-gray-700 dark:text-gray-300">
                        <LayoutDashboard className="w-4 h-4 text-blue-600" /> Admin Dashboard
                      </Link>
                      <Link href="/admin?tab=orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2 text-gray-700 dark:text-gray-300">
                        <ShoppingBag className="w-4 h-4 text-purple-600" /> Manage Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2 text-gray-700 dark:text-gray-300">
                        <LayoutDashboard className="w-4 h-4 text-blue-600" /> Dashboard
                      </Link>
                      <Link href="/dashboard?tab=orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2 text-gray-700 dark:text-gray-300">
                        <ShoppingBag className="w-4 h-4 text-purple-600" /> My Orders
                      </Link>
                      <Link href="/dashboard?tab=wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2 text-gray-700 dark:text-gray-300">
                        <Heart className="w-4 h-4 text-red-500" /> Wishlist
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-500 py-2 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-[var(--border)] pt-3 mt-2 flex gap-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-medium py-2 border border-[var(--border)] rounded-lg">Login</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm bg-blue-600 text-white py-2 rounded-lg font-medium">Register</Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}