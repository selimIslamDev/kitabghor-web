"use client";

import Link from "next/link";
import {
  ShoppingCart, Menu, X, BookOpen, Search,
  LayoutDashboard, User, ShoppingBag, Heart, LogOut,
  ChevronDown, Zap, GraduationCap,
} from "lucide-react";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const megaMenuCategories = [
  {
    title: "Books",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { label: "Class 8-9 Books", href: "/products?classLevel=Class 8-9", icon: "📗" },
      { label: "SSC Books", href: "/products?classLevel=SSC", icon: "📘" },
      { label: "HSC Books", href: "/products?classLevel=HSC", icon: "📙" },
      { label: "University Books", href: "/products?classLevel=University", icon: "🎓" },
    ],
  },
  {
    title: "Gadgets",
    icon: <Zap className="w-4 h-4" />,
    items: [
      { label: "Calculators", href: "/products?type=GADGET&subject=Calculator", icon: "🔢" },
      { label: "Geometry Box", href: "/products?type=GADGET&subject=Geometry", icon: "📐" },
      { label: "Pen & Pencil", href: "/products?type=GADGET&subject=Pen", icon: "✏️" },
      { label: "Art Supplies", href: "/products?type=GADGET&subject=Art", icon: "🎨" },
    ],
  },
  {
    title: "Popular",
    icon: <GraduationCap className="w-4 h-4" />,
    items: [
      { label: "SSC Starter Pack", href: "/bundles/c1", icon: "📦" },
      { label: "HSC Science Pack", href: "/bundles/c2", icon: "🎒" },
      { label: "Art Student Bundle", href: "/bundles/c3", icon: "🎨" },
      { label: "View All Bundles", href: "/products", icon: "🛍️" },
    ],
  },
];

