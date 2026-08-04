"use client";

import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { ShoppingCart, Package } from "lucide-react";
import { useRelatedProducts, useCartWithAuth, type Product } from "@/lib/hooks";
import toast from "react-hot-toast";

export default function RelatedProducts({ productId }: { productId: string }) {
  const { data: related, isLoading } = useRelatedProducts(productId);
  const { addItem } = useCartWithAuth();

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
      image: product.images?.[0] || "📦",
      stock: product.stock,
    });
  };

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
          Related Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
              <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700/50" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-2/3" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
        Related Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {related.map((product: Product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
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
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      className="group bg-white dark:bg-slate-800/90 rounded-xl border border-gray-100 dark:border-slate-700/60 overflow-hidden hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-500/40 transition-all duration-300 flex flex-col"
    >
      {/* Image — book-cover style portrait ratio */}
      <div className="relative bg-slate-100 dark:bg-slate-800 aspect-[3/4] w-full overflow-hidden">
        {/* Circular discount badge, top-left, like Rokomari */}
        {isDiscounted && (
          <span className="absolute top-2.5 left-2.5 z-10 w-11 h-11 rounded-full bg-rose-500 text-white flex flex-col items-center justify-center leading-none shadow-md">
            <span className="text-[11px] font-extrabold">{discountPercent}%</span>
            <span className="text-[7px] font-semibold tracking-wide">OFF</span>
          </span>
        )}

        {/* Diagonal ribbon badge, top-right corner, like Rokomari's "eBook" ribbon */}
        {product.productType && (
          <div className="absolute top-0 right-0 z-10 w-24 h-24 overflow-hidden pointer-events-none">
            <span className="absolute top-[14px] right-[-32px] w-[130px] rotate-45 bg-sky-500 text-white text-[10px] font-bold text-center py-1 shadow-sm">
              {product.productType === "BOOK" ? "Book" : "Gadget"}
            </span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {validImages.length > 0 ? (
          <>
            {validImages.map((src, idx) => (
              <Image
                key={src + idx}
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                className={`object-cover transition-opacity duration-300 ease-in-out ${
                  idx === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {hasMultipleImages && (
              <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1">
                {validImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-3.5 bg-violet-600"
                        : "w-1.5 bg-white/80 dark:bg-slate-500 border border-slate-300/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
            {product.images?.[0] ? (
              <span className="text-5xl">{product.images[0]}</span>
            ) : (
              <Package className="w-14 h-14 stroke-[1.5]" />
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {product.author && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{product.author}</p>
        )}

        <div className="flex items-baseline gap-2 mt-0.5">
          {isDiscounted && (
            <span className="text-xs text-gray-400 line-through">
              Tk {product.price.toLocaleString()}
            </span>
          )}
          <span className="text-base font-extrabold text-gray-900 dark:text-white">
            Tk {activePrice.toLocaleString()}
          </span>
        </div>

        <button
          onClick={(e) => onAddToCart(e, product)}
          disabled={product.stock === 0}
          className={`mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-full font-semibold text-xs transition-all duration-200 ${
            product.stock === 0
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98]"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.stock === 0 ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}