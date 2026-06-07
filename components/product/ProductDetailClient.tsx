"use client";

import { useState } from "react";
import { ShoppingCart, Star, Heart, ArrowLeft, Plus, Minus, CheckCircle, Truck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";

const mockProduct = {
  id: "1",
  name: "SSC Physics Guide 2024",
  author: "Abdul Alim",
  publisher: "Panjeree Publications",
  edition: "2024",
  classLevel: "SSC",
  subject: "Physics",
  price: 280,
  discountPrice: 250,
  stock: 50,
  rating: 4.8,
  reviews: 124,
  image: "📘",
  type: "BOOK",
  description: "A comprehensive guide for SSC Physics covering all chapters with detailed explanations, solved examples, and practice questions. This book follows the latest NCTB curriculum and is perfect for SSC candidates.",
  features: [
    "Complete NCTB curriculum coverage",
    "Chapter-wise solved examples",
    "Previous year question solutions",
    "Practice questions with answers",
    "Easy to understand language",
  ],
};

const mockReviews = [
  { id: 1, name: "Rahul Ahmed", rating: 5, comment: "Excellent book! Very helpful for SSC preparation.", date: "2024-01-15" },
  { id: 2, name: "Fatima Begum", rating: 4, comment: "Good content, well organized chapters.", date: "2024-01-10" },
  { id: 3, name: "Karim Hassan", rating: 5, comment: "Best physics book for SSC. Highly recommended!", date: "2024-01-05" },
];

const relatedProducts = [
  { id: "2", name: "SSC Chemistry Guide", price: 270, discountPrice: 240, image: "📗", rating: 4.7 },
  { id: "3", name: "SSC Math Guide", price: 290, discountPrice: 260, image: "📙", rating: 4.8 },
  { id: "4", name: "SSC English Grammar", price: 200, discountPrice: 180, image: "📕", rating: 4.6 },
];

export default function ProductDetailClient({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        discountPrice: mockProduct.discountPrice,
        image: mockProduct.image,
        stock: mockProduct.stock,
      });
    }
    toast.success(`${quantity}x ${mockProduct.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 transition">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{mockProduct.name}</span>
      </div>

      {/* Back Button */}
      <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left — Image */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl h-96 flex items-center justify-center mb-4 relative">
            <span className="text-9xl">{mockProduct.image}</span>
            {mockProduct.discountPrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                {Math.round(((mockProduct.price - mockProduct.discountPrice) / mockProduct.price) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {["📘", "📖", "📝"].map((img, i) => (
              <div key={i} className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center text-3xl cursor-pointer border-2 border-blue-500 hover:border-blue-600 transition">
                {img}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Info */}
        <div>
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full">
              {mockProduct.classLevel}
            </span>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
              {mockProduct.subject}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            {mockProduct.name}
          </h1>

          {/* Author Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
            <p>Author: <span className="text-gray-700 dark:text-gray-300 font-medium">{mockProduct.author}</span></p>
            <p>Publisher: <span className="text-gray-700 dark:text-gray-300 font-medium">{mockProduct.publisher}</span></p>
            <p>Edition: <span className="text-gray-700 dark:text-gray-300 font-medium">{mockProduct.edition}</span></p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(mockProduct.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{mockProduct.rating}</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">({mockProduct.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              ৳{mockProduct.discountPrice || mockProduct.price}
            </span>
            {mockProduct.discountPrice && (
              <div>
                <span className="text-lg text-gray-400 line-through block">৳{mockProduct.price}</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Save ৳{mockProduct.price - mockProduct.discountPrice}
                </span>
              </div>
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
                onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{mockProduct.stock} in stock</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={() => { setWishlisted(!wishlisted); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!"); }}
              className={`p-4 rounded-xl border-2 transition ${wishlisted ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500" : "border-[var(--border)] hover:border-red-300 text-gray-400 hover:text-red-500"}`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Features */}
          <div className="bg-[var(--card)] rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
            <ul className="space-y-2">
              {mockProduct.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Info */}
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
              {tab} {tab === "reviews" && `(${mockReviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === "description" ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{mockProduct.description}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
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

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {p.image}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{p.name}</h3>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">{p.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">৳{p.discountPrice}</span>
                  <span className="text-xs text-gray-400 line-through">৳{p.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}