import Link from "next/link";
import { BookOpen, Share2, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                KitabGhor
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Your one-stop shop for academic books and gadgets — from Class 8 to University.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg bg-[var(--muted)] hover:bg-blue-100 dark:hover:bg-blue-900 transition">
                <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[var(--muted)] hover:bg-blue-100 dark:hover:bg-blue-900 transition">
                <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </a>
              <a href="mailto:support@kitabghor.com" className="p-2 rounded-lg bg-[var(--muted)] hover:bg-blue-100 dark:hover:bg-blue-900 transition">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/products?classLevel=SSC" className="hover:text-blue-600 transition">SSC Books</Link></li>
              <li><Link href="/products?classLevel=HSC" className="hover:text-blue-600 transition">HSC Books</Link></li>
              <li><Link href="/products?classLevel=University" className="hover:text-blue-600 transition">University</Link></li>
              <li><Link href="/products?type=GADGET" className="hover:text-blue-600 transition">Gadgets</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Help</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 transition">FAQ</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 transition">Return Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} KitabGhor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}