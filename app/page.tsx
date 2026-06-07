import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import GadgetsSection from "@/components/home/GadgetsSection";
import ComboSection from "@/components/home/ComboSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

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
            <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}