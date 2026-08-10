"use client";

import Link from "next/link";
import {
  ShoppingCart, Menu, X, BookOpen, Search,
  LayoutDashboard, User, ShoppingBag, Heart, LogOut,
  ChevronDown, Zap, GraduationCap,
} from "lucide-react";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";

// Hydration-safe "mounted" flag — avoids calling setState synchronously
// inside an effect (which React now warns about). No-op subscribe,
// client snapshot true, server snapshot false.
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";

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

// Design tokens — premium dark-gold theme (single theme, no light/dark toggle)
const theme = {
  "--bg": "#0c0b09",
  "--surface": "#141210",
  "--surface-2": "#1c1915",
  "--border": "rgba(255,255,255,0.06)",
  "--border-gold": "rgba(201,162,39,0.2)",
  "--gold": "#c9a227",
  "--gold-soft": "#d4b84a",
  "--text": "#f5f0e8",
  "--muted": "#a89f8f",
  "--dim": "#6b6358",
} as React.CSSProperties;

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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Outside click
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
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
    <div style={theme}>
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap" rel="stylesheet" />

      {/* Promo Bar */}
      <div
        className="h-9 flex items-center justify-center text-xs tracking-wide"
        style={{
          background: "linear-gradient(90deg, #1a160f 0%, #2a2215 50%, #1a160f 100%)",
          borderBottom: "1px solid var(--border-gold)",
          color: "var(--muted)",
        }}
      >
        <span>✦ Free shipping on orders above <strong style={{ color: "var(--gold)", fontWeight: 600 }}>৳500</strong></span>
        <span className="mx-3 opacity-30">|</span>
        <span>
          Use code{" "}
          <span
            className="inline-flex items-center font-semibold text-[0.6875rem] px-2 py-0.5 rounded mx-1 tracking-wide"
            style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)", color: "var(--gold-soft)" }}
          >
            KITAB10
          </span>{" "}
          for 10% off
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(12, 11, 9, 0.95)" : "rgba(12, 11, 9, 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 gap-8">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)", boxShadow: "0 2px 12px rgba(201,162,39,0.25)" }}
              >
                <BookOpen className="w-[18px] h-[18px]" style={{ color: "#0c0b09" }} />
              </div>
              <span className="text-[1.35rem] font-bold tracking-wide" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--text)" }}>
                Kitab<span style={{ color: "var(--gold)" }}>Ghor</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              <Link
                href="/"
                className="relative px-3.5 py-2 text-[0.8125rem] font-medium rounded-lg transition"
                style={{ color: isActive("/") ? "var(--gold)" : "var(--muted)" }}
              >
                Home
                {isActive("/") && <span className="absolute left-1/2 -translate-x-1/2 bottom-0.5 w-4 h-0.5 rounded-full" style={{ background: "var(--gold)" }} />}
              </Link>

              {/* Shop Mega Menu */}
              <div className="relative" ref={megaRef}>
                <button
                  onClick={() => setMegaOpen(!megaOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-medium rounded-lg transition"
                  style={{ color: pathname.startsWith("/products") || megaOpen ? "var(--gold)" : "var(--muted)" }}
                >
                  Shop
                  <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                </button>

                {megaOpen && (
                  <div
                    className="absolute left-0 top-12 w-[520px] rounded-2xl p-5 z-50"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {megaMenuCategories.map((cat) => (
                        <div key={cat.title}>
                          <div className="flex items-center gap-2 font-semibold text-sm mb-3" style={{ color: "var(--gold-soft)" }}>
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,162,39,0.12)" }}>
                              {cat.icon}
                            </div>
                            {cat.title}
                          </div>
                          <ul className="space-y-1">
                            {cat.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMegaOpen(false)}
                                  className="flex items-center gap-2 text-sm py-1.5 px-2 rounded-lg transition"
                                  style={{ color: "var(--muted)" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold-soft)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}
                                >
                                  <span>{item.icon}</span>
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                      <p className="text-xs" style={{ color: "var(--dim)" }}>🔥 New arrivals every week!</p>
                      <Link
                        href="/products"
                        onClick={() => setMegaOpen(false)}
                        className="text-xs px-4 py-2 rounded-lg font-medium transition"
                        style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)", color: "#0c0b09" }}
                      >
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="relative px-3.5 py-2 text-[0.8125rem] font-medium rounded-lg transition"
                style={{ color: isActive("/about") ? "var(--gold)" : "var(--muted)" }}
              >
                About
              </Link>

              <Link
                href="/contact"
                className="relative px-3.5 py-2 text-[0.8125rem] font-medium rounded-lg transition"
                style={{ color: isActive("/contact") ? "var(--gold)" : "var(--muted)" }}
              >
                Contact
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1.5">

              {/* Search — Desktop */}
              <div className="hidden md:flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-48 px-3 py-2 rounded-lg text-sm focus:outline-none"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                    />
                    <button type="button" onClick={() => setSearchOpen(false)} style={{ color: "var(--dim)" }}>
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-[38px] h-[38px] rounded-lg flex items-center justify-center transition"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.background = "rgba(201,162,39,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <Search className="w-[18px] h-[18px]" />
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-[38px] h-[38px] rounded-lg flex items-center justify-center transition"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.background = "rgba(201,162,39,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {mounted && totalItems > 0 && (
                  <span
                    className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[0.625rem] font-bold"
                    style={{ background: "var(--gold)", color: "#0c0b09" }}
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              {isAuthenticated ? (
                <div className="hidden md:block relative ml-1" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition"
                    style={{
                      border: profileOpen ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                      background: profileOpen ? "rgba(201,162,39,0.05)" : "transparent",
                    }}
                  >
                    <div
                      className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "linear-gradient(135deg, var(--gold), #b8921f)", color: "#0c0b09" }}
                    >
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs font-medium max-w-[80px] truncate" style={{ color: "var(--muted)" }}>
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} style={{ color: "var(--dim)" }} />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-12 w-60 rounded-2xl overflow-hidden z-50"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
                    >
                      {/* User Info */}
                      <div className="px-4 py-4" style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black/15 rounded-xl flex items-center justify-center font-bold text-lg" style={{ color: "#0c0b09" }}>
                            {user?.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate" style={{ color: "#0c0b09" }}>{user?.name}</p>
                            <p className="text-xs truncate" style={{ color: "rgba(12,11,9,0.7)" }}>{user?.email}</p>
                          </div>
                        </div>
                        <span
                          className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(12,11,9,0.15)", color: "#0c0b09" }}
                        >
                          {user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}
                        </span>
                      </div>

                      {/* Menu */}
                      <div className="py-2">
                        {user?.role === "ADMIN" ? (
                          <>
                            <ProfileLink href="/admin" onClick={() => setProfileOpen(false)} icon={<LayoutDashboard className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />} label="Admin Dashboard" />
                            <ProfileLink href="/admin?tab=orders" onClick={() => setProfileOpen(false)} icon={<ShoppingBag className="w-3.5 h-3.5" style={{ color: "var(--gold-soft)" }} />} label="Manage Orders" />
                            <ProfileLink href="/admin?tab=products" onClick={() => setProfileOpen(false)} icon={<BookOpen className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />} label="Manage Products" />
                          </>
                        ) : (
                          <>
                            <ProfileLink href="/dashboard" onClick={() => setProfileOpen(false)} icon={<LayoutDashboard className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />} label="Dashboard" />
                            <ProfileLink href="/dashboard?tab=profile" onClick={() => setProfileOpen(false)} icon={<User className="w-3.5 h-3.5" style={{ color: "var(--gold-soft)" }} />} label="My Profile" />
                            <ProfileLink href="/dashboard?tab=orders" onClick={() => setProfileOpen(false)} icon={<ShoppingBag className="w-3.5 h-3.5" style={{ color: "var(--gold-soft)" }} />} label="My Orders" />
                            <ProfileLink href="/dashboard?tab=wishlist" onClick={() => setProfileOpen(false)} icon={<Heart className="w-3.5 h-3.5" style={{ color: "#e0897a" }} />} label="Wishlist" />
                          </>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="py-2" style={{ borderTop: "1px solid var(--border)" }}>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition"
                          style={{ color: "#e0897a" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(224,137,122,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(224,137,122,0.12)" }}>
                            <LogOut className="w-3.5 h-3.5" style={{ color: "#e0897a" }} />
                          </div>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <Link href="/login" className="text-sm font-medium px-3 py-2 rounded-lg transition" style={{ color: "var(--muted)" }}>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm px-4 py-2 rounded-lg font-medium transition"
                    style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)", color: "#0c0b09" }}
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-[38px] h-[38px] rounded-lg flex items-center justify-center"
                style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden py-4 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--dim)" }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search books or gadgets..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                </div>
              </form>

              <MobileLink href="/" onClick={() => setMenuOpen(false)} active={isActive("/")}>Home</MobileLink>
              <MobileLink href="/products" onClick={() => setMenuOpen(false)} active={pathname.startsWith("/products")}>Shop</MobileLink>
              <MobileLink href="/about" onClick={() => setMenuOpen(false)}>About</MobileLink>
              <MobileLink href="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileLink>

              {isAuthenticated ? (
                <div className="pt-3 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3 mb-3 px-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ background: "linear-gradient(135deg, var(--gold), #b8921f)", color: "#0c0b09" }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{user?.name}</p>
                      <p className="text-xs" style={{ color: "var(--dim)" }}>{user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}</p>
                    </div>
                  </div>

                  {user?.role === "ADMIN" ? (
                    <>
                      <MobileIconLink href="/admin" onClick={() => setMenuOpen(false)} icon={<LayoutDashboard className="w-4 h-4" style={{ color: "var(--gold)" }} />}>Admin Dashboard</MobileIconLink>
                      <MobileIconLink href="/admin?tab=orders" onClick={() => setMenuOpen(false)} icon={<ShoppingBag className="w-4 h-4" style={{ color: "var(--gold-soft)" }} />}>Manage Orders</MobileIconLink>
                    </>
                  ) : (
                    <>
                      <MobileIconLink href="/dashboard" onClick={() => setMenuOpen(false)} icon={<LayoutDashboard className="w-4 h-4" style={{ color: "var(--gold)" }} />}>Dashboard</MobileIconLink>
                      <MobileIconLink href="/dashboard?tab=orders" onClick={() => setMenuOpen(false)} icon={<ShoppingBag className="w-4 h-4" style={{ color: "var(--gold-soft)" }} />}>My Orders</MobileIconLink>
                      <MobileIconLink href="/dashboard?tab=wishlist" onClick={() => setMenuOpen(false)} icon={<Heart className="w-4 h-4" style={{ color: "#e0897a" }} />}>Wishlist</MobileIconLink>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl w-full mt-1"
                    style={{ color: "#e0897a" }}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-2 flex gap-2 px-1" style={{ borderTop: "1px solid var(--border)" }}>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl"
                    style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-sm py-2.5 rounded-xl font-medium"
                    style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)", color: "#0c0b09" }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

function ProfileLink({ href, onClick, icon, label }: { href: string; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm transition"
      style={{ color: "var(--muted)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,162,39,0.1)" }}>
        {icon}
      </div>
      {label}
    </Link>
  );
}

function MobileLink({ href, onClick, active, children }: { href: string; onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl"
      style={{
        color: active ? "var(--gold)" : "var(--muted)",
        background: active ? "rgba(201,162,39,0.08)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}

function MobileIconLink({ href, onClick, icon, children }: { href: string; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 text-sm py-2.5 px-3 rounded-xl" style={{ color: "var(--muted)" }}>
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