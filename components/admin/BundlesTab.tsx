"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package, Tag } from "lucide-react";
import { useAdminBundles, useDeleteBundle } from "@/lib/hooks";
import BundleFormModal from "./BundleFormModal";

interface BundleProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface BundleItem {
  id: string;
  quantity: number;
  product: BundleProduct;
}

interface Bundle {
  id: string;
  name: string;
  description?: string;
  discountPercent: number;
  totalPrice: number;
  bundlePrice: number;
  items: BundleItem[];
}

export default function BundlesTab() {
  const { data: bundles, isLoading } = useAdminBundles();
  const deleteBundle = useDeleteBundle();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBundle, setEditBundle] = useState<Bundle | null>(null);

  const handleEdit = (bundle: Bundle) => {
    setEditBundle(bundle);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditBundle(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("এই bundle টা delete করতে চান?")) {
      deleteBundle.mutate(id);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
          Bundles
        </h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          Create Bundle
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-white/50 animate-pulse" />
          ))}
        </div>
      ) : !bundles || bundles.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 mb-5 font-medium">কোনো bundle নেই এখনো</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition shadow-md shadow-sky-500/20"
          >
            প্রথম Bundle তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bundles.map((bundle: Bundle) => (
            <div
              key={bundle.id}
              className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-sky-600" />
                </div>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/60 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                  <Tag className="w-3 h-3" /> {bundle.discountPercent}% OFF
                </span>
              </div>

              <h3 className="font-semibold text-slate-800 mb-1 text-[15px]">{bundle.name}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                {bundle.description}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mb-4">
                {bundle.items?.length || 0} products
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-sky-600">৳{bundle.bundlePrice}</span>
                  <span className="text-xs text-slate-400 line-through">৳{bundle.totalPrice}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(bundle)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    className="p-2 rounded-xl hover:bg-rose-50 text-rose-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <BundleFormModal
          key={editBundle?.id || "new"}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editBundle={editBundle}
        />
      )}
    </div>
  );
}