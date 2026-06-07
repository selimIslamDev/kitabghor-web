"use client";

import { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, BookOpen, Users,
  BarChart2, Settings, LogOut, Menu, X,
  TrendingUp, TrendingDown, Package, AlertCircle,
  CheckCircle, Clock, Truck, Eye, Edit, Trash2,
  Plus, Search, ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Tab = "dashboard" | "orders" | "products" | "users" | "analytics";

const stats = [
  { label: "Total Revenue", value: "৳1,24,500", change: "+12.5%", up: true, icon: "💰", color: "from-blue-500 to-blue-600" },
  { label: "Total Orders", value: "248", change: "+8.2%", up: true, icon: "📦", color: "from-purple-500 to-purple-600" },
  { label: "Total Products", value: "156", change: "+3.1%", up: true, icon: "📚", color: "from-amber-500 to-amber-600" },
  { label: "Total Users", value: "1,204", change: "+15.3%", up: true, icon: "👥", color: "from-green-500 to-green-600" },
];

const mockOrders = [
  { id: "ORD-001", customer: "Rahul Ahmed", items: 3, total: 780, status: "DELIVERED", date: "2024-01-28" },
  { id: "ORD-002", customer: "Fatima Begum", items: 1, total: 290, status: "SHIPPED", date: "2024-01-27" },
  { id: "ORD-003", customer: "Karim Hassan", items: 2, total: 499, status: "CONFIRMED", date: "2024-01-26" },
  { id: "ORD-004", customer: "Nadia Islam", items: 1, total: 250, status: "PENDING", date: "2024-01-25" },
  { id: "ORD-005", customer: "Sabbir Rahman", items: 4, total: 1200, status: "DELIVERED", date: "2024-01-24" },
];

const mockProducts = [
  { id: "1", name: "SSC Physics Guide", type: "BOOK", price: 280, stock: 49, category: "SSC" },
  { id: "2", name: "HSC Higher Math", type: "BOOK", price: 320, stock: 30, category: "HSC" },
  { id: "3", name: "Casio FX-991EX", type: "GADGET", price: 1200, stock: 25, category: "Gadget" },
  { id: "4", name: "Geometry Box", type: "GADGET", price: 450, stock: 3, category: "Gadget" },
  { id: "5", name: "SSC English Grammar", type: "BOOK", price: 200, stock: 60, category: "SSC" },
];

const mockUsers = [
  { id: "1", name: "Rahul Ahmed", email: "rahul@gmail.com", orders: 5, joined: "2024-01-01" },
  { id: "2", name: "Fatima Begum", email: "fatima@gmail.com", orders: 3, joined: "2024-01-05" },
  { id: "3", name: "Karim Hassan", email: "karim@gmail.com", orders: 7, joined: "2024-01-10" },
  { id: "4", name: "Nadia Islam", email: "nadia@gmail.com", orders: 2, joined: "2024-01-15" },
  { id: "5", name: "Sabbir Rahman", email: "sabbir@gmail.com", orders: 9, joined: "2024-01-20" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" />, badge: 4 },
  { id: "products", label: "Products", icon: <BookOpen className="w-4 h-4" /> },
  { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-4 h-4" /> },
];

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-950 flex flex-col transition-transform duration-300`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">KitabGhor</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as Tab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0] || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name || "Admin"}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-[var(--border)] px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, {user?.name}!</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {stat.icon}
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${stat.up ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
                        {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart (Mock) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
                  <h2 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Revenue</h2>
                  <div className="flex items-end gap-2 h-40">
                    {[40, 65, 50, 80, 75, 90, 85, 95, 70, 88, 92, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-xs text-gray-400">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
                  <h2 className="font-bold text-gray-900 dark:text-white mb-4">Top Categories</h2>
                  <div className="space-y-3">
                    {[
                      { name: "SSC Books", percent: 35, color: "bg-blue-500" },
                      { name: "HSC Books", percent: 28, color: "bg-purple-500" },
                      { name: "Gadgets", percent: 22, color: "bg-amber-500" },
                      { name: "University", percent: 15, color: "bg-green-500" },
                    ].map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{cat.percent}%</span>
                        </div>
                        <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h2 className="font-bold text-amber-800 dark:text-amber-300">Low Stock Alert</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {mockProducts.filter((p) => p.stock <= 5).map((p) => (
                    <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-red-500 font-medium">{p.stock} left</p>
                      </div>
                      <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                          <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.slice(0, 4).map((order) => (
                        <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition">
                          <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{order.id}</td>
                          <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{order.customer}</td>
                          <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{order.items}</td>
                          <td className="py-3 px-2 font-semibold text-blue-600 dark:text-blue-400">৳{order.total}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[order.status].color}`}>
                              {statusConfig[order.status].label}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Orders
                </h1>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none">
                    <option>All Status</option>
                    <option>PENDING</option>
                    <option>CONFIRMED</option>
                    <option>SHIPPED</option>
                    <option>DELIVERED</option>
                  </select>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--muted)]">
                      <tr>
                        {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                          <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{order.items}</td>
                          <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">৳{order.total}</td>
                          <td className="py-3 px-4">
                            <select className={`px-2 py-1 rounded-lg text-xs font-medium border-0 ${statusConfig[order.status].color}`}>
                              {Object.entries(statusConfig).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{order.date}</td>
                          <td className="py-3 px-4">
                            <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
                              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Products
                </h1>
                <button
                  onClick={() => toast.success("Add product modal — coming soon!")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--muted)]">
                      <tr>
                        {["Product", "Type", "Category", "Price", "Stock", "Actions"].map((h) => (
                          <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockProducts.map((product) => (
                        <tr key={product.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${product.type === "BOOK" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"}`}>
                              {product.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{product.category}</td>
                          <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">৳{product.price}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${product.stock <= 5 ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
                                <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </button>
                              <button
                                onClick={() => toast.error("Delete product — coming soon!")}
                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                Users
              </h1>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--muted)]">
                      <tr>
                        {["User", "Email", "Orders", "Joined", "Actions"].map((h) => (
                          <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {user.name[0]}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{user.orders}</td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{user.joined}</td>
                          <td className="py-3 px-4">
                            <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
                              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                Analytics
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium mt-2 ${stat.up ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                      {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change} this month
                    </span>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-6">Revenue Overview — 2024</h2>
                <div className="flex items-end gap-3 h-48">
                  {[
                    { month: "Jan", value: 45000 },
                    { month: "Feb", value: 62000 },
                    { month: "Mar", value: 58000 },
                    { month: "Apr", value: 78000 },
                    { month: "May", value: 72000 },
                    { month: "Jun", value: 95000 },
                    { month: "Jul", value: 88000 },
                    { month: "Aug", value: 102000 },
                    { month: "Sep", value: 85000 },
                    { month: "Oct", value: 110000 },
                    { month: "Nov", value: 124500 },
                    { month: "Dec", value: 0 },
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {d.value > 0 ? `৳${(d.value / 1000).toFixed(0)}k` : ""}
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition hover:opacity-80 ${d.value > 0 ? "bg-blue-500 dark:bg-blue-600" : "bg-[var(--muted)]"}`}
                        style={{ height: `${d.value > 0 ? (d.value / 124500) * 100 : 5}%` }}
                      />
                      <span className="text-xs text-gray-400">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}