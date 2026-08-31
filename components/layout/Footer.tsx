"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to newsletter endpoint
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#0c0b09] border-t border-[#c9a227]/10">
      {/* Trust strip */}
      <div className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: "সারাদেশে ডেলিভারি", desc: "৬৪ জেলায় হোম ডেলিভারি" },
            { icon: ShieldCheck, title: "নিরাপদ পেমেন্ট", desc: "bKash, Nagad, Card ও COD" },
            { icon: BadgeCheck, title: "অথেনটিক বই", desc: "১০০% অরিজিনাল প্রোডাক্ট" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c9a227]/10 flex items-center justify-center shrink-0">
                <item.icon className="w-[18px] h-[18px] text-[#c9a227]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#f5f0e8]">{item.title}</p>
                <p className="text-xs text-[#6b6358]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#c9a227] to-[#b8921f] flex items-center justify-center shadow-lg shadow-[#c9a227]/15 group-hover:scale-105 transition-transform">
                <BookOpen className="w-[18px] h-[18px] text-[#0c0b09]" strokeWidth={2.2} />
              </div>
              <span
                className="text-[1.25rem] font-bold tracking-wide text-[#f5f0e8]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Kitab<span className="text-[#c9a227]">Ghor</span>
              </span>
            </Link>

            <p className="text-sm text-[#6b6358] max-w-xs leading-relaxed mb-5">
              একাডেমিক বই ও গ্যাজেটের জন্য তোমার এক-স্টপ প্ল্যাটফর্ম — ক্লাস ৮ থেকে ইউনিভার্সিটি পর্যন্ত।
            </p>

            <div className="space-y-2.5 text-sm text-[#a89f8f]">
              <a
                href="mailto:support@kitabghor.com"
                className="flex items-center gap-2.5 hover:text-[#c9a227] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#c9a227]/70 shrink-0" />
                support@kitabghor.com
              </a>
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center gap-2.5 hover:text-[#c9a227] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#c9a227]/70 shrink-0" />
                +৮৮০ ১XXX-XXXXXX
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#c9a227]/70 shrink-0" />
                ঢাকা, বাংলাদেশ
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-2 mt-6">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#a89f8f] bg-white/5 hover:text-[#0c0b09] hover:bg-[#c9a227] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4 tracking-wide">ক্যাটাগরি</h3>
            <ul className="space-y-2.5">
              {[
                { label: "SSC বই", href: "/products?classLevel=SSC" },
                { label: "HSC বই", href: "/products?classLevel=HSC" },
                { label: "ইউনিভার্সিটি", href: "/products?classLevel=University" },
                { label: "গ্যাজেটস", href: "/products?type=GADGET" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#a89f8f] hover:text-[#c9a227] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4 tracking-wide">হেল্প</h3>
            <ul className="space-y-2.5">
              {[
                { label: "আমাদের সম্পর্কে", href: "/about" },
                { label: "যোগাযোগ", href: "/contact" },
                { label: "সচরাচর জিজ্ঞাসা", href: "/faq" },
                { label: "রিটার্ন পলিসি", href: "/faq" },
                { label: "প্রাইভেসি পলিসি", href: "/privacy" },
                { label: "টার্মস অফ সার্ভিস", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#a89f8f] hover:text-[#c9a227] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4 tracking-wide">নিউজলেটার</h3>
            <p className="text-xs text-[#6b6358] mb-3 leading-relaxed">
              নতুন বই ও অফার সবার আগে জানতে সাবস্ক্রাইব করো।
            </p>

            {subscribed ? (
              <p className="text-sm text-[#c9a227] flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /> সাবস্ক্রাইব হয়ে গেছে!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="তোমার ইমেইল"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#141210] text-[#f5f0e8] placeholder:text-[#6b6358] border border-white/5 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/40 transition"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-full px-6 py-3 text-sm transition-colors"
                >
                  সাবস্ক্রাইব
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6b6358] order-2 sm:order-1">
              © {new Date().getFullYear()} KitabGhor. সর্বস্বত্ব সংরক্ষিত।
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-center order-1 sm:order-2">
              <span className="text-[11px] text-[#6b6358] mr-1">পেমেন্ট মাধ্যম</span>
              {["bKash", "Nagad", "Card", "COD"].map((method) => (
                <span
                  key={method}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md text-[#a89f8f] bg-white/5 border border-white/5"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}