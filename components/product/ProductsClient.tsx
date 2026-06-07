"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ShoppingCart, Star, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";

const allProducts = [
  { id: "1", name: "SSC Physics Guide", author: "Abdul Alim", price: 280, discountPrice: 250, rating: 4.8, reviews: 124, classLevel: "SSC", subject: "Physics", type: "BOOK", image: "📘", stock: 50 },
  { id: "2", name: "HSC Higher Math", author: "Dr. Abdul Matin", price: 320, discountPrice: 290, rating: 4.9, reviews: 98, classLevel: "HSC", subject: "Math", type: "BOOK", image: "📙", stock: 30 },
  { id: "3", name: "HSC Chemistry", author: "Prof. Rezaul Karim", price: 300, discountPrice: 270, rating: 4.7, reviews: 76, classLevel: "HSC", subject: "Chemistry", type: "BOOK", image: "📗", stock: 40 },
  { id: "4", name: "SSC English Grammar", author: "M. A. Malek", price: 200, discountPrice: 180, rating: 4.6, reviews: 210, classLevel: "SSC", subject: "English", type: "BOOK", image: "📕", stock: 60 },
  { id: "5", name: "Class 8 Math", author: "NCTB", price: 150, discountPrice: 130, rating: 4.5, reviews: 89, classLevel: "Class 8-9", subject: "Math", type: "BOOK", image: "📘", stock: 70 },
  { id: "6", name: "University Calculus", author: "James Stewart", price: 850, discountPrice: 750, rating: 4.9, reviews: 45, classLevel: "University", subject: "Math", type: "BOOK", image: "📙", stock: 20 },
  { id: "g1", name: "Casio FX-991EX", author: "Casio", price: 1200, discountPrice: 1050, rating: 4.9, reviews: 203, classLevel: "", subject: "", type: "GADGET", image: "🔢", stock: 25 },
  { id: "g2", name: "Geometry Box", author: "Staedtler", price: 450, discountPrice: 380, rating: 4.7, reviews: 89, classLevel: "", subject: "", type: "GADGET", image: "📐", stock: 40 },
  { id: "g3", name: "Premium Pen Set", author: "Pilot", price: 350, discountPrice: 299, rating: 4.6, reviews: 156, classLevel: "", subject: "", type: "GADGET", image: "✏️", stock: 100 },
  { id: "g4", name: "Art Color Set", author: "Faber-Castell", price: 800, discountPrice: 699, rating: 4.8, reviews: 67, classLevel: "", subject: "", type: "GADGET", image: "🎨", stock: 30 },
];

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];
const classLevels = ["All", "Class 8-9", "SSC", "HSC", "University"];
const subjects = ["All", "Math", "Physics", "Chemistry", "English", "Biology"];

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

  const filtered = allProducts
    .filter((p) => {
      if (type !== "ALL" && p.type !== type) return false;
      if (classLevel !== "All" && p.classLevel !== classLevel) return false;
      if (subject !== "All" && p.subject !== subject) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (minPrice && (p.discountPrice || p.price) < Number(minPrice)) return false;
      if (maxPrice && (p.discountPrice || p.price) > Number(maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Price: Low to High") return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sort === "Price: High to Low") return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sort === "Most Popular") return b.reviews - a.reviews;
      return 0;
    });

  const handleAddToCart = (product: typeof allProducts[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, discountPrice: product.discountPrice, image: product.image, stock: product.stock });
    toast.success(`${product.name} added to cart!`);
  };

  const clearFilters = () => {
    setSearch(""); setType("ALL"); setClassLevel("All");
    setSubject("All"); setMinPrice(""); setMaxPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
          Explore Products
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">We found <span className="text-blue-600 dark:text-blue-400 font-bold">{filtered.length}</span> stunning premium products for you</p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, author, category..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200/80 bg-white text-gray-900 shadow-sm shadow-gray-100/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:shadow-none"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-4 pr-11 py-3.5 rounded-2xl border border-gray-200/80 bg-white text-gray-900 shadow-sm shadow-gray-100/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            {sortOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-sm font-semibold sm:hidden dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilter ? "block" : "hidden"} sm:block w-full sm:w-64 flex-shrink-0`}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 p-6 sticky top-24 shadow-xl shadow-gray-100/30 dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Filters</h3>
              <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 transition">
                <X className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            {/* Type */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Product Type</p>
              <div className="flex flex-col gap-1.5">
                {["ALL", "BOOK", "GADGET"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${type === t ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}
                  >
                    {t === "ALL" ? "All Products" : t === "BOOK" ? "📚 Books" : "🔧 Gadgets"}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Level */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Class Level</p>
              <div className="flex flex-col gap-1.5">
                {classLevels.map((c) => (
                  <button
                    key={c}
                    onClick={() => setClassLevel(c)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${classLevel === c ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Subject</p>
              <div className="flex flex-col gap-1.5">
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${subject === s ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Price Range (৳)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:bg-slate-800"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 p-8">
              <span className="text-6xl mb-4 block animate-bounce">📭</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products match your criteria</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Try clearing your filters or changing your search terms to find what you need.</p>
              <button onClick={clearFilters} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/20">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                /* --- MARVELOUS CARD DESIGN --- */
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col h-full"
                >
                  {/* Card Image Wrapper with Radial Reflection Overlay */}
                  <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-700/50 dark:to-slate-600/50 h-52 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] dark:bg-none" />
                    
                    {/* Floating Emoji/Image */}
                    <span className="text-7xl group-hover:scale-110 drop-shadow-xl transition-transform duration-300 ease-out select-none">
                      {product.image}
                    </span>
                    
                    {/* Badge: Discount */}
                    {product.discountPrice && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md shadow-rose-500/20">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </div>
                    )}
                    
                    {/* Badge: Class Level */}
                    {product.classLevel && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md dark:bg-slate-800/90 text-gray-800 dark:text-gray-200 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
                        {product.classLevel}
                      </div>
                    )}
                  </div>

                  {/* Card Content Data Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Subject Line Category */}
                    {product.subject && (
                      <span className="text-[11px] font-bold text-blue-600/80 dark:text-blue-400 uppercase tracking-widest mb-1">
                        {product.subject}
                      </span>
                    )}
                    
                    {/* Product Title */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    
                    {/* Subtitle / Author */}
                    <p className="text-xs text-gray-400 dark:text-gray-400 font-medium mb-3">
                      by <span className="text-gray-600 dark:text-gray-300 font-semibold">{product.author}</span>
                    </p>
                    
                    {/* Star Dynamic Ratings wrapper */}
                    <div className="flex items-center gap-1 mb-4 bg-gray-50 dark:bg-slate-700/40 w-fit px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{product.rating}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">({product.reviews} reviews)</span>
                    </div>

                    {/* Spacer to push pricing and button uniformly to bottom */}
                    <div className="mt-auto pt-2">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                          ৳{product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs font-medium text-gray-400 line-through decoration-gray-300 dark:decoration-gray-600">
                            ৳{product.price}
                          </span>
                        )}
                      </div>

                      {/* CTA Action Button Styled with Modern Gradient and Glow Impact */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white rounded-xl font-bold text-xs tracking-wide uppercase shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:opacity-95 active:scale-[0.98] transition-all duration-200"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add To Cart
                      </button>
                    </div>
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