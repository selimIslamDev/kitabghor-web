"use client";

import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from "lucide-react";

const mockOrder = {
  id: "ORD-001",
  date: "2024-01-28",
  status: "SHIPPED",
  trackingId: "KB-2024-001",
  paymentMethod: "bKash",
  paymentStatus: "PAID",
  items: [
    { name: "SSC Physics Guide", image: "📘", quantity: 1, price: 250 },
    { name: "Casio FX-991EX Calculator", image: "🔢", quantity: 1, price: 1050 },
  ],
  shippingAddress: {
    fullName: "Rahul Ahmed",
    phone: "01712345678",
    address: "123 Mirpur Road",
    city: "Dhaka",
    district: "Dhaka",
  },
  subtotal: 1300,
  shipping: 0,
  total: 1300,
};

const steps = [
  { label: "Order Placed", icon: <CheckCircle className="w-5 h-5" />, done: true },
  { label: "Confirmed", icon: <CheckCircle className="w-5 h-5" />, done: true },
  { label: "Shipped", icon: <Truck className="w-5 h-5" />, done: true },
  { label: "Delivered", icon: <Package className="w-5 h-5" />, done: false },
];

export default function OrderDetailClient({ id }: { id: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Order {mockOrder.id}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Placed on {mockOrder.date}</p>
        </div>
        <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-semibold">
          {mockOrder.status}
        </span>
      </div>

      {/* Tracking */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 mb-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Tracking</h2>
        {mockOrder.trackingId && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Tracking ID: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{mockOrder.trackingId}</span>
          </p>
        )}
        <div className="flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.done ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-400"}`}>
                  {step.icon}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center hidden sm:block">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${steps[i + 1].done ? "bg-blue-600" : "bg-[var(--border)]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-gray-900 dark:text-white">Shipping Address</h2>
          </div>
          <p className="font-medium text-gray-900 dark:text-white">{mockOrder.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{mockOrder.shippingAddress.phone}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{mockOrder.shippingAddress.address}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.district}</p>
        </div>

        {/* Payment Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-gray-900 dark:text-white">Payment Info</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Method</span>
              <span className="font-medium text-gray-900 dark:text-white">{mockOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="text-green-600 dark:text-green-400 font-medium">{mockOrder.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 mb-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Items</h2>
        <div className="space-y-3">
          {mockOrder.items.map((item) => (
            <div key={item.name} className="flex items-center gap-4 p-3 bg-[var(--muted)] rounded-xl">
              <span className="text-3xl">{item.image}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
              </div>
              <span className="font-bold text-blue-600 dark:text-blue-400">৳{item.price}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Subtotal</span>
            <span>৳{mockOrder.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Shipping</span>
            <span className="text-green-500">Free</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-[var(--border)]">
            <span>Total</span>
            <span className="text-blue-600 dark:text-blue-400">৳{mockOrder.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}