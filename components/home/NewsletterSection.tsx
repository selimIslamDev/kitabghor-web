"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("Successfully subscribed to newsletter!");
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
          Stay Updated with KitabGhor
        </h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Subscribe to our newsletter and get notified about new arrivals, 
          special offers, and exclusive discounts for students.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              <CheckCircle className="w-4 h-4 text-green-300" />
              {perk}
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl max-w-md mx-auto">
            <CheckCircle className="w-6 h-6 text-green-300" />
            <span className="text-white font-semibold">You're subscribed! Thank you 🎉</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition shadow-lg text-sm"
            >
              Subscribe
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-blue-200 text-xs mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}

const perks = [
  "New Arrivals",
  "Exclusive Deals",
  "Study Tips",
  "Early Access",
];