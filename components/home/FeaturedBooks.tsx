"use client";

import Link from "next/link";
import Image from "next/image";
import { MouseEvent } from "react";
import { ShoppingCart, Star, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
import toast from "react-hot-toast";

interface Book {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  images?: string[];
  stock: number;
  productType: string;
  author?: string | null;
  subject?: string | null;
  classLevel?: string | null;
  _count?: {
    reviews: number;
  };
}

export default function FeaturedBooks() {
  const { addItem } = useCartWithAuth();
  const { data: products, isLoading } = useFeaturedProducts();

  const books: Book[] =
    (products as Book[] | undefined)?.filter((p) => p.productType === "BOOK").slice(0, 4) || [];

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, book: Book) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.stock === 0) {
      toast.error("This product is out of stock!");
      return;
    }
    const success = addItem({
      id: book.id,
      name: book.name,
      price: book.price,
      discountPrice: book.discountPrice ?? undefined,
      image: book.images?.[0] || "📚",
      stock: book.stock,
    });
    if (success) toast.success(`${book.name} added to cart!`);
  };

  return (
    <section className="py-16 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-gray-100 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending Collection</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              Popular Books
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Most loved and highly recommended books by students
            </p>
          </div>

          <Link
            href="/products?type=BOOK"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 group"
          >
            <span>View All Books</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Skeleton Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 animate-pulse space-y-4">
                <div className="h-56 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/3" />
                  <div className="h-5 bg-slate-100 dark:bg-slate-700/50 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
                </div>
                <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-xl pt-2" />
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.length > 0 ? (
              books.map((book) => {
                const isDiscounted = !!book.discountPrice;
                const activePrice = book.discountPrice || book.price;
                const discountPercent = isDiscounted
                  ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
                  : 0;

                return (
                  <Link
                    key={book.id}
                    href={`/products/${book.id}`}
                    className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-100 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-800 dark:to-slate-700/50 h-60 flex items-center justify-center p-4 overflow-hidden">
                        
                        {book.images?.[0] && book.images[0].startsWith("http") ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={book.images[0]}
                              alt={book.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 ease-out"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-110 transition-transform duration-300">
                            {book.images?.[0] ? (
                              <span className="text-6xl">{book.images[0]}</span>
                            ) : (
                              <BookOpen className="w-16 h-16 stroke-[1.5]" />
                            )}
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          {isDiscounted ? (
                            <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          ) : <span />}

                          {book.classLevel && (
                            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-gray-200/50 dark:border-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                              {book.classLevel}
                            </span>
                          )}
                        </div>

                        {/* Stock Overlay / Badge */}
                        {book.stock === 0 ? (
                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider">
                              Out of Stock
                            </span>
                          </div>
                        ) : book.stock <= 5 ? (
                          <span className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                            Only {book.stock} left!
                          </span>
                        ) : null}
                      </div>

                      {/* Info Container */}
                      <div className="p-5">
                        {book.subject && (
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                            {book.subject}
                          </span>
                        )}

                        <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {book.name}
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-3">
                          by <span className="font-medium text-gray-700 dark:text-gray-300">{book.author || "Unknown Author"}</span>
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-4">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              {book._count && book._count.reviews > 0 ? "4.8" : "New"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            ({book._count?.reviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Price & Action Button */}
                    <div className="px-5 pb-5 pt-0">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                          ৳{activePrice}
                        </span>
                        {isDiscounted && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            ৳{book.price}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, book)}
                        disabled={book.stock === 0}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-200 ${
                          book.stock === 0
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 active:scale-[0.98]"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  No books available at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/products?type=BOOK"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30"
          >
            <span>View All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}