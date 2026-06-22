"use client";

import { useState } from "react";
import {
  ShoppingBag, Heart, MapPin, User, Package,
  Star, ChevronRight, LogOut, Settings,
  CheckCircle, Clock, Truck, XCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useMyOrders, useWishlist } from "@/lib/hooks";
import toast from "react-hot-toast";
import Link from "next/link";
import ProfileTab from "./ProfileTab";

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "profile";

const statusConfig = {
  PENDING: { label: "Pending", icon: <Clock className="w-3 h-3" />, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  CONFIRMED: { label: "Confirmed", icon: <CheckCircle className="w-3 h-3" />, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
  SHIPPED: { label: "Shipped", icon: <Truck className="w-3 h-3" />, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
  DELIVERED: { label: "Delivered", icon: <CheckCircle className="w-3 h-3" />, color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" },
  CANCELLED: { label: "Cancelled", icon: <XCircle className="w-3 h-3" />, color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
};

const tabs = [
  { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
  { id: "orders", label: "My Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
  { id: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
  { id: "profile", label: "Profile", icon: <Settings className="w-4 h-4" /> },
];

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-4">👤</div>
            <h2 className="font-bold text-lg">{user?.name || "Student"}</h2>
            <p className="text-blue-200 text-sm">{user?.email}</p>
            <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <Star className="w-4 h-4 text-amber-300 fill-current" />
              <span className="text-sm">Premium Member</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Orders", value: orders?.length || 0, icon: "📦" },
              { label: "Wishlist", value: wishlist?.length || 0, icon: "❤️" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition border-b border-[var(--border)] last:border-0 ${activeTab === tab.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-[var(--muted)]"}`}
              >
                {tab.icon}
                {tab.label}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3">

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </h1>

              {/* Recent Orders */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                </div>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-[var(--muted)] rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : orders?.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-6">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders?.slice(0, 3).map((order: any) => {
                      const status = statusConfig[order.status as keyof typeof statusConfig];
                      return (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{order.id}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {order.items?.[0]?.productName}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${status?.color}`}>
                              {status?.icon} {status?.label}
                            </span>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">৳{order.finalAmount}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Wishlist Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 dark:text-white">Wishlist</h2>
                  <button onClick={() => setActiveTab("wishlist")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                </div>
                {wishlistLoading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-[var(--muted)] rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : wishlist?.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-6">No items in wishlist.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {wishlist?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl">
                        <span className="text-2xl">{item.images?.[0] || "📚"}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">৳{item.discountPrice || item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>My Orders</h1>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-[var(--muted)] rounded-2xl animate-pulse" />)}
                </div>
              ) : orders?.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-6xl mb-4 block">📦</span>
                  <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
                  <Link href="/products" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders?.map((order: any) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig];
                    return (
                      <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium ${status?.color}`}>
                            {status?.icon} {status?.label}
                          </span>
                        </div>
                        <div className="bg-[var(--muted)] rounded-xl p-3 mb-3">
                          {order.items?.map((item: any) => (
                            <p key={item.id} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                              <Package className="w-3 h-3" /> {item.productName} x{item.quantity}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{order.finalAmount}</span>
                          <Link href={`/orders/${order.id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
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

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>My Wishlist</h1>
              {wishlistLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-[var(--muted)] rounded-2xl animate-pulse" />)}
                </div>
              ) : wishlist?.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-6xl mb-4 block">❤️</span>
                  <p className="text-gray-500 dark:text-gray-400">No items in wishlist.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist?.map((item: any) => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-xl h-32 flex items-center justify-center text-5xl mb-3">
                        {item.images?.[0] || "📚"}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-blue-600 dark:text-blue-400">৳{item.discountPrice || item.price}</span>
                        {item.discountPrice && <span className="text-xs text-gray-400 line-through">৳{item.price}</span>}
                      </div>
                      <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Profile Tab */}
{activeTab === "profile" && (
  <ProfileTab user={user} />
)}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>My Addresses</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-500 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium px-2 py-1 rounded-lg">Default</span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dhaka, Bangladesh</p>
                </div>
                <button className="bg-[var(--muted)] rounded-2xl border-2 border-dashed border-[var(--border)] p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-400 transition">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Add New Address</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}