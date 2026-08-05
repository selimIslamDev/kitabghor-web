"use client";

import { useState, MouseEvent, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartWithAuth, useProducts, Product } from "@/lib/hooks";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const sortOptions = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Most Popular",
];
const classLevels = ["All", "Class 8-9", "SSC", "HSC", "University"];
const subjects = ["All", "Math", "Physics", "Chemistry", "English", "Biology"];

const sortMap: Record<string, string> = {
  Newest: "newest",
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  "Most Popular": "popular",
};

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || undefined;

  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [classLevel, setClassLevel] = useState("All");
  const [subject, setSubject] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const { addItem } = useCartWithAuth();

  const { data, isLoading, isError } = useProducts({
    type: type === "ALL" ? undefined : type,
    categoryId,
    classLevel: classLevel === "All" ? undefined : classLevel,
    subject: subject === "All" ? undefined : subject,
    search: search || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sortMap[sort],
    page: 1,
    limit: 20,
  });

  const products: Product[] = data?.data || [];
  const total = data?.pagination?.total || 0;

  const handleAddToCart = (e: MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error("This product is out of stock!");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images?.[0] || "📚",
      stock: product.stock,
    });
    toast.success("Added to cart!");
  };

  const clearFilters = () => {
    setSearch("");
    setType("ALL");
    setClassLevel("All");
    setSubject("All");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Shop
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {total} products found
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          >
            {sortOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition text-sm font-medium sm:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside
          className={`${showFilter ? "block" : "hidden"} sm:block w-full sm:w-64 flex-shrink-0`}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear All
              </button>
            </div>

            {/* Type */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Product Type
              </p>
              <div className="flex flex-col gap-2">
                {["ALL", "BOOK", "GADGET"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${type === t ? "bg-violet-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"}`}
                  >
                    {t === "ALL"
                      ? "All Products"
                      : t === "BOOK"
                        ? "📚 Books"
                        : "🔧 Gadgets"}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Level */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Class Level
              </p>
              <div className="flex flex-col gap-2">
                {classLevels.map((c) => (
                  <button
                    key={c}
                    onClick={() => setClassLevel(c)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${classLevel === c ? "bg-violet-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Subject
              </p>
              <div className="flex flex-col gap-2">
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${subject === s ? "bg-violet-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Price Range (৳)
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-800 overflow-hidden animate-pulse p-3"
                >
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

          {/* Error */}
          {isError && (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Failed to load products
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please check if the backend is running.
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your filters
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (e: MouseEvent, product: Product) => void;
}) {
  const validImages = (product.images || []).filter((img) => img && img.startsWith("http"));
  const hasMultipleImages = validImages.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDiscounted = !!product.discountPrice;
  const activePrice = product.discountPrice || product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
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

        {/* Class Level Badge */}
        {product.classLevel && (
          <div className="absolute top-2 right-2 z-20 bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-[9px] font-semibold px-2 py-0.5 rounded">
            {product.classLevel}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Product Image */}
        {validImages.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {validImages.map((src, idx) => (
              <Image
                key={src + idx}
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 40vw, (max-width: 1200px) 25vw, 25vw"
                className={`object-contain transition-all duration-300 ease-in-out p-1 ${
                  idx === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
            <span className="text-3xl">
              {product.productType === "BOOK" ? "📚" : "🔧"}
            </span>
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
            onClick={(e) => onAddToCart(e, product)}
            disabled={product.stock === 0}
            className={`w-full py-2 px-2 rounded text-xs font-bold transition-all shadow-md ${
              product.stock === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#0095DA] hover:bg-[#0082BF] text-white active:scale-95"
            }`}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-2.5 text-center flex flex-col justify-between flex-1 bg-white dark:bg-slate-800">
        <div>
          {product.subject && (
            <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              {product.subject}
            </p>
          )}

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-xs font-medium text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-[#0095DA] transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 line-clamp-1">
            {product.author || product.brand || "KitabGhor"}
          </p>

          <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
            {product.stock === 0 ? (
              <span className="text-red-500">Out of Stock</span>
            ) : (
              "Product In Stock"
            )}
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-1">
            {isDiscounted && (
              <span className="text-[10px] text-gray-400 line-through">
                TK. {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-xs font-bold text-gray-800 dark:text-white">
              TK. {activePrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* HOVER BOTTOM FOOTER: View Details Link only pops up when HOVERED */}
      <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        <Link
          href={`/products/${product.id}`}
          className="w-full py-2 bg-[#F1F3F6] hover:bg-[#E5E8ED] dark:bg-slate-700/60 dark:hover:bg-slate-700 text-[#0095DA] dark:text-sky-400 text-[11px] font-semibold text-center transition-colors border-t border-gray-100 dark:border-slate-700 block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}





// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import {
//   Search,
//   SlidersHorizontal,
//   X,
//   ShoppingCart,
//   Star,
//   ChevronDown,
// } from "lucide-react";
// import { useCartWithAuth, useProducts, Product } from "@/lib/hooks";
// import toast from "react-hot-toast";
// import Link from "next/link";

// const sortOptions = [
//   "Newest",
//   "Price: Low to High",
//   "Price: High to Low",
//   "Most Popular",
// ];
// const classLevels = ["All", "Class 8-9", "SSC", "HSC", "University"];
// const subjects = ["All", "Math", "Physics", "Chemistry", "English", "Biology"];

// const sortMap: Record<string, string> = {
//   Newest: "newest",
//   "Price: Low to High": "price_asc",
//   "Price: High to Low": "price_desc",
//   "Most Popular": "popular",
// };

// export default function ProductsClient() {
//   const searchParams = useSearchParams();
//   const categoryId = searchParams.get("categoryId") || undefined;

//   const [search, setSearch] = useState("");
//   const [type, setType] = useState("ALL");
//   const [classLevel, setClassLevel] = useState("All");
//   const [subject, setSubject] = useState("All");
//   const [sort, setSort] = useState("Newest");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [showFilter, setShowFilter] = useState(false);
//   const { addItem } = useCartWithAuth();

//   const { data, isLoading, isError } = useProducts({
//     type: type === "ALL" ? undefined : type,
//     categoryId,
//     classLevel: classLevel === "All" ? undefined : classLevel,
//     subject: subject === "All" ? undefined : subject,
//     search: search || undefined,
//     minPrice: minPrice ? Number(minPrice) : undefined,
//     maxPrice: maxPrice ? Number(maxPrice) : undefined,
//     sort: sortMap[sort],
//     page: 1,
//     limit: 20,
//   });

//   const products: Product[] = data?.data || [];
//   const total = data?.pagination?.total || 0;

//   const handleAddToCart = (e: React.MouseEvent, product: Product) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const success = addItem({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       discountPrice: product.discountPrice,
//       image: product.images?.[0] || "📚",
//       stock: product.stock,
//     });
//     if (success) toast.success(`${product.name} added to cart!`);
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setType("ALL");
//     setClassLevel("All");
//     setSubject("All");
//     setMinPrice("");
//     setMaxPrice("");
//   };

//   const getProductImage = (product: Product) => {
//     const img = product.images?.[0];
//     if (img && img.startsWith("http")) return { type: "url" as const, src: img };
//     return { type: "emoji" as const, src: product.productType === "BOOK" ? "📚" : "🔧" };
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1
//           className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
//           style={{ fontFamily: "Poppins, sans-serif" }}
//         >
//           Shop
//         </h1>
//         <p className="text-gray-500 dark:text-gray-400">
//           {total} products found
//         </p>
//       </div>

//       {/* Search + Sort */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <div className="relative flex-1">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search products..."
//             className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//           />
//         </div>
//         <div className="relative">
//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//           >
//             {sortOptions.map((o) => (
//               <option key={o}>{o}</option>
//             ))}
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//         </div>
//         <button
//           onClick={() => setShowFilter(!showFilter)}
//           className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition text-sm font-medium sm:hidden"
//         >
//           <SlidersHorizontal className="w-4 h-4" />
//           Filters
//         </button>
//       </div>

//       <div className="flex gap-8">
//         {/* Sidebar */}
//         <aside
//           className={`${showFilter ? "block" : "hidden"} sm:block w-full sm:w-64 flex-shrink-0`}
//         >
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 sticky top-20">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="font-bold text-gray-900 dark:text-white">
//                 Filters
//               </h3>
//               <button
//                 onClick={clearFilters}
//                 className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
//               >
//                 <X className="w-3 h-3" /> Clear All
//               </button>
//             </div>

//             {/* Type */}
//             <div className="mb-6">
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                 Product Type
//               </p>
//               <div className="flex flex-col gap-2">
//                 {["ALL", "BOOK", "GADGET"].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setType(t)}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${type === t ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
//                   >
//                     {t === "ALL"
//                       ? "All Products"
//                       : t === "BOOK"
//                         ? "📚 Books"
//                         : "🔧 Gadgets"}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Class Level */}
//             <div className="mb-6">
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                 Class Level
//               </p>
//               <div className="flex flex-col gap-2">
//                 {classLevels.map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => setClassLevel(c)}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${classLevel === c ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
//                   >
//                     {c}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Subject */}
//             <div className="mb-6">
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                 Subject
//               </p>
//               <div className="flex flex-col gap-2">
//                 {subjects.map((s) => (
//                   <button
//                     key={s}
//                     onClick={() => setSubject(s)}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${subject === s ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div>
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                 Price Range (৳)
//               </p>
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   value={minPrice}
//                   onChange={(e) => setMinPrice(e.target.value)}
//                   placeholder="Min"
//                   className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="number"
//                   value={maxPrice}
//                   onChange={(e) => setMaxPrice(e.target.value)}
//                   placeholder="Max"
//                   className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Products Grid */}
//         <div className="flex-1">
//           {/* Loading */}
//           {isLoading && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse"
//                 >
//                   <div className="h-44 bg-[var(--muted)]" />
//                   <div className="p-4 space-y-3">
//                     <div className="h-3 bg-[var(--muted)] rounded w-1/3" />
//                     <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
//                     <div className="h-3 bg-[var(--muted)] rounded w-1/2" />
//                     <div className="h-8 bg-[var(--muted)] rounded" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Error */}
//           {isError && (
//             <div className="text-center py-20">
//               <span className="text-6xl mb-4 block">⚠️</span>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                 Failed to load products
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400">
//                 Please check if the backend is running.
//               </p>
//             </div>
//           )}

//           {/* Empty */}
//           {!isLoading && !isError && products.length === 0 && (
//             <div className="text-center py-20">
//               <span className="text-6xl mb-4 block">📭</span>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                 No products found
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 mb-4">
//                 Try adjusting your filters
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}

//           {/* Grid */}
//           {!isLoading && !isError && products.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((product) => {
//                 const image = getProductImage(product);
//                 return (
//                   <Link
//                     key={product.id}
//                     href={`/products/${product.id}`}
//                     className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
//                   >
//                     {/* Image */}
//                     <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 h-44 flex items-center justify-center overflow-hidden">
//                       {image.type === "url" ? (
//                         <img
//                           src={image.src}
//                           alt={product.name}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                         />
//                       ) : (
//                         <span className="text-6xl group-hover:scale-110 transition-transform duration-200">
//                           {image.src}
//                         </span>
//                       )}
//                       {product.discountPrice && (
//                         <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
//                           {Math.round(
//                             ((product.price - product.discountPrice) /
//                               product.price) *
//                               100,
//                           )}
//                           % OFF
//                         </div>
//                       )}
//                       {product.stock <= 5 && product.stock > 0 && (
//                         <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
//                           Only {product.stock} left!
//                         </div>
//                       )}
//                       {product.stock === 0 && (
//                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
//                           <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl">
//                             Out of Stock
//                           </span>
//                         </div>
//                       )}
//                       {product.classLevel && (
//                         <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg">
//                           {product.classLevel}
//                         </div>
//                       )}
//                     </div>

//                     {/* Info */}
//                     <div className="p-4">
//                       {product.subject && (
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                           {product.subject}
//                         </p>
//                       )}
//                       <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
//                         {product.name}
//                       </h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
//                         by {product.author || product.brand || "KitabGhor"}
//                       </p>
//                       <div className="flex items-center gap-1 mb-3">
//                         <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                           {product._count && product._count.reviews > 0 ? "4.8" : "New"}
//                         </span>
//                         <span className="text-xs text-gray-400">
//                           ({product._count?.reviews || 0})
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2 mb-4">
//                         <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                           ৳{product.discountPrice || product.price}
//                         </span>
//                         {product.discountPrice && (
//                           <span className="text-sm text-gray-400 line-through">
//                             ৳{product.price}
//                           </span>
//                         )}
//                       </div>
//                       <button
//                         onClick={(e) => handleAddToCart(e, product)}
//                         disabled={product.stock === 0}
//                         className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition ${
//                           product.stock === 0
//                             ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
//                             : "bg-blue-600 hover:bg-blue-700 text-white"
//                         }`}
//                       >
//                         <ShoppingCart className="w-4 h-4" />
//                         {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                       </button>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }