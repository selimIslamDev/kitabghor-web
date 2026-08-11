"use client";

import { useEffect } from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useFeaturedReviews, FeaturedReview } from "@/lib/hooks";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

function TestimonialCard({ review }: { review: FeaturedReview }) {
  const initial = review.user.name?.[0]?.toUpperCase() || "U";

  return (
    <div className="group relative rounded-2xl border border-[rgba(201,162,39,0.15)] bg-[#141210] p-6 transition-all duration-300 hover:border-[rgba(201,162,39,0.35)] hover:-translate-y-1 w-[300px] lg:w-auto flex-shrink-0 flex flex-col justify-between">
      {/* soft gold wash */}
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.06),transparent_70%)] pointer-events-none" />

      <div className="relative">
        {/* Stars + Quote */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-[#c9a227] text-[#c9a227]"
                    : "text-[#2a2723]"
                }`}
              />
            ))}
          </div>
          <Quote className="w-8 h-8 text-[rgba(201,162,39,0.15)] group-hover:text-[rgba(201,162,39,0.3)] transition-colors" />
        </div>

        {/* Comment */}
        <p className="text-[#d4cdc3] text-[15px] leading-relaxed mb-6 line-clamp-4">
          “{review.comment}”
        </p>
      </div>

      {/* Author */}
      <div className="relative pt-5 border-t border-[rgba(255,255,255,0.05)] flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.3)] flex items-center justify-center text-[#c9a227] font-bold text-base shadow-inner">
          {initial}
        </div>
        <div>
          <div className="font-semibold text-white text-[15px] flex items-center gap-1.5">
            {review.user.name}
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a227]" />
          </div>
          <div className="text-xs text-[#6b6358] font-medium line-clamp-1">
            on {review.product.name}
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsCarousel({ reviews }: { reviews: FeaturedReview[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, containScroll: "trimSnaps" },
    [Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Reinitialize if the review list changes size after mount (e.g. data arrives late)
  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, reviews.length]);

  return (
    <div
      className="lg:hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      ref={emblaRef}
    >
      <div className="flex gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex-[0_0_auto]">
            <TestimonialCard review={review} />
          </div>
        ))}
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
    <section className="py-20 bg-[#0c0b09] text-[#f5f0e8] relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(201,162,39,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.3)] text-[#c9a227] text-sm font-semibold mb-5">
            <Star className="w-3.5 h-3.5 fill-[#c9a227]" />
            Testimonials
          </div>

          <h2 className="text-3xl sm:text-[2.6rem] font-extrabold tracking-tight text-white mb-3">
            What Our Students Say
          </h2>
          <p className="text-[#8b8378] text-base">
            Trusted by students across Bangladesh for authentic books and fast
            delivery.
          </p>

          {/* Average rating pill */}
          {totalReviews > 0 && (
            <div className="inline-flex items-center gap-3 bg-[#141210] border border-[rgba(201,162,39,0.2)] px-5 py-2.5 rounded-2xl mt-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? "fill-[#c9a227] text-[#c9a227]"
                        : "text-[#2a2723]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-white">
                {averageRating}
              </span>
              <span className="text-xs text-[#6b6358] border-l border-[rgba(255,255,255,0.08)] pl-3">
                {totalReviews}+ reviews
              </span>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-white/5 bg-[#141210] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Desktop only (lg+) — static grid */}
        {!isLoading && reviews.length > 0 && (
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {reviews.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Mobile + Tablet — Embla autoplay carousel */}
        {!isLoading && reviews.length > 0 && (
          <TestimonialsCarousel reviews={reviews} />
        )}
      </div>
    </section>
  );
}