"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Coupon {
  id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxUsage?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

const initialForm = {
  code: "",
  discountType: "percent" as "percent" | "fixed",
  discountValue: "",
  minOrderAmount: "",
  maxUsage: "",
  expiresAt: "",
};

export default function CouponsTab() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => {
      const res = await api.get("/coupons");
      return res.data.data as Coupon[];
    },
  });

  const createCoupon = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/coupons", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon created!");
      setShowModal(false);
      setForm(initialForm);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create coupon!");
    },
  });

  const toggleCoupon = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/coupons/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon status updated!");
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/coupons/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon deleted!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) {
      toast.error("Please fill all required fields!");
      return;
    }
    createCoupon.mutate({
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
      maxUsage: form.maxUsage ? Number(form.maxUsage) : undefined,
      expiresAt: form.expiresAt || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
          Coupons
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-[var(--muted)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : coupons?.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No coupons yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--muted)]">
                <tr>
                  {["Code", "Discount", "Min Order", "Usage", "Status", "Expires", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons?.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      {coupon.discountType === "percent"
                        ? `${coupon.discountValue}%`
                        : `৳${coupon.discountValue}`}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {coupon.usedCount}/{coupon.maxUsage || "∞"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleCoupon.mutate(coupon.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${coupon.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {coupon.isActive
                          ? <><ToggleRight className="w-3 h-3" /> Active</>
                          : <><ToggleLeft className="w-3 h-3" /> Inactive</>
                        }
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          if (confirm(`Delete coupon "${coupon.code}"?`)) {
                            deleteCoupon.mutate(coupon.id);
                          }
                        }}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--muted)] rounded-xl transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. KITAB10"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Discount Type *
                </label>
                <div className="flex gap-3">
                  {["percent", "fixed"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, discountType: type as "percent" | "fixed" })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${form.discountType === type
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        : "border-[var(--border)] text-gray-500"
                      }`}
                    >
                      {type === "percent" ? "% Percent" : "৳ Fixed"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === "percent" ? "10" : "50"}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Min Order (৳)
                  </label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="200"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Max Usage
                  </label>
                  <input
                    type="number"
                    value={form.maxUsage}
                    onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Expires At
                  </label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
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
                  disabled={createCoupon.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl font-semibold transition"
                >
                  {createCoupon.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}