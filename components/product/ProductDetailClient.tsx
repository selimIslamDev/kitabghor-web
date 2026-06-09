"use client";

import { useState } from "react";
import { ShoppingCart, Star, Heart, ArrowLeft, Plus, Minus, CheckCircle, Truck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useProduct, useProductReviews, useAddToWishlist } from "@/lib/hooks";
import toast from "react-hot-toast";

export default function ProductDetailClient({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const { data: product, isLoading } = useProduct(id);
  const { data: reviewData } = useProductReviews(id);
  const { addItem } = useCartStore();
  const addToWishlist = useAddToWishlist();

  const reviews = reviewData?.data || [];

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0] || "📚",
        stock: product.stock,
      });
    }
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    if (!product) return;
    addToWishlist.mutate(product.id);
    setWishlisted(!wishlisted);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="h-96 bg-[var(--muted)] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-[var(--muted)] rounded w-1/3" />
            <div className="h-8 bg-[var(--muted)] rounded w-3/4" />
            <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
            <div className="h-12 bg-[var(--muted)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">📭</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
        <Link href="/products" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 transition">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{product.name}</span>
      </div>

      <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl h-96 flex items-center justify-center relative">
            <span className="text-9xl">{product.images?.[0] || "📚"}</span>
            {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {product.classLevel && (
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full">
                {product.classLevel}
              </span>
            )}
            {product.subject && (
              <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
                {product.subject}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            {product.name}
          </h1>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
            {product.author && <p>Author: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.author}</span></p>}
            {product.publisher && <p>Publisher: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.publisher}</span></p>}
            {product.edition && <p>Edition: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.edition}</span></p>}
            {product.brand && <p>Brand: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.brand}</span></p>}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              ৳{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <div>
                <span className="text-lg text-gray-400 line-through block">৳{product.price}</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Save ৳{product.price - product.discountPrice}
                </span>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4">
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center gap-3 bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`p-4 rounded-xl border-2 transition ${wishlisted ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500" : "border-[var(--border)] hover:border-red-300 text-gray-400 hover:text-red-500"}`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Delivery */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Truck className="w-4 h-4 text-blue-500" />
              Fast Delivery
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <RefreshCw className="w-4 h-4 text-green-500" />
              Easy Returns
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-4 border-b border-[var(--border)] mb-6">
          {(["description", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-semibold capitalize text-sm transition border-b-2 ${activeTab === tab ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              {tab} {tab === "reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === "description" ? (
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
        ) : (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : reviews.map((review: any) => (
              <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                      {review.user?.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.user?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}