"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart, Star, Heart, ArrowLeft,
  Plus, Minus, CheckCircle, Truck, RefreshCw, ShieldCheck, BadgeCheck,
  ChevronDown, ChevronUp, Share2, BookOpen
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

const LENS_WIDTH = 120;
const LENS_HEIGHT = 160;

const isValidMeta = (val?: string | null) => {
  return val && val.trim() !== "" && val.trim() !== "$$";
};

export default function ProductDetailClient({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Zoom States
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

  // Sticky bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    let lensX = x - LENS_WIDTH / 2;
    let lensY = y - LENS_HEIGHT / 2;

    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > width - LENS_WIDTH) lensX = width - LENS_WIDTH;
    if (lensY > height - LENS_HEIGHT) lensY = height - LENS_HEIGHT;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-5 h-[450px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl mb-4 block">📭</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">The product you are looking for might have been removed or is unavailable.</p>
        <Link href="/products" className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-medium transition shadow-lg shadow-violet-500/25">
          Back to Shop
        </Link>
      </div>
    );
  }

  const rating = reviews.length > 0
    ? Math.round(reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length)
    : 5;

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const savedAmount = product.discountPrice ? product.price - product.discountPrice : 0;
  const hasValidMeta = isValidMeta(product.publisher) || isValidMeta(product.edition) || isValidMeta(product.isbn) || isValidMeta(product.brand) || isValidMeta(product.model);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 selection:bg-violet-500 selection:text-white">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-violet-600 transition">Shop</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[200px]">{product.name}</span>
      </div>

      <Link href="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:gap-3 transition-all mb-6 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Products
      </Link>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 relative">
        
        {/* Left Column: Image Gallery (5 Cols) */}
        <div className="lg:col-span-5">
          <div
            className="bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-900/60 dark:to-slate-900/30 rounded-3xl h-[420px] sm:h-[480px] flex items-center justify-center relative border border-slate-200/80 dark:border-slate-800/80 shadow-sm select-none cursor-crosshair p-8 group"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            {mainImage && mainImage.startsWith("http") ? (
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-lg shadow-[0_15px_35px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <span className="text-8xl filter drop-shadow-lg">
                {mainImage || (product.productType === "BOOK" ? "📚" : "🔧")}
              </span>
            )}

            {/* Hover Lens */}
            {showZoom && mainImage?.startsWith("http") && (
              <div
                className="absolute border-2 border-violet-500 bg-violet-500/10 backdrop-blur-[1px] pointer-events-none rounded-lg shadow-xl"
                style={{
                  width: `${LENS_WIDTH}px`,
                  height: `${LENS_HEIGHT}px`,
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                }}
              />
            )}

            {/* Badges */}
            {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-lg shadow-rose-500/20 uppercase tracking-wider">
                {discountPercent}% OFF
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-md flex items-center justify-center rounded-3xl">
                <span className="bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 justify-center sm:justify-start">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white dark:bg-slate-900 p-1 shrink-0 ${
                    (selectedImage === img || (!selectedImage && i === 0))
                      ? "border-violet-600 shadow-lg shadow-violet-500/20 ring-2 ring-violet-500/20 scale-105"
                      : "border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-400"
                  }`}
                >
                  {img.startsWith("http") ? (
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">{img}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="hidden lg:grid grid-cols-2 gap-3 mt-6 p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Express Delivery</p>
                <p className="text-[10px] text-slate-500">2-4 Days Islandwide</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">7 Days Return</p>
                <p className="text-[10px] text-slate-500">Moneyback Guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">100% Original</p>
                <p className="text-[10px] text-slate-500">Authentic Publication</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Secure Payment</p>
                <p className="text-[10px] text-slate-500">SSL Encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions (7 Cols) */}
        <div className="lg:col-span-7 relative flex flex-col justify-between">
          
          {/* Zoom Window Box */}
          {showZoom && mainImage?.startsWith("http") ? (
            <div
              className="hidden lg:block absolute inset-0 z-30 bg-white dark:bg-slate-900 rounded-3xl border-2 border-violet-500 shadow-2xl overflow-hidden"
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                backgroundSize: "280%",
                backgroundRepeat: "no-repeat"
              }}
            />
          ) : null}

          <div>
            {/* Tag Categories */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.classLevel && (
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                  {product.classLevel}
                </span>
              )}
              {product.subject && (
                <span className="bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-violet-100 dark:border-violet-900/40">
                  {product.subject}
                </span>
              )}
              {product.productType && (
                <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/40 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {product.productType === "BOOK" ? "Book" : "Gadget"}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Author */}
            {product.author && isValidMeta(product.author) && (
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                by <span className="font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">{product.author}</span>
              </p>
            )}

            {/* Rating & Social Share */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">{rating}.0</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({reviews.length} {reviews.length === 1 ? "Customer Review" : "Customer Reviews"})
                </span>
              </div>

              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Pricing Section */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-violet-50/30 dark:from-slate-900/80 dark:to-violet-950/20 rounded-2xl border border-slate-200/70 dark:border-slate-800 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-violet-600 dark:text-violet-400">
                  ৳{(product.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base text-slate-400 line-through">৳{product.price.toLocaleString()}</span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                      Save ৳{savedAmount.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                {product.stock > 0 ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    In Stock ({product.stock} copies available)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-500">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Action Controls */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700/80 shadow-inner">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3.5 px-6 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-full font-bold text-sm transition shadow-lg shadow-violet-600/25 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className={`p-3.5 rounded-full border-2 transition ${wishlisted
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-600"
                    : "border-slate-200 dark:border-slate-800 hover:border-violet-300 text-slate-400 hover:text-violet-600"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Quick Spec Summary */}
          {hasValidMeta && (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Specifications Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {isValidMeta(product.publisher) && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Publisher</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{product.publisher}</span>
                  </div>
                )}
                {isValidMeta(product.edition) && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Edition</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{product.edition}</span>
                  </div>
                )}
                {isValidMeta(product.isbn) && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">ISBN</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">{product.isbn}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-16">
        <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mb-8">
          {(["description", "specifications", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-bold text-sm capitalize transition border-b-2 -mb-px ${activeTab === tab
                ? "border-violet-600 text-violet-600 dark:text-violet-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab === "description" ? "Book Overview" : tab === "specifications" ? "Specifications" : `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "description" && (
          <div className="bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800">
            <div className={`prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed ${!isDescExpanded ? "line-clamp-4" : ""}`}>
              <p>{product.description || "No detailed description provided for this product."}</p>
            </div>
            {product.description && product.description.length > 200 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-4 text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:underline"
              >
                {isDescExpanded ? <>Show Less <ChevronUp className="w-3.5 h-3.5" /></> : <>Read Full Overview <ChevronDown className="w-3.5 h-3.5" /></>}
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Specifications Table */}
        {activeTab === "specifications" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden max-w-2xl">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isValidMeta(product.publisher) && (
                  <tr>
                    <td className="px-6 py-3.5 text-slate-400 font-medium w-1/3 bg-slate-50/50 dark:bg-slate-800/30">Publisher</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{product.publisher}</td>
                  </tr>
                )}
                {isValidMeta(product.author) && (
                  <tr>
                    <td className="px-6 py-3.5 text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30">Author</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{product.author}</td>
                  </tr>
                )}
                {isValidMeta(product.edition) && (
                  <tr>
                    <td className="px-6 py-3.5 text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30">Edition</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{product.edition}</td>
                  </tr>
                )}
                {isValidMeta(product.isbn) && (
                  <tr>
                    <td className="px-6 py-3.5 text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30">ISBN</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200 font-mono">{product.isbn}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <ReviewForm productId={id} />

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-4xl mb-2 block">💬</span>
                <p className="text-slate-500 text-xs font-semibold">No customer reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              reviews.map((review: Review) => (
                <div key={review.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md shadow-violet-500/20">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{review.user?.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <RelatedProducts productId={id} />

      {/* Floating Sticky Buy Bar (On Scroll) */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 transition-transform duration-300 shadow-2xl ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            {mainImage && mainImage.startsWith("http") && (
              <img src={mainImage} alt={product.name} className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-700" />
            )}
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
              <p className="text-xs font-black text-violet-600 dark:text-violet-400">৳{(product.discountPrice || product.price).toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-md shadow-violet-500/20 transition shrink-0"
          >
            Add to Cart
          </button>
        </div>
      </div>

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