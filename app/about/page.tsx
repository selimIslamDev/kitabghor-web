import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, Users, Star, Truck, Shield, Heart } from "lucide-react";

export const metadata = { title: "About Us — KitabGhor" };

const stats = [
  { value: "5,000+", label: "Books Available", icon: "📚" },
  { value: "10,000+", label: "Happy Students", icon: "👥" },
  { value: "50+", label: "Trusted Brands", icon: "🏆" },
  { value: "4.9★", label: "Average Rating", icon: "⭐" },
];

const values = [
  { icon: <BookOpen className="w-6 h-6" />, title: "Quality Books", description: "We source only original, high-quality books from trusted publishers across Bangladesh." },
  { icon: <Users className="w-6 h-6" />, title: "Student First", description: "Every decision we make is with students in mind — affordable prices, fast delivery." },
  { icon: <Shield className="w-6 h-6" />, title: "Trusted & Secure", description: "Safe payments, genuine products, and a hassle-free shopping experience." },
  { icon: <Truck className="w-6 h-6" />, title: "Fast Delivery", description: "We deliver across Bangladesh within 2-3 business days." },
  { icon: <Star className="w-6 h-6" />, title: "Best Prices", description: "Competitive pricing with regular discounts and combo offers for students." },
  { icon: <Heart className="w-6 h-6" />, title: "Passionate Team", description: "A team of educators and tech enthusiasts working to improve student lives." },
];

const team = [
  { name: "Md. Selim Islam", role: "Founder & CEO", avatar: "👨‍💼" },
  { name: "Fatima Begum", role: "Head of Operations", avatar: "👩‍💼" },
  { name: "Karim Hassan", role: "Tech Lead", avatar: "👨‍💻" },
  { name: "Nadia Akter", role: "Customer Success", avatar: "👩‍💻" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 px-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              About KitabGhor
            </h1>
            <p className="text-blue-100 text-lg">
              Bangladesh's most trusted academic book and gadget store, serving students from Class 8 to University since 2020.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[var(--card)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              KitabGhor was founded in 2020 with a simple mission — make academic books and educational gadgets accessible and affordable for every student in Bangladesh.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              What started as a small online bookshop has grown into Bangladesh's most trusted academic store, serving over 10,000 students across the country with a carefully curated collection of books from Class 8 to University level, along with essential educational gadgets.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[var(--card)] px-4">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10" style={{ fontFamily: "Poppins, sans-serif" }}>
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value) => (
                <div key={value.title} className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10" style={{ fontFamily: "Poppins, sans-serif" }}>
              Meet the Team
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3">
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{member.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
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