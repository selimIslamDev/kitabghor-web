"use client";

import Link from "next/link";
import { ShoppingCart, Star, ArrowRight, Heart } from "lucide-react";
import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
import toast from "react-hot-toast";

interface Book {
  id: string;
  name: string;
  author?: string;
  price: number;
  discountPrice?: number | null;
  images?: string[];
  stock: number;
  classLevel?: string;
  subject?: string;
  productType?: string;
  _count?: { reviews?: number };
}

export default function FeaturedBooks() {
  const { addItem } = useCartWithAuth();
  const { data: products, isLoading } = useFeaturedProducts();

  const books: Book[] =
    (products as Book[] | undefined)?.filter((p) => p.productType === "BOOK").slice(0, 4) || [];

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, book: Book) => {
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

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border border-[var(--border)] overflow-hidden animate-pulse p-5">
                <div className="h-56 bg-[var(--muted)] rounded-2xl mb-4" />
                <div className="h-3 bg-[var(--muted)] rounded w-1/3 mb-2" />
                <div className="h-4 bg-[var(--muted)] rounded w-3/4 mb-3" />
                <div className="h-10 bg-[var(--muted)] rounded-full" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.length > 0 ? books.map((book) => {
              const discountPercent = book.discountPrice
                ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
                : null;

              return (
                <Link
                  key={book.id}
                  href={`/products/${book.id}`}
                  className="relative bg-white dark:bg-slate-800 rounded-3xl border border-[var(--border)] p-5 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group block"
                >
                  {/* Book cover */}
                  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl h-56 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                    {book.images?.[0] && book.images[0].startsWith("http") ? (
                      <img
                        src={book.images[0]}
                        alt={book.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-200">
                        {book.images?.[0] || "📚"}
                      </span>
                    )}

                    {book.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {book.classLevel && (
                      <div className="absolute top-3 left-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg">
                        {book.classLevel}
                      </div>
                    )}
                  </div>

                  {/* Scalloped discount seal - overlapping cover top-right */}
                  {discountPercent && (
                    <div className="absolute -top-2 right-3 z-10 w-16 h-16">
                      <div className="absolute inset-0 bg-red-500 rounded-lg rotate-0 shadow-lg" />
                      <div className="absolute inset-0 bg-red-500 rounded-lg rotate-45 shadow-lg" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-extrabold leading-none">
                        <span className="text-sm">{discountPercent}%</span>
                        <span className="text-[9px] font-semibold">offers</span>
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <h3 className="font-extrabold text-lg uppercase tracking-wide text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1">
                    {book.name}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">{book.author || "Unknown"}</p>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {book._count?.reviews && book._count.reviews > 0 ? "4.8" : "New"}/5
                    </span>
                    <span className="text-xs text-gray-400">
                      ({book._count?.reviews || 0} Reviews)
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      ৳{book.discountPrice || book.price}
                    </span>
                    {book.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">৳{book.price}</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Stock Available: {book.stock} Unit{book.stock === 1 ? "" : "s"}
                  </p>

                  {/* Split pill action button */}
                  <div className="flex items-center rounded-full overflow-hidden">
                    <button
                      onClick={(e) => handleAddToCart(e, book)}
                      disabled={book.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-bold text-sm tracking-wide transition ${
                        book.stock === 0
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {book.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="flex items-center gap-1 px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs tracking-wide transition"
                    >
                      <Heart className="w-4 h-4" />
                      WISHLIST
                    </button>
                  </div>
                </Link>
              );
            }) : (
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











// "use client";

// import Link from "next/link";
// import { ShoppingCart, Star, ArrowRight } from "lucide-react";
// import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
// import toast from "react-hot-toast";

// export default function FeaturedBooks() {
//   const { addItem } = useCartWithAuth();
//   const { data: products, isLoading } = useFeaturedProducts();

//   const books = products?.filter((p: any) => p.productType === "BOOK").slice(0, 4) || [];

//   const handleAddToCart = (e: React.MouseEvent, book: any) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (book.stock === 0) {
//       toast.error("This product is out of stock!");
//       return;
//     }
//     const success = addItem({
//       id: book.id,
//       name: book.name,
//       price: book.price,
//       discountPrice: book.discountPrice,
//       image: book.images?.[0] || "📚",
//       stock: book.stock,
//     });
//     if (success) toast.success(`${book.name} added to cart!`);
//   };

//   return (
//     <section className="py-16 bg-[var(--card)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-10">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
//               Popular Books
//             </h2>
//             <p className="text-gray-500 dark:text-gray-400">Most loved books by students</p>
//           </div>
//           <Link href="/products?type=BOOK" className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
//             View All <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         {/* Skeleton */}
//         {isLoading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
//                 <div className="h-48 bg-[var(--muted)]" />
//                 <div className="p-4 space-y-3">
//                   <div className="h-3 bg-[var(--muted)] rounded w-1/3" />
//                   <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
//                   <div className="h-8 bg-[var(--muted)] rounded" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {!isLoading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {books.length > 0 ? books.map((book: any) => (
//               <Link
//                 key={book.id}
//                 href={`/products/${book.id}`}
//                 className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
//               >
//                 {/* Image */}
//                 <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 h-48 flex items-center justify-center overflow-hidden">
//                   {book.images?.[0] && book.images[0].startsWith("http") ? (
//                     <img
//                       src={book.images[0]}
//                       alt={book.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                     />
//                   ) : (
//                     <span className="text-7xl group-hover:scale-110 transition-transform duration-200">
//                       {book.images?.[0] || "📚"}
//                     </span>
//                   )}

//                   {/* Out of Stock Overlay */}
//                   {book.stock === 0 && (
//                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                       <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl">
//                         Out of Stock
//                       </span>
//                     </div>
//                   )}

//                   {/* Low Stock Badge */}
//                   {book.stock <= 5 && book.stock > 0 && (
//                     <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
//                       Only {book.stock} left!
//                     </div>
//                   )}

//                   {/* Discount Badge */}
//                   {book.discountPrice && (
//                     <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
//                       {Math.round(((book.price - book.discountPrice) / book.price) * 100)}% OFF
//                     </div>
//                   )}

//                   {/* Class Level Badge */}
//                   {book.classLevel && (
//                     <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg">
//                       {book.classLevel}
//                     </div>
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div className="p-4">
//                   {book.subject && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{book.subject}</p>}
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{book.name}</h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by {book.author || "Unknown"}</p>
//                   <div className="flex items-center gap-1 mb-3">
//                     <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {book._count?.reviews > 0 ? "4.8" : "New"}
//                     </span>
//                     <span className="text-xs text-gray-400">({book._count?.reviews || 0})</span>
//                   </div>
//                   <div className="flex items-center gap-2 mb-4">
//                     <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                       ৳{book.discountPrice || book.price}
//                     </span>
//                     {book.discountPrice && (
//                       <span className="text-sm text-gray-400 line-through">৳{book.price}</span>
//                     )}
//                   </div>
//                   <button
//                     onClick={(e) => handleAddToCart(e, book)}
//                     disabled={book.stock === 0}
//                     className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition ${
//                       book.stock === 0
//                         ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700 text-white"
//                     }`}
//                   >
//                     <ShoppingCart className="w-4 h-4" />
//                     {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                   </button>
//                 </div>
//               </Link>
//             )) : (
//               <div className="col-span-4 text-center py-10 text-gray-500 dark:text-gray-400">
//                 No books available yet.
//               </div>
//             )}
//           </div>
//         )}

//         <div className="sm:hidden mt-6 text-center">
//           <Link href="/products?type=BOOK" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
//             View All Books <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }