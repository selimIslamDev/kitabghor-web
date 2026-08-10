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
          <div className="lg:col-span-5 h-[450px] bg-[#161411] rounded-2xl border border-[#c9a227]/15" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-5 bg-[#161411] rounded w-1/4" />
            <div className="h-10 bg-[#161411] rounded w-3/4" />
            <div className="h-4 bg-[#161411] rounded w-1/3" />
            <div className="h-28 bg-[#161411] rounded-2xl" />
            <div className="h-12 bg-[#161411] rounded-xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl mb-4 block">📭</span>
        <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">Product Not Found</h2>
        <p className="text-[#a89f8f] mb-6 text-sm">The product you are looking for might have been removed or is unavailable.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-[#c9a227] hover:bg-[#d4b84a] text-[#0c0b09] rounded-xl font-semibold transition shadow-lg shadow-[#c9a227]/20"
        >
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 selection:bg-[#c9a227] selection:text-[#0c0b09]">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#6b6358] mb-5">
        <Link href="/" className="hover:text-[#c9a227] transition">Home</Link>
        <span className="opacity-50">/</span>
        <Link href="/products" className="hover:text-[#c9a227] transition">Shop</Link>
        <span className="opacity-50">/</span>
        <span className="text-[#f5f0e8] font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#c9a227] hover:gap-3 transition-all mb-7 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Products
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16 relative">
        
        {/* Left: Gallery */}
        <div className="lg:col-span-5">
          <div
            className="bg-gradient-to-b from-[#1c1915] to-[#161411] rounded-2xl h-[420px] sm:h-[480px] flex items-center justify-center relative border border-[#c9a227]/15 shadow-[0_24px_64px_rgba(0,0,0,0.4)] select-none cursor-crosshair p-8 group"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            {mainImage && mainImage.startsWith("http") ? (
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-lg shadow-[0_20px_40px_-8px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <span className="text-8xl filter drop-shadow-lg">
                {mainImage || (product.productType === "BOOK" ? "📚" : "🔧")}
              </span>
            )}

            {/* Hover Lens */}
            {showZoom && mainImage?.startsWith("http") && (
              <div
                className="absolute border-2 border-[#c9a227] bg-[#c9a227]/10 backdrop-blur-[1px] pointer-events-none rounded-lg shadow-xl"
                style={{
                  width: `${LENS_WIDTH}px`,
                  height: `${LENS_HEIGHT}px`,
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                }}
              />
            )}

            {/* Discount Badge */}
            {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#c9a227] to-[#b8921f] text-[#0c0b09] text-[11px] font-bold px-3 py-1.5 rounded-lg z-10 shadow-lg shadow-[#c9a227]/25 uppercase tracking-wider">
                {discountPercent}% OFF
              </div>
            )}

            {/* Out of Stock Overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 z-20 bg-[#0c0b09]/70 backdrop-blur-md flex items-center justify-center rounded-2xl">
                <span className="bg-rose-600 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">
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
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#161411] p-1 shrink-0 ${
                    (selectedImage === img || (!selectedImage && i === 0))
                      ? "border-[#c9a227] shadow-lg shadow-[#c9a227]/15 ring-2 ring-[#c9a227]/20 scale-105"
                      : "border-[#c9a227]/15 opacity-70 hover:opacity-100 hover:border-[#c9a227]/40"
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

          {/* Trust Badges */}
          <div className="hidden lg:grid grid-cols-2 gap-3 mt-6 p-4 bg-[#161411]/80 rounded-2xl border border-[#c9a227]/12">
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center shrink-0 text-[#c9a227]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#f5f0e8]">Express Delivery</p>
                <p className="text-[10px] text-[#6b6358]">2-4 Days Islandwide</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center shrink-0 text-[#c9a227]">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#f5f0e8]">7 Days Return</p>
                <p className="text-[10px] text-[#6b6358]">Moneyback Guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center shrink-0 text-[#c9a227]">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#f5f0e8]">100% Original</p>
                <p className="text-[10px] text-[#6b6358]">Authentic Publication</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center shrink-0 text-[#c9a227]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#f5f0e8]">Secure Payment</p>
                <p className="text-[10px] text-[#6b6358]">SSL Encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-7 relative flex flex-col justify-between">
          
          {/* Zoom Window */}
          {showZoom && mainImage?.startsWith("http") ? (
            <div
              className="hidden lg:block absolute inset-0 z-30 bg-[#161411] rounded-2xl border-2 border-[#c9a227] shadow-2xl overflow-hidden"
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                backgroundSize: "280%",
                backgroundRepeat: "no-repeat"
              }}
            />
          ) : null}

          <div>
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {product.classLevel && (
                <span className="bg-[#1c1915] text-[#a89f8f] text-[11px] font-medium px-3 py-1 rounded-lg border border-[#c9a227]/15">
                  {product.classLevel}
                </span>
              )}
              {product.subject && (
                <span className="bg-[#c9a227]/10 text-[#d4b84a] text-[11px] font-medium px-3 py-1 rounded-lg border border-[#c9a227]/25">
                  {product.subject}
                </span>
              )}
              {product.productType && (
                <span className="bg-[#c9a227]/10 text-[#d4b84a] text-[11px] font-medium px-3 py-1 rounded-lg border border-[#c9a227]/25 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {product.productType === "BOOK" ? "Book" : "Gadget"}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold text-[#f5f0e8] mb-2 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Author */}
            {product.author && isValidMeta(product.author) && (
              <p className="text-[#a89f8f] text-sm mb-5">
                by <span className="font-semibold text-[#c9a227] hover:text-[#d4b84a] cursor-pointer transition">{product.author}</span>
              </p>
            )}

            {/* Rating + Share */}
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#c9a227]/12 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 bg-[#c9a227]/10 px-2.5 py-1 rounded-lg border border-[#c9a227]/20">
                  <Star className="w-3.5 h-3.5 fill-[#c9a227] text-[#c9a227]" />
                  <span className="text-xs font-semibold text-[#d4b84a]">{rating}.0</span>
                </div>
                <span className="text-xs text-[#6b6358]">
                  ({reviews.length} {reviews.length === 1 ? "Customer Review" : "Customer Reviews"})
                </span>
              </div>

              <button className="text-[#6b6358] hover:text-[#c9a227] transition p-2 rounded-full hover:bg-[#c9a227]/10">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Price Block */}
            <div className="p-5 bg-[#161411] rounded-2xl border border-[#c9a227]/15 mb-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-semibold text-[#c9a227]">
                  ৳{(product.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base text-[#6b6358] line-through">৳{product.price.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      Save ৳{savedAmount.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="mt-4 pt-3 border-t border-[#c9a227]/10 flex items-center justify-between">
                {product.stock > 0 ? (
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    In Stock ({product.stock} copies available)
                  </span>
                ) : (
                  <span className="text-xs font-medium text-rose-400">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center gap-1 bg-[#1c1915] rounded-xl px-2 py-1.5 border border-[#c9a227]/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#a89f8f] hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm text-[#f5f0e8]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#a89f8f] hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#c9a227] to-[#b8921f] hover:from-[#d4b84a] hover:to-[#c9a227] disabled:opacity-50 text-[#0c0b09] rounded-xl font-semibold text-sm transition shadow-lg shadow-[#c9a227]/25 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className={`p-3.5 rounded-xl border-2 transition ${
                    wishlisted
                      ? "border-[#c9a227] bg-[#c9a227]/10 text-[#c9a227]"
                      : "border-[#c9a227]/20 hover:border-[#c9a227]/50 text-[#6b6358] hover:text-[#c9a227]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Specs Summary */}
          {hasValidMeta && (
            <div className="bg-[#161411]/80 rounded-2xl p-4 border border-[#c9a227]/12">
              <h4 className="text-[11px] font-semibold text-[#6b6358] uppercase tracking-wider mb-3">Specifications Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {isValidMeta(product.publisher) && (
                  <div>
                    <span className="text-[#6b6358] block text-[10px] mb-0.5">Publisher</span>
                    <span className="font-medium text-[#f5f0e8]">{product.publisher}</span>
                  </div>
                )}
                {isValidMeta(product.edition) && (
                  <div>
                    <span className="text-[#6b6358] block text-[10px] mb-0.5">Edition</span>
                    <span className="font-medium text-[#f5f0e8]">{product.edition}</span>
                  </div>
                )}
                {isValidMeta(product.isbn) && (
                  <div>
                    <span className="text-[#6b6358] block text-[10px] mb-0.5">ISBN</span>
                    <span className="font-medium text-[#f5f0e8] font-mono">{product.isbn}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex gap-8 border-b border-[#c9a227]/15 mb-8">
          {(["description", "specifications", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold text-sm capitalize transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#c9a227] text-[#c9a227]"
                  : "border-transparent text-[#6b6358] hover:text-[#a89f8f]"
              }`}
            >
              {tab === "description" ? "Book Overview" : tab === "specifications" ? "Specifications" : `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="bg-[#161411]/60 rounded-2xl p-6 border border-[#c9a227]/12">
            <div className={`prose prose-invert max-w-none text-[#a89f8f] text-sm leading-relaxed ${!isDescExpanded ? "line-clamp-4" : ""}`}>
              <p>{product.description || "No detailed description provided for this product."}</p>
            </div>
            {product.description && product.description.length > 200 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-4 text-xs font-semibold text-[#c9a227] flex items-center gap-1 hover:text-[#d4b84a] transition"
              >
                {isDescExpanded ? (
                  <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Read Full Overview <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div className="bg-[#161411] rounded-2xl border border-[#c9a227]/12 overflow-hidden max-w-2xl">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-[#c9a227]/10">
                {isValidMeta(product.publisher) && (
                  <tr>
                    <td className="px-6 py-3.5 text-[#6b6358] font-medium w-1/3 bg-[#1c1915]/50">Publisher</td>
                    <td className="px-6 py-3.5 font-medium text-[#f5f0e8]">{product.publisher}</td>
                  </tr>
                )}
                {isValidMeta(product.author) && (
                  <tr>
                    <td className="px-6 py-3.5 text-[#6b6358] font-medium bg-[#1c1915]/50">Author</td>
                    <td className="px-6 py-3.5 font-medium text-[#f5f0e8]">{product.author}</td>
                  </tr>
                )}
                {isValidMeta(product.edition) && (
                  <tr>
                    <td className="px-6 py-3.5 text-[#6b6358] font-medium bg-[#1c1915]/50">Edition</td>
                    <td className="px-6 py-3.5 font-medium text-[#f5f0e8]">{product.edition}</td>
                  </tr>
                )}
                {isValidMeta(product.isbn) && (
                  <tr>
                    <td className="px-6 py-3.5 text-[#6b6358] font-medium bg-[#1c1915]/50">ISBN</td>
                    <td className="px-6 py-3.5 font-medium text-[#f5f0e8] font-mono">{product.isbn}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-5">
            <ReviewForm productId={id} />

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-[#161411]/60 rounded-2xl border border-dashed border-[#c9a227]/20">
                <span className="text-4xl mb-2 block">💬</span>
                <p className="text-[#6b6358] text-xs font-medium">No customer reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              reviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="bg-[#161411] rounded-2xl border border-[#c9a227]/12 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#c9a227] rounded-full flex items-center justify-center font-bold text-[#0c0b09] text-xs shadow-md shadow-[#c9a227]/20">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-[#f5f0e8] text-xs">{review.user?.name}</p>
                        <p className="text-[10px] text-[#6b6358]">
                          {new Date(review.createdAt).toLocaleDateString("en-BD", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? "fill-[#c9a227] text-[#c9a227]" : "text-[#3a342c]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-[#a89f8f] leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <RelatedProducts productId={id} />

      {/* Sticky Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#0c0b09]/90 backdrop-blur-md border-t border-[#c9a227]/15 p-3 transition-transform duration-300 shadow-2xl ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            {mainImage && mainImage.startsWith("http") && (
              <img
                src={mainImage}
                alt={product.name}
                className="w-10 h-10 object-contain rounded-lg border border-[#c9a227]/20"
              />
            )}
            <div className="truncate">
              <h4 className="text-xs font-semibold text-[#f5f0e8] truncate">{product.name}</h4>
              <p className="text-xs font-semibold text-[#c9a227]">
                ৳{(product.discountPrice || product.price).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-[#c9a227] to-[#b8921f] hover:from-[#d4b84a] hover:to-[#c9a227] disabled:opacity-50 text-[#0c0b09] rounded-xl font-semibold text-xs shadow-md shadow-[#c9a227]/20 transition shrink-0"
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