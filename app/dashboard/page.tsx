import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata = { title: "Dashboard — KitabGhor" };

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <DashboardClient />
      </main>
      <Footer />
    </>
  );
}