"use client";

import { useState } from "react";
import { X, Package, Search } from "lucide-react";
import { useProducts, useCreateBundle, useUpdateBundle } from "@/lib/hooks";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface EditBundleData {
  id: string;
  name: string;
  description?: string;
  discountPercent: number;
  items: { product: { id: string } }[];
}

interface BundleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editBundle?: EditBundleData | null;
}

export default function BundleFormModal({ isOpen, onClose, editBundle }: BundleFormModalProps) {
  const [name, setName] = useState(editBundle?.name || "");
  const [description, setDescription] = useState(editBundle?.description || "");
  const [discountPercent, setDiscountPercent] = useState(editBundle?.discountPercent ?? 10);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    editBundle?.items.map((item) => item.product.id) || []
  );
  const [search, setSearch] = useState("");

  const { data: productsData } = useProducts({});
  const products: ProductOption[] = productsData?.data || [];

  const createBundle = useCreateBundle();
  const updateBundle = useUpdateBundle();

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || selectedIds.length < 2) return;

    const payload = { name, description, discountPercent, productIds: selectedIds };

    if (editBundle) {
      updateBundle.mutate({ id: editBundle.id, ...payload }, { onSuccess: onClose });
    } else {
      createBundle.mutate(payload, { onSuccess: onClose });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200/60 sticky top-0 bg-white/95 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-sky-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
              {editBundle ? "Edit Bundle" : "Create Bundle"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Bundle Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SSC Science Pack"
              className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the bundle"
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm resize-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Discount %
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Select Products ({selectedIds.length} selected)
              </label>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-sm
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 transition"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200/80 rounded-xl p-3 bg-slate-50/40">
              {filteredProducts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No products found</p>
              ) : (
                filteredProducts.map((product) => (
                  <label
                    key={product.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition
                      ${
                        selectedIds.includes(product.id)
                          ? "bg-sky-50 border border-sky-200/60"
                          : "hover:bg-white border border-transparent"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      className="w-4 h-4 accent-sky-500"
                    />
                    <span className="text-lg">{product.images?.[0] || "📚"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">৳{product.price}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {selectedIds.length < 2 && (
              <p className="text-xs text-amber-600 mt-2 font-medium">
                অন্তত ২টা product select করুন
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 sm:p-6 border-t border-slate-200/60">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !name.trim() ||
              selectedIds.length < 2 ||
              createBundle.isPending ||
              updateBundle.isPending
            }
            className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl font-semibold transition shadow-md shadow-sky-500/20"
          >
            {editBundle ? "Update Bundle" : "Create Bundle"}
          </button>
        </div>
      </div>
    </div>
  );
}