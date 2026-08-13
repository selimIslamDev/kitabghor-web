import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, Users, Star, Truck, Shield, Heart } from "lucide-react";

export const metadata = { title: "About Us — KitabGhor" };

const stats = [
  { value: "5,000+", label: "Books Available", icon: BookOpen },
  { value: "10,000+", label: "Happy Students", icon: Users },
  { value: "50+", label: "Trusted Brands", icon: Shield },
  { value: "4.9★", label: "Average Rating", icon: Star },
];

const values = [
  {
    icon: BookOpen,
    title: "Quality Books",
    description:
      "We source only original, high-quality books from trusted publishers across Bangladesh.",
  },
  {
    icon: Users,
    title: "Student First",
    description:
      "Every decision we make is with students in mind — affordable prices, fast delivery.",
  },
  {
    icon: Shield,
    title: "Trusted & Secure",
    description:
      "Safe payments, genuine products, and a hassle-free shopping experience.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "We deliver across Bangladesh within 2-3 business days.",
  },
  {
    icon: Star,
    title: "Best Prices",
    description:
      "Competitive pricing with regular discounts and combo offers for students.",
  },
  {
    icon: Heart,
    title: "Passionate Team",
    description:
      "A team of educators and tech enthusiasts working to improve student lives.",
  },
];

const team = [
  { name: "Md. Selim Islam", role: "Founder & CEO", initial: "S" },
  { name: "Fatima Begum", role: "Head of Operations", initial: "F" },
  { name: "Karim Hassan", role: "Tech Lead", initial: "K" },
  { name: "Nadia Akter", role: "Customer Success", initial: "N" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#0c0b09] text-[#f5f0e8]">
        {/* Hero */}
        <section className="relative pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_60%)] pointer-events-none" />

          <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(201,162,39,0.12)",
                border: "1px solid rgba(201,162,39,0.3)",
              }}
            >
              <BookOpen className="w-8 h-8 text-[#c9a227]" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              About KitabGhor
            </h1>
            <p className="text-[#a89f8f] text-lg leading-relaxed">
              Bangladesh’s most trusted academic book and gadget store, serving
              students from Class 8 to University since 2020.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-6 text-center border border-white/5 bg-[#141210]"
                  >
                    <div className="flex justify-center mb-3">
                      <Icon className="w-6 h-6 text-[#c9a227]" />
                    </div>
                    <div className="text-3xl font-extrabold text-[#c9a227] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[#8b8378]">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-6">
              Our Story
            </h2>
            <p className="text-[#a89f8f] leading-relaxed mb-4">
              KitabGhor was founded in 2020 with a simple mission — make
              academic books and educational gadgets accessible and affordable
              for every student in Bangladesh.
            </p>
            <p className="text-[#a89f8f] leading-relaxed">
              What started as a small online bookshop has grown into
              Bangladesh’s most trusted academic store, serving over 10,000
              students across the country with a carefully curated collection of
              books from Class 8 to University level, along with essential
              educational gadgets.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-3xl font-extrabold text-white text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="rounded-2xl border border-white/5 bg-[#141210] p-6 hover:border-[rgba(201,162,39,0.25)] transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: "rgba(201,162,39,0.12)",
                        border: "1px solid rgba(201,162,39,0.25)",
                      }}
                    >
                      <Icon className="w-6 h-6 text-[#c9a227]" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-[#8b8378] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-5">
            <h2 className="text-3xl font-extrabold text-white text-center mb-12">
              Meet the Team
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                    style={{
                      background: "rgba(201,162,39,0.12)",
                      border: "1px solid rgba(201,162,39,0.3)",
                      color: "#c9a227",
                    }}
                  >
                    {member.initial}
                  </div>
                  <h3 className="font-semibold text-white text-sm">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#8b8378] mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}