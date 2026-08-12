"use client";

import Link from "next/link";
import { BookOpen, Share2, Globe, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0c0b09]">
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
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Kitab<span className="text-[#c9a227]">Ghor</span>
              </span>
            </Link>

            <p className="text-sm text-[#6b6358] max-w-xs leading-relaxed mb-5">
              Your one-stop shop for academic books and gadgets — from Class 8 to University.
            </p>

            <div className="space-y-2 text-sm text-[#6b6358]">
              <a
                href="mailto:support@kitabghor.com"
                className="flex items-center gap-2 hover:text-[#c9a227] transition"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                support@kitabghor.com
              </a>
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center gap-2 hover:text-[#c9a227] transition"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                +880 1XXX-XXXXXX
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {[
                { label: "SSC Books", href: "/products?classLevel=SSC" },
                { label: "HSC Books", href: "/products?classLevel=HSC" },
                { label: "University", href: "/products?classLevel=University" },
                { label: "Gadgets", href: "/products?type=GADGET" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#6b6358] hover:text-[#c9a227] transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4">Help</h3>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Return Policy", href: "/faq" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#6b6358] hover:text-[#c9a227] transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4">Stay Updated</h3>
            <p className="text-xs text-[#6b6358] mb-3 leading-relaxed">
              Get new arrivals & offers in your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#141210] border border-white/[0.08] text-[#f5f0e8] placeholder:text-[#6b6358] focus:outline-none focus:border-[#c9a227]/40 transition"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#c9a227] to-[#b8921f] text-[#0c0b09] hover:from-[#d4b84a] hover:to-[#c9a227] transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[11px] text-[#6b6358] mr-1">We accept</span>
              {["bKash", "Nagad", "Card", "COD"].map((method) => (
                <span
                  key={method}
                  className="text-[11px] px-2 py-1 rounded border border-white/[0.06] text-[#a89f8f] bg-[#141210]"
                >
                  {method}
                </span>
              ))}
            </div>

            <div className="flex gap-1.5">
              <a
                href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6b6358] hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6b6358] hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@kitabghor.com"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6b6358] hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-[#6b6358] mt-5">
            © {new Date().getFullYear()} KitabGhor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}