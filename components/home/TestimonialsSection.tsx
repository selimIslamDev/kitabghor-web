// import { Star, Quote } from "lucide-react";

// const testimonials = [
//   {
//     id: 1,
//     name: "Rahul Ahmed",
//     role: "SSC Candidate 2024",
//     rating: 5,
//     comment: "KitabGhor is amazing! I got all my SSC books and a calculator in one order. Fast delivery and great prices. Highly recommended!",
//     avatar: "👦",
//   },
//   {
//     id: 2,
//     name: "Fatima Begum",
//     role: "HSC Student",
//     rating: 5,
//     comment: "The HSC Science Pack saved me so much money. All books were original and arrived in perfect condition. Will definitely order again!",
//     avatar: "👧",
//   },
//   {
//     id: 3,
//     name: "Karim Hassan",
//     role: "University Student",
//     rating: 4,
//     comment: "Great collection of university books. Found some rare titles that I couldn't find anywhere else. Customer service is very helpful.",
//     avatar: "👨",
//   },
//   {
//     id: 4,
//     name: "Nadia Islam",
//     role: "Class 9 Student",
//     rating: 5,
//     comment: "Ordered the geometry box and pen set combo. Excellent quality products at affordable prices. My go-to shop for stationery!",
//     avatar: "👩",
//   },
//   {
//     id: 5,
//     name: "Sabbir Rahman",
//     role: "HSC Candidate 2024",
//     rating: 5,
//     comment: "Best online bookshop in Bangladesh! The website is easy to use and the checkout process is smooth. Got my books within 2 days.",
//     avatar: "👦",
//   },
//   {
//     id: 6,
//     name: "Tania Akter",
//     role: "Class 10 Student",
//     rating: 4,
//     comment: "Very satisfied with my purchase. The SSC starter pack is great value for money. Books are exactly as described.",
//     avatar: "👧",
//   },
// ];

// export default function TestimonialsSection() {
//   return (
//     <section className="py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
//             <Star className="w-3 h-3 fill-current" />
//             Student Reviews
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
//             What Students Say
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400">
//             Trusted by thousands of students across Bangladesh
//           </p>

//           {/* Overall Rating */}
//           <div className="flex items-center justify-center gap-3 mt-4">
//             <div className="flex items-center gap-1">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
//               ))}
//             </div>
//             <span className="text-2xl font-bold text-gray-900 dark:text-white">4.9</span>
//             <span className="text-gray-500 dark:text-gray-400">out of 5 (2,400+ reviews)</span>
//           </div>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {testimonials.map((t) => (
//             <div
//               key={t.id}
//               className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative"
//             >
//               {/* Quote Icon */}
//               <Quote className="w-8 h-8 text-blue-100 dark:text-blue-900 absolute top-4 right-4" />

//               {/* Rating */}
//               <div className="flex items-center gap-1 mb-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`w-4 h-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-600"}`}
//                   />
//                 ))}
//               </div>

//               {/* Comment */}
//               <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
//                 "{t.comment}"
//               </p>

//               {/* Author */}
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xl">
//                   {t.avatar}
//                 </div>
//                 <div>
//                   <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useFeaturedReviews, FeaturedReview } from "@/lib/hooks";

function TestimonialCard({ review }: { review: FeaturedReview }) {
  const initial = review.user.name?.[0]?.toUpperCase() || "U";
  return (
    <div className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 relative flex flex-col justify-between w-[300px] sm:w-auto flex-shrink-0">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-slate-700"
                }`}
              />
            ))}
          </div>
          <Quote className="w-8 h-8 text-slate-100 dark:text-slate-700/50 group-hover:text-emerald-100 dark:group-hover:text-emerald-950 transition-colors duration-300" />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-normal line-clamp-4">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="pt-4 border-t border-gray-50 dark:border-slate-700/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-100 to-blue-100 dark:from-emerald-950 dark:to-slate-800 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30 shadow-inner">
            {initial}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
              {review.user.name}
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline-block" />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
              on {review.product.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { data, isLoading } = useFeaturedReviews(12);
  const reviews = data?.data || [];
  const averageRating = data?.meta.averageRating || 0;
  const totalReviews = data?.meta.total || 0;

  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            Student Reviews
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            What Our Students Say
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Trusted by students across Bangladesh for authentic books and fast delivery.
          </p>

          {totalReviews > 0 && (
            <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 px-5 py-2.5 rounded-2xl shadow-sm mt-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-slate-700"}`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{averageRating}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 border-l border-gray-200 dark:border-slate-700 pl-3">
                {totalReviews}+ reviews
              </span>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Desktop/tablet — static grid */}
        {!isLoading && reviews.length > 0 && (
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Mobile — single-row auto-scrolling marquee */}
        {!isLoading && reviews.length > 0 && (
          <div className="sm:hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((review, i) => (
                <TestimonialCard key={`${review.id}-${i}`} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}