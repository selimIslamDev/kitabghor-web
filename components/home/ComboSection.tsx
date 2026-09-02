"use client";

import Link from "next/link";
import {
  Tag,
  ArrowRight,
  Check,
  BookOpen,
  GraduationCap,
  Gift,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgePercent,
} from "lucide-react";
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
    wash: "radial-gradient(ellipse at 30% 15%, rgba(59,130,246,0.18) 0%, transparent 65%)",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-300",
    check: "text-blue-400",
    button: "bg-blue-600 hover:bg-blue-500",
    accentLine: "bg-blue-500",
    Icon: BookOpen,
  },
  {
    wash: "radial-gradient(ellipse at 30% 15%, rgba(16,185,129,0.18) 0%, transparent 65%)",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-300",
    check: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500",
    accentLine: "bg-emerald-500",
    Icon: GraduationCap,
    isPopular: true,
  },
  {
    wash: "radial-gradient(ellipse at 30% 15%, rgba(168,85,247,0.18) 0%, transparent 65%)",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-300",
    check: "text-purple-400",
    button: "bg-purple-600 hover:bg-purple-500",
    accentLine: "bg-purple-500",
    Icon: Gift,
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
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-7 bg-[#1a1815] rounded-full w-36 mx-auto mb-5 animate-pulse" />
            <div className="h-10 bg-[#1a1815] rounded-lg w-80 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-[#1a1815] rounded w-72 mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#141210] overflow-hidden"
              >
                <div className="p-6 space-y-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[#1a1815] animate-pulse" />

                  {/* Title + desc */}
                  <div className="space-y-2">
                    <div className="h-5 bg-[#1a1815] rounded-md w-3/4 animate-pulse" />
                    <div className="h-3.5 bg-[#1a1815] rounded-md w-1/2 animate-pulse" />
                  </div>

                  {/* Accent line */}
                  <div className="h-0.5 w-10 bg-[#1a1815] rounded-full animate-pulse" />

                  {/* Includes */}
                  <div className="space-y-2.5">
                    <div className="h-3.5 bg-[#1a1815] rounded w-full animate-pulse" />
                    <div className="h-3.5 bg-[#1a1815] rounded w-5/6 animate-pulse" />
                    <div className="h-3.5 bg-[#1a1815] rounded w-4/6 animate-pulse" />
                  </div>

                  {/* Price */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-20 bg-[#1a1815] rounded-md animate-pulse" />
                      <div className="h-4 w-12 bg-[#1a1815] rounded animate-pulse" />
                      <div className="h-5 w-14 bg-[#1a1815] rounded animate-pulse" />
                    </div>
                    <div className="h-3.5 w-24 bg-[#1a1815] rounded animate-pulse" />
                  </div>

                  {/* Button */}
                  <div className="h-11 w-full bg-[#1a1815] rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom features skeleton */}
          <div className="rounded-2xl bg-[#141210]/60 px-4 py-5 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a1815] animate-pulse flex-shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-[#1a1815] rounded w-20 animate-pulse" />
                    <div className="h-3 bg-[#1a1815] rounded w-28 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
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
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[rgba(201,162,39,0.12)] text-[#c9a227] text-sm font-semibold mb-5">
            <span className="text-base">✦</span>
            Combo Offers
          </div>

          <h2 className="text-3xl sm:text-[2.6rem] font-extrabold tracking-tight text-white mb-3">
            Save More with <span className="text-blue-400">Bundles</span>
          </h2>
          <p className="text-[#8b8378] max-w-lg mx-auto text-base">
            Curated bundles. Smarter savings. Stronger results.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {bundles.slice(0, 3).map((bundle, index) => {
            const style = styleVariants[index % styleVariants.length];
            const savings = bundle.totalPrice - bundle.bundlePrice;
            const Icon = style.Icon;
            const items = bundle.items || [];

            return (
              <div
                key={bundle.id}
                className="group relative rounded-2xl bg-[#141210] overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* soft wash */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: style.wash }}
                />

                {/* Most Popular badge */}
                {style.isPopular && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-3 py-1 rounded-b-xl bg-[#c9a227] text-[#0c0b09] text-[11px] font-bold flex items-center gap-1 shadow-lg">
                      <span>★</span> Most Popular
                    </div>
                  </div>
                )}

                <div className="relative p-6 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${style.iconBg}`}
                  >
                    <Icon className={`w-7 h-7 ${style.iconColor}`} />
                  </div>

                  {/* Title + Desc */}
                  <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
                    {bundle.name}
                  </h3>
                  {bundle.description && (
                    <p className="text-sm text-[#8b8378] mb-4 line-clamp-2">
                      {bundle.description}
                    </p>
                  )}

                  {/* Accent line */}
                  <div className={`h-0.5 w-10 rounded-full mb-5 ${style.accentLine}`} />

                  {/* Includes */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2.5 text-[14px] text-[#e8e0d5]"
                      >
                        <Check
                          className={`w-4 h-4 flex-shrink-0 ${style.check}`}
                          strokeWidth={2.5}
                        />
                        {item.product.name}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-2xl font-extrabold text-white">
                        ৳{bundle.bundlePrice}
                      </span>
                      <span className="text-sm text-[#6b6358] line-through">
                        ৳{bundle.totalPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 text-xs font-bold">
                        {bundle.discountPercent}% OFF
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-emerald-400 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      Save ৳{savings}
                    </div>
                  </div>

                  {/* CTA */}
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

        {/* Bottom Features */}
        <div className="rounded-2xl bg-[#141210]/60 px-4 py-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: BadgePercent,
                title: "Best Price",
                desc: "Unbeatable bundle rates",
              },
              {
                icon: ShieldCheck,
                title: "Quality Assured",
                desc: "Trusted content, always",
              },
              {
                icon: Truck,
                title: "Safe Delivery",
                desc: "Secure & reliable shipping",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "Hassle-free returns",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(201,162,39,0.1)] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#c9a227]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-[#6b6358]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
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