"use client";

import { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, BookOpen, Users,
  BarChart2, LogOut, Menu, X,
  TrendingUp, TrendingDown, AlertCircle,
  Eye, Edit, Trash2,
  Plus, Search, Tag, Package,
  Download, Calendar, RefreshCw, CheckCircle2,
} from "lucide-react";
import AdminNotifications from "./AdminNotifications";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import {
  useAdminDashboard, useAdminOrders, useAdminProducts,
  useAdminUsers, useAdminAnalytics, useUpdateOrderStatus,
  useDeleteProduct,
} from "@/lib/hooks";
import toast from "react-hot-toast";
import ProductModal from "./ProductModal";
import CouponsTab from "./CouponsTab";
import CategoriesTab from "./CategoriesTab";
import BundlesTab from "./BundlesTab";

type Tab = "dashboard" | "orders" | "products" | "users" | "coupons" | "categories" | "analytics" | "bundles";

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  productType: "BOOK" | "GADGET";
  category?: { name: string };
}

interface OrderItem {
  id: string;
}

interface Order {
  id: string;
  user?: { name: string };
  items?: OrderItem[];
  finalAmount: number;
  status: string;
  createdAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count?: { orders: number };
}

interface MonthlySale {
  month: string;
  revenue: number;
}

interface CategoryStat {
  id: string;
  name: string;
  _count?: { products: number };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-50 text-amber-700 border border-amber-200/60" },
  CONFIRMED: { label: "Confirmed", color: "bg-sky-50 text-sky-700 border border-sky-200/60" },
  SHIPPED: { label: "Shipped", color: "bg-violet-50 text-violet-700 border border-violet-200/60" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-50 text-rose-700 border border-rose-200/60" },
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "products", label: "Products", icon: <BookOpen className="w-4 h-4" /> },
  { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
  { id: "coupons", label: "Coupons", icon: <Tag className="w-4 h-4" /> },
  { id: "bundles", label: "Bundles", icon: <Package className="w-4 h-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "categories", label: "Categories", icon: <Tag className="w-4 h-4" /> },
];

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const { data: dashboard, isLoading: dashLoading } = useAdminDashboard();
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders();
  const { data: productsData, isLoading: productsLoading } = useAdminProducts();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers();
  const { data: analytics } = useAdminAnalytics();
  const updateStatus = useUpdateOrderStatus();
  const deleteProduct = useDeleteProduct();

  const orders: Order[] = ordersData?.data || [];
  const products: Product[] = productsData?.data || [];
  const users: AdminUser[] = usersData?.data || [];

  const stats = dashboard ? [
    { label: "Total Revenue", value: `৳${dashboard.stats.totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: "💰", accent: "from-sky-400/20 to-blue-500/10" },
    { label: "Total Orders", value: String(dashboard.stats.totalOrders), change: "+8.2%", up: true, icon: "📦", accent: "from-violet-400/20 to-purple-500/10" },
    { label: "Total Products", value: String(dashboard.stats.totalProducts), change: "+3.1%", up: true, icon: "📚", accent: "from-amber-400/20 to-orange-500/10" },
    { label: "Total Users", value: String(dashboard.stats.totalUsers), change: "+15.3%", up: true, icon: "👥", accent: "from-emerald-400/20 to-teal-500/10" },
  ] : [];

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-[#f4f6f9] overflow-hidden font-sans">
      {/* Soft ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-200/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      {/* Sidebar */}
      {/*
        FIX: On mobile this sidebar is `fixed` and floats ON TOP of the page content,
        so it must be fully opaque there or the dashboard content behind it bleeds
        through the blur/transparency (the "ghosting" bug from the screenshot).
        On desktop (lg:) it sits statically next to the content, so the original
        translucent glass effect is kept.
      */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col transition-transform duration-300 ease-out
        bg-white lg:bg-white/70 backdrop-blur-2xl border-r border-slate-200 lg:border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200/60">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-[15px] tracking-tight">KitabGhor</p>
            <p className="text-[11px] text-slate-500 font-medium">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm"
                  }`}
              >
                <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-slate-200/60">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-slate-200/50 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {user?.name?.[0] || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-800 text-xs font-semibold truncate">{user?.name || "Admin"}</p>
              <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Bar */}
        <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 px-4 sm:px-6 py-3.5 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-slate-200/60 text-slate-800 text-sm
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300
                shadow-sm transition"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="text-[12px] text-slate-500 font-medium hidden md:block">
              {new Date().toLocaleDateString("en-BD", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <AdminNotifications />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 w-full">
              <div>
                <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">Welcome back, {user?.name}!</p>
              </div>

              {dashLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-white/50 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60
                        shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60`} />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl bg-white/80 border border-white/70 flex items-center justify-center text-xl shadow-sm">
                            {stat.icon}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg
                              ${stat.up ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}
                          >
                            {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-2xl font-semibold text-slate-800 tracking-tight">{stat.value}</p>
                        <p className="text-[13px] text-slate-500 mt-0.5">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {dashboard?.lowStockProducts?.length > 0 && (
                <div className="rounded-2xl bg-amber-50/80 backdrop-blur-xl border border-amber-200/50 p-5 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <h2 className="font-semibold text-amber-800 text-[15px]">Low Stock Alert</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dashboard.lowStockProducts.map((p: Product) => (
                      <div
                        key={p.id}
                        className="bg-white/80 rounded-xl border border-amber-100/80 p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                          <p className="text-xs text-rose-500 font-semibold mt-0.5">{p.stock} left</p>
                        </div>
                        <button className="shrink-0 text-xs font-semibold bg-sky-500 text-white px-3 py-1.5 rounded-lg hover:bg-sky-600 transition shadow-sm">
                          Restock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-slate-800 text-[15px]">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-[13px] font-medium text-sky-600 hover:text-sky-700 transition"
                  >
                    View All
                  </button>
                </div>

                {dashLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200/70">
                            {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                              <th
                                key={h}
                                className="text-left py-3 px-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard?.recentOrders?.slice(0, 5).map((order: Order) => (
                            <tr
                              key={order.id}
                              className="border-b border-slate-100/80 hover:bg-white/50 transition"
                            >
                              <td className="py-3.5 px-2 font-medium text-slate-700 text-xs">
                                {order.id.slice(0, 12)}...
                              </td>
                              <td className="py-3.5 px-2 text-slate-600">{order.user?.name}</td>
                              <td className="py-3.5 px-2 font-semibold text-sky-600">
                                ৳{order.finalAmount}
                              </td>
                              <td className="py-3.5 px-2">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusConfig[order.status]?.color}`}
                                >
                                  {statusConfig[order.status]?.label}
                                </span>
                              </td>
                              <td className="py-3.5 px-2 text-slate-500 text-xs">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                      {dashboard?.recentOrders?.slice(0, 5).map((order: Order) => (
                        <div
                          key={order.id}
                          className="rounded-xl bg-white/80 border border-slate-100 p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                              {order.id.slice(0, 12)}...
                            </span>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusConfig[order.status]?.color}`}
                            >
                              {statusConfig[order.status]?.label}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-800">{order.user?.name}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-sky-600">৳{order.finalAmount}</span>
                            <span className="text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6 w-full">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                Orders
              </h1>

              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
                {ordersLoading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50/80">
                          <tr>
                            {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Action"].map(
                              (h) => (
                                <th
                                  key={h}
                                  className="text-left py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                                >
                                  {h}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr
                              key={order.id}
                              className="border-t border-slate-100/80 hover:bg-white/60 transition"
                            >
                              <td className="py-3.5 px-4 font-medium text-slate-700 text-xs">
                                {order.id.slice(0, 12)}...
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">{order.user?.name}</td>
                              <td className="py-3.5 px-4 text-slate-600">{order.items?.length}</td>
                              <td className="py-3.5 px-4 font-semibold text-sky-600">
                                ৳{order.finalAmount}
                              </td>
                              <td className="py-3.5 px-4">
                                <select
                                  defaultValue={order.status}
                                  onChange={(e) =>
                                    updateStatus.mutate({ id: order.id, status: e.target.value })
                                  }
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${statusConfig[order.status]?.color}`}
                                >
                                  {Object.entries(statusConfig).map(([key, val]) => (
                                    <option key={key} value={key}>
                                      {val.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3.5 px-4 text-slate-500 text-xs">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4">
                                <button className="p-2 rounded-xl hover:bg-sky-50 transition">
                                  <Eye className="w-4 h-4 text-sky-600" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile / Tablet cards */}
                    <div className="lg:hidden p-4 space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-xl bg-white/80 border border-slate-100 p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium text-slate-400">
                                {order.id.slice(0, 12)}...
                              </p>
                              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                {order.user?.name}
                              </p>
                            </div>
                            <button className="p-2 rounded-xl hover:bg-sky-50 transition shrink-0">
                              <Eye className="w-4 h-4 text-sky-600" />
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                            <span className="text-slate-500">
                              Items: <strong className="text-slate-700">{order.items?.length}</strong>
                            </span>
                            <span className="font-semibold text-sky-600">৳{order.finalAmount}</span>
                            <span className="text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <select
                            defaultValue={order.status}
                            onChange={(e) =>
                              updateStatus.mutate({ id: order.id, status: e.target.value })
                            }
                            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${statusConfig[order.status]?.color}`}
                          >
                            {Object.entries(statusConfig).map(([key, val]) => (
                              <option key={key} value={key}>
                                {val.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                  Products
                </h1>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-sky-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
                {productsLoading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50/80">
                          <tr>
                            {["Product", "Type", "Category", "Price", "Stock", "Actions"].map((h) => (
                              <th
                                key={h}
                                className="text-left py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr
                              key={product.id}
                              className="border-t border-slate-100/80 hover:bg-white/60 transition"
                            >
                              <td className="py-3.5 px-4 font-medium text-slate-800">
                                {product.name}
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold
                                    ${
                                      product.productType === "BOOK"
                                        ? "bg-sky-50 text-sky-700 border border-sky-200/60"
                                        : "bg-amber-50 text-amber-700 border border-amber-200/60"
                                    }`}
                                >
                                  {product.productType}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {product.category?.name}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-semibold text-sky-600">
                                    ৳{product.discountPrice || product.price}
                                  </span>
                                  {product.discountPrice && (
                                    <span className="text-xs text-slate-400 line-through">
                                      ৳{product.price}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`font-semibold text-sm
                                    ${
                                      product.stock <= 5
                                        ? "text-rose-500"
                                        : product.stock <= 10
                                        ? "text-amber-500"
                                        : "text-emerald-600"
                                    }`}
                                >
                                  {product.stock}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setProductModalOpen(true);
                                    }}
                                    className="p-2 rounded-xl hover:bg-sky-50 transition"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4 text-sky-600" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete "${product.name}"?`)) {
                                        deleteProduct.mutate(product.id);
                                      }
                                    }}
                                    className="p-2 rounded-xl hover:bg-rose-50 transition"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4 text-rose-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="lg:hidden p-4 space-y-3">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="rounded-xl bg-white/80 border border-slate-100 p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 text-sm truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold
                                    ${
                                      product.productType === "BOOK"
                                        ? "bg-sky-50 text-sky-700 border border-sky-200/60"
                                        : "bg-amber-50 text-amber-700 border border-amber-200/60"
                                    }`}
                                >
                                  {product.productType}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {product.category?.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setProductModalOpen(true);
                                }}
                                className="p-2 rounded-xl hover:bg-sky-50 transition"
                              >
                                <Edit className="w-4 h-4 text-sky-600" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${product.name}"?`)) {
                                    deleteProduct.mutate(product.id);
                                  }
                                }}
                                className="p-2 rounded-xl hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-4 h-4 text-rose-500" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-semibold text-sky-600">
                                ৳{product.discountPrice || product.price}
                              </span>
                              {product.discountPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  ৳{product.price}
                                </span>
                              )}
                            </div>
                            <span
                              className={`font-semibold text-xs
                                ${
                                  product.stock <= 5
                                    ? "text-rose-500"
                                    : product.stock <= 10
                                    ? "text-amber-500"
                                    : "text-emerald-600"
                                }`}
                            >
                              Stock: {product.stock}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6 w-full">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                Users
              </h1>

              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
                {usersLoading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50/80">
                          <tr>
                            {["User", "Email", "Orders", "Joined", "Actions"].map((h) => (
                              <th
                                key={h}
                                className="text-left py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr
                              key={u.id}
                              className="border-t border-slate-100/80 hover:bg-white/60 transition"
                            >
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600 font-semibold text-sm border border-sky-200/50">
                                    {u.name?.[0]}
                                  </div>
                                  <span className="font-medium text-slate-800">{u.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {u._count?.orders || 0}
                              </td>
                              <td className="py-3.5 px-4 text-slate-500 text-xs">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4">
                                <button className="p-2 rounded-xl hover:bg-sky-50 transition">
                                  <Eye className="w-4 h-4 text-sky-600" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden p-4 space-y-3">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className="rounded-xl bg-white/80 border border-slate-100 p-4 flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600 font-semibold text-sm border border-sky-200/50 shrink-0">
                            {u.name?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{u.name}</p>
                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                              <span>{u._count?.orders || 0} orders</span>
                              <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button className="p-2 rounded-xl hover:bg-sky-50 transition shrink-0">
                            <Eye className="w-4 h-4 text-sky-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "coupons" && <CouponsTab />}
          {activeTab === "bundles" && <BundlesTab />}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (() => {
            const monthlyData: MonthlySale[] = analytics?.monthlySales || [
              { month: "Jan", revenue: 45000 },
              { month: "Feb", revenue: 62000 },
              { month: "Mar", revenue: 58000 },
              { month: "Apr", revenue: 78000 },
              { month: "May", revenue: 72000 },
              { month: "Jun", revenue: 95000 },
            ];
            const maxRev = Math.max(...monthlyData.map((x) => x.revenue), 1);

            // Order status counts from existing orders data
            const statusCounts = {
              DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
              CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
              SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
              PENDING: orders.filter((o) => o.status === "PENDING").length,
              CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
            };
            const totalOrdersCount = orders.length || 1;
            const orderStatusItems = [
              { key: "DELIVERED", label: "Delivered", color: "#22c55e", count: statusCounts.DELIVERED },
              { key: "CONFIRMED", label: "Processing", color: "#3b82f6", count: statusCounts.CONFIRMED },
              { key: "SHIPPED", label: "Shipped", color: "#f59e0b", count: statusCounts.SHIPPED },
              { key: "CANCELLED", label: "Cancelled", color: "#ef4444", count: statusCounts.CANCELLED },
              { key: "PENDING", label: "Pending", color: "#a78bfa", count: statusCounts.PENDING },
            ].filter((s) => s.count > 0 || orders.length === 0);

            // Donut segments
            let donutOffset = 0;
            const donutCircumference = 2 * Math.PI * 40;
            const donutSegments = orderStatusItems.map((item) => {
              const pct = orders.length === 0 ? 0.25 : item.count / totalOrdersCount;
              const seg = { ...item, pct, dash: pct * donutCircumference, offset: donutOffset };
              donutOffset += pct * donutCircumference;
              return seg;
            });

            const completedOrders = statusCounts.DELIVERED;
            const completionRate = orders.length > 0
              ? ((completedOrders / orders.length) * 100).toFixed(1)
              : "0";
            const avgOrderValue = orders.length > 0
              ? Math.round(orders.reduce((s, o) => s + o.finalAmount, 0) / orders.length)
              : 0;

            // Sparkline paths (decorative, based on monthly trend shape)
            const sparkPaths = [
              "M0,28 L8,24 L16,26 L24,18 L32,20 L40,12 L48,14 L56,8 L64,10 L72,4",
              "M0,20 L8,22 L16,16 L24,18 L32,12 L40,14 L48,8 L56,10 L64,6 L72,2",
              "M0,26 L8,22 L16,24 L24,16 L32,18 L40,10 L48,14 L56,8 L64,6 L72,4",
              "M0,24 L8,20 L16,22 L24,14 L32,16 L40,10 L48,12 L56,6 L64,8 L72,2",
            ];
            const sparkColors = ["#38bdf8", "#a78bfa", "#fbbf24", "#34d399"];

            // Line chart points
            const chartW = 560;
            const chartH = 180;
            const padX = 8;
            const padY = 12;
            const points = monthlyData.map((d, i) => {
              const x = padX + (i / Math.max(monthlyData.length - 1, 1)) * (chartW - padX * 2);
              const y = chartH - padY - (d.revenue / maxRev) * (chartH - padY * 2);
              return { x, y, ...d };
            });
            const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
            const areaPath = `${linePath} L${points[points.length - 1]?.x || 0},${chartH} L${points[0]?.x || 0},${chartH} Z`;

            return (
              <div className="space-y-5 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
                      Analytics
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                      Track your store performance and key metrics
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 border border-slate-200/70 text-slate-600 text-xs font-medium hover:bg-white transition shadow-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="sm:hidden">Date Range</span>
                    </button>
                    <button
                      onClick={() => toast.success("Report export coming soon!")}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 border border-slate-200/70 text-slate-600 text-xs font-medium hover:bg-white transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Report
                    </button>
                  </div>
                </div>

                {/* Stat Cards with sparklines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={stat.label}
                      className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70
                        shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-50`} />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white/90 border border-white/80 flex items-center justify-center text-lg shadow-sm mb-3">
                            {stat.icon}
                          </div>
                          <p className="text-[12px] text-slate-500 font-medium mb-0.5">{stat.label}</p>
                          <p className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
                            {stat.value}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-1.5
                              ${stat.up ? "text-emerald-600" : "text-rose-500"}`}
                          >
                            {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stat.change} vs last month
                          </span>
                        </div>
                        <svg width="72" height="32" viewBox="0 0 72 32" className="shrink-0 mt-1 opacity-80">
                          <path
                            d={sparkPaths[idx % 4]}
                            fill="none"
                            stroke={sparkColors[idx % 4]}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Revenue + Orders Overview */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                  {/* Revenue Overview - Line Chart */}
                  <div className="xl:col-span-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-semibold text-slate-800 text-[15px]">Revenue Overview</h2>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                        Monthly
                      </span>
                    </div>
                    <div className="relative w-full overflow-x-auto">
                      <svg
                        viewBox={`0 0 ${chartW} ${chartH + 28}`}
                        className="w-full h-auto min-w-[280px]"
                        style={{ maxHeight: 220 }}
                      >
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                          const y = chartH - padY - t * (chartH - padY * 2);
                          return (
                            <g key={t}>
                              <line
                                x1={padX}
                                y1={y}
                                x2={chartW - padX}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                              />
                              <text
                                x={padX - 2}
                                y={y + 3}
                                textAnchor="end"
                                className="fill-slate-400"
                                fontSize="10"
                              >
                                ৳{(maxRev * t / 1000).toFixed(0)}k
                              </text>
                            </g>
                          );
                        })}
                        {/* Area fill */}
                        <path d={areaPath} fill="url(#revGradient)" opacity="0.35" />
                        {/* Line */}
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Dots */}
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
                            <text
                              x={p.x}
                              y={chartH + 18}
                              textAnchor="middle"
                              className="fill-slate-400"
                              fontSize="10"
                            >
                              {p.month}
                            </text>
                          </g>
                        ))}
                        <defs>
                          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Orders Overview - Donut */}
                  <div className="xl:col-span-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                    <h2 className="font-semibold text-slate-800 text-[15px] mb-5">Orders Overview</h2>
                    <div className="flex items-center gap-5 mb-5">
                      <div className="relative w-28 h-28 shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                          {donutSegments.map((seg, i) => (
                            <circle
                              key={seg.key}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={seg.color}
                              strokeWidth="12"
                              strokeDasharray={`${seg.dash} ${donutCircumference - seg.dash}`}
                              strokeDashoffset={-seg.offset}
                              strokeLinecap="butt"
                            />
                          ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-semibold text-slate-800">{orders.length}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Total Orders</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2.5 min-w-0">
                        {orderStatusItems.map((item) => (
                          <div key={item.key} className="flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-slate-600 font-medium truncate">{item.label}</span>
                            </div>
                            <span className="text-slate-800 font-semibold shrink-0">
                              {item.count}{" "}
                              <span className="text-slate-400 font-normal">
                                ({orders.length ? ((item.count / orders.length) * 100).toFixed(1) : 0}%)
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                      <div className="rounded-xl bg-slate-50/80 border border-slate-100 p-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Completion Rate
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{completionRate}%</p>
                      </div>
                      <div className="rounded-xl bg-slate-50/80 border border-slate-100 p-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <TrendingUp className="w-3 h-3 text-sky-500" />
                          Avg. Order Value
                        </div>
                        <p className="text-sm font-semibold text-slate-800">৳{avgOrderValue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom row: Categories + Products + Payment placeholder from data */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Top Categories */}
                  <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                    <h2 className="font-semibold text-slate-800 text-[15px] mb-5">Top Categories</h2>
                    {analytics?.categoryStats?.length ? (
                      <div className="space-y-4">
                        {analytics.categoryStats.map((cat: CategoryStat) => {
                          const maxProducts = Math.max(
                            ...analytics.categoryStats.map((c: CategoryStat) => c._count?.products || 0),
                            1
                          );
                          const pct = ((cat._count?.products || 0) / maxProducts) * 100;
                          return (
                            <div key={cat.id}>
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-slate-600 font-medium">{cat.name}</span>
                                <span className="text-slate-500 text-xs font-medium">
                                  {cat._count?.products || 0} products
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all"
                                  style={{ width: `${Math.max(pct, 4)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">No category data yet</p>
                    )}
                  </div>

                  {/* Top Selling Products (from products list) */}
                  <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-semibold text-slate-800 text-[15px]">Top Selling Products</h2>
                      <button
                        onClick={() => setActiveTab("products")}
                        className="text-[12px] font-medium text-sky-600 hover:text-sky-700 transition"
                      >
                        View all
                      </button>
                    </div>
                    {products.length > 0 ? (
                      <div className="space-y-3">
                        {products.slice(0, 5).map((product, i) => (
                          <div key={product.id} className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 shrink-0">
                              {i + 1}
                            </span>
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100/80 flex items-center justify-center text-sm shrink-0">
                              {product.productType === "BOOK" ? "📚" : "🔧"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                              <p className="text-[11px] text-slate-500">
                                ৳{product.discountPrice || product.price}
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                              Stock {product.stock}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">No products yet</p>
                    )}
                  </div>

                  {/* Quick Stats summary */}
                  <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
                    <h2 className="font-semibold text-slate-800 text-[15px] mb-5">Store Snapshot</h2>
                    <div className="flex items-center justify-center mb-5">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="10"
                            strokeDasharray={`${donutCircumference * 0.7} ${donutCircumference * 0.3}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-semibold text-slate-800">
                            {dashboard?.stats?.totalRevenue
                              ? `৳${(dashboard.stats.totalRevenue / 1000).toFixed(1)}k`
                              : "৳0"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Revenue</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
                        <span className="text-slate-500 font-medium">Total Orders</span>
                        <span className="font-semibold text-slate-800">{orders.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
                        <span className="text-slate-500 font-medium">Total Products</span>
                        <span className="font-semibold text-slate-800">{products.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
                        <span className="text-slate-500 font-medium">Total Users</span>
                        <span className="font-semibold text-slate-800">{users.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-emerald-50/80 border border-emerald-100">
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Success Rate
                        </span>
                        <span className="font-semibold text-emerald-700">{completionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  Data updates automatically · Last updated:{" "}
                  {new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })()}
        </main>
      </div>

      <ProductModal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setSelectedProduct(null);
        }}
        product={
          selectedProduct
            ? { ...selectedProduct, discountPrice: selectedProduct.discountPrice ?? undefined }
            : undefined
        }
      />
    </div>
  );
}















// // "use client";

// // import { useState } from "react";
// // import {
// //   LayoutDashboard, ShoppingBag, BookOpen, Users,
// //   BarChart2, LogOut, Menu, X,
// //   TrendingUp, TrendingDown, AlertCircle,
// //   CheckCircle, Eye, Edit, Trash2,
// //   Plus, Search, Tag, Package,
// // } from "lucide-react";
// // import AdminNotifications from "./AdminNotifications";
// // import { useAuthStore } from "@/store/auth.store";
// // import { useRouter } from "next/navigation";
// // import {
// //   useAdminDashboard, useAdminOrders, useAdminProducts,
// //   useAdminUsers, useAdminAnalytics, useUpdateOrderStatus,
// //   useDeleteProduct,
// // } from "@/lib/hooks";
// // import toast from "react-hot-toast";
// // import ProductModal from "./ProductModal";
// // import CouponsTab from "./CouponsTab";
// // import CategoriesTab from "./CategoriesTab";
// // import BundlesTab from "./BundlesTab";
// // // import BundlesTab from "./BundlesTab";

// // type Tab = "dashboard" | "orders" | "products" | "users" | "coupons" | "categories" | "analytics" | "bundles";

// // interface Product {
// //   id: string;
// //   name: string;
// //   price: number;
// //   discountPrice?: number | null;
// //   stock: number;
// //   productType: "BOOK" | "GADGET";
// //   category?: { name: string };
// // }

// // interface OrderItem {
// //   id: string;
// // }

// // interface Order {
// //   id: string;
// //   user?: { name: string };
// //   items?: OrderItem[];
// //   finalAmount: number;
// //   status: string;
// //   createdAt: string;
// // }

// // interface AdminUser {
// //   id: string;
// //   name: string;
// //   email: string;
// //   createdAt: string;
// //   _count?: { orders: number };
// // }

// // interface MonthlySale {
// //   month: string;
// //   revenue: number;
// // }

// // interface CategoryStat {
// //   id: string;
// //   name: string;
// //   _count?: { products: number };
// // }

// // const statusConfig: Record<string, { label: string; color: string }> = {
// //   PENDING: { label: "Pending", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
// //   CONFIRMED: { label: "Confirmed", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
// //   SHIPPED: { label: "Shipped", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
// //   DELIVERED: { label: "Delivered", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" },
// //   CANCELLED: { label: "Cancelled", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
// // };

// // const navItems = [
// //   { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
// //   { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
// //   { id: "products", label: "Products", icon: <BookOpen className="w-4 h-4" /> },
// //   { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
// //   { id: "coupons", label: "Coupons", icon: <Tag className="w-4 h-4" /> },
// //   { id: "bundles", label: "Bundles", icon: <Package className="w-4 h-4" /> },
// //   { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-4 h-4" /> },
// //   { id: "categories", label: "Categories", icon: <Tag className="w-4 h-4" /> },
// // ];

// // export default function AdminClient() {
// //   const [activeTab, setActiveTab] = useState<Tab>("dashboard");
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [productModalOpen, setProductModalOpen] = useState(false);
// //   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
// //   const { user, logout } = useAuthStore();
// //   const router = useRouter();

// //   const { data: dashboard, isLoading: dashLoading } = useAdminDashboard();
// //   const { data: ordersData, isLoading: ordersLoading } = useAdminOrders();
// //   const { data: productsData, isLoading: productsLoading } = useAdminProducts();
// //   const { data: usersData, isLoading: usersLoading } = useAdminUsers();
// //   const { data: analytics } = useAdminAnalytics();
// //   const updateStatus = useUpdateOrderStatus();
// //   const deleteProduct = useDeleteProduct();

// //   const orders: Order[] = ordersData?.data || [];
// //   const products: Product[] = productsData?.data || [];
// //   const users: AdminUser[] = usersData?.data || [];

// //   const stats = dashboard ? [
// //     { label: "Total Revenue", value: `৳${dashboard.stats.totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: "💰", color: "from-blue-500 to-blue-600" },
// //     { label: "Total Orders", value: String(dashboard.stats.totalOrders), change: "+8.2%", up: true, icon: "📦", color: "from-purple-500 to-purple-600" },
// //     { label: "Total Products", value: String(dashboard.stats.totalProducts), change: "+3.1%", up: true, icon: "📚", color: "from-amber-500 to-amber-600" },
// //     { label: "Total Users", value: String(dashboard.stats.totalUsers), change: "+15.3%", up: true, icon: "👥", color: "from-green-500 to-green-600" },
// //   ] : [];

// //   const handleLogout = () => {
// //     logout();
// //     toast.success("Logged out!");
// //     router.push("/");
// //   };

// //   return (
// //     <div className="flex h-screen bg-[var(--background)] overflow-hidden">

// //       {/* Sidebar */}
// //       <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-950 flex flex-col transition-transform duration-300`}>
// //         {/* Logo */}
// //         <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
// //           <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
// //             <BookOpen className="w-5 h-5 text-white" />
// //           </div>
// //           <div>
// //             <p className="font-bold text-white text-sm">KitabGhor</p>
// //             <p className="text-xs text-slate-400">Admin Panel</p>
// //           </div>
// //           <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
// //             <X className="w-4 h-4" />
// //           </button>
// //         </div>

// //         {/* Nav */}
// //         <nav className="flex-1 px-3 py-4 space-y-1">
// //           {navItems.map((item) => (
// //             <button
// //               key={item.id}
// //               onClick={() => { setActiveTab(item.id as Tab); setSidebarOpen(false); }}
// //               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
// //             >
// //               {item.icon}
// //               {item.label}
// //             </button>
// //           ))}
// //         </nav>

// //         {/* User */}
// //         <div className="px-3 py-4 border-t border-slate-800">
// //           <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 mb-2">
// //             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
// //               {user?.name?.[0] || "A"}
// //             </div>
// //             <div className="min-w-0">
// //               <p className="text-white text-xs font-medium truncate">{user?.name || "Admin"}</p>
// //               <p className="text-slate-400 text-xs truncate">{user?.email}</p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={handleLogout}
// //             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition"
// //           >
// //             <LogOut className="w-4 h-4" />
// //             Logout
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Overlay */}
// //       {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}

// //       {/* Main */}
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         {/* Top Bar */}
// //         <header className="bg-white dark:bg-slate-800 border-b border-[var(--border)] px-6 py-4 flex items-center gap-4">
// //           <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
// //             <Menu className="w-5 h-5" />
// //           </button>
// //           <div className="relative flex-1 max-w-md">
// //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// //             <input
// //               type="text"
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               placeholder="Search..."
// //               className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
// //           <div className="ml-auto flex items-center gap-3">
// //             <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
// //               {new Date().toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
// //             </span>
// //             <AdminNotifications />
// //           </div>
// //         </header>

// //         {/* Content */}
// //         <main className="flex-1 overflow-y-auto p-6">

// //           {/* Dashboard */}
// //           {activeTab === "dashboard" && (
// //             <div className="space-y-6">
// //               <div>
// //                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Dashboard</h1>
// //                 <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, {user?.name}!</p>
// //               </div>

// //               {dashLoading ? (
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
// //                   {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[var(--muted)] rounded-2xl animate-pulse" />)}
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
// //                   {stats.map((stat) => (
// //                     <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
// //                       <div className="flex items-center justify-between mb-4">
// //                         <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
// //                           {stat.icon}
// //                         </div>
// //                         <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${stat.up ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 text-red-600"}`}>
// //                           {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
// //                           {stat.change}
// //                         </span>
// //                       </div>
// //                       <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
// //                       <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}

// //               {dashboard?.lowStockProducts?.length > 0 && (
// //                 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5">
// //                   <div className="flex items-center gap-2 mb-3">
// //                     <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
// //                     <h2 className="font-bold text-amber-800 dark:text-amber-300">Low Stock Alert</h2>
// //                   </div>
// //                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
// //                     {dashboard.lowStockProducts.map((p: Product) => (
// //                       <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between">
// //                         <div>
// //                           <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
// //                           <p className="text-xs text-red-500 font-medium">{p.stock} left</p>
// //                         </div>
// //                         <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
// //                           Restock
// //                         </button>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
// //                   <button onClick={() => setActiveTab("orders")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
// //                 </div>
// //                 {dashLoading ? (
// //                   <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-[var(--muted)] rounded-xl animate-pulse" />)}</div>
// //                 ) : (
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full text-sm">
// //                       <thead>
// //                         <tr className="border-b border-[var(--border)]">
// //                           {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
// //                             <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
// //                           ))}
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {dashboard?.recentOrders?.slice(0, 5).map((order: Order) => (
// //                           <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition">
// //                             <td className="py-3 px-2 font-medium text-gray-900 dark:text-white text-xs">{order.id.slice(0, 12)}...</td>
// //                             <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{order.user?.name}</td>
// //                             <td className="py-3 px-2 font-semibold text-blue-600 dark:text-blue-400">৳{order.finalAmount}</td>
// //                             <td className="py-3 px-2">
// //                               <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[order.status]?.color}`}>
// //                                 {statusConfig[order.status]?.label}
// //                               </span>
// //                             </td>
// //                             <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs">
// //                               {new Date(order.createdAt).toLocaleDateString()}
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Orders Tab */}
// //           {activeTab === "orders" && (
// //             <div className="space-y-6">
// //               <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Orders</h1>
// //               <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
// //                 {ordersLoading ? (
// //                   <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-[var(--muted)] rounded-xl animate-pulse" />)}</div>
// //                 ) : (
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full text-sm">
// //                       <thead className="bg-[var(--muted)]">
// //                         <tr>
// //                           {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Action"].map((h) => (
// //                             <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
// //                           ))}
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {orders.map((order) => (
// //                           <tr key={order.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition">
// //                             <td className="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">{order.id.slice(0, 12)}...</td>
// //                             <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{order.user?.name}</td>
// //                             <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{order.items?.length}</td>
// //                             <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">৳{order.finalAmount}</td>
// //                             <td className="py-3 px-4">
// //                               <select
// //                                 defaultValue={order.status}
// //                                 onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
// //                                 className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${statusConfig[order.status]?.color}`}
// //                               >
// //                                 {Object.entries(statusConfig).map(([key, val]) => (
// //                                   <option key={key} value={key}>{val.label}</option>
// //                                 ))}
// //                               </select>
// //                             </td>
// //                             <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
// //                               {new Date(order.createdAt).toLocaleDateString()}
// //                             </td>
// //                             <td className="py-3 px-4">
// //                               <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
// //                                 <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
// //                               </button>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Products Tab */}
// //           {activeTab === "products" && (
// //             <div className="space-y-6">
// //               <div className="flex items-center justify-between">
// //                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Products</h1>
// //                 <button
// //                   onClick={() => { setSelectedProduct(null); setProductModalOpen(true); }}
// //                   className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
// //                 >
// //                   <Plus className="w-4 h-4" />
// //                   Add Product
// //                 </button>
// //               </div>

// //               <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
// //                 {productsLoading ? (
// //                   <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-[var(--muted)] rounded-xl animate-pulse" />)}</div>
// //                 ) : (
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full text-sm">
// //                       <thead className="bg-[var(--muted)]">
// //                         <tr>
// //                           {["Product", "Type", "Category", "Price", "Stock", "Actions"].map((h) => (
// //                             <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
// //                           ))}
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {products.map((product) => (
// //                           <tr key={product.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition">
// //                             <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
// //                             <td className="py-3 px-4">
// //                               <span className={`px-2 py-1 rounded-lg text-xs font-medium ${product.productType === "BOOK" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"}`}>
// //                                 {product.productType}
// //                               </span>
// //                             </td>
// //                             <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{product.category?.name}</td>
// //                             <td className="py-3 px-4">
// //                               <div>
// //                                 <span className="font-semibold text-blue-600 dark:text-blue-400">৳{product.discountPrice || product.price}</span>
// //                                 {product.discountPrice && (
// //                                   <span className="text-xs text-gray-400 line-through ml-1">৳{product.price}</span>
// //                                 )}
// //                               </div>
// //                             </td>
// //                             <td className="py-3 px-4">
// //                               <span className={`font-medium ${product.stock <= 5 ? "text-red-500" : product.stock <= 10 ? "text-amber-500" : "text-green-600 dark:text-green-400"}`}>
// //                                 {product.stock}
// //                               </span>
// //                             </td>
// //                             <td className="py-3 px-4">
// //                               <div className="flex items-center gap-1">
// //                                 <button
// //                                   onClick={() => { setSelectedProduct(product); setProductModalOpen(true); }}
// //                                   className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
// //                                   title="Edit"
// //                                 >
// //                                   <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
// //                                 </button>
// //                                 <button
// //                                   onClick={() => {
// //                                     if (confirm(`Delete "${product.name}"?`)) {
// //                                       deleteProduct.mutate(product.id);
// //                                     }
// //                                   }}
// //                                   className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
// //                                   title="Delete"
// //                                 >
// //                                   <Trash2 className="w-4 h-4 text-red-500" />
// //                                 </button>
// //                               </div>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Users Tab */}
// //           {activeTab === "users" && (
// //             <div className="space-y-6">
// //               <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Users</h1>
// //               <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
// //                 {usersLoading ? (
// //                   <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-[var(--muted)] rounded-xl animate-pulse" />)}</div>
// //                 ) : (
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full text-sm">
// //                       <thead className="bg-[var(--muted)]">
// //                         <tr>
// //                           {["User", "Email", "Orders", "Joined", "Actions"].map((h) => (
// //                             <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
// //                           ))}
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {users.map((u) => (
// //                           <tr key={u.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition">
// //                             <td className="py-3 px-4">
// //                               <div className="flex items-center gap-3">
// //                                 <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
// //                                   {u.name?.[0]}
// //                                 </div>
// //                                 <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
// //                               </div>
// //                             </td>
// //                             <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.email}</td>
// //                             <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u._count?.orders || 0}</td>
// //                             <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
// //                               {new Date(u.createdAt).toLocaleDateString()}
// //                             </td>
// //                             <td className="py-3 px-4">
// //                               <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
// //                                 <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
// //                               </button>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === "categories" && <CategoriesTab />}
// //           {activeTab === "coupons" && <CouponsTab />}
// //           {activeTab === "bundles" && <BundlesTab />}

// //           {/* Analytics Tab */}
// //           {activeTab === "analytics" && (
// //             <div className="space-y-6">
// //               <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Analytics</h1>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
// //                 {stats.map((stat) => (
// //                   <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
// //                     <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
// //                       {stat.icon}
// //                     </div>
// //                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
// //                     <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
// //                     <span className={`inline-flex items-center gap-1 text-xs font-medium mt-2 ${stat.up ? "text-green-600" : "text-red-500"}`}>
// //                       {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
// //                       {stat.change} this month
// //                     </span>
// //                   </div>
// //                 ))}
// //               </div>

// //               <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
// //                 <h2 className="font-bold text-gray-900 dark:text-white mb-6">Revenue Overview</h2>
// //                 <div className="flex items-end gap-3 h-48">
// //                   {(analytics?.monthlySales || [
// //                     { month: "Jan", revenue: 45000 },
// //                     { month: "Feb", revenue: 62000 },
// //                     { month: "Mar", revenue: 58000 },
// //                     { month: "Apr", revenue: 78000 },
// //                     { month: "May", revenue: 72000 },
// //                     { month: "Jun", revenue: 95000 },
// //                   ]).map((d: MonthlySale, i: number) => {
// //                     const maxRevenue = Math.max(...(analytics?.monthlySales || [{ revenue: 95000 }]).map((x: MonthlySale) => x.revenue));
// //                     return (
// //                       <div key={i} className="flex-1 flex flex-col items-center gap-2">
// //                         <span className="text-xs text-gray-500 dark:text-gray-400">
// //                           {d.revenue > 0 ? `৳${(d.revenue / 1000).toFixed(0)}k` : ""}
// //                         </span>
// //                         <div
// //                           className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-lg hover:opacity-80 transition"
// //                           style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
// //                         />
// //                         <span className="text-xs text-gray-400">{d.month}</span>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>

// //               {analytics?.categoryStats && (
// //                 <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
// //                   <h2 className="font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
// //                   <div className="space-y-3">
// //                     {analytics.categoryStats.map((cat: CategoryStat) => (
// //                       <div key={cat.id}>
// //                         <div className="flex justify-between text-sm mb-1">
// //                           <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
// //                           <span className="font-medium text-gray-900 dark:text-white">{cat._count?.products} products</span>
// //                         </div>
// //                         <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
// //                           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(((cat._count?.products || 0) / 10) * 100, 100)}%` }} />
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </main>
// //       </div>

// //       <ProductModal
// //         open={productModalOpen}
// //         onClose={() => { setProductModalOpen(false); setSelectedProduct(null); }}
// //         product={
// //           selectedProduct
// //             ? { ...selectedProduct, discountPrice: selectedProduct.discountPrice ?? undefined }
// //             : undefined
// //         }
// //       />
// //     </div>
// //   );
// // }




// "use client";

// import { useState } from "react";
// import {
//   LayoutDashboard, ShoppingBag, BookOpen, Users,
//   BarChart2, LogOut, Menu, X,
//   TrendingUp, TrendingDown, AlertCircle,
//   Eye, Edit, Trash2,
//   Plus, Search, Tag, Package,
// } from "lucide-react";
// import AdminNotifications from "./AdminNotifications";
// import { useAuthStore } from "@/store/auth.store";
// import { useRouter } from "next/navigation";
// import {
//   useAdminDashboard, useAdminOrders, useAdminProducts,
//   useAdminUsers, useAdminAnalytics, useUpdateOrderStatus,
//   useDeleteProduct,
// } from "@/lib/hooks";
// import toast from "react-hot-toast";
// import ProductModal from "./ProductModal";
// import CouponsTab from "./CouponsTab";
// import CategoriesTab from "./CategoriesTab";
// import BundlesTab from "./BundlesTab";

// type Tab = "dashboard" | "orders" | "products" | "users" | "coupons" | "categories" | "analytics" | "bundles";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discountPrice?: number | null;
//   stock: number;
//   productType: "BOOK" | "GADGET";
//   category?: { name: string };
// }

// interface OrderItem {
//   id: string;
// }

// interface Order {
//   id: string;
//   user?: { name: string };
//   items?: OrderItem[];
//   finalAmount: number;
//   status: string;
//   createdAt: string;
// }

// interface AdminUser {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: string;
//   _count?: { orders: number };
// }

// interface MonthlySale {
//   month: string;
//   revenue: number;
// }

// interface CategoryStat {
//   id: string;
//   name: string;
//   _count?: { products: number };
// }

// const statusConfig: Record<string, { label: string; color: string }> = {
//   PENDING: { label: "Pending", color: "bg-amber-50 text-amber-700 border border-amber-200/60" },
//   CONFIRMED: { label: "Confirmed", color: "bg-sky-50 text-sky-700 border border-sky-200/60" },
//   SHIPPED: { label: "Shipped", color: "bg-violet-50 text-violet-700 border border-violet-200/60" },
//   DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
//   CANCELLED: { label: "Cancelled", color: "bg-rose-50 text-rose-700 border border-rose-200/60" },
// };

// const navItems = [
//   { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
//   { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
//   { id: "products", label: "Products", icon: <BookOpen className="w-4 h-4" /> },
//   { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
//   { id: "coupons", label: "Coupons", icon: <Tag className="w-4 h-4" /> },
//   { id: "bundles", label: "Bundles", icon: <Package className="w-4 h-4" /> },
//   { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-4 h-4" /> },
//   { id: "categories", label: "Categories", icon: <Tag className="w-4 h-4" /> },
// ];

// export default function AdminClient() {
//   const [activeTab, setActiveTab] = useState<Tab>("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [productModalOpen, setProductModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const { user, logout } = useAuthStore();
//   const router = useRouter();

//   const { data: dashboard, isLoading: dashLoading } = useAdminDashboard();
//   const { data: ordersData, isLoading: ordersLoading } = useAdminOrders();
//   const { data: productsData, isLoading: productsLoading } = useAdminProducts();
//   const { data: usersData, isLoading: usersLoading } = useAdminUsers();
//   const { data: analytics } = useAdminAnalytics();
//   const updateStatus = useUpdateOrderStatus();
//   const deleteProduct = useDeleteProduct();

//   const orders: Order[] = ordersData?.data || [];
//   const products: Product[] = productsData?.data || [];
//   const users: AdminUser[] = usersData?.data || [];

//   const stats = dashboard ? [
//     { label: "Total Revenue", value: `৳${dashboard.stats.totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: "💰", accent: "from-sky-400/20 to-blue-500/10" },
//     { label: "Total Orders", value: String(dashboard.stats.totalOrders), change: "+8.2%", up: true, icon: "📦", accent: "from-violet-400/20 to-purple-500/10" },
//     { label: "Total Products", value: String(dashboard.stats.totalProducts), change: "+3.1%", up: true, icon: "📚", accent: "from-amber-400/20 to-orange-500/10" },
//     { label: "Total Users", value: String(dashboard.stats.totalUsers), change: "+15.3%", up: true, icon: "👥", accent: "from-emerald-400/20 to-teal-500/10" },
//   ] : [];

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out!");
//     router.push("/");
//   };

//   return (
//     <div className="flex h-screen bg-[#f4f6f9] overflow-hidden font-sans">
//       {/* Soft ambient background */}
//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl" />
//         <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-200/25 blur-3xl" />
//         <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-emerald-200/20 blur-3xl" />
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col transition-transform duration-300 ease-out
//         bg-white/70 backdrop-blur-2xl border-r border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]`}
//       >
//         {/* Logo */}
//         <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200/60">
//           <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
//             <BookOpen className="w-5 h-5 text-white" />
//           </div>
//           <div className="min-w-0">
//             <p className="font-semibold text-slate-800 text-[15px] tracking-tight">KitabGhor</p>
//             <p className="text-[11px] text-slate-500 font-medium">Admin Panel</p>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="ml-auto lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {navItems.map((item) => {
//             const isActive = activeTab === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => {
//                   setActiveTab(item.id as Tab);
//                   setSidebarOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
//                   ${
//                     isActive
//                       ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
//                       : "text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm"
//                   }`}
//               >
//                 <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
//                 {item.label}
//               </button>
//             );
//           })}
//         </nav>

//         {/* User */}
//         <div className="px-3 py-4 border-t border-slate-200/60">
//           <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-slate-200/50 mb-2">
//             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
//               {user?.name?.[0] || "A"}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="text-slate-800 text-xs font-semibold truncate">{user?.name || "Admin"}</p>
//               <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Overlay */}
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
//         />
//       )}

//       {/* Main */}
//       <div className="flex-1 flex flex-col overflow-hidden relative z-10">
//         {/* Top Bar */}
//         <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 px-4 sm:px-6 py-3.5 flex items-center gap-3 sm:gap-4">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 transition"
//           >
//             <Menu className="w-5 h-5" />
//           </button>

//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search anything..."
//               className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-slate-200/60 text-slate-800 text-sm
//                 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300
//                 shadow-sm transition"
//             />
//           </div>

//           <div className="ml-auto flex items-center gap-2 sm:gap-3">
//             <span className="text-[12px] text-slate-500 font-medium hidden md:block">
//               {new Date().toLocaleDateString("en-BD", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </span>
//             <AdminNotifications />
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">
//           {/* Dashboard */}
//           {activeTab === "dashboard" && (
//             <div className="space-y-6 max-w-[1400px] mx-auto">
//               <div>
//                 <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                   Dashboard
//                 </h1>
//                 <p className="text-slate-500 text-sm mt-0.5">Welcome back, {user?.name}!</p>
//               </div>

//               {dashLoading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//                   {[...Array(4)].map((_, i) => (
//                     <div key={i} className="h-32 rounded-2xl bg-white/50 animate-pulse" />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//                   {stats.map((stat) => (
//                     <div
//                       key={stat.label}
//                       className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60
//                         shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
//                     >
//                       <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60`} />
//                       <div className="relative">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="w-11 h-11 rounded-xl bg-white/80 border border-white/70 flex items-center justify-center text-xl shadow-sm">
//                             {stat.icon}
//                           </div>
//                           <span
//                             className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg
//                               ${stat.up ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}
//                           >
//                             {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//                             {stat.change}
//                           </span>
//                         </div>
//                         <p className="text-2xl font-semibold text-slate-800 tracking-tight">{stat.value}</p>
//                         <p className="text-[13px] text-slate-500 mt-0.5">{stat.label}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {dashboard?.lowStockProducts?.length > 0 && (
//                 <div className="rounded-2xl bg-amber-50/80 backdrop-blur-xl border border-amber-200/50 p-5 shadow-sm">
//                   <div className="flex items-center gap-2.5 mb-4">
//                     <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
//                       <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
//                     </div>
//                     <h2 className="font-semibold text-amber-800 text-[15px]">Low Stock Alert</h2>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {dashboard.lowStockProducts.map((p: Product) => (
//                       <div
//                         key={p.id}
//                         className="bg-white/80 rounded-xl border border-amber-100/80 p-3.5 flex items-center justify-between gap-3"
//                       >
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
//                           <p className="text-xs text-rose-500 font-semibold mt-0.5">{p.stock} left</p>
//                         </div>
//                         <button className="shrink-0 text-xs font-semibold bg-sky-500 text-white px-3 py-1.5 rounded-lg hover:bg-sky-600 transition shadow-sm">
//                           Restock
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
//                 <div className="flex items-center justify-between mb-5">
//                   <h2 className="font-semibold text-slate-800 text-[15px]">Recent Orders</h2>
//                   <button
//                     onClick={() => setActiveTab("orders")}
//                     className="text-[13px] font-medium text-sky-600 hover:text-sky-700 transition"
//                   >
//                     View All
//                   </button>
//                 </div>

//                 {dashLoading ? (
//                   <div className="space-y-3">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
//                     ))}
//                   </div>
//                 ) : (
//                   <>
//                     {/* Desktop table */}
//                     <div className="hidden md:block overflow-x-auto">
//                       <table className="w-full text-sm">
//                         <thead>
//                           <tr className="border-b border-slate-200/70">
//                             {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
//                               <th
//                                 key={h}
//                                 className="text-left py-3 px-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
//                               >
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {dashboard?.recentOrders?.slice(0, 5).map((order: Order) => (
//                             <tr
//                               key={order.id}
//                               className="border-b border-slate-100/80 hover:bg-white/50 transition"
//                             >
//                               <td className="py-3.5 px-2 font-medium text-slate-700 text-xs">
//                                 {order.id.slice(0, 12)}...
//                               </td>
//                               <td className="py-3.5 px-2 text-slate-600">{order.user?.name}</td>
//                               <td className="py-3.5 px-2 font-semibold text-sky-600">
//                                 ৳{order.finalAmount}
//                               </td>
//                               <td className="py-3.5 px-2">
//                                 <span
//                                   className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusConfig[order.status]?.color}`}
//                                 >
//                                   {statusConfig[order.status]?.label}
//                                 </span>
//                               </td>
//                               <td className="py-3.5 px-2 text-slate-500 text-xs">
//                                 {new Date(order.createdAt).toLocaleDateString()}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="md:hidden space-y-3">
//                       {dashboard?.recentOrders?.slice(0, 5).map((order: Order) => (
//                         <div
//                           key={order.id}
//                           className="rounded-xl bg-white/80 border border-slate-100 p-4 space-y-2"
//                         >
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs font-medium text-slate-500">
//                               {order.id.slice(0, 12)}...
//                             </span>
//                             <span
//                               className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusConfig[order.status]?.color}`}
//                             >
//                               {statusConfig[order.status]?.label}
//                             </span>
//                           </div>
//                           <p className="text-sm font-medium text-slate-800">{order.user?.name}</p>
//                           <div className="flex items-center justify-between text-xs">
//                             <span className="font-semibold text-sky-600">৳{order.finalAmount}</span>
//                             <span className="text-slate-400">
//                               {new Date(order.createdAt).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Orders Tab */}
//           {activeTab === "orders" && (
//             <div className="space-y-6 max-w-[1400px] mx-auto">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                 Orders
//               </h1>

//               <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
//                 {ordersLoading ? (
//                   <div className="p-6 space-y-3">
//                     {[...Array(5)].map((_, i) => (
//                       <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
//                     ))}
//                   </div>
//                 ) : (
//                   <>
//                     {/* Desktop */}
//                     <div className="hidden lg:block overflow-x-auto">
//                       <table className="w-full text-sm">
//                         <thead className="bg-slate-50/80">
//                           <tr>
//                             {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Action"].map(
//                               (h) => (
//                                 <th
//                                   key={h}
//                                   className="text-left py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
//                                 >
//                                   {h}
//                                 </th>
//                               )
//                             )}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {orders.map((order) => (
//                             <tr
//                               key={order.id}
//                               className="border-t border-slate-100/80 hover:bg-white/60 transition"
//                             >
//                               <td className="py-3.5 px-4 font-medium text-slate-700 text-xs">
//                                 {order.id.slice(0, 12)}...
//                               </td>
//                               <td className="py-3.5 px-4 text-slate-600">{order.user?.name}</td>
//                               <td className="py-3.5 px-4 text-slate-600">{order.items?.length}</td>
//                               <td className="py-3.5 px-4 font-semibold text-sky-600">
//                                 ৳{order.finalAmount}
//                               </td>
//                               <td className="py-3.5 px-4">
//                                 <select
//                                   defaultValue={order.status}
//                                   onChange={(e) =>
//                                     updateStatus.mutate({ id: order.id, status: e.target.value })
//                                   }
//                                   className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${statusConfig[order.status]?.color}`}
//                                 >
//                                   {Object.entries(statusConfig).map(([key, val]) => (
//                                     <option key={key} value={key}>
//                                       {val.label}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </td>
//                               <td className="py-3.5 px-4 text-slate-500 text-xs">
//                                 {new Date(order.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="py-3.5 px-4">
//                                 <button className="p-2 rounded-xl hover:bg-sky-50 transition">
//                                   <Eye className="w-4 h-4 text-sky-600" />
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile / Tablet cards */}
//                     <div className="lg:hidden p-4 space-y-3">
//                       {orders.map((order) => (
//                         <div
//                           key={order.id}
//                           className="rounded-xl bg-white/80 border border-slate-100 p-4 space-y-3"
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div>
//                               <p className="text-xs font-medium text-slate-400">
//                                 {order.id.slice(0, 12)}...
//                               </p>
//                               <p className="text-sm font-semibold text-slate-800 mt-0.5">
//                                 {order.user?.name}
//                               </p>
//                             </div>
//                             <button className="p-2 rounded-xl hover:bg-sky-50 transition shrink-0">
//                               <Eye className="w-4 h-4 text-sky-600" />
//                             </button>
//                           </div>
//                           <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
//                             <span className="text-slate-500">
//                               Items: <strong className="text-slate-700">{order.items?.length}</strong>
//                             </span>
//                             <span className="font-semibold text-sky-600">৳{order.finalAmount}</span>
//                             <span className="text-slate-400">
//                               {new Date(order.createdAt).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <select
//                             defaultValue={order.status}
//                             onChange={(e) =>
//                               updateStatus.mutate({ id: order.id, status: e.target.value })
//                             }
//                             className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${statusConfig[order.status]?.color}`}
//                           >
//                             {Object.entries(statusConfig).map(([key, val]) => (
//                               <option key={key} value={key}>
//                                 {val.label}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Products Tab */}
//           {activeTab === "products" && (
//             <div className="space-y-6 max-w-[1400px] mx-auto">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                   Products
//                 </h1>
//                 <button
//                   onClick={() => {
//                     setSelectedProduct(null);
//                     setProductModalOpen(true);
//                   }}
//                   className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-sky-500/20"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Product
//                 </button>
//               </div>

//               <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
//                 {productsLoading ? (
//                   <div className="p-6 space-y-3">
//                     {[...Array(5)].map((_, i) => (
//                       <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
//                     ))}
//                   </div>
//                 ) : (
//                   <>
//                     {/* Desktop */}
//                     <div className="hidden lg:block overflow-x-auto">
//                       <table className="w-full text-sm">
//                         <thead className="bg-slate-50/80">
//                           <tr>
//                             {["Product", "Type", "Category", "Price", "Stock", "Actions"].map((h) => (
//                               <th
//                                 key={h}
//                                 className="text-left py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
//                               >
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {products.map((product) => (
//                             <tr
//                               key={product.id}
//                               className="border-t border-slate-100/80 hover:bg-white/60 transition"
//                             >
//                               <td className="py-3.5 px-4 font-medium text-slate-800">
//                                 {product.name}
//                               </td>
//                               <td className="py-3.5 px-4">
//                                 <span
//                                   className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold
//                                     ${
//                                       product.productType === "BOOK"
//                                         ? "bg-sky-50 text-sky-700 border border-sky-200/60"
//                                         : "bg-amber-50 text-amber-700 border border-amber-200/60"
//                                     }`}
//                                 >
//                                   {product.productType}
//                                 </span>
//                               </td>
//                               <td className="py-3.5 px-4 text-slate-600">
//                                 {product.category?.name}
//                               </td>
//                               <td className="py-3.5 px-4">
//                                 <div className="flex items-baseline gap-1.5">
//                                   <span className="font-semibold text-sky-600">
//                                     ৳{product.discountPrice || product.price}
//                                   </span>
//                                   {product.discountPrice && (
//                                     <span className="text-xs text-slate-400 line-through">
//                                       ৳{product.price}
//                                     </span>
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="py-3.5 px-4">
//                                 <span
//                                   className={`font-semibold text-sm
//                                     ${
//                                       product.stock <= 5
//                                         ? "text-rose-500"
//                                         : product.stock <= 10
//                                         ? "text-amber-500"
//                                         : "text-emerald-600"
//                                     }`}
//                                 >
//                                   {product.stock}
//                                 </span>
//                               </td>
//                               <td className="py-3.5 px-4">
//                                 <div className="flex items-center gap-1">
//                                   <button
//                                     onClick={() => {
//                                       setSelectedProduct(product);
//                                       setProductModalOpen(true);
//                                     }}
//                                     className="p-2 rounded-xl hover:bg-sky-50 transition"
//                                     title="Edit"
//                                   >
//                                     <Edit className="w-4 h-4 text-sky-600" />
//                                   </button>
//                                   <button
//                                     onClick={() => {
//                                       if (confirm(`Delete "${product.name}"?`)) {
//                                         deleteProduct.mutate(product.id);
//                                       }
//                                     }}
//                                     className="p-2 rounded-xl hover:bg-rose-50 transition"
//                                     title="Delete"
//                                   >
//                                     <Trash2 className="w-4 h-4 text-rose-500" />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="lg:hidden p-4 space-y-3">
//                       {products.map((product) => (
//                         <div
//                           key={product.id}
//                           className="rounded-xl bg-white/80 border border-slate-100 p-4 space-y-3"
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="min-w-0">
//                               <p className="font-semibold text-slate-800 text-sm truncate">
//                                 {product.name}
//                               </p>
//                               <div className="flex items-center gap-2 mt-1.5">
//                                 <span
//                                   className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold
//                                     ${
//                                       product.productType === "BOOK"
//                                         ? "bg-sky-50 text-sky-700 border border-sky-200/60"
//                                         : "bg-amber-50 text-amber-700 border border-amber-200/60"
//                                     }`}
//                                 >
//                                   {product.productType}
//                                 </span>
//                                 <span className="text-xs text-slate-500">
//                                   {product.category?.name}
//                                 </span>
//                               </div>
//                             </div>
//                             <div className="flex gap-1 shrink-0">
//                               <button
//                                 onClick={() => {
//                                   setSelectedProduct(product);
//                                   setProductModalOpen(true);
//                                 }}
//                                 className="p-2 rounded-xl hover:bg-sky-50 transition"
//                               >
//                                 <Edit className="w-4 h-4 text-sky-600" />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   if (confirm(`Delete "${product.name}"?`)) {
//                                     deleteProduct.mutate(product.id);
//                                   }
//                                 }}
//                                 className="p-2 rounded-xl hover:bg-rose-50 transition"
//                               >
//                                 <Trash2 className="w-4 h-4 text-rose-500" />
//                               </button>
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-between text-sm">
//                             <div className="flex items-baseline gap-1.5">
//                               <span className="font-semibold text-sky-600">
//                                 ৳{product.discountPrice || product.price}
//                               </span>
//                               {product.discountPrice && (
//                                 <span className="text-xs text-slate-400 line-through">
//                                   ৳{product.price}
//                                 </span>
//                               )}
//                             </div>
//                             <span
//                               className={`font-semibold text-xs
//                                 ${
//                                   product.stock <= 5
//                                     ? "text-rose-500"
//                                     : product.stock <= 10
//                                     ? "text-amber-500"
//                                     : "text-emerald-600"
//                                 }`}
//                             >
//                               Stock: {product.stock}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Users Tab */}
//           {activeTab === "users" && (
//             <div className="space-y-6 max-w-[1400px] mx-auto">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                 Users
//               </h1>

//               <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
//                 {usersLoading ? (
//                   <div className="p-6 space-y-3">
//                     {[...Array(5)].map((_, i) => (
//                       <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
//                     ))}
//                   </div>
//                 ) : (
//                   <>
//                     {/* Desktop */}
//                     <div className="hidden md:block overflow-x-auto">
//                       <table className="w-full text-sm">
//                         <thead className="bg-slate-50/80">
//                           <tr>
//                             {["User", "Email", "Orders", "Joined", "Actions"].map((h) => (
//                               <th
//                                 key={h}
//                                 className="text-left py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
//                               >
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {users.map((u) => (
//                             <tr
//                               key={u.id}
//                               className="border-t border-slate-100/80 hover:bg-white/60 transition"
//                             >
//                               <td className="py-3.5 px-4">
//                                 <div className="flex items-center gap-3">
//                                   <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600 font-semibold text-sm border border-sky-200/50">
//                                     {u.name?.[0]}
//                                   </div>
//                                   <span className="font-medium text-slate-800">{u.name}</span>
//                                 </div>
//                               </td>
//                               <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
//                               <td className="py-3.5 px-4 text-slate-600">
//                                 {u._count?.orders || 0}
//                               </td>
//                               <td className="py-3.5 px-4 text-slate-500 text-xs">
//                                 {new Date(u.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="py-3.5 px-4">
//                                 <button className="p-2 rounded-xl hover:bg-sky-50 transition">
//                                   <Eye className="w-4 h-4 text-sky-600" />
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="md:hidden p-4 space-y-3">
//                       {users.map((u) => (
//                         <div
//                           key={u.id}
//                           className="rounded-xl bg-white/80 border border-slate-100 p-4 flex items-center gap-3"
//                         >
//                           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600 font-semibold text-sm border border-sky-200/50 shrink-0">
//                             {u.name?.[0]}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-semibold text-slate-800 text-sm truncate">{u.name}</p>
//                             <p className="text-xs text-slate-500 truncate">{u.email}</p>
//                             <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
//                               <span>{u._count?.orders || 0} orders</span>
//                               <span>{new Date(u.createdAt).toLocaleDateString()}</span>
//                             </div>
//                           </div>
//                           <button className="p-2 rounded-xl hover:bg-sky-50 transition shrink-0">
//                             <Eye className="w-4 h-4 text-sky-600" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === "categories" && <CategoriesTab />}
//           {activeTab === "coupons" && <CouponsTab />}
//           {activeTab === "bundles" && <BundlesTab />}

//           {/* Analytics Tab */}
//           {activeTab === "analytics" && (
//             <div className="space-y-6 max-w-[1400px] mx-auto">
//               <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
//                 Analytics
//               </h1>

//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//                 {stats.map((stat) => (
//                   <div
//                     key={stat.label}
//                     className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60
//                       shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5"
//                   >
//                     <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60`} />
//                     <div className="relative">
//                       <div className="w-11 h-11 rounded-xl bg-white/80 border border-white/70 flex items-center justify-center text-xl shadow-sm mb-4">
//                         {stat.icon}
//                       </div>
//                       <p className="text-2xl font-semibold text-slate-800 tracking-tight">
//                         {stat.value}
//                       </p>
//                       <p className="text-[13px] text-slate-500 mt-0.5">{stat.label}</p>
//                       <span
//                         className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-2
//                           ${stat.up ? "text-emerald-600" : "text-rose-500"}`}
//                       >
//                         {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//                         {stat.change} this month
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
//                 <h2 className="font-semibold text-slate-800 text-[15px] mb-6">Revenue Overview</h2>
//                 <div className="flex items-end gap-2 sm:gap-3 h-48">
//                   {(
//                     analytics?.monthlySales || [
//                       { month: "Jan", revenue: 45000 },
//                       { month: "Feb", revenue: 62000 },
//                       { month: "Mar", revenue: 58000 },
//                       { month: "Apr", revenue: 78000 },
//                       { month: "May", revenue: 72000 },
//                       { month: "Jun", revenue: 95000 },
//                     ]
//                   ).map((d: MonthlySale, i: number) => {
//                     const maxRevenue = Math.max(
//                       ...(analytics?.monthlySales || [{ revenue: 95000 }]).map(
//                         (x: MonthlySale) => x.revenue
//                       )
//                     );
//                     return (
//                       <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-0">
//                         <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
//                           {d.revenue > 0 ? `৳${(d.revenue / 1000).toFixed(0)}k` : ""}
//                         </span>
//                         <div
//                           className="w-full max-w-[48px] mx-auto rounded-t-xl bg-gradient-to-t from-sky-500 to-sky-400 hover:opacity-90 transition shadow-sm"
//                           style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
//                         />
//                         <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
//                           {d.month}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {analytics?.categoryStats && (
//                 <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6">
//                   <h2 className="font-semibold text-slate-800 text-[15px] mb-5">Categories</h2>
//                   <div className="space-y-4">
//                     {analytics.categoryStats.map((cat: CategoryStat) => (
//                       <div key={cat.id}>
//                         <div className="flex justify-between text-sm mb-1.5">
//                           <span className="text-slate-600 font-medium">{cat.name}</span>
//                           <span className="font-semibold text-slate-800">
//                             {cat._count?.products} products
//                           </span>
//                         </div>
//                         <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                           <div
//                             className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
//                             style={{
//                               width: `${Math.min(((cat._count?.products || 0) / 10) * 100, 100)}%`,
//                             }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </main>
//       </div>

//       <ProductModal
//         open={productModalOpen}
//         onClose={() => {
//           setProductModalOpen(false);
//           setSelectedProduct(null);
//         }}
//         product={
//           selectedProduct
//             ? { ...selectedProduct, discountPrice: selectedProduct.discountPrice ?? undefined }
//             : undefined
//         }
//       />
//     </div>
//   );
// }