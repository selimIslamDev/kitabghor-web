"use client";

import Link from "next/link";
import { Tag, ArrowRight, Package, Check } from "lucide-react";
import { useBundles } from "@/lib/hooks";

interface BundleProduct {
  id: string;
  name: string;
  images: string[];
}

interface BundleItem {
  id: string;
  product: BundleProduct;
}

interface Bundle {
  id: string;
  name: string;
  description?: string;
  discountPercent: number;
  totalPrice: number;
  bundlePrice: number;
  items: BundleItem[];
}

const styleVariants = [
  {
    accent: "rgba(59, 130, 246, 0.35)",
    wash: "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.18) 0%, transparent 70%)",
    iconBg: "rgba(59, 130, 246, 0.15)",
    iconBorder: "rgba(59, 130, 246, 0.3)",
    button: "bg-blue-600 hover:bg-blue-500",
    badge: "Most Popular",
    check: "text-blue-400",
  },
  {
    accent: "rgba(34, 197, 94, 0.35)",
    wash: "radial-gradient(ellipse at 30% 20%, rgba(34,197,94,0.18) 0%, transparent 70%)",
    iconBg: "rgba(34, 197, 94, 0.15)",
    iconBorder: "rgba(34, 197, 94, 0.3)",
    button: "bg-emerald-600 hover:bg-emerald-500",
    badge: "Best Value",
    check: "text-emerald-400",
  },
  {
    accent: "rgba(168, 85, 247, 0.35)",
    wash: "radial-gradient(ellipse at 30% 20%, rgba(168,85,247,0.18) 0%, transparent 70%)",
    iconBg: "rgba(168, 85, 247, 0.15)",
    iconBorder: "rgba(168, 85, 247, 0.3)",
    button: "bg-purple-600 hover:bg-purple-500",
    badge: "New Arrival",
    check: "text-purple-400",
  },
];

