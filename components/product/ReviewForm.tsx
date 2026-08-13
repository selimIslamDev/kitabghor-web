"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReview } from "@/lib/hooks";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { isAuthenticated } = useAuthStore();
  const createReview = useCreateReview(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit a review!");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating!");
      return;
    }
    createReview.mutate(
      { rating, comment },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        },
      }
    );
  };

  return (
    <div
      className="rounded-2xl p-6 sm:p-7 mb-5"
      style={{
        background: "#141210",
        border: "1px solid rgba(201, 162, 39, 0.18)",
      }}
    >
      <h3 className="text-lg font-semibold text-[#f5f0e8] mb-5">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating */}
        <div>
          <p className="text-sm font-medium text-[#a89f8f] mb-2.5">
            Rating <span className="text-[#c9a227]">*</span>
          </p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    (hoverRating || rating) >= star
                      ? "fill-[#c9a227] text-[#c9a227]"
                      : "text-[#3a3530]"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm font-medium text-[#c9a227]">
                {rating}.0
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-[#a89f8f] mb-2.5">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm text-[#f5f0e8] placeholder:text-[#6b6358] focus:outline-none transition resize-none"
            style={{
              background: "#0c0b09",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.border = "1px solid rgba(201,162,39,0.4)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)")
            }
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createReview.isPending || rating === 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #c9a227 0%, #b8921f 100%)",
            color: "#0c0b09",
            boxShadow: "0 4px 16px rgba(201, 162, 39, 0.25)",
          }}
        >
          {createReview.isPending ? (
            <div className="w-4 h-4 border-2 border-[#0c0b09] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Submit Review
              <Star className="w-3.5 h-3.5 fill-current" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}