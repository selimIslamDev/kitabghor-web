"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { MapPin, CreditCard, Smartphone, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Step = "address" | "payment" | "confirm";

const paymentMethods = [
  { id: "sslcommerz", name: "Credit / Debit Card", icon: <CreditCard className="w-5 h-5" />, description: "Visa, Mastercard, DBBL" },
  { id: "bkash", name: "bKash", icon: <Smartphone className="w-5 h-5" />, description: "Mobile Banking" },
  { id: "nagad", name: "Nagad", icon: <Smartphone className="w-5 h-5" />, description: "Mobile Banking" },
];

export default function CheckoutClient() {
  const { items, totalAmount, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
  });

  const shipping = totalAmount > 500 ? 0 : 60;
  const finalAmount = totalAmount + shipping;

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    toast.success("Order placed successfully! 🎉");
    router.push("/orders/success");
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-8xl mb-6 block">🛒</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
        <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
          Checkout
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-10">
        {(["address", "payment", "confirm"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${step === s ? "bg-blue-600 text-white" : i < ["address", "payment", "confirm"].indexOf(step) ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-[var(--muted)] text-gray-400"}`}>
              {i < ["address", "payment", "confirm"].indexOf(step) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span>{i + 1}</span>
              )}
              <span className="capitalize hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className="w-8 h-0.5 bg-[var(--border)]" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Steps */}
        <div className="lg:col-span-2">

          {/* Step 1 — Address */}
          {step === "address" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "fullName", label: "Full Name", placeholder: "Your full name", col: 1 },
                  { key: "phone", label: "Phone Number", placeholder: "01XXXXXXXXX", col: 1 },
                  { key: "address", label: "Address", placeholder: "House, Road, Area", col: 2 },
                  { key: "city", label: "City", placeholder: "Dhaka", col: 1 },
                  { key: "district", label: "District", placeholder: "Dhaka", col: 1 },
                  { key: "postalCode", label: "Postal Code", placeholder: "1200", col: 1 },
                ].map((field) => (
                  <div key={field.key} className={field.col === 2 ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={address[field.key as keyof typeof address]}
                      onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!address.fullName || !address.phone || !address.address || !address.city || !address.district) {
                    toast.error("Please fill all required fields!");
                    return;
                  }
                  setStep("payment");
                }}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === "payment" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
              </div>

              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition ${paymentMethod === method.id ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-[var(--border)] hover:border-blue-300"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.id ? "bg-blue-600 text-white" : "bg-[var(--muted)] text-gray-500"}`}>
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{method.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("address")}
                  className="flex-1 py-4 border border-[var(--border)] text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-[var(--muted)] transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                >
                  Review Order
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === "confirm" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review & Confirm</h2>
              </div>

              {/* Address Summary */}
              <div className="bg-[var(--muted)] rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Shipping To</p>
                <p className="font-medium text-gray-900 dark:text-white">{address.fullName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{address.phone}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{address.address}, {address.city}, {address.district}</p>
              </div>

              {/* Payment Summary */}
              <div className="bg-[var(--muted)] rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Payment Method</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-2xl">{item.image}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                      ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 py-4 border border-[var(--border)] text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-[var(--muted)] transition"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white rounded-xl font-semibold transition"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-2xl">{item.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border)] pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500">Free</span> : `৳${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-[var(--border)]">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">৳{finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}