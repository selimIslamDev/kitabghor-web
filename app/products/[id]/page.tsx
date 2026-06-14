import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <ProductDetailClient id={id} />
      </main>
      <Footer />
    </>
  );
}