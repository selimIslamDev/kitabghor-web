"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { useCreateOrder } from "@/lib/hooks";
import {
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
} from "lucide-react";
import Link from "next/link";

type Step = "address" | "payment" | "confirm";

const paymentMethods = [
  {
    id: "sslcommerz",
    name: "Online Payment",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Card, bKash, Nagad, Rocket & more",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: <Banknote className="w-5 h-5" />,
    description: "Pay when you receive your order",
  },
];

function ItemImage({ image, name }: { image: string; name: string }) {
  if (image && image.startsWith("http")) {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center">
      <span className="text-xl">{image || "📚"}</span>
    </div>
  );
}

export default function CheckoutClient() {
  const { items, totalAmount } = useCartStore();
  const createOrder = useCreateOrder();

  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
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

  const handlePlaceOrder = () => {
    createOrder.mutate({
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: address,
      paymentMethod,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl mb-6 block">🛒</span>
          <h2 className="text-2xl font-bold text-white mb-4">
            Your cart is empty
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-xl font-semibold hover:from-amber-300 hover:to-yellow-400 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const steps: Step[] = ["address", "payment", "confirm"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-yellow-500/80 hover:text-yellow-400 font-medium mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Checkout
          </h1>
          <p className="text-gray-400 mt-2">
            Complete your order with confidence.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  step === s
                    ? "bg-yellow-500/15 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : i < steps.indexOf(step)
                    ? "bg-green-500/10 text-green-400"
                    : "bg-[#121212] text-gray-500"
                }`}
              >
                {i < steps.indexOf(step) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                )}
                <span className="capitalize hidden sm:block">{s}</span>
              </div>
              {i < 2 && (
                <div className="w-10 h-px bg-yellow-500/20 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Form (3/5) */}
          <div className="lg:col-span-3">
            {/* Step 1 — Address */}
            {step === "address" && (
              <div className="bg-[#121212] rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(234,179,8,0.08)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Shipping Address
                    </h2>
                    <p className="text-sm text-gray-400">
                      Please provide your shipping details.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      key: "fullName",
                      label: "Full Name",
                      placeholder: "Enter your full name",
                      col: 1,
                    },
                    {
                      key: "phone",
                      label: "Phone",
                      placeholder: "01XXXXXXXXX",
                      col: 1,
                    },
                    {
                      key: "address",
                      label: "Street Address",
                      placeholder: "House, Road, Area",
                      col: 2,
                    },
                    {
                      key: "city",
                      label: "City",
                      placeholder: "Dhaka",
                      col: 1,
                    },
                    {
                      key: "district",
                      label: "District",
                      placeholder: "Dhaka",
                      col: 1,
                    },
                    {
                      key: "postalCode",
                      label: "Postal Code",
                      placeholder: "1200",
                      col: 1,
                    },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className={field.col === 2 ? "sm:col-span-2" : ""}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={address[field.key as keyof typeof address]}
                        onChange={(e) =>
                          setAddress({ ...address, [field.key]: e.target.value })
                        }
                        className="w-full px-4 py-3.5 rounded-xl bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 text-sm transition"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (
                      !address.fullName ||
                      !address.phone ||
                      !address.address ||
                      !address.city ||
                      !address.district
                    ) {
                      return;
                    }
                    setStep("payment");
                  }}
                  className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
                >
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <Lock className="w-3.5 h-3.5" />
                  Secure checkout. Your data is protected.
                </p>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === "payment" && (
              <div className="bg-[#121212] rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(234,179,8,0.08)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Payment Method
                    </h2>
                    <p className="text-sm text-gray-400">
                      Choose your preferred payment option.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition cursor-pointer ${
                        paymentMethod === method.id
                          ? "bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                          : "bg-black/20 hover:bg-black/30"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          paymentMethod === method.id
                            ? "bg-yellow-500 text-black"
                            : "bg-[#1a1a1a] text-gray-400"
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white text-sm">
                          {method.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {method.description}
                        </p>
                      </div>
                      {paymentMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-yellow-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("address")}
                    className="flex-1 py-4 text-gray-300 rounded-xl font-semibold bg-black/20 hover:bg-yellow-500/5 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer"
                  >
                    Review Order
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Confirm */}
            {step === "confirm" && (
              <div className="bg-[#121212] rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(234,179,8,0.08)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Review & Confirm
                    </h2>
                    <p className="text-sm text-gray-400">
                      Please review your order before placing it.
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 mb-4">
                  <p className="text-xs font-semibold text-yellow-500/80 uppercase tracking-wider mb-2">
                    Shipping To
                  </p>
                  <p className="font-medium text-white">{address.fullName}</p>
                  <p className="text-sm text-gray-400">{address.phone}</p>
                  <p className="text-sm text-gray-400">
                    {address.address}, {address.city}, {address.district} -{" "}
                    {address.postalCode}
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-5 mb-6">
                  <p className="text-xs font-semibold text-yellow-500/80 uppercase tracking-wider mb-2">
                    Payment Method
                  </p>
                  <p className="font-medium text-white">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <ItemImage image={item.image} name={item.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          x{item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-yellow-400 text-sm">
                        ৳
                        {(
                          (item.discountPrice || item.price) * item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 py-4 text-gray-300 rounded-xl font-semibold bg-black/20 hover:bg-yellow-500/5 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={createOrder.isPending}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
                  >
                    {createOrder.isPending ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary  */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 bg-[#121212] rounded-2xl p-6 shadow-[0_0_40px_rgba(234,179,8,0.12)]">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <span className="text-yellow-400">📋</span>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <ItemImage image={item.image} name={item.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-yellow-400">
                      ৳
                      {(
                        (item.discountPrice || item.price) * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-emerald-400 font-medium"
                        : "text-white"
                    }
                  >
                    {shipping === 0 ? "Free" : `৳${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-semibold text-white text-lg">Total</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    ৳{finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Lock className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Secure & Encrypted Checkout</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  256-bit SSL protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}