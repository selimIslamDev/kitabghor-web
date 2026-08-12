"use client";

import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { ShoppingCart, Star, ArrowRight, Zap, Wrench } from "lucide-react";
import { useCartWithAuth, useFeaturedProducts } from "@/lib/hooks";
import toast from "react-hot-toast";

interface Gadget {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  images?: string[];
  stock: number;
  productType: string;
  brand?: string | null;
  _count?: {
    reviews: number;
  };
}

const badgeLabels = ["Best Seller", "Popular", "New", "Top Rated"];
const badgeColors = [
  { bg: "#c9a227", color: "#0c0b09" },
  { bg: "rgba(59,130,246,0.9)", color: "#fff" },
  { bg: "rgba(34,197,94,0.9)", color: "#fff" },
  { bg: "rgba(168,85,247,0.9)", color: "#fff" },
];

export default function GadgetsSection() {
  const { addItem } = useCartWithAuth();
  const { data: products, isLoading } = useFeaturedProducts();

  const gadgets: Gadget[] =
    (products as Gadget[] | undefined)?.filter((p) => p.productType === "GADGET").slice(0, 4) || [];

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, gadget: Gadget) => {
    e.preventDefault();
    e.stopPropagation();
    if (gadget.stock === 0) {
      toast.error("This product is out of stock!");
      return;
    }
    addItem({
      id: gadget.id,
      name: gadget.name,
      price: gadget.price,
      discountPrice: gadget.discountPrice ?? undefined,
      image: gadget.images?.[0] || "🔧",
      stock: gadget.stock,
    });
    toast.success("Added to cart!");
  };

  return (
    <section className="py-12 relative overflow-hidden bg-[#0c0b09]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header — same style as FeaturedBooks */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-4 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
              style={{
                background: "rgba(201,162,39,0.1)",
                color: "#d4b84a",
                border: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Educational Gadgets</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{ color: "#f5f0e8" }}
            >
              Top Gadgets for Students
            </h2>
            <p className="text-sm mt-1" style={{ color: "#a89f8f" }}>
              Essential tools to boost your learning
            </p>
          </div>

          <Link
            href="/products?type=GADGET"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group"
            style={{
              color: "#d4b84a",
              background: "rgba(201,162,39,0.08)",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <span>View All Gadgets</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-[1.15rem]">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: "#141210", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="h-[11.5rem]" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="p-3 space-y-2">
                  <div className="h-3 rounded w-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-2.5 rounded w-2/3" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-2.5 rounded w-1/3" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-[1.15rem]">
            {gadgets.length > 0 ? (
              gadgets.map((gadget, index) => (
                <GadgetCard
                  key={gadget.id}
                  gadget={gadget}
                  index={index}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div
                className="col-span-full text-center py-12 rounded-2xl"
                style={{ background: "#141210", border: "1px dashed rgba(255,255,255,0.08)" }}
              >
                <Wrench className="w-10 h-10 mx-auto mb-2" style={{ color: "#6b6358" }} />
                <p className="text-sm font-medium" style={{ color: "#a89f8f" }}>
                  No gadgets available at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mobile View All */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/products?type=GADGET"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "#d4b84a" }}
          >
            View All Gadgets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GadgetCard({
  gadget,
  index,
  onAddToCart,
}: {
  gadget: Gadget;
  index: number;
  onAddToCart: (e: MouseEvent<HTMLButtonElement>, gadget: Gadget) => void;
}) {
  const validImages = (gadget.images || []).filter((img) => img && img.startsWith("http"));
  const hasMultipleImages = validImages.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDiscounted = !!gadget.discountPrice;
  const activePrice = gadget.discountPrice || gadget.price;
  const discountPercent = isDiscounted
    ? Math.round(((gadget.price - gadget.discountPrice!) / gadget.price) * 100)
    : 0;

  const badge = badgeLabels[index % 4];
  const badgeStyle = badgeColors[index % 4];

  const startCycling = () => {
    if (!hasMultipleImages) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, 900);
  };

  const stopCycling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      className="group rounded-xl overflow-hidden flex flex-col relative transition-colors duration-200"
      style={{ background: "#141210", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Image Area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ background: "rgba(12,11,9,0.5)", padding: "0.6rem", height: "11.5rem" }}
      >
        {/* Badge (Best Seller / Popular etc.) */}
        <div
          className="absolute z-20 font-bold"
          style={{
            top: "0.4rem",
            left: "0.4rem",
            padding: "2px 6px",
            borderRadius: "4px",
            background: badgeStyle.bg,
            color: badgeStyle.color,
            fontSize: "9px",
          }}
        >
          {badge}
        </div>

        {/* Discount Badge (circular) */}
        {isDiscounted && (
          <div
            className="absolute z-20 flex flex-col items-center justify-center font-bold leading-tight"
            style={{
              top: "0.4rem",
              right: "0.4rem",
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              background: "#c9a227",
              color: "#0c0b09",
              fontSize: "8px",
            }}
          >
            <span>{discountPercent}%</span>
            <span style={{ fontSize: "6px", fontWeight: 500, textTransform: "uppercase" }}>OFF</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {gadget.stock === 0 && (
          <div
            className="absolute inset-0 z-30 backdrop-blur-[1px] flex items-center justify-center"
            style={{ background: "rgba(12,11,9,0.75)" }}
          >
            <span
              className="text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ background: "#dc2626" }}
            >
              Out of Stock
            </span>
          </div>
        )}

        {/* Product Image */}
        {validImages.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {validImages.map((src, idx) => (
              <Image
                key={src + idx}
                src={src}
                alt={gadget.name}
                fill
                sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 20vw"
                className={`object-contain transition-all duration-300 ease-in-out p-1 ${
                  idx === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: "#6b6358" }}>
            {gadget.images?.[0] ? (
              <span className="text-3xl">{gadget.images[0]}</span>
            ) : (
              <Wrench className="w-10 h-10 stroke-[1.2]" />
            )}
          </div>
        )}

        {/* Multi-image Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-1 left-0 right-0 z-20 flex items-center justify-center gap-1">
            {validImages.map((_, idx) => (
              <span
                key={idx}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: idx === activeIndex ? "0.625rem" : "0.25rem",
                  background: idx === activeIndex ? "#c9a227" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        )}

        {/* Hover Overlay + Add to Cart */}
        <div
          className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background: "rgba(12,11,9,0.55)" }}
        >
          <button
            onClick={(e) => onAddToCart(e, gadget)}
            disabled={gadget.stock === 0}
            className="font-semibold transition-all active:scale-95"
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.4rem",
              fontSize: "0.7rem",
              background: gadget.stock === 0 ? "#4a463f" : "#c9a227",
              color: gadget.stock === 0 ? "#a89f8f" : "#0c0b09",
              cursor: gadget.stock === 0 ? "not-allowed" : "pointer",
              boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
            }}
          >
            {gadget.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-center" style={{ padding: "0.55rem 0.6rem 0.5rem" }}>
        <Link href={`/products/${gadget.id}`} className="block">
          <h3
            className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis transition-colors"
            style={{ fontSize: "0.72rem", color: "#f5f0e8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a227")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f0e8")}
          >
            {gadget.name}
          </h3>
        </Link>

        <p
          className="whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontSize: "10px", color: "#6b6358", marginTop: "1px" }}
        >
          {gadget.brand || "No Brand"}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1" style={{ marginTop: "3px" }}>
          <Star className="w-2.5 h-2.5 fill-[#c9a227] text-[#c9a227]" />
          <span style={{ fontSize: "10px", color: "#a89f8f" }}>
            {gadget._count?.reviews && gadget._count.reviews > 0 ? "4.8" : "New"} ({gadget._count?.reviews || 0})
          </span>
        </div>

        {/* Stock */}
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            marginTop: "2px",
            color: gadget.stock === 0 ? "#f87171" : "rgba(52,211,153,0.9)",
          }}
        >
          {gadget.stock === 0 ? "Out of Stock" : "In Stock"}
        </p>

        {/* Price */}
        <div className="flex items-center justify-center gap-[0.35rem]" style={{ marginTop: "4px" }}>
          {isDiscounted && (
            <span style={{ fontSize: "10px", color: "#6b6358", textDecoration: "line-through" }}>
              ৳{gadget.price}
            </span>
          )}
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c9a227" }}>
            ৳{activePrice}
          </span>
        </div>
      </div>

      {/* View Details Footer */}
      <Link
        href={`/products/${gadget.id}`}
        className="w-full flex items-center justify-center font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:underline"
        style={{
          height: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(12,11,9,0.4)",
          fontSize: "11px",
          color: "#c9a227",
        }}
      >
        View Details
      </Link>
    </div>
  );
}