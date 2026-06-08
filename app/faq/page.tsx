"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How long does delivery take?", a: "We deliver within 2-3 business days across Dhaka and 4-5 days for other districts." },
  { q: "Are all books original?", a: "Yes, we source 100% original books directly from publishers and authorized distributors." },
  { q: "Can I return a book?", a: "Yes, you can return books within 7 days if they are in original condition. Contact our support team." },
  { q: "Do you offer student discounts?", a: "Yes! We regularly offer discounts and combo packs for students. Subscribe to our newsletter to stay updated." },
  { q: "What payment methods do you accept?", a: "We accept bKash, Nagad, and all major credit/debit cards via SSLCommerz." },
  { q: "How do I track my order?", a: "After placing an order, you'll receive a tracking ID. Go to your dashboard to track your order status." },
  { q: "Can I order in bulk for my school?", a: "Yes! We offer bulk order discounts for schools and colleges. Contact us at support@kitabghor.com." },
  { q: "Do you deliver outside Bangladesh?", a: "Currently we only deliver within Bangladesh. International shipping is coming soon." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-blue-100">Everything you need to know about KitabGhor</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] overflow-hidden">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--muted)] transition"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{faq.q}</span>
                    {open === i
                      ? <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    }
                  </button>
                  {open === i && (
                    <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-[var(--border)]">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}