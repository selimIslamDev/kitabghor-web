"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartClient() {
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "KITAB10") {
      const d = Math.round(totalAmount * 0.1);
      setDiscount(d);
      setCouponApplied(true);
      toast.success("Coupon applied! 10% discount added.");
    } else {
      toast.error("Invalid coupon code!");
    }
  };

  const finalAmount = totalAmount - discount;
  const shipping = finalAmount > 500 ? 0 : 60;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-8xl mb-6 block">🛒</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Add some books or gadgets to get started!</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Shopping Cart
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} item{items.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { clearCart(); toast.success("Cart cleared!"); }}
          className="text-sm text-red-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-4 flex gap-4">
              {/* Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                {item.image}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  ৳{item.discountPrice || item.price} each
                </p>

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-[var(--muted)] rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Subtotal */}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </span>
                    {/* Remove */}
                    <button
                      onClick={() => { removeItem(item.id); toast.success("Item removed!"); }}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coupon Code</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter code"
                    disabled={couponApplied}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleCoupon}
                  disabled={couponApplied}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ KITAB10 applied — 10% off!</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 dark:text-green-400">Free</span> : `৳${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add ৳{500 - totalAmount} more for free shipping</p>
              )}
              <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">৳{(finalAmount + shipping).toLocaleString()}</span>
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

            <Link href="/products" className="w-full flex items-center justify-center gap-2 py-3 mt-3 border border-[var(--border)] text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}