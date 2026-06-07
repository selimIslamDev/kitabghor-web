import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "@/components/cart/CheckoutClient";

export const metadata = {
  title: "Checkout — KitabGhor",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}