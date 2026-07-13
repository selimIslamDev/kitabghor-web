"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package, Tag } from "lucide-react";
import { useAdminBundles, useDeleteBundle } from "@/lib/hooks";
import BundleFormModal from "./BundleFormModal";
// import BundleFormModal from "./BundleFormModal";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
          Bundles
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Create Bundle
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-[var(--muted)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !bundles || bundles.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)]">
          <span className="text-6xl mb-4 block">📦</span>
          <p className="text-gray-500 dark:text-gray-400 mb-4">কোনো bundle নেই এখনো</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          >
            প্রথম Bundle তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bundles.map((bundle: Bundle) => (
            <div key={bundle.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium px-2 py-1 rounded-lg">
                  <Tag className="w-3 h-3" /> {bundle.discountPercent}% OFF
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{bundle.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{bundle.description}</p>
              <p className="text-xs text-gray-400 mb-4">{bundle.items?.length || 0} products</p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{bundle.bundlePrice}</span>
                  <span className="text-xs text-gray-400 line-through ml-2">৳{bundle.totalPrice}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(bundle)}
                    className="p-2 rounded-lg hover:bg-[var(--muted)] text-gray-500 transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
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