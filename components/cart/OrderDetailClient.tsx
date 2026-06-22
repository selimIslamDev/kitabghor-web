"use client";

import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from "lucide-react";
import { useOrder } from "@/lib/hooks";

const steps = [
  { label: "Order Placed", statuses: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
  { label: "Confirmed", statuses: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
  { label: "Shipped", statuses: ["SHIPPED", "DELIVERED"] },
  { label: "Delivered", statuses: ["DELIVERED"] },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
  PROCESSING: { label: "Processing", color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
};

export default function OrderDetailClient({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-[var(--muted)] rounded w-1/3" />
        <div className="h-32 bg-[var(--muted)] rounded-2xl" />
        <div className="h-48 bg-[var(--muted)] rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">📭</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order not found</h2>
        <Link href="/dashboard?tab=orders" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const shippingAddress = typeof order.shippingAddress === "string"
    ? JSON.parse(order.shippingAddress)
    : order.shippingAddress;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/dashboard?tab=orders" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Order Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {order.id} · {new Date(order.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Tracking */}
      {order.status !== "CANCELLED" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Tracking</h2>
          {order.trackingId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Tracking ID: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{order.trackingId}</span>
            </p>
          )}
          <div className="flex items-center">
            {steps.map((step, i) => {
              const done = step.statuses.includes(order.status);
              return (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${done ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-400"}`}>
                      {done ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center hidden sm:block">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition ${steps[i + 1].statuses.includes(order.status) ? "bg-blue-600" : "bg-[var(--border)]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-gray-900 dark:text-white">Shipping Address</h2>
          </div>
          <p className="font-medium text-gray-900 dark:text-white">{shippingAddress?.fullName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{shippingAddress?.phone}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{shippingAddress?.address}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {shippingAddress?.city}, {shippingAddress?.district}
            {shippingAddress?.postalCode ? ` - ${shippingAddress.postalCode}` : ""}
          </p>
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
              <span className="font-medium text-gray-900 dark:text-white capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className={`font-medium ${order.paymentStatus === "PAID" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                {order.paymentStatus || "UNPAID"}
              </span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Coupon</span>
                <span className="font-mono font-medium text-blue-600 dark:text-blue-400">{order.couponCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Items</h2>
        <div className="space-y-3 mb-4">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-[var(--muted)] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.productImage && item.productImage.startsWith("http") ? (
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{item.productImage || "📚"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.productName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
              </div>
              <span className="font-bold text-blue-600 dark:text-blue-400">৳{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="border-t border-[var(--border)] pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Subtotal</span>
            <span>৳{order.totalAmount?.toLocaleString()}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-৳{order.discountAmount?.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Shipping</span>
            <span className="text-green-500">Free</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-[var(--border)]">
            <span>Total</span>
            <span className="text-blue-600 dark:text-blue-400">৳{order.finalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}