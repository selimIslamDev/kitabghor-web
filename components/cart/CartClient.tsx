"use client";

import { useCartStore } from "@/store/cart.store";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartClient() {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");

  const shipping = totalAmount > 500 ? 0 : 60;
  const discount = 15;
  const total = totalAmount + shipping - discount;

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-white/5 mb-8">
            <span className="text-6xl">🛒</span>
          </div>
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-10">Add some books to get started!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/25"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Your Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => {
              const image = getItemImage(item.image);

              // Safe access
              const author = item.author || null;
              const edition = item.edition || null;

              return (
                <div
                  key={item.id}
                  className="relative bg-[#121212] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.08)] hover:shadow-[0_0_28px_rgba(234,179,8,0.16)]"
                >
                  <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                    {/* Book Cover */}
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 shadow-lg">
                      {image.type === "url" ? (
                        <img
                          src={image.src}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {image.src}
                        </div>
                      )}
                    </div>

                    {/* Info (mobile: sits beside cover) */}
                    <div className="flex-1 min-w-0 sm:hidden">
                      <h3 className="font-semibold text-white text-lg leading-tight">
                        {item.name}
                      </h3>
                      {author && (
                        <p className="text-sm text-gray-400 mt-1">{author}</p>
                      )}
                      {edition && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-md bg-yellow-500/15 text-yellow-400">
                          {edition}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info (desktop) + Price/Quantity row (all sizes) */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="hidden sm:block">
                      <h3 className="font-semibold text-white text-lg leading-tight">
                        {item.name}
                      </h3>

                      {author && (
                        <p className="text-sm text-gray-400 mt-1">{author}</p>
                      )}

                      {edition && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-md bg-yellow-500/15 text-yellow-400">
                          {edition}
                        </span>
                      )}
                    </div>

                    {/* Price + Quantity */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <span className="text-xl font-bold text-yellow-400">
                        ৳{(item.discountPrice || item.price).toLocaleString()}
                      </span>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-yellow-500/10 text-white transition cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-yellow-500/10 text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success("Item removed!");
                          }}
                          className="flex items-center gap-1.5 text-sm text-yellow-500/80 hover:text-yellow-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-[#121212] rounded-2xl p-6 shadow-[0_0_30px_rgba(234,179,8,0.12)]">
              <h2 className="text-xl font-semibold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-emerald-400 font-medium"
                        : "text-white"
                    }
                  >
                    {shipping === 0 ? "Free" : `৳${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-yellow-400">
                    -৳{discount.toLocaleString()}
                  </span>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <span className="font-semibold text-white text-lg">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-yellow-400">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-300">
                    Apply Coupon Code
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 rounded-xl bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-5 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/30"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}