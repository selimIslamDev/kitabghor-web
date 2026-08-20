"use client";

import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import { useCreateProduct, useUpdateProduct, useCategories, useUploadImage } from "@/lib/hooks";
import { Category } from "@/lib/hooks";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    discountPrice?: number;
    stock?: number;
    productType?: "BOOK" | "GADGET";
    categoryId?: string;
    images?: string[];
    author?: string;
    publisher?: string;
    edition?: string;
    classLevel?: string;
    subject?: string;
    isbn?: string;
    brand?: string;
    model?: string;
  };
}

type ProductType = "BOOK" | "GADGET";

interface FormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  productType: ProductType;
  categoryId: string;
  images: string[];
  author: string;
  publisher: string;
  edition: string;
  classLevel: string;
  subject: string;
  isbn: string;
  brand: string;
  model: string;
}

const initialForm: FormState = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  productType: "BOOK",
  categoryId: "",
  images: [],
  author: "",
  publisher: "",
  edition: "",
  classLevel: "",
  subject: "",
  isbn: "",
  brand: "",
  model: "",
};

const bookFields: { key: keyof FormState; label: string; placeholder: string }[] = [
  { key: "author", label: "Author", placeholder: "Author name" },
  { key: "publisher", label: "Publisher", placeholder: "Publisher name" },
  { key: "edition", label: "Edition", placeholder: "e.g. 2024" },
  { key: "isbn", label: "ISBN", placeholder: "ISBN number" },
];

function mapProductToForm(product: ProductModalProps["product"]): FormState {
  if (!product) return initialForm;
  return {
    name: product.name ?? "",
    description: product.description ?? "",
    price: String(product.price ?? ""),
    discountPrice: String(product.discountPrice ?? ""),
    stock: String(product.stock ?? ""),
    productType: product.productType === "GADGET" ? "GADGET" : "BOOK",
    categoryId: product.categoryId ?? "",
    images: product.images ?? [],
    author: product.author ?? "",
    publisher: product.publisher ?? "",
    edition: product.edition ?? "",
    classLevel: product.classLevel ?? "",
    subject: product.subject ?? "",
    isbn: product.isbn ?? "",
    brand: product.brand ?? "",
    model: product.model ?? "",
  };
}

export default function ProductModal({ open, onClose, product }: ProductModalProps) {
  const [form, setForm] = useState<FormState>(() => mapProductToForm(product));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [syncedKey, setSyncedKey] = useState<string | null>(open ? (product?.id ?? "new") : null);
  const currentKey = open ? (product?.id ?? "new") : null;

  if (open && currentKey !== syncedKey) {
    setSyncedKey(currentKey);
    setForm(mapProductToForm(product));
  }

  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { uploadImage, uploading, progress } = useUploadImage();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (form.images.length >= 4) {
      toast.error("Maximum 4 images allowed!");
      return;
    }

    const url = await uploadImage(files[0]);
    if (url) {
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      toast.success("Image uploaded!");
    }

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
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      productType: form.productType as "BOOK" | "GADGET",
      categoryId: form.categoryId,
      images: form.images,
      author: form.author,
      publisher: form.publisher,
      edition: form.edition,
      classLevel: form.classLevel,
      subject: form.subject,
      isbn: form.isbn,
      brand: form.brand,
      model: form.model,
    };

    if (product) {
      updateProduct.mutate(
        { id: product.id, ...data },
        { onSuccess: () => onClose() }
      );
    } else {
      createProduct.mutate(data, {
        onSuccess: () => {
          onClose();
          setForm(initialForm);
          setSyncedKey(null);
        },
      });
    }
  };

  const filteredCategories = (categories ?? []).filter(
    (c: Category) => c.type === form.productType
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200/60 sticky top-0 bg-white/95 backdrop-blur-xl z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {product ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Type *
            </label>
            <div className="flex gap-3">
              {(["BOOK", "GADGET"] as ProductType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, productType: type, categoryId: "" })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border-2
                    ${
                      form.productType === type
                        ? "border-sky-500 bg-sky-50 text-sky-600"
                        : "border-slate-200 text-slate-500 hover:border-sky-300"
                    }`}
                >
                  {type === "BOOK" ? "📚 Book" : "🔧 Gadget"}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Images ({form.images.length}/4)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {form.images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50"
                >
                  <Image src={img} alt={`Product ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-sky-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
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
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-sky-400 flex flex-col items-center justify-center gap-2 transition disabled:opacity-50 bg-slate-50/50"
                >
                  {uploading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-sky-600 font-medium">{progress}%</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-6 h-6 text-slate-400" />
                      <span className="text-xs text-slate-400 font-medium">Add Image</span>
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
            <p className="text-xs text-slate-400">
              Max 4 images, 5MB each. JPG, PNG, WEBP supported.
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter product name"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm resize-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Price (৳) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Discount Price (৳)
              </label>
              <input
                type="number"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                placeholder="0 (optional)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stock *
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
              >
                <option value="">Select Category</option>
                {filteredCategories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Book Fields */}
          {form.productType === "BOOK" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-sky-50/60 border border-sky-100/80">
              <p className="sm:col-span-2 text-sm font-semibold text-sky-700">📚 Book Details</p>
              {bookFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={form[field.key] as string}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-800
                      placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Class Level
                </label>
                <select
                  value={form.classLevel}
                  onChange={(e) => setForm({ ...form, classLevel: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-800
                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                >
                  <option value="">Select Class</option>
                  {["Class 8-9", "SSC", "HSC", "University"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-800
                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                >
                  <option value="">Select Subject</option>
                  {[
                    "Math",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "English",
                    "Bangla",
                    "ICT",
                    "History",
                    "Geography",
                    "Art",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Gadget Fields */}
          {form.productType === "GADGET" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100/80">
              <p className="sm:col-span-2 text-sm font-semibold text-amber-700">
                🔧 Gadget Details
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Brand</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. Casio"
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-800
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Model</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="e.g. FX-991EX"
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-800
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-300 text-sm transition"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending || updateProduct.isPending || uploading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-70 text-white rounded-xl font-semibold transition shadow-md shadow-sky-500/20"
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