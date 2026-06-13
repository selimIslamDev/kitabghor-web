"use client";

import Link from "next/link";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useFeaturedProducts } from "@/lib/hooks";
import toast from "react-hot-toast";

export default function FeaturedBooks() {
  const { addItem } = useCartStore();
  const { data: products, isLoading } = useFeaturedProducts();

  const books = products?.filter((p: any) => p.productType === "BOOK").slice(0, 4) || [];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images?.[0] || "📚",
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="py-16 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Popular Books
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Most loved books by students</p>
          </div>
          <Link href="/products?type=BOOK" className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
                <div className="h-48 bg-[var(--muted)]" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[var(--muted)] rounded w-1/3" />
                  <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
                  <div className="h-8 bg-[var(--muted)] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.length > 0 ? books.map((book: any) => (
              <Link
                key={book.id}
                href={`/products/${book.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
              >
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 h-48 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-200">
                    {book.images?.[0] || "📚"}
                  </span>
                  {book.discountPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {Math.round(((book.price - book.discountPrice) / book.price) * 100)}% OFF
                    </div>
                  )}
                  {book.classLevel && (
                    <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg">
                      {book.classLevel}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {book.subject && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{book.subject}</p>}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{book.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by {book.author || "Unknown"}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {book._count?.reviews > 0 ? "4.8" : "New"}
                    </span>
                    <span className="text-xs text-gray-400">({book._count?.reviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ৳{book.discountPrice || book.price}
                    </span>
                    {book.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">৳{book.price}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, book)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </Link>
            )) : (
              <div className="col-span-4 text-center py-10 text-gray-500 dark:text-gray-400">
                No books available yet.
              </div>
            )}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/products?type=BOOK" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
            View All Books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}