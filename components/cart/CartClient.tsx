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

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8">
          <span className="text-6xl">🛒</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-10">
          Add some books or gadgets to get started!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/25"
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
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Your Cart
          </h1>
          <p className="text-gray-400 mt-1">{items.length} items</p>
        </div>
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared!");
          }}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium transition px-4 py-2 rounded-xl hover:bg-red-500/10"
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
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-amber-500/30 transition-all duration-300"
              >
                {/* Soft glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
                  {image.type === "url" ? (
                    <img
                      src={image.src}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{image.src}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-base sm:text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-amber-400/90 mt-0.5">
                    ৳{(item.discountPrice || item.price).toLocaleString()} each
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price + Delete */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className="font-bold text-lg text-amber-400">
                    ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success("Item removed!");
                    }}
                    className="p-2 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary - Glass Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/40">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-sm transition"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3.5 mb-6">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-400 font-medium" : ""}>
                  {shipping === 0 ? "Free" : `৳${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Add ৳{(500 - totalAmount).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="font-bold text-white text-lg">Total</span>
                <span className="text-2xl font-bold text-amber-400">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button - Matching your screenshot color */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/products"
              className="w-full flex items-center justify-center py-3.5 mt-3 border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-2xl text-sm font-medium transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}