export default function ComboSection() {
  const { data: bundles, isLoading } = useBundles() as {
    data: Bundle[] | undefined;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-[#0c0b09]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <div className="h-5 bg-[#1a1815] rounded-full w-36 mx-auto mb-4 animate-pulse" />
            <div className="h-9 bg-[#1a1815] rounded-lg w-72 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-[#1a1815] rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141210] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bundles || bundles.length === 0) return null;

  return (
    <section className="py-16 bg-[#0c0b09] text-[#f5f0e8]">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.25)] text-[#c9a227] text-sm font-semibold mb-5">
            <Package className="w-3.5 h-3.5" />
            Combo Offers
          </div>

          <h2 className="text-3xl sm:text-[2.5rem] font-extrabold tracking-tight text-white mb-3">
            Save More with Bundles
          </h2>
          <p className="text-[#8b8378] max-w-xl mx-auto text-base">
            Get everything you need in one pack and save up to 25% compared to
            buying individually
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundles.slice(0, 3).map((bundle, index) => {
            const style = styleVariants[index % styleVariants.length];
            const savings = bundle.totalPrice - bundle.bundlePrice;

            return (
              <div
                key={bundle.id}
                className="group relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#141210] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(255,255,255,0.12)]"
                style={{
                  boxShadow: `0 0 0 1px ${style.accent}, 0 12px 40px rgba(0,0,0,0.35)`,
                }}
              >
                {/* soft wash */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: style.wash }}
                />

                {/* Top */}
                <div className="relative p-6 pb-5">
                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-[rgba(201,162,39,0.15)] border border-[rgba(201,162,39,0.3)] text-[#f0c14b] text-[11px] font-bold">
                    {style.badge}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: style.iconBg,
                      border: `1px solid ${style.iconBorder}`,
                    }}
                  >
                    <Package className="w-7 h-7 text-[#f0c14b]" />
                  </div>

                  <h3 className="text-xl font-extrabold text-white tracking-tight mb-1.5">
                    {bundle.name}
                  </h3>
                  {bundle.description && (
                    <p className="text-sm text-[#8b8378] line-clamp-2">
                      {bundle.description}
                    </p>
                  )}
                </div>

                {/* Includes */}
                <div className="relative px-6 py-4 border-t border-[rgba(255,255,255,0.06)]">
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6358] mb-3">
                    Includes
                  </p>
                  <ul className="space-y-2.5">
                    {bundle.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2.5 text-[14px] text-[#e8e0d5]"
                      >
                        <span className="w-5 h-5 rounded-full bg-[rgba(201,162,39,0.12)] flex items-center justify-center flex-shrink-0">
                          <Check
                            className={`w-3 h-3 ${style.check}`}
                            strokeWidth={3}
                          />
                        </span>
                        {item.product.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price + CTA */}
                <div className="relative px-6 py-5 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-white">
                          ৳{bundle.bundlePrice}
                        </span>
                        <span className="text-sm text-[#6b6358] line-through">
                          ৳{bundle.totalPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-sm text-emerald-400 font-medium">
                        <Tag className="w-3.5 h-3.5" />
                        Save ৳{savings}
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-red-400 text-xs font-bold">
                      {bundle.discountPercent}% OFF
                    </div>
                  </div>

                  <Link
                    href={`/bundles/${bundle.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${style.button}`}
                  >
                    Get This Bundle
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}







// "use client";

// import Link from "next/link";
// import { Tag, ArrowRight, Package } from "lucide-react";
// import { useBundles } from "@/lib/hooks";

// interface BundleProduct {
//   id: string;
//   name: string;
//   images: string[];
// }

// interface BundleItem {
//   id: string;
//   product: BundleProduct;
// }

// interface Bundle {
//   id: string;
//   name: string;
//   description?: string;
//   discountPercent: number;
//   totalPrice: number;
//   bundlePrice: number;
//   items: BundleItem[];
// }

// const styleVariants = [
//   { icon: "📦", color: "from-blue-500 to-indigo-600", badge: "Most Popular" },
//   { icon: "🎒", color: "from-purple-500 to-pink-600", badge: "Best Value" },
//   { icon: "🎨", color: "from-amber-500 to-orange-600", badge: "New Arrival" },
// ];

// export default function ComboSection() {
//   const { data: bundles, isLoading } = useBundles() as { data: Bundle[] | undefined; isLoading: boolean };

//   if (isLoading) {
//     return (
//       <section className="py-16 bg-[var(--card)]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-10">
//             <div className="h-6 bg-[var(--muted)] rounded w-32 mx-auto mb-3 animate-pulse" />
//             <div className="h-8 bg-[var(--muted)] rounded w-64 mx-auto mb-3 animate-pulse" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-96 bg-[var(--muted)] rounded-2xl animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!bundles || bundles.length === 0) return null;

//   return (
//     <section className="py-16 bg-[var(--card)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
//             <Package className="w-3 h-3" />
//             Combo Offers
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
//             Save More with Bundles
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
//             Get everything you need in one pack and save up to 25% compared to buying individually
//           </p>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {bundles.slice(0, 3).map((bundle, index) => {
//             const style = styleVariants[index % styleVariants.length];
//             const savings = bundle.totalPrice - bundle.bundlePrice;

//             return (
//               <div
//                 key={bundle.id}
//                 className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group"
//               >
//                 {/* Top Banner */}
//                 <div className={`bg-gradient-to-r ${style.color} p-6 text-white relative`}>
//                   <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
//                     {style.badge}
//                   </div>
//                   <span className="text-5xl mb-3 block">{style.icon}</span>
//                   <h3 className="text-xl font-bold mb-1">{bundle.name}</h3>
//                   {bundle.description && (
//                     <p className="text-sm text-white/80 line-clamp-2">{bundle.description}</p>
//                   )}
//                 </div>

//                 {/* Items */}
//                 <div className="p-4 border-b border-[var(--border)]">
//                   <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Includes</p>
//                   <ul className="space-y-1">
//                     {bundle.items.map((item) => (
//                       <li key={item.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//                         <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
//                         {item.product.name}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Price + CTA */}
//                 <div className="p-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                           ৳{bundle.bundlePrice}
//                         </span>
//                         <span className="text-sm text-gray-400 line-through">৳{bundle.totalPrice}</span>
//                       </div>
//                       <div className="flex items-center gap-1 mt-1">
//                         <Tag className="w-3 h-3 text-green-500" />
//                         <span className="text-xs text-green-600 dark:text-green-400 font-medium">
//                           Save ৳{savings}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-2 py-1 rounded-lg">
//                         {bundle.discountPercent}% OFF
//                       </span>
//                     </div>
//                   </div>
//                   <Link
//                     href={`/bundles/${bundle.id}`}
//                     className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
//                   >
//                     Get This Bundle
//                     <ArrowRight className="w-4 h-4" />
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }