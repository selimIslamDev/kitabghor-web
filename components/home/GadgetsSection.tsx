// "use client";

// import Link from "next/link";
// import { ShoppingCart, Star, ArrowRight, Zap } from "lucide-react";
// import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
// import toast from "react-hot-toast";

// interface Gadget {
//   id: string;
//   name: string;
//   price: number;
//   discountPrice?: number | null;
//   images?: string[];
//   stock: number;
//   productType: string;
//   brand?: string | null;
//   _count?: {
//     reviews: number;
//   };
// }

// const badgeStyles: Record<number, string> = {
//   0: "bg-[rgba(201,162,39,0.18)] text-[#f0c14b] border border-[rgba(201,162,39,0.35)]",
//   1: "bg-[rgba(59,130,246,0.15)] text-blue-300 border border-[rgba(59,130,246,0.3)]",
//   2: "bg-[rgba(34,197,94,0.15)] text-emerald-300 border border-[rgba(34,197,94,0.3)]",
//   3: "bg-[rgba(168,85,247,0.15)] text-purple-300 border border-[rgba(168,85,247,0.3)]",
// };

// const badgeLabels: Record<number, string> = {
//   0: "Best Seller",
//   1: "Popular",
//   2: "New",
//   3: "Top Rated",
// };

// export default function GadgetsSection() {
//   const { addItem } = useCartWithAuth();
//   const { data: products, isLoading } = useFeaturedProducts();

//   const gadgets: Gadget[] =
//     (products as Gadget[] | undefined)?.filter((p) => p.productType === "GADGET").slice(0, 4) || [];

//   const handleAddToCart = (e: React.MouseEvent, gadget: Gadget) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const success = addItem({
//       id: gadget.id,
//       name: gadget.name,
//       price: gadget.price,
//       discountPrice: gadget.discountPrice ?? undefined,
//       image: gadget.images?.[0] || "🔧",
//       stock: gadget.stock,
//     });
//     if (success) toast.success(`${gadget.name} added to cart!`);
//   };

//   return (
//     <section className="py-16 bg-[#0c0b09] text-[#f5f0e8]">
//       <div className="max-w-6xl mx-auto px-5">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
//           <div>
//             <div className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold tracking-widest uppercase text-[#c9a227] mb-3">
//               <Zap className="w-3.5 h-3.5" />
//               <span>Educational Gadgets</span>
//             </div>
//             <h2 className="text-3xl sm:text-[2.4rem] font-extrabold tracking-tight text-white leading-tight">
//               Top Gadgets for Students
//             </h2>
//             <p className="text-[#8b8378] mt-2 max-w-md">
//               Essential tools to boost your learning
//             </p>
//           </div>

//           <Link
//             href="/products?type=GADGET"
//             className="hidden sm:inline-flex items-center gap-2 text-[#c9a227] font-semibold hover:text-[#f0c14b] transition-colors"
//           >
//             View All
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         {/* Skeleton */}
//         {isLoading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141210] overflow-hidden animate-pulse"
//               >
//                 <div className="h-48 bg-[#1a1815]" />
//                 <div className="p-5 space-y-3">
//                   <div className="h-3 bg-[#1a1815] rounded w-1/3" />
//                   <div className="h-4 bg-[#1a1815] rounded w-3/4" />
//                   <div className="h-9 bg-[#1a1815] rounded-xl" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Cards */}
//         {!isLoading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {gadgets.length > 0 ? (
//               gadgets.map((gadget, index) => (
//                 <Link
//                   key={gadget.id}
//                   href={`/products/${gadget.id}`}
//                   className="group relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#141210] overflow-hidden transition-all duration-300 hover:border-[rgba(201,162,39,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
//                 >
//                   {/* Image */}
//                   <div className="relative h-48 bg-gradient-to-br from-[#1a1815] to-[#141210] flex items-center justify-center overflow-hidden">
//                     {gadget.images?.[0] && gadget.images[0].startsWith("http") ? (
//                       <img
//                         src={gadget.images[0]}
//                         alt={gadget.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     ) : (
//                       <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
//                         {gadget.images?.[0] || "🔧"}
//                       </span>
//                     )}

//                     {/* Badge */}
//                     <div
//                       className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-lg ${badgeStyles[index % 4]}`}
//                     >
//                       {badgeLabels[index % 4]}
//                     </div>

//                     {/* Discount */}
//                     {gadget.discountPrice && (
//                       <div className="absolute top-3 right-3 bg-[rgba(239,68,68,0.18)] text-red-400 border border-[rgba(239,68,68,0.35)] text-[11px] font-bold px-2.5 py-1 rounded-lg">
//                         {Math.round(
//                           ((gadget.price - gadget.discountPrice) / gadget.price) * 100
//                         )}
//                         % OFF
//                       </div>
//                     )}
//                   </div>

//                   {/* Info */}
//                   <div className="p-5">
//                     {gadget.brand && (
//                       <p className="text-[11px] text-[#6b6358] mb-1 uppercase tracking-wider">
//                         {gadget.brand}
//                       </p>
//                     )}

//                     <h3 className="font-semibold text-[#f5f0e8] mb-3 line-clamp-2 text-[15px] leading-snug group-hover:text-[#c9a227] transition-colors">
//                       {gadget.name}
//                     </h3>

//                     <div className="flex items-center gap-1.5 mb-4">
//                       <Star className="w-3.5 h-3.5 fill-[#c9a227] text-[#c9a227]" />
//                       <span className="text-sm font-medium text-[#e8e0d5]">
//                         {(gadget._count?.reviews ?? 0) > 0 ? "4.8" : "New"}
//                       </span>
//                       <span className="text-xs text-[#6b6358]">
//                         ({gadget._count?.reviews || 0})
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-2 mb-5">
//                       <span className="text-xl font-extrabold text-white">
//                         ৳{gadget.discountPrice || gadget.price}
//                       </span>
//                       {gadget.discountPrice && (
//                         <span className="text-sm text-[#6b6358] line-through">
//                           ৳{gadget.price}
//                         </span>
//                       )}
//                     </div>

//                     <button
//                       onClick={(e) => handleAddToCart(e, gadget)}
//                       className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgba(201,162,39,0.15)] border border-[rgba(201,162,39,0.3)] text-[#f0c14b] font-semibold text-sm hover:bg-[rgba(201,162,39,0.25)] hover:border-[rgba(201,162,39,0.45)] transition-all duration-200 active:scale-[0.98]"
//                     >
//                       <ShoppingCart className="w-4 h-4" />
//                       Add to Cart
//                     </button>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <div className="col-span-4 text-center py-14 text-[#6b6358]">
//                 No gadgets available yet.
//               </div>
//             )}
//           </div>
//         )}

//         {/* Mobile View All */}
//         <div className="sm:hidden mt-8 text-center">
//           <Link
//             href="/products?type=GADGET"
//             className="inline-flex items-center gap-2 text-[#c9a227] font-semibold"
//           >
//             View All Gadgets
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
















"use client";

import Link from "next/link";
import { ShoppingCart, Star, ArrowRight, Zap } from "lucide-react";
import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
import toast from "react-hot-toast";

const badgeColors: Record<number, string> = {
  0: "bg-amber-500",
  1: "bg-blue-500",
  2: "bg-green-500",
  3: "bg-purple-500",
};

const badgeLabels: Record<number, string> = {
  0: "Best Seller",
  1: "Popular",
  2: "New",
  3: "Top Rated",
};

export default function GadgetsSection() {
  const { addItem } = useCartWithAuth();
  const { data: products, isLoading } = useFeaturedProducts();

  const gadgets = products?.filter((p: any) => p.productType === "GADGET").slice(0, 4) || [];

  const handleAddToCart = (e: React.MouseEvent, gadget: any) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addItem({
      id: gadget.id,
      name: gadget.name,
      price: gadget.price,
      discountPrice: gadget.discountPrice,
      image: gadget.images?.[0] || "🔧",
      stock: gadget.stock,
    });
    if (success) toast.success(`${gadget.name} added to cart!`);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Zap className="w-3 h-3" />
              Educational Gadgets
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Top Gadgets for Students
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Essential tools to boost your learning</p>
          </div>
          <Link href="/products?type=GADGET" className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
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
            {gadgets.length > 0 ? gadgets.map((gadget: any, index: number) => (
              <Link
                key={gadget.id}
                href={`/products/${gadget.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
              >
                {/* Image */}
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-700 dark:to-slate-600 h-48 flex items-center justify-center overflow-hidden">
                  {gadget.images?.[0] && gadget.images[0].startsWith("http") ? (
                    <img
                      src={gadget.images[0]}
                      alt={gadget.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-200">
                      {gadget.images?.[0] || "🔧"}
                    </span>
                  )}
                  <div className={`absolute top-3 left-3 ${badgeColors[index % 4]} text-white text-xs font-bold px-2 py-1 rounded-lg`}>
                    {badgeLabels[index % 4]}
                  </div>
                  {gadget.discountPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {Math.round(((gadget.price - gadget.discountPrice) / gadget.price) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {gadget.brand && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{gadget.brand}</p>}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 text-sm">{gadget.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {gadget._count?.reviews > 0 ? "4.8" : "New"}
                    </span>
                    <span className="text-xs text-gray-400">({gadget._count?.reviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ৳{gadget.discountPrice || gadget.price}
                    </span>
                    {gadget.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">৳{gadget.price}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, gadget)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </Link>
            )) : (
              <div className="col-span-4 text-center py-10 text-gray-500 dark:text-gray-400">
                No gadgets available yet.
              </div>
            )}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/products?type=GADGET" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
            View All Gadgets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}