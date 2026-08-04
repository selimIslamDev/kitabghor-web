"use client";

import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Package } from "lucide-react";
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
    toast.success("Added to cart!");
  };

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
          Related Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-800 overflow-hidden p-3">
              <div className="h-36 bg-slate-200 dark:bg-slate-700/50 rounded" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-2/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3" />
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
    <div
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      className="group bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* Top Image Section */}
      <div className="relative bg-white dark:bg-slate-900 p-3.5 aspect-square w-full overflow-hidden flex items-center justify-center">

        {/* Round Yellow Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-2 left-2 z-20 bg-[#FDE047] text-gray-800 w-9 h-9 rounded-full flex flex-col items-center justify-center text-[9px] font-bold leading-tight shadow-sm border border-amber-200">
            <span>{discountPercent}%</span>
            <span className="text-[7px] font-medium uppercase">OFF</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
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
                alt={product.name}
                fill
                sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 20vw"
                className={`object-contain transition-all duration-300 ease-in-out p-1 ${
                  idx === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
            {product.images?.[0] ? (
              <span className="text-3xl">{product.images[0]}</span>
            ) : (
              <Package className="w-10 h-10 stroke-[1.2]" />
            )}
          </div>
        )}

        {/* Multi-image Dots Indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-1 left-0 right-0 z-20 flex items-center justify-center gap-1">
            {validImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-2.5 bg-sky-500"
                    : "w-1 bg-gray-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>
        )}

        {/* HOVER OVERLAY: Add to Cart Button appears inside image section */}
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center p-3">
          <button
            onClick={(e) => onAddToCart(e, product)}
            disabled={product.stock === 0}
            className={`w-full py-2 px-2 rounded text-xs font-bold transition-all shadow-md ${
              product.stock === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#0095DA] hover:bg-[#0082BF] text-white active:scale-95"
            }`}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-2.5 text-center flex flex-col justify-between flex-1 bg-white dark:bg-slate-800">
        <div>
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-xs font-medium text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-[#0095DA] transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.author && (
            <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 line-clamp-1">
              {product.author}
            </p>
          )}

          <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
            {product.stock === 0 ? (
              <span className="text-red-500">Out of Stock</span>
            ) : (
              "Product In Stock"
            )}
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-1">
            {isDiscounted && (
              <span className="text-[10px] text-gray-400 line-through">
                TK. {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-xs font-bold text-gray-800 dark:text-white">
              TK. {activePrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* HOVER BOTTOM FOOTER: View Details Link only pops up when HOVERED */}
      <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        <Link
          href={`/products/${product.id}`}
          className="w-full py-2 bg-[#F1F3F6] hover:bg-[#E5E8ED] dark:bg-slate-700/60 dark:hover:bg-slate-700 text-[#0095DA] dark:text-sky-400 text-[11px] font-semibold text-center transition-colors border-t border-gray-100 dark:border-slate-700 block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}