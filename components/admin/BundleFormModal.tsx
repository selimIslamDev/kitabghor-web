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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editBundle ? "Edit Bundle" : "Create Bundle"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bundle Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SSC Science Pack"
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the bundle"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Products ({selectedIds.length} selected)
              </label>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 border border-[var(--border)] rounded-xl p-3">
              {filteredProducts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No products found</p>
              ) : (
                filteredProducts.map((product) => (
                  <label
                    key={product.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${
                      selectedIds.includes(product.id) ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-[var(--muted)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-lg">{product.images?.[0] || "📚"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">৳{product.price}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {selectedIds.length < 2 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">অন্তত ২টা product select করুন</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[var(--border)] text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-[var(--muted)] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || selectedIds.length < 2 || createBundle.isPending || updateBundle.isPending}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold transition"
          >
            {editBundle ? "Update Bundle" : "Create Bundle"}
          </button>
        </div>
      </div>
    </div>
  );
}