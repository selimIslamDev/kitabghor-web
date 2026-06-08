import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDetailClient from "@/components/cart/OrderDetailClient";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <OrderDetailClient id={params.id} />
      </main>
      <Footer />
    </>
  );
}