import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-9xl font-black text-blue-600 dark:text-blue-400 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            404
          </div>
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">
              Back to Home
            </Link>
            <Link href="/products" className="px-8 py-4 border border-[var(--border)] text-gray-600 dark:text-gray-300 hover:bg-[var(--muted)] rounded-xl font-semibold transition">
              Browse Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}