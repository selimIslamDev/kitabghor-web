"use client";

import { useCartStore } from "@/store/cart.store";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartClient() {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = totalAmount > 500 ? 0 : 60;
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8">
          <span className="text-6xl">🛒</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-10">Add some books or gadgets to get started!</p>
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
    <div className="min-h-screen bg-[#05070d] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Your Cart
          </h1>
          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared!");
            }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 font-medium transition px-4 py-2 rounded-xl hover:bg-white/5"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const image = getItemImage(item.image);
              const price = item.discountPrice || item.price;
              return (
                <div
                  key={item.id}
                  className="bg-[#0d1117]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4"
                >
                  {/* Cover */}
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
                    {image.type === "url" ? (
                      <img src={image.src} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-amber-400/70" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base sm:text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-amber-400 mt-2">
                      ${price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition text-white disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Item removed!");
                      }}
                      className="flex items-center gap-1 text-xs font-medium text-amber-400/90 hover:text-amber-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#0d1117]/80 border border-amber-400/40 rounded-2xl p-6 shadow-[0_0_25px_-5px_rgba(251,191,36,0.25)]">
              <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Subtotal</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-400 font-medium" : ""}>
                    {shipping === 0 ? "Free" : `$${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-amber-400">
                    <span>Discount</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Coupon */}
              <div className="mb-5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-2">
                  <Tag className="w-3.5 h-3.5" />
                  Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-sm transition"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6 flex justify-between items-center">
                <span className="font-bold text-white text-lg">Total</span>
                <span className="text-2xl font-bold text-amber-400">
                  ${total.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button — original color kept */}
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
    </div>
  );
}