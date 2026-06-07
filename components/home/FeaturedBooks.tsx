"use client";

import Link from "next/link";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";

const books = [
  {
    id: "1",
    name: "SSC Physics Guide",
    author: "Abdul Alim",
    price: 280,
    discountPrice: 250,
    rating: 4.8,
    reviews: 124,
    classLevel: "SSC",
    subject: "Physics",
    image: "📘",
    stock: 50,
  },
  {
    id: "2",
    name: "HSC Higher Math",
    author: "Dr. Abdul Matin",
    price: 320,
    discountPrice: 290,
    rating: 4.9,
    reviews: 98,
    classLevel: "HSC",
    subject: "Math",
    image: "📙",
    stock: 30,
  },
  {
    id: "3",
    name: "HSC Chemistry",
    author: "Prof. Rezaul Karim",
    price: 300,
    discountPrice: 270,
    rating: 4.7,
    reviews: 76,
    classLevel: "HSC",
    subject: "Chemistry",
    image: "📗",
    stock: 40,
  },
  {
    id: "4",
    name: "SSC English Grammar",
    author: "M. A. Malek",
    price: 200,
    discountPrice: 180,
    rating: 4.6,
    reviews: 210,
    classLevel: "SSC",
    subject: "English",
    image: "📕",
    stock: 60,
  },
];

export default function FeaturedBooks() {
  const { addItem } = useCartStore();

  const handleAddToCart = (book: typeof books[0]) => {
    addItem({
      id: book.id,
      name: book.name,
      price: book.price,
      discountPrice: book.discountPrice,
      image: book.image,
      stock: book.stock,
    });
    toast.success(`${book.name} added to cart!`);
  };

  return (
    <section className="py-16 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Popular Books
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Most loved books by students</p>
          </div>
          <Link
            href="/products?type=BOOK"
            className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
            >
              {/* Book Cover */}
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 h-48 flex items-center justify-center">
                <span className="text-7xl">{book.image}</span>
                {book.discountPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {Math.round(((book.price - book.discountPrice) / book.price) * 100)}% OFF
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg">
                  {book.classLevel}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{book.subject}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{book.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by {book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{book.rating}</span>
                  <span className="text-xs text-gray-400">({book.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ৳{book.discountPrice || book.price}
                  </span>
                  {book.discountPrice && (
                    <span className="text-sm text-gray-400 line-through">৳{book.price}</span>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleAddToCart(book)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden mt-6 text-center">
          <Link href="/products?type=BOOK" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
            View All Books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}