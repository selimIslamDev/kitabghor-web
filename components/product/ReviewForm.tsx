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
    createReview.mutate({ rating, comment }, {
      onSuccess: () => {
        setRating(0);
        setComment("");
      },
    });
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800 p-5 mb-4">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating *</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition"
              >
                <Star
                  className={`w-8 h-8 transition ${(hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white dark:bg-slate-800 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={createReview.isPending || rating === 0}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition"
        >
          {createReview.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : "Submit Review ⭐"}
        </button>
      </form>
    </div>
  );
}