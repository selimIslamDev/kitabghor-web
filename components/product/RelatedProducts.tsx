"use client";

import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { BookOpen, Wrench } from "lucide-react";
import { useRelatedProducts, useCartWithAuth, type Product } from "@/lib/hooks";
import toast from "react-hot-toast";

export default function RelatedProducts({ productId }: { productId: string }) {
  const { data: related, isLoading } = useRelatedProducts(productId);
  const { addItem } = useCartWithAuth();

  const products = related || [];

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error("This product is out of stock!");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice ?? undefined,
      image: product.images?.[0] || "📚",
      stock: product.stock,
      author: product.author ?? undefined,
      edition: product.edition ?? undefined,
    });
    toast.success("Added to cart!");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-[1.15rem]">
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
    );
  }

  if (!products.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-[1.15rem]">
      {products.slice(0, 4).map((product: Product) => (
        <RelatedCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}

function RelatedCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (e: MouseEvent<HTMLButtonElement>, product: Product) => void;
}) {
  const validImages = (product.images || []).filter((img) => img && img.startsWith("http"));
  const hasMultipleImages = validImages.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDiscounted = !!product.discountPrice;
  const activePrice = product.discountPrice || product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

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
        {isDiscounted && (
          <div
            className="absolute z-20 flex flex-col items-center justify-center font-bold leading-tight"
            style={{
              top: "0.4rem",
              left: "0.4rem",
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

        {product.classLevel && (
          <div
            className="absolute z-20 font-semibold"
            style={{
              top: "0.4rem",
              right: "0.4rem",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(201,162,39,0.15)",
              border: "1px solid rgba(201,162,39,0.3)",
              color: "#c9a227",
              fontSize: "9px",
            }}
          >
            {product.classLevel}
          </div>
        )}

        {product.stock === 0 && (
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

        {validImages.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {validImages.map((src, idx) => (
              <Image
                key={src + idx}
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                className={`object-contain transition-all duration-300 ease-in-out p-1 ${
                  idx === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: "#6b6358" }}>
            {product.productType === "BOOK" ? (
              <BookOpen className="w-10 h-10 stroke-[1.2]" />
            ) : (
              <Wrench className="w-10 h-10 stroke-[1.2]" />
            )}
          </div>
        )}

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

        <div
          className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background: "rgba(12,11,9,0.55)" }}
        >
          <button
            onClick={(e) => onAddToCart(e, product)}
            disabled={product.stock === 0}
            className="font-semibold transition-all active:scale-95"
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.4rem",
              fontSize: "0.7rem",
              background: product.stock === 0 ? "#4a463f" : "#c9a227",
              color: product.stock === 0 ? "#a89f8f" : "#0c0b09",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
            }}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-center" style={{ padding: "0.55rem 0.6rem 0.5rem" }}>
        <Link href={`/products/${product.id}`} className="block">
          <h3
            className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis transition-colors"
            style={{ fontSize: "0.72rem", color: "#f5f0e8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a227")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f0e8")}
          >
            {product.name}
          </h3>
        </Link>

        <p
          className="whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontSize: "10px", color: "#6b6358", marginTop: "1px" }}
        >
          {product.author || product.brand || "KitabGhor"}
        </p>

        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            marginTop: "3px",
            color: product.stock === 0 ? "#f87171" : "rgba(52,211,153,0.9)",
          }}
        >
          {product.stock === 0 ? "Out of Stock" : "In Stock"}
        </p>

        <div className="flex items-center justify-center gap-[0.35rem]" style={{ marginTop: "4px" }}>
          {isDiscounted && (
            <span style={{ fontSize: "10px", color: "#6b6358", textDecoration: "line-through" }}>
              ৳{product.price}
            </span>
          )}
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c9a227" }}>
            ৳{activePrice}
          </span>
        </div>
      </div>

      {/* View Details */}
      <Link
        href={`/products/${product.id}`}
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