"use client";

import { useCartStore } from "@/store/cart.store";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartClient() {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");

  const shipping = totalAmount > 500 ? 0 : 60;
  const total = totalAmount + shipping;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code!");
      return;
    }
    toast.error("Invalid coupon code!");
  };

  const getItemImage = (image: string) => {
    if (image && image.startsWith("http")) return { type: "url", src: image };
    return { type: "emoji", src: image || "📚" };
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Add some books or gadgets to get started!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          <ShoppingBag className="w-5 h-5" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Shopping Cart
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} items</p>
        </div>
        <button
          onClick={() => { clearCart(); toast.success("Cart cleared!"); }}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const image = getItemImage(item.image);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-4 flex items-center gap-4"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex-shrink-0 flex items-center justify-center">
                  {image.type === "url" ? (
                    <img
                      src={image.src}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{image.src}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ৳{(item.discountPrice || item.price).toLocaleString()} each
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-[var(--muted)] rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price + Delete */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => { removeItem(item.id); toast.success("Item removed!"); }}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-500 font-medium" : ""}>
                  {shipping === 0 ? "Free" : `৳${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add ৳{(500 - totalAmount).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products"
              className="w-full flex items-center justify-center py-3 mt-3 border border-[var(--border)] text-gray-600 dark:text-gray-300 hover:bg-[var(--muted)] rounded-xl text-sm font-medium transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}