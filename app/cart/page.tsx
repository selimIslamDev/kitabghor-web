import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartClient from "@/components/cart/CartClient";

export const metadata = {
  title: "Cart — KitabGhor",
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <CartClient />
      </main>
      <Footer />
    </>
  );
}