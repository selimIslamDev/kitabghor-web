import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsClient from "@/components/product/ProductsClient";

export const metadata = {
  title: "Shop — Books & Gadgets",
  description: "Browse our collection of academic books and educational gadgets",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <ProductsClient />
      </main>
      <Footer />
    </>
  );
}