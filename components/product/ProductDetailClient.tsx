"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart, Star, Heart, ArrowLeft,
  Plus, Minus, CheckCircle, Truck, RefreshCw, ShieldCheck,
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

// Design tokens — Nirjhar Books style (single dark-gold theme, no light/dark toggle)
const theme = {
  "--bg": "#0c0b09",
  "--bg-elevated": "#161411",
  "--bg-card": "#1c1915",
  "--bg-soft": "#221e19",
  "--gold": "#c9a227",
  "--gold-soft": "#d4b84a",
  "--gold-dim": "#8a7120",
  "--text": "#f5f0e8",
  "--text-muted": "#a89f8f",
  "--text-dim": "#6b6358",
  "--border": "rgba(201, 162, 39, 0.18)",
  "--border-strong": "rgba(201, 162, 39, 0.35)",
  "--success": "#4a9b6e",
} as React.CSSProperties;

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

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 400);
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
      <div style={theme} className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-[1280px] mx-auto px-7 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
            <div className="lg:col-span-5 h-[480px] bg-[var(--bg-elevated)] rounded-[20px] border border-[var(--border)]" />
            <div className="lg:col-span-7 space-y-4">
              <div className="h-5 bg-[var(--bg-elevated)] rounded w-1/4" />
              <div className="h-12 bg-[var(--bg-elevated)] rounded w-3/4" />
              <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/3" />
              <div className="h-24 bg-[var(--bg-elevated)] rounded-2xl" />
              <div className="h-12 bg-[var(--bg-elevated)] rounded-full w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={theme} className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-[1280px] mx-auto px-7 py-24 text-center">
          <span className="text-6xl mb-4 block">📭</span>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Product Not Found</h2>
          <p className="text-[var(--text-muted)] mb-6 text-sm">The product you are looking for might have been removed or is unavailable.</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-[10px] font-semibold text-[#0c0b09]" style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)" }}>
            Back to Shop
          </Link>
        </div>
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
    <div style={theme} className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative">
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* subtle grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-8 relative z-[1]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[0.82rem] text-[var(--text-dim)] mb-2">
          <Link href="/" className="text-[var(--text-muted)] hover:text-[var(--gold)] transition">Home</Link>
          <span className="opacity-60">/</span>
          <Link href="/products" className="text-[var(--text-muted)] hover:text-[var(--gold)] transition">Shop</Link>
          <span className="opacity-60">/</span>
          <span className="text-[var(--text)] font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <Link href="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--gold-soft)] hover:text-[var(--gold)] hover:gap-3 transition-all my-6 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Products
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 relative">

          {/* Gallery */}
          <div className="lg:col-span-5">
            <div
              className="rounded-[20px] border border-[var(--border)] p-10 sm:p-12 flex items-center justify-center relative overflow-hidden select-none cursor-crosshair"
              style={{
                background: "linear-gradient(145deg, #1a1713 0%, #12100e 100%)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
              }}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(201, 162, 39, 0.07) 0%, transparent 55%)" }}
              />

              {mainImage && mainImage.startsWith("http") ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-h-[380px] max-w-full object-contain rounded-md relative z-[1]"
                  style={{ boxShadow: "8px 12px 32px rgba(0,0,0,0.55)" }}
                />
              ) : (
                <span className="text-8xl relative z-[1]">
                  {mainImage || (product.productType === "BOOK" ? "📚" : "🔧")}
                </span>
              )}

              {/* Hover Lens */}
              {showZoom && mainImage?.startsWith("http") && (
                <div
                  className="absolute pointer-events-none rounded-lg z-[2]"
                  style={{
                    width: `${LENS_WIDTH}px`,
                    height: `${LENS_HEIGHT}px`,
                    left: `${lensPos.x}px`,
                    top: `${lensPos.y}px`,
                    border: "2px solid var(--gold)",
                    background: "rgba(201, 162, 39, 0.15)",
                  }}
                />
              )}

              {product.discountPrice && (
                <div
                  className="absolute top-4 left-4 text-[#0c0b09] text-xs font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wider"
                  style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 100%)" }}
                >
                  {discountPercent}% OFF
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex items-center justify-center rounded-[20px]">
                  <span className="bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-5 justify-center overflow-x-auto pb-1">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className="w-16 h-16 rounded-[10px] overflow-hidden transition-all cursor-pointer flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--bg-card)",
                      border: (selectedImage === img || (!selectedImage && i === 0))
                        ? "1.5px solid var(--gold)"
                        : "1.5px solid transparent",
                      boxShadow: (selectedImage === img || (!selectedImage && i === 0))
                        ? "0 0 0 2px rgba(201, 162, 39, 0.2)"
                        : "none",
                    }}
                  >
                    {img.startsWith("http") ? (
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xl">{img}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Trust Guarantees */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mt-6 p-4 rounded-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              {[
                { icon: Truck, title: "Express Delivery", sub: "2-4 Days Islandwide" },
                { icon: RefreshCw, title: "7 Days Return", sub: "Moneyback Guarantee" },
                { icon: CheckCircle, title: "100% Original", sub: "Authentic Publication" },
                { icon: ShieldCheck, title: "Secure Payment", sub: "SSL Encrypted" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[var(--gold)]" style={{ background: "rgba(201, 162, 39, 0.12)" }}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text)]">{item.title}</p>
                    <p className="text-[10px] text-[var(--text-dim)]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-7 relative flex flex-col justify-between">
            {showZoom && mainImage?.startsWith("http") ? (
              <div
                className="hidden lg:block absolute inset-0 z-30 rounded-[20px] overflow-hidden"
                style={{
                  background: "var(--bg-elevated)",
                  border: "2px solid var(--gold)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                  backgroundSize: "280%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            ) : null}

            <div>
              {/* Tags */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {product.classLevel && (
                  <span
                    className="text-[0.72rem] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md"
                    style={{ background: "rgba(201, 162, 39, 0.1)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                  >
                    {product.classLevel}
                  </span>
                )}
                {product.subject && (
                  <span
                    className="text-[0.72rem] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md"
                    style={{ background: "rgba(201, 162, 39, 0.15)", color: "var(--gold-soft)", border: "1px solid rgba(201, 162, 39, 0.3)" }}
                  >
                    {product.subject}
                  </span>
                )}
                {product.productType && (
                  <span
                    className="text-[0.72rem] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md flex items-center gap-1"
                    style={{ background: "rgba(74, 155, 110, 0.12)", color: "#6bc48a", border: "1px solid rgba(74, 155, 110, 0.25)" }}
                  >
                    <BookOpen className="w-3 h-3" />
                    {product.productType === "BOOK" ? "Book" : "Gadget"}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-3xl sm:text-[3.1rem] font-semibold leading-[1.12] tracking-tight mb-2.5"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text)" }}
              >
                {product.name}
              </h1>

              {product.author && isValidMeta(product.author) && (
                <p className="text-[1.05rem] text-[var(--text-muted)] mb-6">
                  by <span className="font-medium text-[var(--gold-soft)]">{product.author}</span>
                </p>
              )}

              {/* Rating + Share */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-[3px] text-[var(--gold)] text-[1.05rem]">
                    {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                  </div>
                  <span className="text-[0.9rem] text-[var(--text-muted)]">
                    <strong className="text-[var(--text)] font-semibold">{rating}.0</strong> · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
                <button className="text-[var(--text-dim)] hover:text-[var(--gold)] transition p-2 rounded-full">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Price Block */}
              <div
                className="rounded-[14px] p-6 mb-7 flex items-baseline gap-4 flex-wrap"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <span className="text-[2.4rem] font-semibold tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)" }}>
                  ৳{(product.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-[1.15rem] text-[var(--text-dim)] line-through">৳{product.price.toLocaleString()}</span>
                    <span className="text-[0.82rem] font-semibold px-2.5 py-1 rounded-[5px]" style={{ color: "var(--success)", background: "rgba(74, 155, 110, 0.12)" }}>
                      Save ৳{savedAmount.toLocaleString()}
                    </span>
                  </>
                )}

                <div className="w-full pt-3 mt-1 border-t" style={{ borderColor: "var(--border)" }}>
                  {product.stock > 0 ? (
                    <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--success)" }}>
                      <CheckCircle className="w-4 h-4" />
                      In Stock — {product.stock} copies available
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-400">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Meta grid */}
              {hasValidMeta && (
                <div className="grid grid-cols-2 gap-x-7 gap-y-3.5 mb-8 text-[0.88rem]">
                  {isValidMeta(product.publisher) && (
                    <div className="flex flex-col gap-[3px]">
                      <span className="text-[0.78rem] uppercase tracking-wide text-[var(--text-dim)]">Publisher</span>
                      <span className="font-medium text-[var(--text)]">{product.publisher}</span>
                    </div>
                  )}
                  {isValidMeta(product.edition) && (
                    <div className="flex flex-col gap-[3px]">
                      <span className="text-[0.78rem] uppercase tracking-wide text-[var(--text-dim)]">Edition</span>
                      <span className="font-medium text-[var(--text)]">{product.edition}</span>
                    </div>
                  )}
                  {isValidMeta(product.isbn) && (
                    <div className="flex flex-col gap-[3px]">
                      <span className="text-[0.78rem] uppercase tracking-wide text-[var(--text-dim)]">ISBN</span>
                      <span className="font-medium text-[var(--text)] font-mono">{product.isbn}</span>
                    </div>
                  )}
                  {isValidMeta(product.brand) && (
                    <div className="flex flex-col gap-[3px]">
                      <span className="text-[0.78rem] uppercase tracking-wide text-[var(--text-dim)]">Brand</span>
                      <span className="font-medium text-[var(--text)]">{product.brand}</span>
                    </div>
                  )}
                  {isValidMeta(product.model) && (
                    <div className="flex flex-col gap-[3px]">
                      <span className="text-[0.78rem] uppercase tracking-wide text-[var(--text-dim)]">Model</span>
                      <span className="font-medium text-[var(--text)]">{product.model}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3.5 flex-wrap mb-2">
                <div className="flex items-center rounded-[10px] overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-[42px] h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-11 text-center font-semibold text-sm text-[var(--text)]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-[42px] h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] transition disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 min-w-[180px] h-12 rounded-[10px] font-semibold text-sm flex items-center justify-center gap-2.5 transition disabled:opacity-50 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)",
                    color: "#0c0b09",
                    boxShadow: "0 4px 20px rgba(201, 162, 39, 0.25)",
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={handleWishlist}
                  className="h-12 w-12 rounded-[10px] flex items-center justify-center transition"
                  style={{
                    border: wishlisted ? "1.5px solid var(--gold)" : "1.5px solid var(--border-strong)",
                    color: wishlisted ? "var(--gold)" : "var(--text-muted)",
                    background: wishlisted ? "rgba(201, 162, 39, 0.08)" : "transparent",
                  }}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16 pt-7" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex gap-7 mb-6 pb-0" style={{ borderBottom: "1px solid var(--border)" }}>
            {(["description", "specifications", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="pb-3.5 font-medium text-sm transition relative -mb-px"
                style={{ color: activeTab === tab ? "var(--gold)" : "var(--text-dim)" }}
              >
                {tab === "description" ? "Book Overview" : tab === "specifications" ? "Specifications" : `Reviews (${reviews.length})`}
                {activeTab === tab && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] rounded-t-[2px]" style={{ background: "var(--gold)" }} />
                )}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div>
              <div
                className={`text-[0.95rem] leading-[1.75] text-[var(--text-muted)] ${!isDescExpanded ? "line-clamp-4" : ""}`}
              >
                <p>{product.description || "No detailed description provided for this product."}</p>
              </div>
              {product.description && product.description.length > 200 && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: "var(--gold-soft)" }}
                >
                  {isDescExpanded ? <>Show Less <ChevronUp className="w-3.5 h-3.5" /></> : <>Read Full Overview <ChevronDown className="w-3.5 h-3.5" /></>}
                </button>
              )}
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="rounded-[14px] overflow-hidden max-w-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <table className="w-full text-left text-xs">
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {isValidMeta(product.publisher) && (
                    <tr>
                      <td className="px-6 py-3.5 text-[var(--text-dim)] font-medium w-1/3" style={{ background: "var(--bg-soft)" }}>Publisher</td>
                      <td className="px-6 py-3.5 font-semibold text-[var(--text)]">{product.publisher}</td>
                    </tr>
                  )}
                  {isValidMeta(product.author) && (
                    <tr>
                      <td className="px-6 py-3.5 text-[var(--text-dim)] font-medium" style={{ background: "var(--bg-soft)" }}>Author</td>
                      <td className="px-6 py-3.5 font-semibold text-[var(--text)]">{product.author}</td>
                    </tr>
                  )}
                  {isValidMeta(product.edition) && (
                    <tr>
                      <td className="px-6 py-3.5 text-[var(--text-dim)] font-medium" style={{ background: "var(--bg-soft)" }}>Edition</td>
                      <td className="px-6 py-3.5 font-semibold text-[var(--text)]">{product.edition}</td>
                    </tr>
                  )}
                  {isValidMeta(product.isbn) && (
                    <tr>
                      <td className="px-6 py-3.5 text-[var(--text-dim)] font-medium" style={{ background: "var(--bg-soft)" }}>ISBN</td>
                      <td className="px-6 py-3.5 font-semibold text-[var(--text)] font-mono">{product.isbn}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-5">
              <ReviewForm productId={id} />

              {reviews.length === 0 ? (
                <div className="text-center py-12 rounded-[14px]" style={{ background: "var(--bg-elevated)", border: "1px dashed var(--border)" }}>
                  <span className="text-4xl mb-2 block">💬</span>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">No customer reviews yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                reviews.map((review: Review) => (
                  <div key={review.id} className="rounded-[14px] p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-[#0c0b09]"
                          style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 100%)" }}
                        >
                          {review.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text)] text-xs">{review.user?.name}</p>
                          <p className="text-[10px] text-[var(--text-dim)]">
                            {new Date(review.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-[2px] text-[var(--gold)] text-xs">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.comment && <p className="text-xs text-[var(--text-muted)] leading-relaxed">{review.comment}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2
            className="text-[1.85rem] font-semibold mb-7 flex items-center gap-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text)" }}
          >
            You may also like
            <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--border-strong), transparent)" }} />
          </h2>
          <RelatedProducts productId={id} />
        </div>
      </div>

      {/* Floating Sticky Buy Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
        style={{ background: "rgba(12, 11, 9, 0.9)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            {mainImage && mainImage.startsWith("http") && (
              <img src={mainImage} alt={product.name} className="w-10 h-10 object-contain rounded-lg" style={{ border: "1px solid var(--border)" }} />
            )}
            <div className="truncate">
              <h4 className="text-xs font-semibold text-[var(--text)] truncate">{product.name}</h4>
              <p className="text-xs font-bold" style={{ color: "var(--gold)" }}>৳{(product.discountPrice || product.price).toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="px-6 py-2.5 rounded-full font-semibold text-xs transition shrink-0 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8921f 100%)", color: "#0c0b09" }}
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