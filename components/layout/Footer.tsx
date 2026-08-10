import Link from "next/link";
import { BookOpen, Share2, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0c0b09] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
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

            <p className="text-sm text-[#6b6358] max-w-xs leading-relaxed">
              Your one-stop shop for academic books and gadgets — from Class 8 to University.
            </p>

            <div className="flex gap-2 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-white/[0.06] flex items-center justify-center text-[#6b6358] hover:text-[#c9a227] hover:border-[#c9a227]/30 hover:bg-[#c9a227]/5 transition"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-white/[0.06] flex items-center justify-center text-[#6b6358] hover:text-[#c9a227] hover:border-[#c9a227]/30 hover:bg-[#c9a227]/5 transition"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@kitabghor.com"
                className="w-9 h-9 rounded-lg border border-white/[0.06] flex items-center justify-center text-[#6b6358] hover:text-[#c9a227] hover:border-[#c9a227]/30 hover:bg-[#c9a227]/5 transition"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4 tracking-wide">
              Categories
            </h3>
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
            <h3 className="text-sm font-semibold text-[#f5f0e8] mb-4 tracking-wide">
              Help
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Return Policy", href: "/faq" },
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
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6b6358]">
            © {new Date().getFullYear()} KitabGhor. All rights reserved.
          </p>
          <p className="text-xs text-[#6b6358]">
            Made for students across Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}