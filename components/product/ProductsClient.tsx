"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ShoppingCart, Star, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useProducts } from "@/lib/hooks";
import toast from "react-hot-toast";

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];
const classLevels = ["All", "Class 8-9", "SSC", "HSC", "University"];
const subjects = ["All", "Math", "Physics", "Chemistry", "English", "Biology"];

const sortMap: Record<string, string> = {
  "Newest": "newest",
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  "Most Popular": "popular",
};

export default function ProductsClient() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [classLevel, setClassLevel] = useState("All");
  const [subject, setSubject] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const { addItem } = useCartStore();

  const { data, isLoading, isError } = useProducts({
    type: type === "ALL" ? undefined : type,
    classLevel: classLevel === "All" ? undefined : classLevel,
    subject: subject === "All" ? undefined : subject,
    search: search || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sortMap[sort],
    page: 1,
    limit: 20,
  });

  const products = data?.data || [];
  const total = data?.pagination?.total || 0;

  const handleAddToCart = (product: any) => {
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

  const clearFilters = () => {
    setSearch(""); setType("ALL"); setClassLevel("All");
    setSubject("All"); setMinPrice(""); setMaxPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          Shop
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{total} products found</p>
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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {sortOptions.map((o) => <option key={o}>{o}</option>)}
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
        <aside className={`${showFilter ? "block" : "hidden"} sm:block w-full sm:w-64 flex-shrink-0`}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear All
              </button>
            </div>

            {/* Type */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Product Type</p>
              <div className="flex flex-col gap-2">
                {["ALL", "BOOK", "GADGET"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${type === t ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
                  >
                    {t === "ALL" ? "All Products" : t === "BOOK" ? "📚 Books" : "🔧 Gadgets"}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Level */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Class Level</p>
              <div className="flex flex-col gap-2">
                {classLevels.map((c) => (
                  <button
                    key={c}
                    onClick={() => setClassLevel(c)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${classLevel === c ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Subject</p>
              <div className="flex flex-col gap-2">
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${subject === s ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range (৳)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
                  <div className="h-44 bg-[var(--muted)]" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-[var(--muted)] rounded w-1/3" />
                    <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--muted)] rounded w-1/2" />
                    <div className="h-8 bg-[var(--muted)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load products</h3>
              <p className="text-gray-500 dark:text-gray-400">Please check if the backend is running.</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters</p>
              <button onClick={clearFilters} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
                  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 h-44 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-200">
                      {product.images?.[0] || (product.productType === "BOOK" ? "📚" : "🔧")}
                    </span>
                    {product.discountPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </div>
                    )}
                    {product.classLevel && (
                      <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg">
                        {product.classLevel}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {product.subject && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.subject}</p>}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      by {product.author || product.brand || "KitabGhor"}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {product._count?.reviews > 0 ? "4.8" : "New"}
                      </span>
                      <span className="text-xs text-gray-400">({product._count?.reviews || 0})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ৳{product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">৳{product.price}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

















// "use client";

// import { useState } from "react";
// import { Search, SlidersHorizontal, X, ShoppingCart, Star, ChevronDown } from "lucide-react";
// import { useCartStore } from "@/store/cart.store";
// import toast from "react-hot-toast";

// const allProducts = [
//   { id: "1", name: "SSC Physics Guide", author: "Abdul Alim", price: 280, discountPrice: 250, rating: 4.8, reviews: 124, classLevel: "SSC", subject: "Physics", type: "BOOK", image: "📘", stock: 50 },
//   { id: "2", name: "HSC Higher Math", author: "Dr. Abdul Matin", price: 320, discountPrice: 290, rating: 4.9, reviews: 98, classLevel: "HSC", subject: "Math", type: "BOOK", image: "📙", stock: 30 },
//   { id: "3", name: "HSC Chemistry", author: "Prof. Rezaul Karim", price: 300, discountPrice: 270, rating: 4.7, reviews: 76, classLevel: "HSC", subject: "Chemistry", type: "BOOK", image: "📗", stock: 40 },
//   { id: "4", name: "SSC English Grammar", author: "M. A. Malek", price: 200, discountPrice: 180, rating: 4.6, reviews: 210, classLevel: "SSC", subject: "English", type: "BOOK", image: "📕", stock: 60 },
//   { id: "5", name: "Class 8 Math", author: "NCTB", price: 150, discountPrice: 130, rating: 4.5, reviews: 89, classLevel: "Class 8-9", subject: "Math", type: "BOOK", image: "📘", stock: 70 },
//   { id: "6", name: "University Calculus", author: "James Stewart", price: 850, discountPrice: 750, rating: 4.9, reviews: 45, classLevel: "University", subject: "Math", type: "BOOK", image: "📙", stock: 20 },
//   { id: "g1", name: "Casio FX-991EX", author: "Casio", price: 1200, discountPrice: 1050, rating: 4.9, reviews: 203, classLevel: "", subject: "", type: "GADGET", image: "🔢", stock: 25 },
//   { id: "g2", name: "Geometry Box", author: "Staedtler", price: 450, discountPrice: 380, rating: 4.7, reviews: 89, classLevel: "", subject: "", type: "GADGET", image: "📐", stock: 40 },
//   { id: "g3", name: "Premium Pen Set", author: "Pilot", price: 350, discountPrice: 299, rating: 4.6, reviews: 156, classLevel: "", subject: "", type: "GADGET", image: "✏️", stock: 100 },
//   { id: "g4", name: "Art Color Set", author: "Faber-Castell", price: 800, discountPrice: 699, rating: 4.8, reviews: 67, classLevel: "", subject: "", type: "GADGET", image: "🎨", stock: 30 },
// ];

// const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];
// const classLevels = ["All", "Class 8-9", "SSC", "HSC", "University"];
// const subjects = ["All", "Math", "Physics", "Chemistry", "English", "Biology"];

// export default function ProductsClient() {
//   const [search, setSearch] = useState("");
//   const [type, setType] = useState("ALL");
//   const [classLevel, setClassLevel] = useState("All");
//   const [subject, setSubject] = useState("All");
//   const [sort, setSort] = useState("Newest");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [showFilter, setShowFilter] = useState(false);
//   const { addItem } = useCartStore();

//   const filtered = allProducts
//     .filter((p) => {
//       if (type !== "ALL" && p.type !== type) return false;
//       if (classLevel !== "All" && p.classLevel !== classLevel) return false;
//       if (subject !== "All" && p.subject !== subject) return false;
//       if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
//       if (minPrice && (p.discountPrice || p.price) < Number(minPrice)) return false;
//       if (maxPrice && (p.discountPrice || p.price) > Number(maxPrice)) return false;
//       return true;
//     })
//     .sort((a, b) => {
//       if (sort === "Price: Low to High") return (a.discountPrice || a.price) - (b.discountPrice || b.price);
//       if (sort === "Price: High to Low") return (b.discountPrice || b.price) - (a.discountPrice || a.price);
//       if (sort === "Most Popular") return b.reviews - a.reviews;
//       return 0;
//     });

//   const handleAddToCart = (product: typeof allProducts[0]) => {
//     addItem({ id: product.id, name: product.name, price: product.price, discountPrice: product.discountPrice, image: product.image, stock: product.stock });
//     toast.success(`${product.name} added to cart!`);
//   };

//   const clearFilters = () => {
//     setSearch(""); setType("ALL"); setClassLevel("All");
//     setSubject("All"); setMinPrice(""); setMaxPrice("");
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
//           Shop
//         </h1>
//         <p className="text-gray-500 dark:text-gray-400">{filtered.length} products found</p>
//       </div>

//       {/* Search + Sort Bar */}
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
//             {sortOptions.map((o) => <option key={o}>{o}</option>)}
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//         </div>
//         <button
//           onClick={() => setShowFilter(!showFilter)}
//           className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] transition text-sm font-medium sm:hidden"
//         >
//           <SlidersHorizontal className="w-4 h-4" />
//           Filters
//         </button>
//       </div>

//       <div className="flex gap-8">
//         {/* Sidebar Filters */}
//         <aside className={`${showFilter ? "block" : "hidden"} sm:block w-full sm:w-64 flex-shrink-0`}>
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 sticky top-20">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
//               <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
//                 <X className="w-3 h-3" /> Clear All
//               </button>
//             </div>

//             {/* Type */}
//             <div className="mb-6">
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Product Type</p>
//               <div className="flex flex-col gap-2">
//                 {["ALL", "BOOK", "GADGET"].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setType(t)}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition ${type === t ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
//                   >
//                     {t === "ALL" ? "All Products" : t === "BOOK" ? "📚 Books" : "🔧 Gadgets"}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Class Level */}
//             <div className="mb-6">
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Class Level</p>
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
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Subject</p>
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
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range (৳)</p>
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

//         {/* Product Grid */}
//         <div className="flex-1">
//           {filtered.length === 0 ? (
//             <div className="text-center py-20">
//               <span className="text-6xl mb-4 block">📭</span>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
//               <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters</p>
//               <button onClick={clearFilters} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map((product) => (
//                 <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
//                   <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 h-44 flex items-center justify-center">
//                     <span className="text-6xl group-hover:scale-110 transition-transform duration-200">{product.image}</span>
//                     {product.discountPrice && (
//                       <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
//                         {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
//                       </div>
//                     )}
//                     {product.classLevel && (
//                       <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg">
//                         {product.classLevel}
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-4">
//                     {product.subject && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.subject}</p>}
//                     <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by {product.author}</p>
//                     <div className="flex items-center gap-1 mb-3">
//                       <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
//                       <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
//                       <span className="text-xs text-gray-400">({product.reviews})</span>
//                     </div>
//                     <div className="flex items-center gap-2 mb-4">
//                       <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{product.discountPrice || product.price}</span>
//                       {product.discountPrice && <span className="text-sm text-gray-400 line-through">৳{product.price}</span>}
//                     </div>
//                     <button
//                       onClick={() => handleAddToCart(product)}
//                       className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
//                     >
//                       <ShoppingCart className="w-4 h-4" />
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }