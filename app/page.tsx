import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import GadgetsSection from "@/components/home/GadgetsSection";
import ComboSection from "@/components/home/ComboSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
         <CategoriesSection />
         <FeaturedBooks />
          <GadgetsSection />
           <ComboSection />
      </main>
      <Footer />
    </>
  );
}