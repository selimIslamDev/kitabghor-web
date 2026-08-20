"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
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

interface ApiErrorResponse {
  message?: string;
}

interface CreateCouponPayload {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxUsage?: number;
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
    mutationFn: async (data: CreateCouponPayload) => {
      const res = await api.post("/coupons", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon created!");
      setShowModal(false);
      setForm(initialForm);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
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
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-800 tracking-tight">
          Coupons
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-100/80 animate-pulse" />
            ))}
          </div>
        ) : coupons?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Tag className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No coupons yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition shadow-md shadow-sky-500/20"
            >
              Create First Coupon
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/80">
                  <tr>
                    {["Code", "Discount", "Min Order", "Usage", "Status", "Expires", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {coupons?.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="border-t border-slate-100/80 hover:bg-white/60 transition"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sky-600 bg-sky-50 border border-sky-200/50 px-2.5 py-1 rounded-lg text-xs">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {coupon.discountType === "percent"
                          ? `${coupon.discountValue}%`
                          : `৳${coupon.discountValue}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {coupon.usedCount}/{coupon.maxUsage || "∞"}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleCoupon.mutate(coupon.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition
                            ${
                              coupon.isActive
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                                : "bg-slate-100 text-slate-500 border border-slate-200/60"
                            }`}
                        >
                          {coupon.isActive ? (
                            <>
                              <ToggleRight className="w-3.5 h-3.5" /> Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-3.5 h-3.5" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            if (confirm(`Delete coupon "${coupon.code}"?`)) {
                              deleteCoupon.mutate(coupon.id);
                            }
                          }}
                          className="p-2 rounded-xl hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden p-4 space-y-3">
              {coupons?.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-xl bg-white/80 border border-slate-100 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono font-bold text-sky-600 bg-sky-50 border border-sky-200/50 px-2.5 py-1 rounded-lg text-xs">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete coupon "${coupon.code}"?`)) {
                          deleteCoupon.mutate(coupon.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                    <span className="font-semibold text-slate-800">
                      {coupon.discountType === "percent"
                        ? `${coupon.discountValue}%`
                        : `৳${coupon.discountValue}`}
                    </span>
                    <span className="text-slate-500">
                      Min: {coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : "—"}
                    </span>
                    <span className="text-slate-500">
                      {coupon.usedCount}/{coupon.maxUsage || "∞"} used
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleCoupon.mutate(coupon.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition
                        ${
                          coupon.isActive
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500 border border-slate-200/60"
                        }`}
                    >
                      {coupon.isActive ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5" /> Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5" /> Inactive
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "Never expires"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60 sticky top-0 bg-white/95 backdrop-blur-xl z-10">
              <h2 className="text-lg font-semibold text-slate-800">Create Coupon</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. KITAB10"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm font-mono transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Discount Type *
                </label>
                <div className="flex gap-3">
                  {["percent", "fixed"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, discountType: type as "percent" | "fixed" })
                      }
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border-2
                        ${
                          form.discountType === type
                            ? "border-sky-500 bg-sky-50 text-sky-600"
                            : "border-slate-200 text-slate-500"
                        }`}
                    >
                      {type === "percent" ? "% Percent" : "৳ Fixed"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === "percent" ? "10" : "50"}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                      placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Min Order (৳)
                  </label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="200"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                      placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Max Usage
                  </label>
                  <input
                    type="number"
                    value={form.maxUsage}
                    onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                      placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Expires At
                  </label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                      focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                  />
                </div>
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
                  disabled={createCoupon.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-70 text-white rounded-xl font-semibold transition shadow-md shadow-sky-500/20"
                >
                  {createCoupon.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Coupon"
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