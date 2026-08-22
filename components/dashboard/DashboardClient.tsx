"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag, Heart, MapPin, User, Package,
  Star, ChevronRight, LogOut, Settings,
  CheckCircle, Clock, Truck, XCircle, Menu, X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useMyOrders, useWishlist, useCartWithAuth } from "@/lib/hooks";
import toast from "react-hot-toast";
import Link from "next/link";
import ProfileTab from "./ProfileTab";

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "profile";

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: <Clock className="w-3 h-3" />,
    color: "bg-amber-50 text-amber-700 border border-amber-200/60",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: <CheckCircle className="w-3 h-3" />,
    color: "bg-sky-50 text-sky-700 border border-sky-200/60",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck className="w-3 h-3" />,
    color: "bg-violet-50 text-violet-700 border border-violet-200/60",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <CheckCircle className="w-3 h-3" />,
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="w-3 h-3" />,
    color: "bg-rose-50 text-rose-700 border border-rose-200/60",
  },
};

const tabs = [
  { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
  { id: "orders", label: "My Orders", icon: <ShoppingBag className="w-4 h-4" /> },
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
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartWithAuth();

  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

  useEffect(() => {
    const tabParam = searchParams.get("tab") as Tab | null;
    if (tabParam && ["overview", "orders", "wishlist", "addresses", "profile"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] overflow-hidden font-sans">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      {/* Sidebar - Admin style */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col
        transition-transform duration-300 ease-out will-change-transform
        bg-white/80 backdrop-blur-2xl border-r border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="relative overflow-hidden mx-3 mt-3 mb-2 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 text-white shadow-md shadow-sky-500/20">
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center text-xl shrink-0">
              👤
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{user?.name || "Student"}</p>
              <p className="text-sky-100 text-[11px] truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative mt-3 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-2.5 py-1">
            <Star className="w-3 h-3 text-amber-300 fill-current" />
            <span className="text-[10px] font-medium">Premium Member</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-3 mb-2">
          {[
            { label: "Orders", value: orders?.length || 0, icon: "📦" },
            { label: "Wishlist", value: wishlist?.length || 0, icon: "❤️" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/60 border border-slate-200/50 p-2.5 text-center"
            >
              <div className="text-base mb-0.5">{stat.icon}</div>
              <div className="text-sm font-semibold text-slate-800">{stat.value}</div>
              <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm"
                  }`}
              >
                <span className={isActive ? "text-white" : "text-slate-400"}>{tab.icon}</span>
                {tab.label}
                <ChevronRight
                  className={`w-3.5 h-3.5 ml-auto transition ${
                    isActive ? "text-white/70" : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-slate-200/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300
          ${sidebarOpen
            ? "bg-slate-900/30 backdrop-blur-sm opacity-100 pointer-events-auto"
            : "bg-transparent opacity-0 pointer-events-none"
          }`}
        aria-hidden={!sidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10 min-w-0">
        <header className="lg:hidden bg-white/60 backdrop-blur-xl border-b border-white/50 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {tabs.find((t) => t.id === activeTab)?.label}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{user?.name}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "overview" && (
            <div className="space-y-5 sm:space-y-6 max-w-5xl">
              <div>
                <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Here&apos;s what&apos;s happening with your account
                </p>
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-800 text-[15px]">Recent Orders</h2>
                  <button
                    onClick={() => switchTab("orders")}
                    className="text-[13px] font-medium text-sky-600 hover:text-sky-700 transition"
                  >
                    View All
                  </button>
                </div>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 rounded-xl bg-slate-100/80 animate-pulse" />
                    ))}
                  </div>
                ) : !orders?.length ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-slate-400" />
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
                          className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100/80 hover:bg-white transition"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm truncate">
                              {order.id.slice(0, 16)}...
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {order.items?.[0]?.productName}
                              {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${status?.color}`}
                            >
                              {status?.icon} {status?.label}
                            </span>
                            <p className="text-sm font-semibold text-sky-600 mt-1">
                              ৳{order.finalAmount}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-800 text-[15px]">Wishlist</h2>
                  <button
                    onClick={() => switchTab("wishlist")}
                    className="text-[13px] font-medium text-sky-600 hover:text-sky-700 transition"
                  >
                    View All
                  </button>
                </div>
                {wishlistLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 rounded-xl bg-slate-100/80 animate-pulse" />
                    ))}
                  </div>
                ) : !wishlist?.length ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">No items in wishlist.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(wishlist as WishlistItem[])?.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100/80"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100/80 flex items-center justify-center overflow-hidden shrink-0">
                          {item.images?.[0] && item.images[0].startsWith("http") ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">{item.images?.[0] || "📚"}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs text-sky-600 font-semibold mt-0.5">
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

          {activeTab === "orders" && (
            <div className="space-y-5 sm:space-y-6 max-w-5xl">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                My Orders
              </h1>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-white/50 animate-pulse" />
                  ))}
                </div>
              ) : !orders?.length ? (
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center py-16 sm:py-20">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 mb-5 font-medium">No orders yet.</p>
                  <Link
                    href="/products"
                    className="inline-flex px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition shadow-md shadow-sky-500/20"
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
                        className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {order.id.slice(0, 16)}...
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString("en-BD", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold self-start sm:self-auto ${status?.color}`}
                          >
                            {status?.icon} {status?.label}
                          </span>
                        </div>
                        <div className="rounded-xl bg-slate-50/80 border border-slate-100/80 p-3.5 mb-4 space-y-1.5">
                          {order.items?.map((item) => (
                            <p
                              key={item.id}
                              className="text-sm text-slate-600 flex items-center gap-2"
                            >
                              <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">
                                {item.productName} ×{item.quantity}
                              </span>
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-sky-600">
                            ৳{order.finalAmount}
                          </span>
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-[13px] text-sky-600 hover:text-sky-700 font-medium transition"
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

          {activeTab === "wishlist" && (
            <div className="space-y-5 sm:space-y-6 max-w-5xl">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                My Wishlist
              </h1>
              {wishlistLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-52 rounded-2xl bg-white/50 animate-pulse" />
                  ))}
                </div>
              ) : !wishlist?.length ? (
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center py-16 sm:py-20">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No items in wishlist.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(wishlist as WishlistItem[])?.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition"
                    >
                      <Link href={`/products/${item.id}`}>
                        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100/50 h-32 flex items-center justify-center mb-3 overflow-hidden">
                          {item.images?.[0] && item.images[0].startsWith("http") ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-5xl">{item.images?.[0] || "📚"}</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-semibold text-sky-600">
                            ৳{item.discountPrice || item.price}
                          </span>
                          {item.discountPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳{item.price}
                            </span>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          if (!item.stock) {
                            toast.error("This product is out of stock!");
                            return;
                          }
                          const success = addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            discountPrice: item.discountPrice,
                            image: item.images?.[0] || "📚",
                            stock: item.stock,
                          });
                          if (success) toast.success(`${item.name} added to cart!`);
                        }}
                        disabled={!item.stock}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition
                          ${
                            !item.stock
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20"
                          }`}
                      >
                        {!item.stock ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-5xl">
              <ProfileTab user={user} />
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-5 sm:space-y-6 max-w-5xl">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                My Addresses
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border-2 border-sky-400/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200/60 px-2.5 py-1 rounded-lg">
                      Default
                    </span>
                    <button className="text-xs font-medium text-sky-600 hover:text-sky-700 transition">
                      Edit
                    </button>
                  </div>
                  <p className="font-semibold text-slate-800 mb-1">{user?.name}</p>
                  <p className="text-sm text-slate-500">Dhaka, Bangladesh</p>
                </div>
                <button className="rounded-2xl bg-white/50 backdrop-blur-xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-2.5 hover:border-sky-400 hover:bg-sky-50/30 transition min-h-[120px]">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-sky-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Add New Address</span>
                </button>
              </div>
            </div>
          )}
        </main>
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

// const statusConfig = {
//   PENDING: {
//     label: "Pending",
//     icon: <Clock className="w-3 h-3" />,
//     color: "bg-amber-50 text-amber-700 border border-amber-200/60",
//   },
//   CONFIRMED: {
//     label: "Confirmed",
//     icon: <CheckCircle className="w-3 h-3" />,
//     color: "bg-sky-50 text-sky-700 border border-sky-200/60",
//   },
//   SHIPPED: {
//     label: "Shipped",
//     icon: <Truck className="w-3 h-3" />,
//     color: "bg-violet-50 text-violet-700 border border-violet-200/60",
//   },
//   DELIVERED: {
//     label: "Delivered",
//     icon: <CheckCircle className="w-3 h-3" />,
//     color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
//   },
//   CANCELLED: {
//     label: "Cancelled",
//     icon: <XCircle className="w-3 h-3" />,
//     color: "bg-rose-50 text-rose-700 border border-rose-200/60",
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

// export default function DashboardClient() {
//   const [activeTab, setActiveTab] = useState<Tab>("overview");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user, logout } = useAuthStore();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { addItem } = useCartWithAuth();

//   const { data: orders, isLoading: ordersLoading } = useMyOrders();
//   const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

//   useEffect(() => {
//     const tabParam = searchParams.get("tab") as Tab | null;
//     if (tabParam && ["overview", "orders", "wishlist", "addresses", "profile"].includes(tabParam)) {
//       setActiveTab(tabParam);
//     }
//   }, [searchParams]);

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
//     <div className="flex min-h-screen bg-[#f4f6f9] overflow-hidden font-sans">
//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-sky-200/30 blur-3xl" />
//         <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-violet-200/20 blur-3xl" />
//         <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-emerald-200/20 blur-3xl" />
//       </div>

//       {/* Sidebar - Admin style */}
//       <aside
//         className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col
//         transition-transform duration-300 ease-out will-change-transform
//         bg-white/80 backdrop-blur-2xl border-r border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)]
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       >
//         <div className="relative overflow-hidden mx-3 mt-3 mb-2 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 text-white shadow-md shadow-sky-500/20">
//           <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-xl" />
//           <div className="relative flex items-center gap-3">
//             <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center text-xl shrink-0">
//               👤
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="font-semibold text-sm truncate">{user?.name || "Student"}</p>
//               <p className="text-sky-100 text-[11px] truncate">{user?.email}</p>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition shrink-0"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="relative mt-3 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-2.5 py-1">
//             <Star className="w-3 h-3 text-amber-300 fill-current" />
//             <span className="text-[10px] font-medium">Premium Member</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-2 px-3 mb-2">
//           {[
//             { label: "Orders", value: orders?.length || 0, icon: "📦" },
//             { label: "Wishlist", value: wishlist?.length || 0, icon: "❤️" },
//           ].map((stat) => (
//             <div
//               key={stat.label}
//               className="rounded-xl bg-white/60 border border-slate-200/50 p-2.5 text-center"
//             >
//               <div className="text-base mb-0.5">{stat.icon}</div>
//               <div className="text-sm font-semibold text-slate-800">{stat.value}</div>
//               <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
//             </div>
//           ))}
//         </div>

//         <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.id;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => switchTab(tab.id as Tab)}
//                 className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
//                   ${
//                     isActive
//                       ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
//                       : "text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm"
//                   }`}
//               >
//                 <span className={isActive ? "text-white" : "text-slate-400"}>{tab.icon}</span>
//                 {tab.label}
//                 <ChevronRight
//                   className={`w-3.5 h-3.5 ml-auto transition ${
//                     isActive ? "text-white/70" : "text-slate-300"
//                   }`}
//                 />
//               </button>
//             );
//           })}
//         </nav>

//         <div className="px-3 py-3 border-t border-slate-200/60">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Mobile sidebar overlay */}
//       <div
//         onClick={() => setSidebarOpen(false)}
//         className={`fixed inset-0 z-40 lg:hidden transition-all duration-300
//           ${sidebarOpen
//             ? "bg-slate-900/30 backdrop-blur-sm opacity-100 pointer-events-auto"
//             : "bg-transparent opacity-0 pointer-events-none"
//           }`}
//         aria-hidden={!sidebarOpen}
//       />

//       <div className="flex-1 flex flex-col overflow-hidden relative z-10 min-w-0">
//         <header className="lg:hidden bg-white/60 backdrop-blur-xl border-b border-white/50 px-4 py-3 flex items-center gap-3">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 transition"
//           >
//             <Menu className="w-5 h-5" />
//           </button>
//           <div className="min-w-0">
//             <p className="text-sm font-semibold text-slate-800 truncate">
//               {tabs.find((t) => t.id === activeTab)?.label}
//             </p>
//             <p className="text-[11px] text-slate-500 truncate">{user?.name}</p>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">
//           {activeTab === "overview" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <div>
//                 <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                   Welcome back, {user?.name?.split(" ")[0]}! 👋
//                 </h1>
//                 <p className="text-slate-500 text-sm mt-0.5">
//                   Here&apos;s what&apos;s happening with your account
//                 </p>
//               </div>

//               <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="font-semibold text-slate-800 text-[15px]">Recent Orders</h2>
//                   <button
//                     onClick={() => switchTab("orders")}
//                     className="text-[13px] font-medium text-sky-600 hover:text-sky-700 transition"
//                   >
//                     View All
//                   </button>
//                 </div>
//                 {ordersLoading ? (
//                   <div className="space-y-3">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="h-16 rounded-xl bg-slate-100/80 animate-pulse" />
//                     ))}
//                   </div>
//                 ) : !orders?.length ? (
//                   <div className="text-center py-10">
//                     <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
//                       <Package className="w-6 h-6 text-slate-400" />
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
//                           className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100/80 hover:bg-white transition"
//                         >
//                           <div className="min-w-0">
//                             <p className="font-medium text-slate-800 text-sm truncate">
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
//                             <p className="text-sm font-semibold text-sky-600 mt-1">
//                               ৳{order.finalAmount}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="font-semibold text-slate-800 text-[15px]">Wishlist</h2>
//                   <button
//                     onClick={() => switchTab("wishlist")}
//                     className="text-[13px] font-medium text-sky-600 hover:text-sky-700 transition"
//                   >
//                     View All
//                   </button>
//                 </div>
//                 {wishlistLoading ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="h-16 rounded-xl bg-slate-100/80 animate-pulse" />
//                     ))}
//                   </div>
//                 ) : !wishlist?.length ? (
//                   <div className="text-center py-10">
//                     <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
//                       <Heart className="w-6 h-6 text-slate-400" />
//                     </div>
//                     <p className="text-sm text-slate-500">No items in wishlist.</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     {(wishlist as WishlistItem[])?.slice(0, 3).map((item) => (
//                       <div
//                         key={item.id}
//                         className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100/80"
//                       >
//                         <div className="w-10 h-10 rounded-lg bg-white border border-slate-100/80 flex items-center justify-center overflow-hidden shrink-0">
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
//                           <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
//                           <p className="text-xs text-sky-600 font-semibold mt-0.5">
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

//           {activeTab === "orders" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                 My Orders
//               </h1>
//               {ordersLoading ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, i) => (
//                     <div key={i} className="h-32 rounded-2xl bg-white/50 animate-pulse" />
//                   ))}
//                 </div>
//               ) : !orders?.length ? (
//                 <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center py-16 sm:py-20">
//                   <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
//                     <Package className="w-8 h-8 text-slate-400" />
//                   </div>
//                   <p className="text-slate-500 mb-5 font-medium">No orders yet.</p>
//                   <Link
//                     href="/products"
//                     className="inline-flex px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition shadow-md shadow-sky-500/20"
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
//                         className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition"
//                       >
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//                           <div>
//                             <p className="font-semibold text-slate-800 text-sm">
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
//                         <div className="rounded-xl bg-slate-50/80 border border-slate-100/80 p-3.5 mb-4 space-y-1.5">
//                           {order.items?.map((item) => (
//                             <p
//                               key={item.id}
//                               className="text-sm text-slate-600 flex items-center gap-2"
//                             >
//                               <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
//                               <span className="truncate">
//                                 {item.productName} ×{item.quantity}
//                               </span>
//                             </p>
//                           ))}
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-lg font-semibold text-sky-600">
//                             ৳{order.finalAmount}
//                           </span>
//                           <Link
//                             href={`/orders/${order.id}`}
//                             className="text-[13px] text-sky-600 hover:text-sky-700 font-medium transition"
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

//           {activeTab === "wishlist" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                 My Wishlist
//               </h1>
//               {wishlistLoading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {[...Array(3)].map((_, i) => (
//                     <div key={i} className="h-52 rounded-2xl bg-white/50 animate-pulse" />
//                   ))}
//                 </div>
//               ) : !wishlist?.length ? (
//                 <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center py-16 sm:py-20">
//                   <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
//                     <Heart className="w-8 h-8 text-slate-400" />
//                   </div>
//                   <p className="text-slate-500 font-medium">No items in wishlist.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {(wishlist as WishlistItem[])?.map((item) => (
//                     <div
//                       key={item.id}
//                       className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition"
//                     >
//                       <Link href={`/products/${item.id}`}>
//                         <div className="rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100/50 h-32 flex items-center justify-center mb-3 overflow-hidden">
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
//                         <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">
//                           {item.name}
//                         </h3>
//                         <div className="flex items-baseline gap-2 mb-3">
//                           <span className="font-semibold text-sky-600">
//                             ৳{item.discountPrice || item.price}
//                           </span>
//                           {item.discountPrice && (
//                             <span className="text-xs text-slate-400 line-through">
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
//                         className={`w-full py-2.5 rounded-xl text-sm font-semibold transition
//                           ${
//                             !item.stock
//                               ? "bg-slate-100 text-slate-400 cursor-not-allowed"
//                               : "bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20"
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

//           {activeTab === "profile" && (
//             <div className="max-w-5xl">
//               <ProfileTab user={user} />
//             </div>
//           )}

//           {activeTab === "addresses" && (
//             <div className="space-y-5 sm:space-y-6 max-w-5xl">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                 My Addresses
//               </h1>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="rounded-2xl bg-white/70 backdrop-blur-xl border-2 border-sky-400/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5">
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200/60 px-2.5 py-1 rounded-lg">
//                       Default
//                     </span>
//                     <button className="text-xs font-medium text-sky-600 hover:text-sky-700 transition">
//                       Edit
//                     </button>
//                   </div>
//                   <p className="font-semibold text-slate-800 mb-1">{user?.name}</p>
//                   <p className="text-sm text-slate-500">Dhaka, Bangladesh</p>
//                 </div>
//                 <button className="rounded-2xl bg-white/50 backdrop-blur-xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-2.5 hover:border-sky-400 hover:bg-sky-50/30 transition min-h-[120px]">
//                   <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
//                     <MapPin className="w-5 h-5 text-sky-500" />
//                   </div>
//                   <span className="text-sm font-medium text-slate-600">Add New Address</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }