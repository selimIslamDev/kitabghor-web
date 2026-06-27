"use client";

import { useState } from "react";
import { Plus, Trash2, X, BookOpen, Zap } from "lucide-react";
import { useCategories, Category } from "@/lib/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CategoriesTab() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "BOOK" as "BOOK" | "GADGET" });
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useCategories();

  const createCategory = useMutation({
    mutationFn: async (data: { name: string; type: "BOOK" | "GADGET" }) => {
      const res = await api.post("/categories", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created!");
      setShowModal(false);
      setForm({ name: "", type: "BOOK" });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to create category!");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted!");
    },
    onError: () => {
      toast.error("Cannot delete category with products!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter a category name!");
      return;
    }
    createCategory.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Categories
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--muted)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : categories?.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No categories yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat: Category) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    cat.type === "BOOK"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                  }`}
                >
                  {cat.type === "BOOK" ? (
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cat._count?.products || 0} products · {cat.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Delete "${cat.name}"?`)) {
                    deleteCategory.mutate(cat.id);
                  }
                }}
                disabled={(cat._count?.products || 0) > 0}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                title={
                  (cat._count?.products || 0) > 0
                    ? "Cannot delete category with products"
                    : "Delete"
                }
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Category</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-[var(--muted)] rounded-xl transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. SSC Books"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <div className="flex gap-3">
                  {(["BOOK", "GADGET"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, type })}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition border-2 ${
                        form.type === type
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-[var(--border)] text-gray-500 hover:border-blue-300"
                      }`}
                    >
                      {type === "BOOK" ? "📚 Book" : "🔧 Gadget"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-[var(--border)] text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-[var(--muted)] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategory.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl font-semibold transition"
                >
                  {createCategory.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}