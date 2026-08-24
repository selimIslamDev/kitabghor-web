"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Package,
  Star,
  ChevronRight,
  Settings,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Menu,
  X,
  Trash2,
  Bell,
  ShieldCheck,
  RotateCcw,
  Headset,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useSearchParams } from "next/navigation";
import {
  useMyOrders,
  useWishlist,
  useCartWithAuth,
  useRemoveFromWishlist,
} from "@/lib/hooks";
import toast from "react-hot-toast";
import Link from "next/link";
import ProfileTab from "./ProfileTab";

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "profile";

const VALID_TABS: Tab[] = [
  "overview",
  "orders",
  "wishlist",
  "addresses",
  "profile",
];

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: <Clock className="w-3 h-3" />,
    color: "bg-amber-500/15 text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: <CheckCircle className="w-3 h-3" />,
    color: "bg-sky-500/15 text-sky-400",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck className="w-3 h-3" />,
    color: "bg-violet-500/15 text-violet-400",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <CheckCircle className="w-3 h-3" />,
    color: "bg-emerald-500/15 text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="w-3 h-3" />,
    color: "bg-rose-500/15 text-rose-400",
  },
};

const tabs = [
  { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
  {
    id: "orders",
    label: "My Orders",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
  { id: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
  { id: "profile", label: "Profile", icon: <Settings className="w-4 h-4" /> },
];

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
}

interface Order {
  id: string;
  status: keyof typeof statusConfig;
  finalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  stock?: number;
  author?: string;
  subject?: string;
  classLevel?: string;
}

function getTabFromParams(searchParams: URLSearchParams | null): Tab {
  const tabParam = searchParams?.get("tab") as Tab | null;
  return tabParam && VALID_TABS.includes(tabParam) ? tabParam : "overview";
}

/**
 * Outer wrapper: reads the URL and re-mounts <DashboardClientInner> (via `key`)
 * whenever the `?tab=` param changes to a different value.
 */
export default function DashboardClient() {
  const searchParams = useSearchParams();
  const tabFromUrl = getTabFromParams(searchParams);

  return <DashboardClientInner key={tabFromUrl} initialTab={tabFromUrl} />;
}

function DashboardClientInner({ initialTab }: { initialTab: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const { addItem } = useCartWithAuth();

  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

  // Real backend-backed removal — invalidates the wishlist query on success
  // so the UI stays in sync with the server (see lib/hooks.ts).
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const visibleWishlist = (wishlist as WishlistItem[]) || [];

  // useRemoveFromWishlist (lib/hooks/useWishlist.ts) already shows its own
  // success/error toast and invalidates the ["wishlist"] query — no need to
  // duplicate that here.
  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlistMutation.mutate(id);
  };

  const handleClearWishlist = () => {
    if (!visibleWishlist.length) return;
    // Fire sequentially so we don't spam the wishlist endpoint / toasts all at once.
    visibleWishlist.reduce(
      (chain, item) =>
        chain.then(() => removeFromWishlistMutation.mutateAsync(item.id)),
      Promise.resolve(),
    );
  };

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0c10]">
      <div className="flex min-h-screen bg-[#0a0c10] overflow-hidden max-w-7xl mx-auto font-sans text-slate-200">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-600/10 blur-[100px]" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-600/10 blur-[90px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-emerald-600/8 blur-[80px]" />
        </div>

        {/* Sidebar - sticky on desktop */}
        <aside
          className={`
    fixed inset-y-0 left-0 z-50
    w-[260px]
    flex flex-col
    transition-transform duration-300 ease-out
    will-change-transform

    bg-[#0f1218]/90 backdrop-blur-2xl
    shadow-[0_0_40px_rgba(0,0,0,0.4)]

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

    lg:sticky
    lg:top-0
    lg:h-screen
    lg:translate-x-0
  `}
        >
          {/* User card */}
          <div className="relative overflow-hidden mx-3 mt-3 mb-2 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 p-4 text-white shadow-lg shadow-sky-900/40">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-blue-400/20 blur-xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shrink-0 shadow-inner">
                👤
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate tracking-tight">
                  {user?.name || "Student"}
                </p>
                <p className="text-sky-100/80 text-[11px] truncate">
                  {user?.email}
                </p>
              </div>
              <button
  onClick={() => setSidebarOpen(false)}
  className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
>
  <X className="w-4 h-4" />
</button>
            </div>
            <div className="relative mt-3 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-2.5 py-1">
              <Star className="w-3 h-3 text-amber-300 fill-current" />
              <span className="text-[10px] font-medium tracking-wide">
                Premium Member
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 px-3 mb-2">
            {[
              { label: "Orders", value: orders?.length || 0, icon: "📦" },
              {
                label: "Wishlist",
                value: visibleWishlist.length || 0,
                icon: "❤️",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/[0.03] p-2.5 text-center hover:bg-white/[0.05] transition"
              >
                <div className="text-base mb-0.5">{stat.icon}</div>
                <div className="text-sm font-semibold text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id as Tab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-sky-500/20 text-sky-300 shadow-[0_0_20px_rgba(14,165,233,0.15)]"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <span
                    className={isActive ? "text-sky-400" : "text-slate-500"}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ml-auto transition ${
                      isActive ? "text-sky-400/70" : "text-slate-600"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 z-40 lg:hidden transition-all duration-300
          ${
            sidebarOpen
              ? "bg-black/60 backdrop-blur-sm opacity-100 pointer-events-auto"
              : "bg-transparent opacity-0 pointer-events-none"
          }`}
          aria-hidden={!sidebarOpen}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10 min-w-0">
          {/* Mobile header */}
          <header className="lg:hidden bg-[#0f1218]/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {tabs.find((t) => t.id === activeTab)?.label}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.name}
              </p>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div className="space-y-5 sm:space-y-6 max-w-5xl">
                <div>
                  <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
                    Welcome back, {user?.name?.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5">
                    Here&apos;s what&apos;s happening with your account
                  </p>
                </div>

                {/* Recent Orders card */}
                <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-white text-[15px]">
                      Recent Orders
                    </h2>
                    <button
                      onClick={() => switchTab("orders")}
                      className="text-[13px] font-medium text-sky-400 hover:text-sky-300 transition cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  {ordersLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 rounded-xl bg-white/[0.04] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : !orders?.length ? (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                        <Package className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-sm text-slate-500">No orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(orders as Order[])?.slice(0, 3).map((order) => {
                        const status = statusConfig[order.status];
                        return (
                          <div
                            key={order.id}
                            className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-slate-200 text-sm truncate">
                                {order.id.slice(0, 16)}...
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                {order.items?.[0]?.productName}
                                {order.items?.length > 1
                                  ? ` +${order.items.length - 1} more`
                                  : ""}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${status?.color}`}
                              >
                                {status?.icon} {status?.label}
                              </span>
                              <p className="text-sm font-semibold text-sky-400 mt-1">
                                ৳{order.finalAmount}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Wishlist preview card */}
                <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-white text-[15px]">
                      Wishlist
                    </h2>
                    <button
                      onClick={() => switchTab("wishlist")}
                      className="text-[13px] font-medium text-sky-400 hover:text-sky-300 transition cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  {wishlistLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 rounded-xl bg-white/[0.04] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : !visibleWishlist.length ? (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-sm text-slate-500">
                        No items in wishlist.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {visibleWishlist.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center overflow-hidden shrink-0">
                            {item.images?.[0] &&
                            item.images[0].startsWith("http") ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl">
                                {item.images?.[0] || "📚"}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-sky-400 font-semibold mt-0.5">
                              ৳{item.discountPrice || item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Orders ── */}
            {activeTab === "orders" && (
              <div className="space-y-5 sm:space-y-6 max-w-5xl">
                <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
                  My Orders
                </h1>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 rounded-2xl bg-[#12151c]/60 animate-pulse"
                      />
                    ))}
                  </div>
                ) : !orders?.length ? (
                  <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] text-center py-16 sm:py-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-500 mb-5 font-medium">
                      No orders yet.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold transition"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(orders as Order[])?.map((order) => {
                      const status = statusConfig[order.status];
                      return (
                        <div
                          key={order.id}
                          className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <p className="font-semibold text-white text-sm">
                                {order.id.slice(0, 16)}...
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-BD",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold self-start sm:self-auto ${status?.color}`}
                            >
                              {status?.icon} {status?.label}
                            </span>
                          </div>
                          <div className="rounded-xl bg-white/[0.03] p-3.5 mb-4 space-y-1.5">
                            {order.items?.map((item) => (
                              <p
                                key={item.id}
                                className="text-sm text-slate-400 flex items-center gap-2"
                              >
                                <Package className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                <span className="truncate">
                                  {item.productName} ×{item.quantity}
                                </span>
                              </p>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-sky-400">
                              ৳{order.finalAmount}
                            </span>
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-[13px] text-sky-400 hover:text-sky-300 font-medium transition"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Wishlist ── */}
            {activeTab === "wishlist" && (
              <div className="space-y-5 sm:space-y-6 max-w-5xl">
                <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="flex items-center gap-2.5 text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
                      My Wishlist
                      <Heart className="w-6 h-6 text-violet-400" />
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {visibleWishlist.length} item
                      {visibleWishlist.length === 1 ? "" : "s"} saved in your
                      wishlist
                    </p>
                  </div>
                  {visibleWishlist.length > 0 && (
                    <button
                      onClick={handleClearWishlist}
                      disabled={removeFromWishlistMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Wishlist
                    </button>
                  )}
                </div>

                {wishlistLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-40 rounded-2xl bg-[#12151c]/60 animate-pulse"
                      />
                    ))}
                  </div>
                ) : visibleWishlist.length === 0 ? (
                  <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] text-center py-16 sm:py-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-500 font-medium">
                      No items in wishlist.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visibleWishlist.map((item) => {
                      const activePrice = item.discountPrice || item.price;
                      const discountPercent = item.discountPrice
                        ? Math.round(
                            ((item.price - item.discountPrice) / item.price) *
                              100,
                          )
                        : 0;
                      const badgeLabel =
                        item.subject || item.classLevel || "Book";
                      const subtitle = item.author
                        ? item.author
                        : [item.subject, item.classLevel]
                            .filter(Boolean)
                            .join(" • ") || "Available at KitabGhor";

                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5 flex flex-col sm:flex-row gap-5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition"
                        >
                          {/* Image */}
                          <Link
                            href={`/products/${item.id}`}
                            className="w-full sm:w-44 h-36 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-sky-950/60 to-blue-950/40 flex items-center justify-center"
                          >
                            {item.images?.[0] &&
                            item.images[0].startsWith("http") ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-5xl">
                                {item.images?.[0] || "📚"}
                              </span>
                            )}
                          </Link>

                          {/* Info + Price + Actions */}
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${item.id}`}>
                                <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1 hover:text-sky-300 transition">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-slate-500 mb-2 line-clamp-1">
                                {subtitle}
                              </p>
                              <span className="inline-block text-xs font-medium text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg">
                                {badgeLabel}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 sm:px-4">
                              <span className="text-2xl font-bold text-sky-400">
                                ৳{activePrice}
                              </span>
                              {item.discountPrice ? (
                                <div className="flex flex-col items-start gap-1">
                                  <span className="text-sm text-slate-600 line-through">
                                    ৳{item.price}
                                  </span>
                                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    {discountPercent}% OFF
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            <div className="hidden sm:block w-px h-16 bg-white/[0.06]" />

                            <div className="flex sm:flex-col items-end gap-3 shrink-0">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleRemoveFromWishlist(item.id)
                                  }
                                  disabled={
                                    removeFromWishlistMutation.isPending
                                  }
                                  aria-label="Remove from wishlist"
                                  className="w-9 h-9 rounded-lg flex items-center justify-center text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {item.stock ? (
                                <button
                                  onClick={() => {
                                    const success = addItem({
                                      id: item.id,
                                      name: item.name,
                                      price: item.price,
                                      discountPrice: item.discountPrice,
                                      image: item.images?.[0] || "📚",
                                      stock: item.stock ?? 0,
                                    });
                                    if (success)
                                      toast.success(
                                        `${item.name} added to cart!`,
                                      );
                                  }}
                                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition cursor-pointer whitespace-nowrap"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  Add to Cart
                                </button>
                              ) : (
                                <div className="flex flex-col items-end gap-1.5">
                                  <span className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] whitespace-nowrap">
                                    Out of Stock
                                  </span>
                                  <button className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition cursor-pointer">
                                    <Bell className="w-3 h-3" />
                                    Notify me when available
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Trust badges */}
                {visibleWishlist.length > 0 && (
                  <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      {
                        icon: ShieldCheck,
                        color: "sky",
                        title: "Safe & Secure",
                        desc: "Your data is protected",
                      },
                      {
                        icon: RotateCcw,
                        color: "violet",
                        title: "Easy Returns",
                        desc: "7 days return policy",
                      },
                      {
                        icon: Headset,
                        color: "amber",
                        title: "24/7 Support",
                        desc: "We're here to help",
                      },
                    ].map((f) => (
                      <div key={f.title} className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                            f.color === "sky"
                              ? "bg-sky-500/15"
                              : f.color === "violet"
                                ? "bg-violet-500/15"
                                : "bg-amber-500/15"
                          }`}
                        >
                          <f.icon
                            className={`w-5 h-5 ${
                              f.color === "sky"
                                ? "text-sky-400"
                                : f.color === "violet"
                                  ? "text-violet-400"
                                  : "text-amber-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {f.title}
                          </p>
                          <p className="text-xs text-slate-500">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Profile ── */}
            {activeTab === "profile" && (
              <div className="max-w-5xl">
                <ProfileTab user={user} />
              </div>
            )}

            {/* ── Addresses ── */}
            {activeTab === "addresses" && (
              <div className="space-y-5 sm:space-y-6 max-w-5xl">
                <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
                  My Addresses
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold bg-sky-500/15 text-sky-400 px-2.5 py-1 rounded-lg">
                        Default
                      </span>
                      <button className="text-xs font-medium text-sky-400 hover:text-sky-300 transition cursor-pointer">
                        Edit
                      </button>
                    </div>
                    <p className="font-semibold text-white mb-1">
                      {user?.name}
                    </p>
                    <p className="text-sm text-slate-500">Dhaka, Bangladesh</p>
                  </div>
                  <button className="rounded-2xl bg-[#12151c]/50 backdrop-blur-xl p-5 flex flex-col items-center justify-center gap-2.5 hover:bg-sky-500/5 transition min-h-[120px] cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-sky-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-400">
                      Add New Address
                    </span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import {
//   ShoppingBag, Heart, MapPin, User, Package,
//   Star, ChevronRight, LogOut, Settings,
//   CheckCircle, Clock, Truck, XCircle, Menu, X,
// } from "lucide-react";
// import { useAuthStore } from "@/store/auth.store";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useMyOrders, useWishlist, useCartWithAuth } from "@/lib/hooks";
// import toast from "react-hot-toast";
// import Link from "next/link";
// import ProfileTab from "./ProfileTab";

// type Tab = "overview" | "orders" | "wishlist" | "addresses" | "profile";

// const VALID_TABS: Tab[] = ["overview", "orders", "wishlist", "addresses", "profile"];

// const statusConfig = {
//   PENDING: {
//     label: "Pending",
//     icon: <Clock className="w-3 h-3" />,
//     color: "bg-amber-500/15 text-amber-400",
//   },
//   CONFIRMED: {
//     label: "Confirmed",
//     icon: <CheckCircle className="w-3 h-3" />,
//     color: "bg-sky-500/15 text-sky-400",
//   },
//   SHIPPED: {
//     label: "Shipped",
//     icon: <Truck className="w-3 h-3" />,
//     color: "bg-violet-500/15 text-violet-400",
//   },
//   DELIVERED: {
//     label: "Delivered",
//     icon: <CheckCircle className="w-3 h-3" />,
//     color: "bg-emerald-500/15 text-emerald-400",
//   },
//   CANCELLED: {
//     label: "Cancelled",
//     icon: <XCircle className="w-3 h-3" />,
//     color: "bg-rose-500/15 text-rose-400",
//   },
// };

// const tabs = [
//   { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
//   { id: "orders", label: "My Orders", icon: <ShoppingBag className="w-4 h-4" /> },
//   { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
//   { id: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
//   { id: "profile", label: "Profile", icon: <Settings className="w-4 h-4" /> },
// ];

// interface OrderItem {
//   id: string;
//   productName: string;
//   quantity: number;
// }

// interface Order {
//   id: string;
//   status: keyof typeof statusConfig;
//   finalAmount: number;
//   createdAt: string;
//   items: OrderItem[];
// }

// interface WishlistItem {
//   id: string;
//   name: string;
//   price: number;
//   discountPrice?: number;
//   images?: string[];
//   stock?: number;
// }

// function getTabFromParams(searchParams: URLSearchParams | null): Tab {
//   const tabParam = searchParams?.get("tab") as Tab | null;
//   return tabParam && VALID_TABS.includes(tabParam) ? tabParam : "overview";
// }

// /**
//  * Outer wrapper: reads the URL and re-mounts <DashboardClientInner> (via `key`)
//  * whenever the `?tab=` param changes to a different value.
//  */
// export default function DashboardClient() {
//   const searchParams = useSearchParams();
//   const tabFromUrl = getTabFromParams(searchParams);

//   return <DashboardClientInner key={tabFromUrl} initialTab={tabFromUrl} />;
// }

// function DashboardClientInner({ initialTab }: { initialTab: Tab }) {
//   const [activeTab, setActiveTab] = useState<Tab>(initialTab);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user, logout } = useAuthStore();
//   const router = useRouter();
//   const { addItem } = useCartWithAuth();

//   const { data: orders, isLoading: ordersLoading } = useMyOrders();
//   const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

//   // Lock body scroll when mobile sidebar is open
//   useEffect(() => {
//     if (sidebarOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [sidebarOpen]);

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully!");
//     router.push("/");
//   };

//   const switchTab = (tab: Tab) => {
//     setActiveTab(tab);
//     setSidebarOpen(false);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#0a0c10]">
//     <div className="flex min-h-screen bg-[#0a0c10] overflow-hidden max-w-7xl mx-auto font-sans text-slate-200">
//       {/* Ambient glow orbs */}
//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-600/10 blur-[100px]" />
//         <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-600/10 blur-[90px]" />
//         <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-emerald-600/8 blur-[80px]" />
//       </div>

//       {/* Sidebar - sticky on desktop */}
//       <aside
//         className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-[260px] flex flex-col
//         transition-transform duration-300 ease-out will-change-transform
//         bg-[#0f1218]/90 backdrop-blur-2xl
//         shadow-[0_0_40px_rgba(0,0,0,0.4)]
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       >
//         {/* User card */}
//         <div className="relative overflow-hidden mx-3 mt-3 mb-2 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 p-4 text-white shadow-lg shadow-sky-900/40">
//           <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
//           <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-blue-400/20 blur-xl" />
//           <div className="relative flex items-center gap-3">
//             <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shrink-0 shadow-inner">
//               👤
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="font-semibold text-sm truncate tracking-tight">{user?.name || "Student"}</p>
//               <p className="text-sky-100/80 text-[11px] truncate">{user?.email}</p>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="relative mt-3 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-2.5 py-1">
//             <Star className="w-3 h-3 text-amber-300 fill-current" />
//             <span className="text-[10px] font-medium tracking-wide">Premium Member</span>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-2 px-3 mb-2">
//           {[
//             { label: "Orders", value: orders?.length || 0, icon: "📦" },
//             { label: "Wishlist", value: wishlist?.length || 0, icon: "❤️" },
//           ].map((stat) => (
//             <div
//               key={stat.label}
//               className="rounded-xl bg-white/[0.03] p-2.5 text-center hover:bg-white/[0.05] transition"
//             >
//               <div className="text-base mb-0.5">{stat.icon}</div>
//               <div className="text-sm font-semibold text-white">{stat.value}</div>
//               <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.id;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => switchTab(tab.id as Tab)}
//                 className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer
//                   ${
//                     isActive
//                       ? "bg-sky-500/20 text-sky-300 shadow-[0_0_20px_rgba(14,165,233,0.15)]"
//                       : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
//                   }`}
//               >
//                 <span className={isActive ? "text-sky-400" : "text-slate-500"}>{tab.icon}</span>
//                 {tab.label}
//                 <ChevronRight
//                   className={`w-3.5 h-3.5 ml-auto transition ${
//                     isActive ? "text-sky-400/70" : "text-slate-600"
//                   }`}
//                 />
//               </button>
//             );
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="px-3 py-3">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Mobile overlay */}
//       <div
//         onClick={() => setSidebarOpen(false)}
//         className={`fixed inset-0 z-40 lg:hidden transition-all duration-300
//           ${sidebarOpen
//             ? "bg-black/60 backdrop-blur-sm opacity-100 pointer-events-auto"
//             : "bg-transparent opacity-0 pointer-events-none"
//           }`}
//         aria-hidden={!sidebarOpen}
//       />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden relative z-10 min-w-0">
//         {/* Mobile header */}
//         <header className="lg:hidden bg-[#0f1218]/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
//           >
//             <Menu className="w-5 h-5" />
//           </button>
//           <div className="min-w-0">
//             <p className="text-sm font-semibold text-white truncate">
//               {tabs.find((t) => t.id === activeTab)?.label}
//             </p>
//             <p className="text-[11px] text-slate-500 truncate">{user?.name}</p>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">
//           {/* ── Overview ── */}
//           {activeTab === "overview" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <div>
//                 <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
//                   Welcome back, {user?.name?.split(" ")[0]}! 👋
//                 </h1>
//                 <p className="text-slate-500 text-sm mt-0.5">
//                   Here&apos;s what&apos;s happening with your account
//                 </p>
//               </div>

//               {/* Recent Orders card */}
//               <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5 sm:p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="font-semibold text-white text-[15px]">Recent Orders</h2>
//                   <button
//                     onClick={() => switchTab("orders")}
//                     className="text-[13px] font-medium text-sky-400 hover:text-sky-300 transition cursor-pointer"
//                   >
//                     View All
//                   </button>
//                 </div>
//                 {ordersLoading ? (
//                   <div className="space-y-3">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
//                     ))}
//                   </div>
//                 ) : !orders?.length ? (
//                   <div className="text-center py-10">
//                     <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
//                       <Package className="w-6 h-6 text-slate-500" />
//                     </div>
//                     <p className="text-sm text-slate-500">No orders yet.</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {(orders as Order[])?.slice(0, 3).map((order) => {
//                       const status = statusConfig[order.status];
//                       return (
//                         <div
//                           key={order.id}
//                           className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition"
//                         >
//                           <div className="min-w-0">
//                             <p className="font-medium text-slate-200 text-sm truncate">
//                               {order.id.slice(0, 16)}...
//                             </p>
//                             <p className="text-xs text-slate-500 mt-0.5 truncate">
//                               {order.items?.[0]?.productName}
//                               {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
//                             </p>
//                           </div>
//                           <div className="text-right shrink-0">
//                             <span
//                               className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${status?.color}`}
//                             >
//                               {status?.icon} {status?.label}
//                             </span>
//                             <p className="text-sm font-semibold text-sky-400 mt-1">
//                               ৳{order.finalAmount}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Wishlist preview card */}
//               <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5 sm:p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="font-semibold text-white text-[15px]">Wishlist</h2>
//                   <button
//                     onClick={() => switchTab("wishlist")}
//                     className="text-[13px] font-medium text-sky-400 hover:text-sky-300 transition cursor-pointer"
//                   >
//                     View All
//                   </button>
//                 </div>
//                 {wishlistLoading ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
//                     ))}
//                   </div>
//                 ) : !wishlist?.length ? (
//                   <div className="text-center py-10">
//                     <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
//                       <Heart className="w-6 h-6 text-slate-500" />
//                     </div>
//                     <p className="text-sm text-slate-500">No items in wishlist.</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     {(wishlist as WishlistItem[])?.slice(0, 3).map((item) => (
//                       <div
//                         key={item.id}
//                         className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]"
//                       >
//                         <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center overflow-hidden shrink-0">
//                           {item.images?.[0] && item.images[0].startsWith("http") ? (
//                             <img
//                               src={item.images[0]}
//                               alt={item.name}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <span className="text-xl">{item.images?.[0] || "📚"}</span>
//                           )}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
//                           <p className="text-xs text-sky-400 font-semibold mt-0.5">
//                             ৳{item.discountPrice || item.price}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ── Orders ── */}
//           {activeTab === "orders" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
//                 My Orders
//               </h1>
//               {ordersLoading ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, i) => (
//                     <div key={i} className="h-32 rounded-2xl bg-[#12151c]/60 animate-pulse" />
//                   ))}
//                 </div>
//               ) : !orders?.length ? (
//                 <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] text-center py-16 sm:py-20">
//                   <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
//                     <Package className="w-8 h-8 text-slate-500" />
//                   </div>
//                   <p className="text-slate-500 mb-5 font-medium">No orders yet.</p>
//                   <Link
//                     href="/products"
//                     className="inline-flex px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition shadow-lg shadow-sky-500/20"
//                   >
//                     Start Shopping
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {(orders as Order[])?.map((order) => {
//                     const status = statusConfig[order.status];
//                     return (
//                       <div
//                         key={order.id}
//                         className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition"
//                       >
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//                           <div>
//                             <p className="font-semibold text-white text-sm">
//                               {order.id.slice(0, 16)}...
//                             </p>
//                             <p className="text-xs text-slate-500 mt-0.5">
//                               {new Date(order.createdAt).toLocaleDateString("en-BD", {
//                                 year: "numeric",
//                                 month: "short",
//                                 day: "numeric",
//                               })}
//                             </p>
//                           </div>
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold self-start sm:self-auto ${status?.color}`}
//                           >
//                             {status?.icon} {status?.label}
//                           </span>
//                         </div>
//                         <div className="rounded-xl bg-white/[0.03] p-3.5 mb-4 space-y-1.5">
//                           {order.items?.map((item) => (
//                             <p
//                               key={item.id}
//                               className="text-sm text-slate-400 flex items-center gap-2"
//                             >
//                               <Package className="w-3.5 h-3.5 text-slate-600 shrink-0" />
//                               <span className="truncate">
//                                 {item.productName} ×{item.quantity}
//                               </span>
//                             </p>
//                           ))}
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-lg font-semibold text-sky-400">
//                             ৳{order.finalAmount}
//                           </span>
//                           <Link
//                             href={`/orders/${order.id}`}
//                             className="text-[13px] text-sky-400 hover:text-sky-300 font-medium transition"
//                           >
//                             View Details →
//                           </Link>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── Wishlist ── */}
//           {activeTab === "wishlist" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
//                 My Wishlist
//               </h1>
//               {wishlistLoading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {[...Array(3)].map((_, i) => (
//                     <div key={i} className="h-52 rounded-2xl bg-[#12151c]/60 animate-pulse" />
//                   ))}
//                 </div>
//               ) : !wishlist?.length ? (
//                 <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] text-center py-16 sm:py-20">
//                   <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
//                     <Heart className="w-8 h-8 text-slate-500" />
//                   </div>
//                   <p className="text-slate-500 font-medium">No items in wishlist.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {(wishlist as WishlistItem[])?.map((item) => (
//                     <div
//                       key={item.id}
//                       className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-4 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition"
//                     >
//                       <Link href={`/products/${item.id}`}>
//                         <div className="rounded-xl bg-gradient-to-br from-sky-950/60 to-blue-950/40 h-32 flex items-center justify-center mb-3 overflow-hidden">
//                           {item.images?.[0] && item.images[0].startsWith("http") ? (
//                             <img
//                               src={item.images[0]}
//                               alt={item.name}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <span className="text-5xl">{item.images?.[0] || "📚"}</span>
//                           )}
//                         </div>
//                         <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
//                           {item.name}
//                         </h3>
//                         <div className="flex items-baseline gap-2 mb-3">
//                           <span className="font-semibold text-sky-400">
//                             ৳{item.discountPrice || item.price}
//                           </span>
//                           {item.discountPrice && (
//                             <span className="text-xs text-slate-600 line-through">
//                               ৳{item.price}
//                             </span>
//                           )}
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => {
//                           if (!item.stock) {
//                             toast.error("This product is out of stock!");
//                             return;
//                           }
//                           const success = addItem({
//                             id: item.id,
//                             name: item.name,
//                             price: item.price,
//                             discountPrice: item.discountPrice,
//                             image: item.images?.[0] || "📚",
//                             stock: item.stock,
//                           });
//                           if (success) toast.success(`${item.name} added to cart!`);
//                         }}
//                         disabled={!item.stock}
//                         className={`w-full py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer
//                           ${
//                             !item.stock
//                               ? "bg-white/[0.04] text-slate-600 cursor-not-allowed"
//                               : "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20"
//                           }`}
//                       >
//                         {!item.stock ? "Out of Stock" : "Add to Cart"}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── Profile ── */}
//           {activeTab === "profile" && (
//             <div className="max-w-5xl">
//               <ProfileTab user={user} />
//             </div>
//           )}

//           {/* ── Addresses ── */}
//           {activeTab === "addresses" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
//                 My Addresses
//               </h1>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="rounded-2xl bg-[#12151c]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] p-5">
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-[11px] font-semibold bg-sky-500/15 text-sky-400 px-2.5 py-1 rounded-lg">
//                       Default
//                     </span>
//                     <button className="text-xs font-medium text-sky-400 hover:text-sky-300 transition cursor-pointer">
//                       Edit
//                     </button>
//                   </div>
//                   <p className="font-semibold text-white mb-1">{user?.name}</p>
//                   <p className="text-sm text-slate-500">Dhaka, Bangladesh</p>
//                 </div>
//                 <button className="rounded-2xl bg-[#12151c]/50 backdrop-blur-xl p-5 flex flex-col items-center justify-center gap-2.5 hover:bg-sky-500/5 transition min-h-[120px] cursor-pointer">
//                   <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
//                     <MapPin className="w-5 h-5 text-sky-400" />
//                   </div>
//                   <span className="text-sm font-medium text-slate-400">Add New Address</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//     </div>
//   );
// }
