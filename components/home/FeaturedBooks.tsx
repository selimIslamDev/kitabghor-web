"use client";

import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
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
    addItem({
      id: book.id,
      name: book.name,
      price: book.price,
      discountPrice: book.discountPrice ?? undefined,
      image: book.images?.[0] || "📚",
      stock: book.stock,
    });
    toast.success("Added to cart!");
  };

  return (
    <section className="py-12 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Popular Books
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Most loved and highly recommended books by students
            </p>
          </div>

          <Link
            href="/products?type=BOOK"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 group"
          >
            <span>View All Books</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Skeleton Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-800 overflow-hidden animate-pulse p-3">
                <div className="h-36 bg-slate-200 dark:bg-slate-700/50 rounded" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {books.length > 0 ? (
              books.map((book) => (
                <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
              ))
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

      </div>
    </section>
  );
}

function BookCard({
  book,
  onAddToCart,
}: {
  book: Book;
  onAddToCart: (e: MouseEvent<HTMLButtonElement>, book: Book) => void;
}) {
  const validImages = (book.images || []).filter((img) => img && img.startsWith("http"));
  const hasMultipleImages = validImages.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDiscounted = !!book.discountPrice;
  const activePrice = book.discountPrice || book.price;
  const discountPercent = isDiscounted
    ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
    : 0;

  const startCycling = () => {
    if (!hasMultipleImages) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, 900);
  };

  const stopCycling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      className="group bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* Top Image Section */}
      <div className="relative bg-white dark:bg-slate-900 p-3.5 aspect-square w-full overflow-hidden flex items-center justify-center">
        
        {/* Round Yellow Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-2 left-2 z-20 bg-[#FDE047] text-gray-800 w-9 h-9 rounded-full flex flex-col items-center justify-center text-[9px] font-bold leading-tight shadow-sm border border-amber-200">
            <span>{discountPercent}%</span>
            <span className="text-[7px] font-medium uppercase">OFF</span>
          </div>
        )}

        {/* Stock Status Badge */}
        {book.stock === 0 && (
          <div className="absolute inset-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Book Cover Image */}
        {validImages.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {validImages.map((src, idx) => (
              <Image
                key={src + idx}
                src={src}
                alt={book.name}
                fill
                sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 20vw"
                className={`object-contain transition-all duration-300 ease-in-out p-1 ${
                  idx === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
            {book.images?.[0] ? (
              <span className="text-3xl">{book.images[0]}</span>
            ) : (
              <BookOpen className="w-10 h-10 stroke-[1.2]" />
            )}
          </div>
        )}

        {/* Multi-image Dots Indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-1 left-0 right-0 z-20 flex items-center justify-center gap-1">
            {validImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-2.5 bg-sky-500"
                    : "w-1 bg-gray-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>
        )}

        {/* HOVER OVERLAY: Add to Cart Button appears inside image section */}
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center p-3">
          <button
            onClick={(e) => onAddToCart(e, book)}
            disabled={book.stock === 0}
            className={`w-full py-2 px-2 rounded text-xs font-bold transition-all shadow-md ${
              book.stock === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#0095DA] hover:bg-[#0082BF] text-white active:scale-95"
            }`}
          >
            {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Book Info Section */}
      <div className="p-2.5 text-center flex flex-col justify-between flex-1 bg-white dark:bg-slate-800">
        <div>
          <Link href={`/products/${book.id}`} className="block">
            <h3 className="text-xs font-medium text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-[#0095DA] transition-colors">
              {book.name}
            </h3>
          </Link>

          {/* Author Name */}
          <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 line-clamp-1">
            {book.author || "Unknown Author"}
          </p>

          {/* Stock Status */}
          <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
            {book.stock === 0 ? (
              <span className="text-red-500">Out of Stock</span>
            ) : (
              "Product In Stock"
            )}
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {isDiscounted && (
              <span className="text-[10px] text-gray-400 line-through">
                TK. {book.price}
              </span>
            )}
            <span className="text-xs font-bold text-gray-800 dark:text-white">
              TK. {activePrice}
            </span>
          </div>
        </div>
      </div>

      {/* HOVER BOTTOM FOOTER: View Details Link only pops up when HOVERED */}
      <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        <Link
          href={`/products/${book.id}`}
          className="w-full py-2 bg-[#F1F3F6] hover:bg-[#E5E8ED] dark:bg-slate-700/60 dark:hover:bg-slate-700 text-[#0095DA] dark:text-sky-400 text-[11px] font-semibold text-center transition-colors border-t border-gray-100 dark:border-slate-700 block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

















// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { MouseEvent, useEffect, useRef, useState } from "react";
// import { ShoppingCart, Eye, BookOpen, Sparkles, ArrowRight } from "lucide-react";
// import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
// import toast from "react-hot-toast";

// interface Book {
//   id: string;
//   name: string;
//   price: number;
//   discountPrice?: number | null;
//   images?: string[];
//   stock: number;
//   productType: string;
//   author?: string | null;
//   subject?: string | null;
//   classLevel?: string | null;
//   _count?: {
//     reviews: number;
//   };
// }

// export default function FeaturedBooks() {
//   const { addItem } = useCartWithAuth();
//   const { data: products, isLoading } = useFeaturedProducts();

//   const books: Book[] =
//     (products as Book[] | undefined)?.filter((p) => p.productType === "BOOK").slice(0, 4) || [];

//   const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, book: Book) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (book.stock === 0) {
//       toast.error("This product is out of stock!");
//       return;
//     }
//     addItem({
//       id: book.id,
//       name: book.name,
//       price: book.price,
//       discountPrice: book.discountPrice ?? undefined,
//       image: book.images?.[0] || "📚",
//       stock: book.stock,
//     });
//     toast.success("Added to cart!");
//   };

//   return (
//     <section className="py-12 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
//           <div>
//             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-2">
//               <Sparkles className="w-3.5 h-3.5" />
//               <span>Trending Collection</span>
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
//               Popular Books
//             </h2>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//               Most loved and highly recommended books by students
//             </p>
//           </div>

//           <Link
//             href="/products?type=BOOK"
//             className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 group"
//           >
//             <span>View All Books</span>
//             <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//           </Link>
//         </div>

//         {/* Skeleton Loading */}
//         {isLoading && (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-800 overflow-hidden animate-pulse p-3">
//                 <div className="h-36 bg-slate-200 dark:bg-slate-700/50 rounded" />
//                 <div className="mt-3 space-y-2">
//                   <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full" />
//                   <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-2/3" />
//                   <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Product Grid */}
//         {!isLoading && (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
//             {books.length > 0 ? (
//               books.map((book) => (
//                 <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
//                 <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
//                 <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
//                   No books available at the moment.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }

// function BookCard({
//   book,
//   onAddToCart,
// }: {
//   book: Book;
//   onAddToCart: (e: MouseEvent<HTMLButtonElement>, book: Book) => void;
// }) {
//   const validImages = (book.images || []).filter((img) => img && img.startsWith("http"));
//   const hasMultipleImages = validImages.length > 1;

//   const [activeIndex, setActiveIndex] = useState(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const isDiscounted = !!book.discountPrice;
//   const activePrice = book.discountPrice || book.price;
//   const discountPercent = isDiscounted
//     ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
//     : 0;

//   const startCycling = () => {
//     if (!hasMultipleImages) return;
//     intervalRef.current = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % validImages.length);
//     }, 900);
//   };

//   const stopCycling = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     setActiveIndex(0);
//   };

//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   return (
//     <div
//       onMouseEnter={startCycling}
//       onMouseLeave={stopCycling}
//       className="group bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
//     >
//       {/* Top Image Section */}
//       <div className="relative bg-white dark:bg-slate-900 p-3.5 aspect-square w-full overflow-hidden flex items-center justify-center">
        
//         {/* Round Yellow Discount Badge */}
//         {isDiscounted && (
//           <div className="absolute top-2 left-2 z-20 bg-[#FDE047] text-gray-800 w-9 h-9 rounded-full flex flex-col items-center justify-center text-[9px] font-bold leading-tight shadow-sm border border-amber-200">
//             <span>{discountPercent}%</span>
//             <span className="text-[7px] font-medium uppercase">OFF</span>
//           </div>
//         )}

//         {/* Stock Status Badge */}
//         {book.stock === 0 && (
//           <div className="absolute inset-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
//             <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
//               Out of Stock
//             </span>
//           </div>
//         )}

//         {/* Book Cover Image */}
//         {validImages.length > 0 ? (
//           <div className="relative w-full h-full flex items-center justify-center">
//             {validImages.map((src, idx) => (
//               <Image
//                 key={src + idx}
//                 src={src}
//                 alt={book.name}
//                 fill
//                 sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 20vw"
//                 className={`object-contain transition-all duration-300 ease-in-out p-1 ${
//                   idx === activeIndex ? "opacity-100" : "opacity-0"
//                 }`}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
//             {book.images?.[0] ? (
//               <span className="text-3xl">{book.images[0]}</span>
//             ) : (
//               <BookOpen className="w-10 h-10 stroke-[1.2]" />
//             )}
//           </div>
//         )}

//         {/* Multi-image Dots Indicator */}
//         {hasMultipleImages && (
//           <div className="absolute bottom-1 left-0 right-0 z-20 flex items-center justify-center gap-1">
//             {validImages.map((_, idx) => (
//               <span
//                 key={idx}
//                 className={`h-1 rounded-full transition-all duration-300 ${
//                   idx === activeIndex
//                     ? "w-2.5 bg-sky-500"
//                     : "w-1 bg-gray-300 dark:bg-slate-600"
//                 }`}
//               />
//             ))}
//           </div>
//         )}

//         {/* HOVER OVERLAY: Add to Cart Button appears inside image section */}
//         <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center p-3">
//           <button
//             onClick={(e) => onAddToCart(e, book)}
//             disabled={book.stock === 0}
//             className={`w-full py-2 px-2 rounded text-xs font-bold transition-all shadow-md ${
//               book.stock === 0
//                 ? "bg-gray-400 text-white cursor-not-allowed"
//                 : "bg-[#0095DA] hover:bg-[#0082BF] text-white active:scale-95"
//             }`}
//           >
//             {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
//           </button>
//         </div>
//       </div>

//       {/* Book Info Section */}
//       <div className="p-2.5 text-center flex flex-col justify-between flex-1 bg-white dark:bg-slate-800">
//         <div>
//           <Link href={`/products/${book.id}`} className="block">
//             <h3 className="text-xs font-medium text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-[#0095DA] transition-colors">
//               {book.name}
//             </h3>
//           </Link>

//           {/* Author Name */}
//           <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 line-clamp-1">
//             {book.author || "Unknown Author"}
//           </p>

//           {/* Stock Status */}
//           <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
//             {book.stock === 0 ? (
//               <span className="text-red-500">Out of Stock</span>
//             ) : (
//               "Product In Stock"
//             )}
//           </p>

//           {/* Pricing */}
//           <div className="flex items-center justify-center gap-1.5 mt-1">
//             {isDiscounted && (
//               <span className="text-[10px] text-gray-400 line-through">
//                 TK. {book.price}
//               </span>
//             )}
//             <span className="text-xs font-bold text-gray-800 dark:text-white">
//               TK. {activePrice}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* HOVER BOTTOM FOOTER: View Details Link only pops up when HOVERED */}
//       <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 ease-in-out">
//         <Link
//           href={`/products/${book.id}`}
//           className="w-full py-2 bg-[#F1F3F6] hover:bg-[#E5E8ED] dark:bg-slate-700/60 dark:hover:bg-slate-700 text-[#0095DA] dark:text-sky-400 text-[11px] font-semibold text-center transition-colors border-t border-gray-100 dark:border-slate-700 block"
//         >
//           View Details
//         </Link>
//       </div>
//     </div>
//   );
// }




// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { MouseEvent, useEffect, useRef, useState } from "react";
// import { ShoppingCart, Star, ArrowRight, BookOpen, Sparkles } from "lucide-react";
// import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
// import toast from "react-hot-toast";

// interface Book {
//   id: string;
//   name: string;
//   price: number;
//   discountPrice?: number | null;
//   images?: string[];
//   stock: number;
//   productType: string;
//   author?: string | null;
//   subject?: string | null;
//   classLevel?: string | null;
//   _count?: {
//     reviews: number;
//   };
// }

// export default function FeaturedBooks() {
//   const { addItem } = useCartWithAuth();
//   const { data: products, isLoading } = useFeaturedProducts();

//   const books: Book[] =
//     (products as Book[] | undefined)?.filter((p) => p.productType === "BOOK").slice(0, 4) || [];

//   const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, book: Book) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (book.stock === 0) {
//       toast.error("This product is out of stock!");
//       return;
//     }
//     addItem({
//       id: book.id,
//       name: book.name,
//       price: book.price,
//       discountPrice: book.discountPrice ?? undefined,
//       image: book.images?.[0] || "📚",
//       stock: book.stock,
//     });
//   };

//   return (
//     <section className="py-16 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-gray-100 dark:border-slate-800 pb-6">
//           <div>
//             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-3">
//               <Sparkles className="w-3.5 h-3.5" />
//               <span>Trending Collection</span>
//             </div>
//             <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
//               Popular Books
//             </h2>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//               Most loved and highly recommended books by students
//             </p>
//           </div>

//           <Link
//             href="/products?type=BOOK"
//             className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 group"
//           >
//             <span>View All Books</span>
//             <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//           </Link>
//         </div>

//         {/* Skeleton Loading */}
//         {isLoading && (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-pulse">
//                 <div className="h-48 sm:h-56 bg-slate-100 dark:bg-slate-700/50" />
//                 <div className="p-3 space-y-2">
//                   <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full" />
//                   <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
//                   <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-2/3" />
//                   <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Product Grid */}
//         {!isLoading && (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {books.length > 0 ? (
//               books.map((book) => (
//                 <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
//                 <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
//                 <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
//                   No books available at the moment.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Mobile View All Link */}
//         <div className="sm:hidden mt-8 text-center">
//           <Link
//             href="/products?type=BOOK"
//             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30"
//           >
//             <span>View All Books</span>
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//       </div>
//     </section>
//   );
// }

// function BookCard({
//   book,
//   onAddToCart,
// }: {
//   book: Book;
//   onAddToCart: (e: MouseEvent<HTMLButtonElement>, book: Book) => void;
// }) {
//   const validImages = (book.images || []).filter((img) => img && img.startsWith("http"));
//   const hasMultipleImages = validImages.length > 1;

//   const [activeIndex, setActiveIndex] = useState(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const isDiscounted = !!book.discountPrice;
//   const activePrice = book.discountPrice || book.price;
//   const discountPercent = isDiscounted
//     ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
//     : 0;
//   const rating = book._count && book._count.reviews > 0 ? 5 : 4;

//   const startCycling = () => {
//     if (!hasMultipleImages) return;
//     intervalRef.current = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % validImages.length);
//     }, 900);
//   };

//   const stopCycling = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     setActiveIndex(0);
//   };

//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   return (
//     <Link
//       href={`/products/${book.id}`}
//       onMouseEnter={startCycling}
//       onMouseLeave={stopCycling}
//       className="group bg-white dark:bg-slate-800/90 rounded-xl border border-gray-100 dark:border-slate-700/60 overflow-hidden hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-500/40 transition-all duration-300 flex flex-col"
//     >
//       {/* Image */}
//       <div className="relative bg-slate-100 dark:bg-slate-800 aspect-square w-full overflow-hidden">
//         {isDiscounted && (
//           <span className="absolute top-2.5 left-2.5 z-10 bg-sky-500 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-sm">
//             {discountPercent}%
//           </span>
//         )}

//         {book.stock === 0 && (
//           <div className="absolute inset-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[1px] flex items-center justify-center">
//             <span className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
//               Out of Stock
//             </span>
//           </div>
//         )}

//         {validImages.length > 0 ? (
//           <>
//             {validImages.map((src, idx) => (
//               <Image
//                 key={src + idx}
//                 src={src}
//                 alt={book.name}
//                 fill
//                 sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
//                 className={`object-cover transition-opacity duration-300 ease-in-out ${
//                   idx === activeIndex ? "opacity-100" : "opacity-0"
//                 }`}
//               />
//             ))}

//             {/* Dots indicator, shown only when multiple images exist */}
//             {hasMultipleImages && (
//               <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1">
//                 {validImages.map((_, idx) => (
//                   <span
//                     key={idx}
//                     className={`h-1.5 rounded-full transition-all duration-300 ${
//                       idx === activeIndex
//                         ? "w-3.5 bg-violet-600"
//                         : "w-1.5 bg-white/80 dark:bg-slate-500 border border-slate-300/50"
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
//             {book.images?.[0] ? (
//               <span className="text-5xl">{book.images[0]}</span>
//             ) : (
//               <BookOpen className="w-14 h-14 stroke-[1.5]" />
//             )}
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="p-3 flex flex-col gap-1 flex-1">
//         <h3 className="text-sm text-gray-800 dark:text-gray-100 line-clamp-1 leading-snug">
//           {book.name}
//         </h3>

//         <span className={`text-xs font-semibold ${book.stock === 0 ? "text-red-500" : "text-green-600 dark:text-green-500"}`}>
//           {book.stock === 0 ? "Out of Stock" : "In Stock"}
//         </span>

//         <div className="flex items-center gap-0.5">
//           {[...Array(5)].map((_, idx) => (
//             <Star
//               key={idx}
//               className={`w-3.5 h-3.5 ${
//                 idx < rating
//                   ? "fill-amber-400 text-amber-400"
//                   : "fill-gray-200 text-gray-200 dark:fill-slate-700 dark:text-slate-700"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex items-baseline gap-2 mt-0.5">
//           {isDiscounted && (
//             <span className="text-xs text-gray-400 line-through">
//               Tk {book.price}
//             </span>
//           )}
//           <span className="text-base font-extrabold text-gray-900 dark:text-white">
//             Tk {activePrice}
//           </span>
//         </div>

//         <button
//           onClick={(e) => onAddToCart(e, book)}
//           disabled={book.stock === 0}
//           className={`mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-full font-semibold text-xs transition-all duration-200 ${
//             book.stock === 0
//               ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
//               : "bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98]"
//           }`}
//         >
//           <ShoppingCart className="w-3.5 h-3.5" />
//           {book.stock === 0 ? "Unavailable" : "Add to Cart"}
//         </button>
//       </div>
//     </Link>
//   );
// }