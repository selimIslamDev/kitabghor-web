"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  type: "BOOK" | "GADGET";
  _count?: { products: number };
}

interface ApiErrorResponse {
  message?: string;
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
    onError: (error: AxiosError<ApiErrorResponse>) => {
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
    onError: (error: AxiosError<ApiErrorResponse>) => {
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
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
          Categories
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Books */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-[15px]">
              📚 Book Categories
              <span className="text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200/60 px-2 py-0.5 rounded-full">
                {books.length}
              </span>
            </h2>
            {books.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No book categories yet.</p>
            ) : (
              <div className="space-y-2">
                {books.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100/80"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Tag className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="font-medium text-slate-800 text-sm truncate">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        ({cat._count?.products || 0})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}"?`)) {
                          deleteCategory.mutate(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gadgets */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-[15px]">
              🔧 Gadget Categories
              <span className="text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200/60 px-2 py-0.5 rounded-full">
                {gadgets.length}
              </span>
            </h2>
            {gadgets.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No gadget categories yet.</p>
            ) : (
              <div className="space-y-2">
                {gadgets.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100/80"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Tag className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-medium text-slate-800 text-sm truncate">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        ({cat._count?.products || 0})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}"?`)) {
                          deleteCategory.mutate(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
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
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60">
              <h2 className="text-lg font-semibold text-slate-800">Add Category</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                <div className="flex gap-3">
                  {["BOOK", "GADGET"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, type: type as "BOOK" | "GADGET" })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border-2
                        ${
                          form.type === type
                            ? "border-sky-500 bg-sky-50 text-sky-600"
                            : "border-slate-200 text-slate-500 hover:border-sky-300"
                        }`}
                    >
                      {type === "BOOK" ? "📚 Book" : "🔧 Gadget"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. SSC Books"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategory.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-70 text-white rounded-xl font-semibold transition shadow-md shadow-sky-500/20"
                >
                  {createCategory.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create"
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