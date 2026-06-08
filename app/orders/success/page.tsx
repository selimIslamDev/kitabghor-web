import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderSuccessClient from "@/components/cart/OrderSuccessClient";

export const metadata = { title: "Order Placed — KitabGhor" };

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <OrderSuccessClient />
      </main>
      <Footer />
    </>
  );
}