"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  type: "BOOK" | "GADGET";
  _count?: { products: number };
}

const initialForm = {
  name: "",
  type: "BOOK" as "BOOK" | "GADGET",
};

export default function CategoriesTab() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });

  const createCategory = useMutation({
    mutationFn: async (data: typeof initialForm) => {
      const res = await api.post("/categories", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created!");
      setShowModal(false);
      setForm(initialForm);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category!");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Please enter a category name!");
      return;
    }
    createCategory.mutate(form);
  };

  const books = categories?.filter((c) => c.type === "BOOK") || [];
  const gadgets = categories?.filter((c) => c.type === "GADGET") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-[var(--muted)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Books */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📚 Book Categories
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {books.length}
              </span>
            </h2>
            {books.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No book categories yet.
              </p>
            ) : (
              <div className="space-y-2">
                {books.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{cat.name}</span>
                      <span className="text-xs text-gray-400">({cat._count?.products || 0} products)</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}"?`)) {
                          deleteCategory.mutate(cat.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gadgets */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🔧 Gadget Categories
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                {gadgets.length}
              </span>
            </h2>
            {gadgets.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No gadget categories yet.
              </p>
            ) : (
              <div className="space-y-2">
                {gadgets.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{cat.name}</span>
                      <span className="text-xs text-gray-400">({cat._count?.products || 0} products)</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}"?`)) {
                          deleteCategory.mutate(cat.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Category</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--muted)] rounded-xl transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label>
                <div className="flex gap-3">
                  {["BOOK", "GADGET"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, type: type as "BOOK" | "GADGET" })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${form.type === type
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "border-[var(--border)] text-gray-500 hover:border-blue-300"
                      }`}
                    >
                      {type === "BOOK" ? "📚 Book" : "🔧 Gadget"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
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
                  ) : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}