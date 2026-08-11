"use client";

import { useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { useFeaturedReviews, FeaturedReview } from "@/lib/hooks";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

function TestimonialCard({ review }: { review: FeaturedReview }) {
  const initial = review.user.name?.[0]?.toUpperCase() || "U";

  return (
    <div className="rounded-2xl border border-[rgba(201,162,39,0.15)] bg-[#141210] p-7 w-[300px] lg:w-auto flex-shrink-0 flex flex-col">
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
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

      {/* Quote mark */}
      <Quote className="w-8 h-8 text-[#c9a227] mb-3 -scale-x-100" />

      {/* Comment */}
      <p className="text-[#d4cdc3] text-[15px] leading-relaxed mb-7 line-clamp-4 flex-1">
        {review.comment}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[rgba(201,162,39,0.12)] border-2 border-[#c9a227] flex items-center justify-center text-[#c9a227] font-bold text-base">
          {initial}
        </div>
        <div>
          <div className="font-semibold text-white text-[15px]">
            {review.user.name}
          </div>
          <div className="text-sm text-[#c9a227] font-medium line-clamp-1">
            {review.product.name}
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

  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="py-20 bg-[#0c0b09] text-[#f5f0e8] relative overflow-hidden">
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
            Trusted by students. Loved by scholars. Built for academic
            excellence.
          </p>
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