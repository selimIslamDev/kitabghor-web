"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, ImagePlus } from "lucide-react";
import { useCreateProduct, useUpdateProduct, useCategories, useUploadImage } from "@/lib/hooks";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: any;
}

const initialForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  productType: "BOOK",
  categoryId: "",
  images: [] as string[],
  author: "",
  publisher: "",
  edition: "",
  classLevel: "",
  subject: "",
  isbn: "",
  brand: "",
  model: "",
};

export default function ProductModal({ open, onClose, product }: ProductModalProps) {
  const [form, setForm] = useState(initialForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { uploadImage, uploading, progress } = useUploadImage();

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price || ""),
        discountPrice: String(product.discountPrice || ""),
        stock: String(product.stock || ""),
        productType: product.productType || "BOOK",
        categoryId: product.categoryId || "",
        images: product.images || [],
        author: product.author || "",
        publisher: product.publisher || "",
        edition: product.edition || "",
        classLevel: product.classLevel || "",
        subject: product.subject || "",
        isbn: product.isbn || "",
        brand: product.brand || "",
        model: product.model || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [product, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (form.images.length >= 4) {
      toast.error("Maximum 4 images allowed!");
      return;
    }

    const file = files[0];
    const url = await uploadImage(file);
    if (url) {
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      toast.success("Image uploaded!");
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.stock || !form.categoryId) {
      toast.error("Please fill all required fields!");
      return;
    }

    const data = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
    };

    if (product) {
      updateProduct.mutate({ id: product.id, ...data }, {
        onSuccess: () => onClose(),
      });
    } else {
      createProduct.mutate(data, {
        onSuccess: () => { onClose(); setForm(initialForm); },
      });
    }
  };

  const filteredCategories = categories?.filter((c: any) => c.type === form.productType) || [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {product ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--muted)] rounded-xl transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Type *</label>
            <div className="flex gap-3">
              {["BOOK", "GADGET"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, productType: type, categoryId: "" })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${form.productType === type ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "border-[var(--border)] text-gray-500 hover:border-blue-300"}`}
                >
                  {type === "BOOK" ? "📚 Book" : "🔧 Gadget"}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Images ({form.images.length}/4)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {form.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)]">
                  <Image
                    src={img}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-md">
                      Main
                    </span>
                  )}
                </div>
              ))}

              {form.images.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] hover:border-blue-400 flex flex-col items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-blue-600">{progress}%</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-400">Add Image</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

            <p className="text-xs text-gray-400">Max 4 images, 5MB each. JPG, PNG, WEBP supported.</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter product name"
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (৳) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount Price (৳)</label>
              <input
                type="number"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                placeholder="0 (optional)"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Category</option>
                {filteredCategories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Book Fields */}
          {form.productType === "BOOK" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="sm:col-span-2 text-sm font-semibold text-blue-700 dark:text-blue-300">📚 Book Details</p>
              {[
                { key: "author", label: "Author", placeholder: "Author name" },
                { key: "publisher", label: "Publisher", placeholder: "Publisher name" },
                { key: "edition", label: "Edition", placeholder: "e.g. 2024" },
                { key: "isbn", label: "ISBN", placeholder: "ISBN number" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={form[field.key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-white dark:bg-slate-700 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Class Level</label>
                <select
                  value={form.classLevel}
                  onChange={(e) => setForm({ ...form, classLevel: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-white dark:bg-slate-700 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Class</option>
                  {["Class 8-9", "SSC", "HSC", "University"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-white dark:bg-slate-700 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Subject</option>
                  {["Math", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "History", "Geography", "Art"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Gadget Fields */}
          {form.productType === "GADGET" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="sm:col-span-2 text-sm font-semibold text-amber-700 dark:text-amber-300">🔧 Gadget Details</p>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Brand</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. Casio"
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-white dark:bg-slate-700 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Model</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="e.g. FX-991EX"
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-white dark:bg-slate-700 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[var(--border)] text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-[var(--muted)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending || updateProduct.isPending || uploading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl font-semibold transition"
            >
              {createProduct.isPending || updateProduct.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{product ? "Update Product" : "Add Product"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}