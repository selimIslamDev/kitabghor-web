"use client";

import { useState } from "react";
import {
  ShoppingCart, Star, Heart, ArrowLeft,
  Plus, Minus, CheckCircle, Truck, RefreshCw, ShieldCheck, BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useCartWithAuth, useProduct, useProductReviews, useAddToWishlist } from "@/lib/hooks";
import ReviewForm from "./ReviewForm";
import RelatedProducts from "./RelatedProducts";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: {
    name?: string | null;
  };
}

// Zoom lens dimensions (Rokomari-style hover zoom)
const LENS_WIDTH = 100;
const LENS_HEIGHT = 150;

export default function ProductDetailClient({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  // Image Zoom States (Rokomari style)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });

  const { data: product, isLoading } = useProduct(id);
  const { data: reviewData } = useProductReviews(id);
  const { addItem } = useCartWithAuth();
  const addToWishlist = useAddToWishlist();

  const reviews: Review[] = reviewData?.data || [];

  const mainImage = selectedImage || product?.images?.[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    let lensX = x - LENS_WIDTH / 2;
    let lensY = y - LENS_HEIGHT / 2;

    // Boundaries
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > width - LENS_WIDTH) lensX = width - LENS_WIDTH;
    if (lensY > height - LENS_HEIGHT) lensY = height - LENS_HEIGHT;

    // Percentages for zoomed background
    const bgX = (lensX / (width - LENS_WIDTH)) * 100;
    const bgY = (lensY / (height - LENS_HEIGHT)) * 100;

    setLensPos({ x: lensX, y: lensY });
    setBgPos({ x: bgX, y: bgY });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0] || "📚",
        stock: product.stock,
      },
      quantity
    );
  };

  const handleWishlist = () => {
    if (!product) return;
    addToWishlist.mutate(product.id);
    setWishlisted(!wishlisted);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="h-96 bg-[var(--muted)] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-[var(--muted)] rounded w-1/3" />
            <div className="h-8 bg-[var(--muted)] rounded w-3/4" />
            <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
            <div className="h-12 bg-[var(--muted)] rounded" />
            <div className="h-12 bg-[var(--muted)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">📭</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
        <Link href="/products" className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold transition">
          Back to Shop
        </Link>
      </div>
    );
  }

  const rating = reviews.length > 0
    ? Math.round(reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length)
    : 4;

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const savedAmount = product.discountPrice ? product.price - product.discountPrice : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-5">
        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <Link href="/products" className="hover:text-violet-600 transition">Shop</Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[240px]">{product.name}</span>
      </div>

      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-medium hover:gap-3 transition-all mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16 relative">
        {/* Image Column */}
        <div>
          <div
            className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl h-[420px] sm:h-[480px] flex items-center justify-center relative overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm select-none cursor-crosshair p-4"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            {mainImage && mainImage.startsWith("http") ? (
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-8xl">
                {mainImage || (product.productType === "BOOK" ? "📚" : "🔧")}
              </span>
            )}

            {/* Rokomari-style Hover Zoom Lens */}
            {showZoom && mainImage?.startsWith("http") && (
              <div
                className="absolute border-2 border-violet-500 bg-violet-500/20 pointer-events-none rounded-md"
                style={{
                  width: `${LENS_WIDTH}px`,
                  height: `${LENS_HEIGHT}px`,
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                }}
              />
            )}

            {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none z-10 shadow-sm">
                {discountPercent}% OFF
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4 justify-center sm:justify-start">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition cursor-pointer bg-white dark:bg-slate-900 p-1 ${
                    (selectedImage === img || (!selectedImage && i === 0))
                      ? "border-violet-600 shadow-md ring-2 ring-violet-100 dark:ring-violet-900/40"
                      : "border-gray-200 dark:border-slate-700 hover:border-violet-300"
                  }`}
                >
                  {img.startsWith("http") ? (
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain rounded" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl bg-[var(--muted)]">{img}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Trust Badges */}
          <div className="hidden lg:grid grid-cols-2 gap-3 mt-6 p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Fast Delivery
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Easy Returns
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              100% Original
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Secured Payment
            </div>
          </div>
        </div>

        {/* Info Column OR Zoom Preview Overlay */}
        <div className="relative">
          {showZoom && mainImage?.startsWith("http") ? (
            <div
              className="hidden lg:block absolute inset-0 z-30 bg-white dark:bg-slate-900 rounded-2xl border-2 border-violet-500 shadow-2xl overflow-hidden"
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                backgroundSize: "250%",
                backgroundRepeat: "no-repeat"
              }}
            />
          ) : null}

          {/* Info Content */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {product.classLevel && (
                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
                  {product.classLevel}
                </span>
              )}
              {product.subject && (
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                  {product.subject}
                </span>
              )}
              {product.productType && (
                <span className="bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-100 dark:border-violet-900/40">
                  {product.productType === "BOOK" ? "📚 Book" : "🔧 Gadget"}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-1.5 leading-tight tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              {product.name}
            </h1>

            {product.author && (
              <p className="text-gray-500 dark:text-gray-400 text-[15px] mb-4">
                by <span className="font-medium text-gray-700 dark:text-gray-300">{product.author}</span>
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-slate-700 dark:text-slate-700"}`} />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {reviews.length > 0 ? `${rating}.0 · ${reviews.length} review${reviews.length > 1 ? "s" : ""}` : "No reviews yet"}
              </span>
            </div>

            {/* Price Card */}
            <div className="p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)] mb-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-400">
                  ৳{(product.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      Save ৳{savedAmount.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2.5">
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    In Stock — {product.stock} available
                  </span>
                ) : (
                  <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Meta table */}
            {(product.publisher || product.edition || product.isbn || product.brand || product.model) && (
              <div className="text-sm mb-5 rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
                {product.publisher && (
                  <div className="flex justify-between px-4 py-2.5 bg-white dark:bg-slate-900">
                    <span className="text-gray-500 dark:text-gray-400">Publisher</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{product.publisher}</span>
                  </div>
                )}
                {product.edition && (
                  <div className="flex justify-between px-4 py-2.5 bg-white dark:bg-slate-900">
                    <span className="text-gray-500 dark:text-gray-400">Edition</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{product.edition}</span>
                  </div>
                )}
                {product.isbn && (
                  <div className="flex justify-between px-4 py-2.5 bg-white dark:bg-slate-900">
                    <span className="text-gray-500 dark:text-gray-400">ISBN</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium font-mono">{product.isbn}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between px-4 py-2.5 bg-white dark:bg-slate-900">
                    <span className="text-gray-500 dark:text-gray-400">Brand</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{product.brand}</span>
                  </div>
                )}
                {product.model && (
                  <div className="flex justify-between px-4 py-2.5 bg-white dark:bg-slate-900">
                    <span className="text-gray-500 dark:text-gray-400">Model</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{product.model}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity + Add to Cart + Wishlist */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-3 bg-[var(--muted)] rounded-full px-2 py-1 border border-[var(--border)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-full font-semibold transition shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlist}
                className={`p-3.5 rounded-full border-2 transition ${wishlisted
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-600"
                  : "border-[var(--border)] hover:border-violet-300 text-gray-400 hover:text-violet-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Trust Badges — mobile only */}
            <div className="grid lg:hidden grid-cols-2 gap-3 mt-5 p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Truck className="w-4 h-4 text-violet-500" />
                Fast Delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <RefreshCw className="w-4 h-4 text-violet-500" />
                Easy Returns
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-violet-500" />
                100% Original
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <ShieldCheck className="w-4 h-4 text-violet-500" />
                Secured Payment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-6 border-b border-[var(--border)] mb-6">
          {(["description", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-semibold text-sm transition border-b-2 -mb-px ${activeTab === tab
                ? "border-violet-600 text-violet-600 dark:text-violet-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab === "description" ? "Description" : `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            <ReviewForm productId={id} />

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-[var(--muted)] rounded-2xl border border-dashed border-[var(--border)]">
                <span className="text-4xl mb-3 block">⭐</span>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              reviews.map((review: Review) => (
                <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-full flex items-center justify-center font-bold text-white text-sm">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {review.user?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-BD", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <RelatedProducts productId={id} />
    </div>
  );
}






// "use client";

// import { useState } from "react";
// import {
//   ShoppingCart, Star, Heart, ArrowLeft,
//   Plus, Minus, CheckCircle, Truck, RefreshCw, ShieldCheck,
// } from "lucide-react";
// import Link from "next/link";
// import { useCartWithAuth, useProduct, useProductReviews, useAddToWishlist } from "@/lib/hooks";
// import ReviewForm from "./ReviewForm";
// import RelatedProducts from "./RelatedProducts";

// interface Review {
//   id: string;
//   rating: number;
//   comment?: string | null;
//   createdAt: string;
//   user?: {
//     name?: string | null;
//   };
// }

// export default function ProductDetailClient({ id }: { id: string }) {
//   const [quantity, setQuantity] = useState(1);
//   const [wishlisted, setWishlisted] = useState(false);
//   const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

//   const { data: product, isLoading } = useProduct(id);
//   const { data: reviewData } = useProductReviews(id);
//   const { addItem } = useCartWithAuth();
//   const addToWishlist = useAddToWishlist();

//   const reviews: Review[] = reviewData?.data || [];

//   const handleAddToCart = () => {
//     if (!product) return;
//     addItem(
//       {
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         discountPrice: product.discountPrice,
//         image: product.images?.[0] || "📚",
//         stock: product.stock,
//       },
//       quantity
//     );
//   };

//   const handleWishlist = () => {
//     if (!product) return;
//     addToWishlist.mutate(product.id);
//     setWishlisted(!wishlisted);
//   };

//   if (isLoading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
//           <div className="h-96 bg-[var(--muted)] rounded-2xl" />
//           <div className="space-y-4">
//             <div className="h-6 bg-[var(--muted)] rounded w-1/3" />
//             <div className="h-8 bg-[var(--muted)] rounded w-3/4" />
//             <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
//             <div className="h-12 bg-[var(--muted)] rounded" />
//             <div className="h-12 bg-[var(--muted)] rounded" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-20 text-center">
//         <span className="text-6xl mb-4 block">📭</span>
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
//         <Link href="/products" className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold transition">
//           Back to Shop
//         </Link>
//       </div>
//     );
//   }

//   const rating = reviews.length > 0
//     ? Math.round(reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length)
//     : 4;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
//         <Link href="/" className="hover:text-violet-600 transition">Home</Link>
//         <span>/</span>
//         <Link href="/products" className="hover:text-violet-600 transition">Shop</Link>
//         <span>/</span>
//         <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
//       </div>

//       <Link href="/products" className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-medium hover:underline mb-6">
//         <ArrowLeft className="w-4 h-4" />
//         Back to Shop
//       </Link>

//       {/* Product Main */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
//         {/* Image */}
//         <div>
//           <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden border border-gray-100 dark:border-slate-700">
//             {product.images?.[0] && product.images[0].startsWith("http") ? (
//               <img
//                 src={product.images[0]}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="text-9xl">
//                 {product.images?.[0] || (product.productType === "BOOK" ? "📚" : "🔧")}
//               </span>
//             )}
//             {product.discountPrice && (
//               <div className="absolute top-4 left-4 bg-sky-500 text-white text-sm font-bold px-3 py-1 rounded-full">
//                 {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
//               </div>
//             )}
//           </div>

//           {/* Extra Images */}
//           {product.images?.length > 1 && (
//             <div className="flex gap-3 mt-3">
//               {product.images.slice(1).map((img: string, i: number) => (
//                 <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[var(--border)] hover:border-violet-500 transition cursor-pointer">
//                   {img.startsWith("http") ? (
//                     <img src={img} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-2xl bg-[var(--muted)]">{img}</div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Info */}
//         <div>
//           {/* Badges */}
//           <div className="flex items-center gap-2 mb-3 flex-wrap">
//             {product.classLevel && (
//               <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full">
//                 {product.classLevel}
//               </span>
//             )}
//             {product.subject && (
//               <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
//                 {product.subject}
//               </span>
//             )}
//             {product.productType && (
//               <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-medium px-3 py-1 rounded-full">
//                 {product.productType === "BOOK" ? "📚 Book" : "🔧 Gadget"}
//               </span>
//             )}
//           </div>

//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
//             {product.name}
//           </h1>

//           {/* Author line (subtitle style, like reference) */}
//           {product.author && (
//             <p className="text-gray-500 dark:text-gray-400 mb-3">{product.author}</p>
//           )}

//           {/* Other meta info */}
//           {(product.publisher || product.edition || product.isbn || product.brand || product.model) && (
//             <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1.5">
//               {product.publisher && (
//                 <p>Publisher: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.publisher}</span></p>
//               )}
//               {product.edition && (
//                 <p>Edition: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.edition}</span></p>
//               )}
//               {product.isbn && (
//                 <p>ISBN: <span className="text-gray-700 dark:text-gray-300 font-medium font-mono">{product.isbn}</span></p>
//               )}
//               {product.brand && (
//                 <p>Brand: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.brand}</span></p>
//               )}
//               {product.model && (
//                 <p>Model: <span className="text-gray-700 dark:text-gray-300 font-medium">{product.model}</span></p>
//               )}
//             </div>
//           )}

//           {/* Rating */}
//           <div className="flex items-center gap-2 mb-4">
//             <div className="flex items-center gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-slate-700 dark:text-slate-700"}`} />
//               ))}
//             </div>
//             <span className="text-gray-500 dark:text-gray-400 text-sm">({reviews.length} reviews)</span>
//           </div>

//           {/* Price */}
//           <div className="flex items-baseline gap-3 mb-3">
//             <span className="text-4xl font-extrabold text-violet-600 dark:text-violet-400">
//               ৳{(product.discountPrice || product.price).toLocaleString()}
//             </span>
//             {product.discountPrice && (
//               <span className="text-lg text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
//             )}
//           </div>

//           {/* Stock */}
//           <div className="flex items-center gap-2 mb-5">
//             {product.stock > 0 ? (
//               <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
//                 <CheckCircle className="w-4 h-4" />
//                 In Stock ({product.stock} available)
//               </span>
//             ) : (
//               <span className="text-sm text-red-500 font-medium">Out of Stock</span>
//             )}
//           </div>

//           {/* Quantity + Add to Cart + Wishlist — one row like reference */}
//           <div className="flex items-center gap-3 mb-6 flex-wrap">
//             <div className="flex items-center gap-3 bg-[var(--muted)] rounded-full px-2 py-1">
//               <button
//                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition"
//               >
//                 <Minus className="w-4 h-4" />
//               </button>
//               <span className="w-6 text-center font-semibold">{quantity}</span>
//               <button
//                 onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                 disabled={quantity >= product.stock}
//                 className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-40"
//               >
//                 <Plus className="w-4 h-4" />
//               </button>
//             </div>

//             <button
//               onClick={handleAddToCart}
//               disabled={product.stock === 0}
//               className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-full font-semibold transition"
//             >
//               <ShoppingCart className="w-5 h-5" />
//               {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
//             </button>

//             <button
//               onClick={handleWishlist}
//               className={`p-3.5 rounded-full border-2 transition ${wishlisted
//                 ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-600"
//                 : "border-[var(--border)] hover:border-violet-300 text-gray-400 hover:text-violet-500"
//               }`}
//             >
//               <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
//             </button>
//           </div>

//           {/* Trust Badge box */}
//           <div className="grid grid-cols-2 gap-3 p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
//             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//               <Truck className="w-4 h-4 text-violet-500" />
//               Fast Delivery
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//               <RefreshCw className="w-4 h-4 text-violet-500" />
//               Easy Returns
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//               <CheckCircle className="w-4 h-4 text-violet-500" />
//               100% Original
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//               <ShieldCheck className="w-4 h-4 text-violet-500" />
//               Secured Payment
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-12">
//         <div className="flex gap-4 border-b border-[var(--border)] mb-6">
//           {(["description", "reviews"] as const).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`pb-3 px-2 font-semibold capitalize text-sm transition border-b-2 ${activeTab === tab
//                 ? "border-violet-600 text-violet-600 dark:text-violet-400"
//                 : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//               }`}
//             >
//               {tab === "description" ? "Description" : `Reviews (${reviews.length})`}
//             </button>
//           ))}
//         </div>

//         {/* Description */}
//         {activeTab === "description" && (
//           <div className="prose dark:prose-invert max-w-none">
//             <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//               {product.description || "No description available."}
//             </p>
//           </div>
//         )}

//         {/* Reviews */}
//         {activeTab === "reviews" && (
//           <div className="space-y-4">
//             {/* Review Form */}
//             <ReviewForm productId={id} />

//             {/* Reviews List */}
//             {reviews.length === 0 ? (
//               <div className="text-center py-8">
//                 <span className="text-4xl mb-3 block">⭐</span>
//                 <p className="text-gray-500 dark:text-gray-400">
//                   No reviews yet. Be the first to review!
//                 </p>
//               </div>
//             ) : (
//               reviews.map((review: Review) => (
//                 <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center font-bold text-violet-600 dark:text-violet-400">
//                         {review.user?.name?.[0]?.toUpperCase() || "U"}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 dark:text-white text-sm">
//                           {review.user?.name}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {new Date(review.createdAt).toLocaleDateString("en-BD", {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-3.5 h-3.5 ${i < review.rating
//                             ? "fill-amber-400 text-amber-400"
//                             : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                   {review.comment && (
//                     <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {/* Related Products */}
//       <RelatedProducts productId={id} />
//     </div>
//   );
// }