export default function Navbar() {
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const { totalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (megaCloseTimer.current) {
      clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
    setMegaOpen(true);
  };

  const closeMegaWithDelay = () => {
    megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      // BUG FIX: raw search string diye URL banale special characters (&, ?, #, space)
      // URL ke bhenge dey. encodeURIComponent diye safe kora holo.
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      setSearch("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Promo Bar */}
      {/* BORDER REMOVED: age border-b diye ekta line dekha jacchilo, ekhon pura soriye dewa holo */}
      <div className="h-9 flex items-center justify-center text-xs bg-gradient-to-r from-[#1a160f] via-[#2a2215] to-[#1a160f] text-[#a89f8f]">
        <span>
          ✦ Free shipping on orders above{" "}
          <strong className="text-[#c9a227] font-semibold">৳500</strong>
        </span>
        <span className="mx-3 opacity-30">|</span>
        <span>
          Use code{" "}
          <span className="inline-flex items-center bg-[#c9a227]/10 border border-[#c9a227]/25 text-[#d4b84a] font-semibold text-[11px] px-2 py-0.5 rounded tracking-wide mx-1">
            KITAB10
          </span>{" "}
          for 10% off
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0c0b09]/95 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            : "bg-[#0c0b09]/90"
        } backdrop-blur-xl`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#c9a227] to-[#b8921f] flex items-center justify-center shadow-lg shadow-[#c9a227]/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-[18px] h-[18px] text-[#0c0b09]" strokeWidth={2.2} />
              </div>
              <span className="text-[1.3rem] font-bold tracking-wide text-[#f5f0e8]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                Kitab<span className="text-[#c9a227]">Ghor</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-0.5 flex-1">
              <Link
                href="/"
                className={`relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition ${
                  isActive("/") ? "text-[#c9a227]" : "text-[#a89f8f] hover:text-[#f5f0e8] hover:bg-white/[0.04]"
                }`}
              >
                Home
                {isActive("/") && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0.5 w-4 h-0.5 rounded-full bg-[#c9a227]" />
                )}
              </Link>

              {/* Shop Mega Menu */}
              <div
                className="relative"
                ref={megaRef}
                onMouseEnter={openMega}
                onMouseLeave={closeMegaWithDelay}
              >
                <button
                  onClick={() => setMegaOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg transition ${
                    pathname.startsWith("/products") || megaOpen
                      ? "text-[#c9a227]"
                      : "text-[#a89f8f] hover:text-[#f5f0e8] hover:bg-white/[0.04]"
                  }`}
                >
                  Shop
                  <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                </button>

                {megaOpen && (
                  <div className="absolute left-0 top-12 w-[540px] rounded-2xl p-5 z-50 bg-[#141210] border border-[rgba(255,255,255,0.08)] shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
                    <div className="grid grid-cols-3 gap-5">
                      {megaMenuCategories.map((cat) => (
                        <div key={cat.title}>
                          <div className="flex items-center gap-2 font-semibold text-sm text-[#d4b84a] mb-3">
                            <div className="w-6 h-6 rounded-lg bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                              {cat.icon}
                            </div>
                            {cat.title}
                          </div>
                          <ul className="space-y-0.5">
                            {cat.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMegaOpen(false)}
                                  className="flex items-center gap-2 text-[13px] py-1.5 px-2 rounded-lg text-[#a89f8f] hover:text-[#d4b84a] hover:bg-white/[0.04] transition"
                                >
                                  <span className="text-sm">{item.icon}</span>
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 flex items-center justify-between">
                      <p className="text-xs text-[#6b6358]">🔥 New arrivals every week</p>
                      <Link
                        href="/products"
                        onClick={() => setMegaOpen(false)}
                        className="text-xs px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#c9a227] to-[#b8921f] text-[#0c0b09] hover:from-[#d4b84a] hover:to-[#c9a227] transition"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition ${
                  isActive("/about") ? "text-[#c9a227]" : "text-[#a89f8f] hover:text-[#f5f0e8] hover:bg-white/[0.04]"
                }`}
              >
                About
              </Link>

              <Link
                href="/contact"
                className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition ${
                  isActive("/contact") ? "text-[#c9a227]" : "text-[#a89f8f] hover:text-[#f5f0e8] hover:bg-white/[0.04]"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 shrink-0">

              {/* Search */}
              <div className="hidden md:flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search books..."
                      className="w-48 px-3 py-2 rounded-lg text-sm bg-[#1c1915] border border-[rgba(255,255,255,0.08)] text-[#f5f0e8] placeholder:text-[#6b6358] focus:outline-none focus:border-[#c9a227]/40"
                    />
                    <button type="button" onClick={() => setSearchOpen(false)} className="text-[#6b6358] hover:text-[#a89f8f]">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-[#a89f8f] hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition"
                    aria-label="Search"
                  >
                    <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-[38px] h-[38px] rounded-lg flex items-center justify-center text-[#a89f8f] hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition"
                aria-label="Cart"
              >
                <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.8} />
                {mounted && totalItems > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#c9a227] text-[#0c0b09] text-[10px] font-bold flex items-center justify-center leading-none">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Profile / Auth */}
              {isAuthenticated ? (
                <div className="hidden md:block relative ml-1" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border transition ${
                      profileOpen
                        ? "border-[#c9a227]/30 bg-[#c9a227]/5"
                        : "border-[rgba(255,255,255,0.06)] hover:border-[#c9a227]/25"
                    }`}
                  >
                    <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#c9a227] to-[#b8921f] text-[#0c0b09] text-xs font-bold flex items-center justify-center">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-[#a89f8f] max-w-[80px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-[#6b6358] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-60 rounded-2xl overflow-hidden z-50 bg-[#141210] border border-[rgba(255,255,255,0.08)] shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
                      {/* User header */}
                      <div className="px-4 py-4 bg-gradient-to-br from-[#c9a227] to-[#b8921f]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black/15 rounded-xl flex items-center justify-center font-bold text-lg text-[#0c0b09]">
                            {user?.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-[#0c0b09] truncate">{user?.name}</p>
                            <p className="text-xs text-[#0c0b09]/70 truncate">{user?.email}</p>
                          </div>
                        </div>
                        <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full font-semibold bg-black/15 text-[#0c0b09]">
                          {user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="py-1.5">
                        {user?.role === "ADMIN" ? (
                          <>
                            <ProfileLink href="/admin" onClick={() => setProfileOpen(false)} icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Admin Dashboard" />
                            <ProfileLink href="/admin?tab=orders" onClick={() => setProfileOpen(false)} icon={<ShoppingBag className="w-3.5 h-3.5" />} label="Manage Orders" />
                            <ProfileLink href="/admin?tab=products" onClick={() => setProfileOpen(false)} icon={<BookOpen className="w-3.5 h-3.5" />} label="Manage Products" />
                          </>
                        ) : (
                          <>
                            <ProfileLink href="/dashboard" onClick={() => setProfileOpen(false)} icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Dashboard" />
                            <ProfileLink href="/dashboard?tab=profile" onClick={() => setProfileOpen(false)} icon={<User className="w-3.5 h-3.5" />} label="My Profile" />
                            <ProfileLink href="/dashboard?tab=orders" onClick={() => setProfileOpen(false)} icon={<ShoppingBag className="w-3.5 h-3.5" />} label="My Orders" />
                            <ProfileLink href="/dashboard?tab=wishlist" onClick={() => setProfileOpen(false)} icon={<Heart className="w-3.5 h-3.5" />} label="Wishlist" />
                          </>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#e0897a] hover:bg-[#e0897a]/8 transition"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#e0897a]/12 flex items-center justify-center">
                            <LogOut className="w-3.5 h-3.5" />
                          </div>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <Link
                    href="/login"
                    className="text-sm font-medium px-3 py-2 rounded-lg text-[#a89f8f] hover:text-[#f5f0e8] transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#c9a227] to-[#b8921f] text-[#0c0b09] hover:from-[#d4b84a] hover:to-[#c9a227] transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden w-[38px] h-[38px] rounded-lg flex items-center justify-center text-[#a89f8f] border border-[rgba(255,255,255,0.08)] hover:text-[#c9a227] hover:border-[#c9a227]/30 transition"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden py-4 space-y-1">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6358]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search books or gadgets..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[#1c1915] border border-[rgba(255,255,255,0.08)] text-[#f5f0e8] placeholder:text-[#6b6358] focus:outline-none focus:border-[#c9a227]/40"
                  />
                </div>
              </form>

              <MobileLink href="/" onClick={() => setMenuOpen(false)} active={isActive("/")}>Home</MobileLink>
              <MobileLink href="/products" onClick={() => setMenuOpen(false)} active={pathname.startsWith("/products")}>Shop</MobileLink>
              <MobileLink href="/about" onClick={() => setMenuOpen(false)}>About</MobileLink>
              <MobileLink href="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileLink>

              {isAuthenticated ? (
                <div className="pt-3 mt-2">
                  <div className="flex items-center gap-3 mb-3 px-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#b8921f] text-[#0c0b09] font-bold flex items-center justify-center">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#f5f0e8]">{user?.name}</p>
                      <p className="text-xs text-[#6b6358]">{user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}</p>
                    </div>
                  </div>

                  {user?.role === "ADMIN" ? (
                    <>
                      <MobileIconLink href="/admin" onClick={() => setMenuOpen(false)} icon={<LayoutDashboard className="w-4 h-4 text-[#c9a227]" />}>Admin Dashboard</MobileIconLink>
                      <MobileIconLink href="/admin?tab=orders" onClick={() => setMenuOpen(false)} icon={<ShoppingBag className="w-4 h-4 text-[#d4b84a]" />}>Manage Orders</MobileIconLink>
                    </>
                  ) : (
                    <>
                      <MobileIconLink href="/dashboard" onClick={() => setMenuOpen(false)} icon={<LayoutDashboard className="w-4 h-4 text-[#c9a227]" />}>Dashboard</MobileIconLink>
                      <MobileIconLink href="/dashboard?tab=orders" onClick={() => setMenuOpen(false)} icon={<ShoppingBag className="w-4 h-4 text-[#d4b84a]" />}>My Orders</MobileIconLink>
                      <MobileIconLink href="/dashboard?tab=wishlist" onClick={() => setMenuOpen(false)} icon={<Heart className="w-4 h-4 text-[#e0897a]" />}>Wishlist</MobileIconLink>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl w-full mt-1 text-[#e0897a]"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-2 flex gap-2 px-1">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] text-[#f5f0e8]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-sm py-2.5 rounded-xl font-semibold bg-gradient-to-r from-[#c9a227] to-[#b8921f] text-[#0c0b09]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

function ProfileLink({
  href,
  onClick,
  icon,
  label,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a89f8f] hover:text-[#f5f0e8] hover:bg-white/[0.04] transition"
    >
      <div className="w-7 h-7 rounded-lg bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
        {icon}
      </div>
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  active,
  children,
}: {
  href: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl ${
        active ? "text-[#c9a227] bg-[#c9a227]/10" : "text-[#a89f8f]"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileIconLink({
  href,
  onClick,
  icon,
  children,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-[#a89f8f]"
    >
      {icon} {children}
    </Link>
  );
}





// "use client";

// import Link from "next/link";
// import { useTheme } from "next-themes";
// import {
//   ShoppingCart, Sun, Moon, Menu, X, BookOpen, Search,
//   LayoutDashboard, User, ShoppingBag, Heart, LogOut,
//   ChevronDown, Zap, GraduationCap,
// } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { useCartStore } from "@/store/cart.store";
// import { useAuthStore } from "@/store/auth.store";
// import { useRouter, usePathname } from "next/navigation";

// const megaMenuCategories = [
//   {
//     title: "Books",
//     icon: <BookOpen className="w-4 h-4" />,
//     color: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/20",
//     items: [
//       { label: "Class 8-9 Books", href: "/products?classLevel=Class 8-9", icon: "📗" },
//       { label: "SSC Books", href: "/products?classLevel=SSC", icon: "📘" },
//       { label: "HSC Books", href: "/products?classLevel=HSC", icon: "📙" },
//       { label: "University Books", href: "/products?classLevel=University", icon: "🎓" },
//     ],
//   },
//   {
//     title: "Gadgets",
//     icon: <Zap className="w-4 h-4" />,
//     color: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/20",
//     items: [
//       { label: "Calculators", href: "/products?type=GADGET&subject=Calculator", icon: "🔢" },
//       { label: "Geometry Box", href: "/products?type=GADGET&subject=Geometry", icon: "📐" },
//       { label: "Pen & Pencil", href: "/products?type=GADGET&subject=Pen", icon: "✏️" },
//       { label: "Art Supplies", href: "/products?type=GADGET&subject=Art", icon: "🎨" },
//     ],
//   },
//   {
//     title: "Popular",
//     icon: <GraduationCap className="w-4 h-4" />,
//     color: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/20",
//     items: [
//       { label: "SSC Starter Pack", href: "/bundles/c1", icon: "📦" },
//       { label: "HSC Science Pack", href: "/bundles/c2", icon: "🎒" },
//       { label: "Art Student Bundle", href: "/bundles/c3", icon: "🎨" },
//       { label: "View All Bundles", href: "/products", icon: "🛍️" },
//     ],
//   },
// ];

// export default function Navbar() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [megaOpen, setMegaOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [search, setSearch] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);

//   const { totalItems } = useCartStore();
//   const { user, isAuthenticated, logout } = useAuthStore();
//   const router = useRouter();
//   const pathname = usePathname();

//   const profileRef = useRef<HTMLDivElement>(null);
//   const megaRef = useRef<HTMLDivElement>(null);

//   useEffect(() => setMounted(true), []);

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
//         setProfileOpen(false);
//       }
//       if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
//         setMegaOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (search.trim()) {
//       router.push(`/products?search=${search}`);
//       setSearch("");
//       setSearchOpen(false);
//       setMenuOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setProfileOpen(false);
//     setMenuOpen(false);
//     router.push("/");
//   };

//   const isActive = (href: string) => pathname === href;

//   return (
//     <>
//       {/* Announcement Bar */}
//       <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center font-medium">
//         🎉 Free shipping on orders above ৳500 &nbsp;|&nbsp; Use code{" "}
//         <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold tracking-wide">KITAB10</span>{" "}
//         for 10% off
//       </div>

//       {/* Main Navbar */}
//       <nav className={`sticky top-0 z-50 border-b border-[var(--border)] transition-all duration-300 ${scrolled ? "bg-[var(--background)]/95 backdrop-blur-md shadow-md" : "bg-[var(--background)]"}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">

//             {/* Logo */}
//             <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition">
//                 <BookOpen className="w-4 h-4 text-white" />
//               </div>
//               <span className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
//                 Kitab<span className="text-blue-600 dark:text-blue-400">Ghor</span>
//               </span>
//             </Link>

//             {/* Desktop Nav Links */}
//             <div className="hidden md:flex items-center gap-1 mx-6">
//               <Link
//                 href="/"
//                 className={`text-sm font-medium px-3 py-2 rounded-lg transition ${isActive("/") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//               >
//                 Home
//               </Link>

//               {/* Shop Mega Menu */}
//               <div className="relative" ref={megaRef}>
//                 <button
//                   onClick={() => setMegaOpen(!megaOpen)}
//                   className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition ${pathname.startsWith("/products") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//                 >
//                   Shop
//                   <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
//                 </button>

//                 {/* Mega Menu Dropdown */}
//                 {megaOpen && (
//                   <div className="absolute left-0 top-12 w-[520px] bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl p-5 z-50">
//                     <div className="grid grid-cols-3 gap-4">
//                       {megaMenuCategories.map((cat) => (
//                         <div key={cat.title}>
//                           <div className={`flex items-center gap-2 ${cat.color} font-semibold text-sm mb-3`}>
//                             <div className={`w-6 h-6 ${cat.bg} rounded-lg flex items-center justify-center`}>
//                               {cat.icon}
//                             </div>
//                             {cat.title}
//                           </div>
//                           <ul className="space-y-1">
//                             {cat.items.map((item) => (
//                               <li key={item.label}>
//                                 <Link
//                                   href={item.href}
//                                   onClick={() => setMegaOpen(false)}
//                                   className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1.5 px-2 rounded-lg hover:bg-[var(--muted)] transition"
//                                 >
//                                   <span>{item.icon}</span>
//                                   {item.label}
//                                 </Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Bottom CTA */}
//                     <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         🔥 New arrivals every week!
//                       </p>
//                       <Link
//                         href="/products"
//                         onClick={() => setMegaOpen(false)}
//                         className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
//                       >
//                         View All Products →
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <Link
//                 href="/about"
//                 className={`text-sm font-medium px-3 py-2 rounded-lg transition ${isActive("/about") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//               >
//                 About
//               </Link>

//               <Link
//                 href="/contact"
//                 className={`text-sm font-medium px-3 py-2 rounded-lg transition ${isActive("/contact") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//               >
//                 Contact
//               </Link>
//             </div>

//             {/* Right Side */}
//             <div className="flex items-center gap-2">

//               {/* Search Button — Desktop */}
//               <div className="hidden md:flex items-center">
//                 {searchOpen ? (
//                   <form onSubmit={handleSearch} className="flex items-center gap-2">
//                     <input
//                       autoFocus
//                       type="text"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       placeholder="Search..."
//                       className="w-48 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
//                       <X className="w-4 h-4" />
//                     </button>
//                   </form>
//                 ) : (
//                   <button
//                     onClick={() => setSearchOpen(true)}
//                     className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
//                   >
//                     <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
//                   </button>
//                 )}
//               </div>

//               {/* Dark/Light Toggle */}
//               {mounted && (
//                 <button
//                   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//                   className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
//                   aria-label="Toggle theme"
//                 >
//                   {theme === "dark" ? (
//                     <Sun className="w-4 h-4 text-yellow-400" />
//                   ) : (
//                     <Moon className="w-4 h-4 text-slate-600" />
//                   )}
//                 </button>
//               )}

//               {/* Cart */}
//               <Link
//                 href="/cart"
//                 className="relative p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 {/* 🛠️ ইনজেক্টেড ফিক্স: Hydration অমিল দূর করতে mounted এবং totalItems একসাথে চেক করা হয়েছে */}
//                 {mounted && totalItems > 0 && (
//                   <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
//                     {totalItems > 9 ? "9+" : totalItems}
//                   </span>
//                 )}
//               </Link>

//               {/* Profile Dropdown */}
//               {isAuthenticated ? (
//                 <div className="hidden md:block relative" ref={profileRef}>
//                   <button
//                     onClick={() => setProfileOpen(!profileOpen)}
//                     className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${profileOpen ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"}`}
//                   >
//                     <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
//                       {user?.name?.[0]?.toUpperCase()}
//                     </div>
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[70px] truncate">
//                       {user?.name?.split(" ")[0]}
//                     </span>
//                     <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
//                   </button>

//                   {profileOpen && (
//                     <div className="absolute right-0 top-12 w-60 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden z-50">
//                       {/* User Info */}
//                       <div className="px-4 py-4 bg-gradient-to-br from-blue-600 to-indigo-700">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                             {user?.name?.[0]?.toUpperCase()}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="font-bold text-white text-sm truncate">{user?.name}</p>
//                             <p className="text-blue-200 text-xs truncate">{user?.email}</p>
//                           </div>
//                         </div>
//                         <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold ${user?.role === "ADMIN" ? "bg-red-400/30 text-red-100" : "bg-white/20 text-white"}`}>
//                           {user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}
//                         </span>
//                       </div>

//                       {/* Menu */}
//                       <div className="py-2">
//                         {user?.role === "ADMIN" ? (
//                           <>
//                             <Link href="/admin" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                                 <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                               </div>
//                               Admin Dashboard
//                             </Link>
//                             <Link href="/admin?tab=orders" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
//                                 <ShoppingBag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
//                               </div>
//                               Manage Orders
//                             </Link>
//                             <Link href="/admin?tab=products" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
//                                 <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
//                               </div>
//                               Manage Products
//                             </Link>
//                           </>
//                         ) : (
//                           <>
//                             <Link href="/dashboard" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                                 <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                               </div>
//                               Dashboard
//                             </Link>
//                             <Link href="/dashboard?tab=profile" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
//                                 <User className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
//                               </div>
//                               My Profile
//                             </Link>
//                             <Link href="/dashboard?tab=orders" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
//                                 <ShoppingBag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
//                               </div>
//                               My Orders
//                             </Link>
//                             <Link href="/dashboard?tab=wishlist" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
//                                 <Heart className="w-3.5 h-3.5 text-red-500" />
//                               </div>
//                               Wishlist
//                             </Link>
//                           </>
//                         )}
//                       </div>

//                       {/* Logout */}
//                       <div className="border-t border-[var(--border)] py-2">
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
//                         >
//                           <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
//                             <LogOut className="w-3.5 h-3.5 text-red-500" />
//                           </div>
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="hidden md:flex items-center gap-2">
//                   <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition">
//                     Login
//                   </Link>
//                   <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
//                     Register
//                   </Link>
//                 </div>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="md:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--card)]"
//               >
//                 {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {menuOpen && (
//             <div className="md:hidden py-4 border-t border-[var(--border)] space-y-1">
//               {/* Mobile Search */}
//               <form onSubmit={handleSearch} className="mb-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder="Search books or gadgets..."
//                     className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </form>

//               <Link href="/" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl ${isActive("/") ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}>
//                 Home
//               </Link>
//               <Link href="/products" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl ${pathname.startsWith("/products") ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}>
//                 Shop
//               </Link>
//               <Link href="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl text-gray-600 dark:text-gray-300">About</Link>
//               <Link href="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl text-gray-600 dark:text-gray-300">Contact</Link>

//               {isAuthenticated ? (
//                 <div className="border-t border-[var(--border)] pt-3 mt-2">
//                   <div className="flex items-center gap-3 mb-3 px-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
//                       {user?.name?.[0]?.toUpperCase()}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
//                       <p className="text-xs text-gray-500">{user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}</p>
//                     </div>
//                   </div>

//                   {user?.role === "ADMIN" ? (
//                     <>
//                       <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <LayoutDashboard className="w-4 h-4 text-blue-600" /> Admin Dashboard
//                       </Link>
//                       <Link href="/admin?tab=orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <ShoppingBag className="w-4 h-4 text-purple-600" /> Manage Orders
//                       </Link>
//                     </>
//                   ) : (
//                     <>
//                       <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <LayoutDashboard className="w-4 h-4 text-blue-600" /> Dashboard
//                       </Link>
//                       <Link href="/dashboard?tab=orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <ShoppingBag className="w-4 h-4 text-purple-600" /> My Orders
//                       </Link>
//                       <Link href="/dashboard?tab=wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <Heart className="w-4 h-4 text-red-500" /> Wishlist
//                       </Link>
//                     </>
//                   )}

//                   <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 py-2.5 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 w-full mt-1">
//                     <LogOut className="w-4 h-4" /> Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="border-t border-[var(--border)] pt-3 mt-2 flex gap-2 px-1">
//                   <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-medium py-2.5 border border-[var(--border)] rounded-xl">Login</Link>
//                   <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm bg-blue-600 text-white py-2.5 rounded-xl font-medium">Register</Link>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </nav>
//     </>
//   );
// }


















// "use client";

// import Link from "next/link";
// import { useTheme } from "next-themes";
// import {
//   ShoppingCart, Sun, Moon, Menu, X, BookOpen, Search,
//   LayoutDashboard, User, ShoppingBag, Heart, LogOut,
//   ChevronDown, Zap, GraduationCap, Calculator, Pencil,
// } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { useCartStore } from "@/store/cart.store";
// import { useAuthStore } from "@/store/auth.store";
// import { useRouter, usePathname } from "next/navigation";

// const megaMenuCategories = [
//   {
//     title: "Books",
//     icon: <BookOpen className="w-4 h-4" />,
//     color: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/20",
//     items: [
//       { label: "Class 8-9 Books", href: "/products?classLevel=Class 8-9", icon: "📗" },
//       { label: "SSC Books", href: "/products?classLevel=SSC", icon: "📘" },
//       { label: "HSC Books", href: "/products?classLevel=HSC", icon: "📙" },
//       { label: "University Books", href: "/products?classLevel=University", icon: "🎓" },
//     ],
//   },
//   {
//     title: "Gadgets",
//     icon: <Zap className="w-4 h-4" />,
//     color: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/20",
//     items: [
//       { label: "Calculators", href: "/products?type=GADGET&subject=Calculator", icon: "🔢" },
//       { label: "Geometry Box", href: "/products?type=GADGET&subject=Geometry", icon: "📐" },
//       { label: "Pen & Pencil", href: "/products?type=GADGET&subject=Pen", icon: "✏️" },
//       { label: "Art Supplies", href: "/products?type=GADGET&subject=Art", icon: "🎨" },
//     ],
//   },
//   {
//     title: "Popular",
//     icon: <GraduationCap className="w-4 h-4" />,
//     color: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/20",
//     items: [
//       { label: "SSC Starter Pack", href: "/bundles/c1", icon: "📦" },
//       { label: "HSC Science Pack", href: "/bundles/c2", icon: "🎒" },
//       { label: "Art Student Bundle", href: "/bundles/c3", icon: "🎨" },
//       { label: "View All Bundles", href: "/products", icon: "🛍️" },
//     ],
//   },
// ];

// export default function Navbar() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [megaOpen, setMegaOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [search, setSearch] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);

//   const { totalItems } = useCartStore();
//   const { user, isAuthenticated, logout } = useAuthStore();
//   const router = useRouter();
//   const pathname = usePathname();

//   const profileRef = useRef<HTMLDivElement>(null);
//   const megaRef = useRef<HTMLDivElement>(null);

//   useEffect(() => setMounted(true), []);

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
//         setProfileOpen(false);
//       }
//       if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
//         setMegaOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (search.trim()) {
//       router.push(`/products?search=${search}`);
//       setSearch("");
//       setSearchOpen(false);
//       setMenuOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setProfileOpen(false);
//     setMenuOpen(false);
//     router.push("/");
//   };

//   const isActive = (href: string) => pathname === href;

//   return (
//     <>
//       {/* Announcement Bar */}
//       <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center font-medium">
//         🎉 Free shipping on orders above ৳500 &nbsp;|&nbsp; Use code{" "}
//         <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold tracking-wide">KITAB10</span>{" "}
//         for 10% off
//       </div>

//       {/* Main Navbar */}
//       <nav className={`sticky top-0 z-50 border-b border-[var(--border)] transition-all duration-300 ${scrolled ? "bg-[var(--background)]/95 backdrop-blur-md shadow-md" : "bg-[var(--background)]"}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">

//             {/* Logo */}
//             <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition">
//                 <BookOpen className="w-4 h-4 text-white" />
//               </div>
//               <span className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
//                 Kitab<span className="text-blue-600 dark:text-blue-400">Ghor</span>
//               </span>
//             </Link>

//             {/* Desktop Nav Links */}
//             <div className="hidden md:flex items-center gap-1 mx-6">
//               <Link
//                 href="/"
//                 className={`text-sm font-medium px-3 py-2 rounded-lg transition ${isActive("/") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//               >
//                 Home
//               </Link>

//               {/* Shop Mega Menu */}
//               <div className="relative" ref={megaRef}>
//                 <button
//                   onClick={() => setMegaOpen(!megaOpen)}
//                   className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition ${pathname.startsWith("/products") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//                 >
//                   Shop
//                   <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
//                 </button>

//                 {/* Mega Menu Dropdown */}
//                 {megaOpen && (
//                   <div className="absolute left-0 top-12 w-[520px] bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl p-5 z-50">
//                     <div className="grid grid-cols-3 gap-4">
//                       {megaMenuCategories.map((cat) => (
//                         <div key={cat.title}>
//                           <div className={`flex items-center gap-2 ${cat.color} font-semibold text-sm mb-3`}>
//                             <div className={`w-6 h-6 ${cat.bg} rounded-lg flex items-center justify-center`}>
//                               {cat.icon}
//                             </div>
//                             {cat.title}
//                           </div>
//                           <ul className="space-y-1">
//                             {cat.items.map((item) => (
//                               <li key={item.label}>
//                                 <Link
//                                   href={item.href}
//                                   onClick={() => setMegaOpen(false)}
//                                   className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1.5 px-2 rounded-lg hover:bg-[var(--muted)] transition"
//                                 >
//                                   <span>{item.icon}</span>
//                                   {item.label}
//                                 </Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Bottom CTA */}
//                     <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         🔥 New arrivals every week!
//                       </p>
//                       <Link
//                         href="/products"
//                         onClick={() => setMegaOpen(false)}
//                         className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
//                       >
//                         View All Products →
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <Link
//                 href="/about"
//                 className={`text-sm font-medium px-3 py-2 rounded-lg transition ${isActive("/about") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//               >
//                 About
//               </Link>

//               <Link
//                 href="/contact"
//                 className={`text-sm font-medium px-3 py-2 rounded-lg transition ${isActive("/contact") ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-[var(--muted)]"}`}
//               >
//                 Contact
//               </Link>
//             </div>

//             {/* Right Side */}
//             <div className="flex items-center gap-2">

//               {/* Search Button — Desktop */}
//               <div className="hidden md:flex items-center">
//                 {searchOpen ? (
//                   <form onSubmit={handleSearch} className="flex items-center gap-2">
//                     <input
//                       autoFocus
//                       type="text"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       placeholder="Search..."
//                       className="w-48 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
//                       <X className="w-4 h-4" />
//                     </button>
//                   </form>
//                 ) : (
//                   <button
//                     onClick={() => setSearchOpen(true)}
//                     className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
//                   >
//                     <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
//                   </button>
//                 )}
//               </div>

//               {/* Dark/Light Toggle */}
//               {mounted && (
//                 <button
//                   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//                   className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
//                   aria-label="Toggle theme"
//                 >
//                   {theme === "dark" ? (
//                     <Sun className="w-4 h-4 text-yellow-400" />
//                   ) : (
//                     <Moon className="w-4 h-4 text-slate-600" />
//                   )}
//                 </button>
//               )}

//               {/* Cart */}
//               <Link
//                 href="/cart"
//                 className="relative p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition"
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 {totalItems > 0 && (
//                   <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
//                     {totalItems > 9 ? "9+" : totalItems}
//                   </span>
//                 )}
//               </Link>

//               {/* Profile Dropdown */}
//               {isAuthenticated ? (
//                 <div className="hidden md:block relative" ref={profileRef}>
//                   <button
//                     onClick={() => setProfileOpen(!profileOpen)}
//                     className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${profileOpen ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"}`}
//                   >
//                     <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
//                       {user?.name?.[0]?.toUpperCase()}
//                     </div>
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[70px] truncate">
//                       {user?.name?.split(" ")[0]}
//                     </span>
//                     <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
//                   </button>

//                   {profileOpen && (
//                     <div className="absolute right-0 top-12 w-60 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden z-50">
//                       {/* User Info */}
//                       <div className="px-4 py-4 bg-gradient-to-br from-blue-600 to-indigo-700">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                             {user?.name?.[0]?.toUpperCase()}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="font-bold text-white text-sm truncate">{user?.name}</p>
//                             <p className="text-blue-200 text-xs truncate">{user?.email}</p>
//                           </div>
//                         </div>
//                         <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold ${user?.role === "ADMIN" ? "bg-red-400/30 text-red-100" : "bg-white/20 text-white"}`}>
//                           {user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}
//                         </span>
//                       </div>

//                       {/* Menu */}
//                       <div className="py-2">
//                         {user?.role === "ADMIN" ? (
//                           <>
//                             <Link href="/admin" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                                 <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                               </div>
//                               Admin Dashboard
//                             </Link>
//                             <Link href="/admin?tab=orders" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
//                                 <ShoppingBag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
//                               </div>
//                               Manage Orders
//                             </Link>
//                             <Link href="/admin?tab=products" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
//                                 <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
//                               </div>
//                               Manage Products
//                             </Link>
//                           </>
//                         ) : (
//                           <>
//                             <Link href="/dashboard" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                                 <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                               </div>
//                               Dashboard
//                             </Link>
//                             <Link href="/dashboard?tab=profile" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
//                                 <User className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
//                               </div>
//                               My Profile
//                             </Link>
//                             <Link href="/dashboard?tab=orders" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
//                                 <ShoppingBag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
//                               </div>
//                               My Orders
//                             </Link>
//                             <Link href="/dashboard?tab=wishlist" onClick={() => setProfileOpen(false)}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)] transition">
//                               <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
//                                 <Heart className="w-3.5 h-3.5 text-red-500" />
//                               </div>
//                               Wishlist
//                             </Link>
//                           </>
//                         )}
//                       </div>

//                       {/* Logout */}
//                       <div className="border-t border-[var(--border)] py-2">
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
//                         >
//                           <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
//                             <LogOut className="w-3.5 h-3.5 text-red-500" />
//                           </div>
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="hidden md:flex items-center gap-2">
//                   <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition">
//                     Login
//                   </Link>
//                   <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
//                     Register
//                   </Link>
//                 </div>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="md:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--card)]"
//               >
//                 {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {menuOpen && (
//             <div className="md:hidden py-4 border-t border-[var(--border)] space-y-1">
//               {/* Mobile Search */}
//               <form onSubmit={handleSearch} className="mb-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder="Search books or gadgets..."
//                     className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </form>

//               <Link href="/" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl ${isActive("/") ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}>
//                 Home
//               </Link>
//               <Link href="/products" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl ${pathname.startsWith("/products") ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}>
//                 Shop
//               </Link>
//               <Link href="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl text-gray-600 dark:text-gray-300">About</Link>
//               <Link href="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl text-gray-600 dark:text-gray-300">Contact</Link>

//               {isAuthenticated ? (
//                 <div className="border-t border-[var(--border)] pt-3 mt-2">
//                   <div className="flex items-center gap-3 mb-3 px-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
//                       {user?.name?.[0]?.toUpperCase()}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
//                       <p className="text-xs text-gray-500">{user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}</p>
//                     </div>
//                   </div>

//                   {user?.role === "ADMIN" ? (
//                     <>
//                       <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <LayoutDashboard className="w-4 h-4 text-blue-600" /> Admin Dashboard
//                       </Link>
//                       <Link href="/admin?tab=orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <ShoppingBag className="w-4 h-4 text-purple-600" /> Manage Orders
//                       </Link>
//                     </>
//                   ) : (
//                     <>
//                       <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <LayoutDashboard className="w-4 h-4 text-blue-600" /> Dashboard
//                       </Link>
//                       <Link href="/dashboard?tab=orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <ShoppingBag className="w-4 h-4 text-purple-600" /> My Orders
//                       </Link>
//                       <Link href="/dashboard?tab=wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[var(--muted)]">
//                         <Heart className="w-4 h-4 text-red-500" /> Wishlist
//                       </Link>
//                     </>
//                   )}

//                   <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 py-2.5 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 w-full mt-1">
//                     <LogOut className="w-4 h-4" /> Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="border-t border-[var(--border)] pt-3 mt-2 flex gap-2 px-1">
//                   <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-medium py-2.5 border border-[var(--border)] rounded-xl">Login</Link>
//                   <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm bg-blue-600 text-white py-2.5 rounded-xl font-medium">Register</Link>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </nav>
//     </>
//   );
// }