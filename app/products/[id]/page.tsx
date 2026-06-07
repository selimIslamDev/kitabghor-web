import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <ProductDetailClient id={params.id} />
      </main>
      <Footer />
    </>
  );
}