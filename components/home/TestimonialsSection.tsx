import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rahul Ahmed",
    role: "SSC Candidate 2024",
    rating: 5,
    comment: "KitabGhor is amazing! I got all my SSC books and a calculator in one order. Fast delivery and great prices. Highly recommended!",
    avatar: "👦",
  },
  {
    id: 2,
    name: "Fatima Begum",
    role: "HSC Student",
    rating: 5,
    comment: "The HSC Science Pack saved me so much money. All books were original and arrived in perfect condition. Will definitely order again!",
    avatar: "👧",
  },
  {
    id: 3,
    name: "Karim Hassan",
    role: "University Student",
    rating: 4,
    comment: "Great collection of university books. Found some rare titles that I couldn't find anywhere else. Customer service is very helpful.",
    avatar: "👨",
  },
  {
    id: 4,
    name: "Nadia Islam",
    role: "Class 9 Student",
    rating: 5,
    comment: "Ordered the geometry box and pen set combo. Excellent quality products at affordable prices. My go-to shop for stationery!",
    avatar: "👩",
  },
  {
    id: 5,
    name: "Sabbir Rahman",
    role: "HSC Candidate 2024",
    rating: 5,
    comment: "Best online bookshop in Bangladesh! The website is easy to use and the checkout process is smooth. Got my books within 2 days.",
    avatar: "👦",
  },
  {
    id: 6,
    name: "Tania Akter",
    role: "Class 10 Student",
    rating: 4,
    comment: "Very satisfied with my purchase. The SSC starter pack is great value for money. Books are exactly as described.",
    avatar: "👧",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <Star className="w-3 h-3 fill-current" />
            Student Reviews
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            What Students Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Trusted by thousands of students across Bangladesh
          </p>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">4.9</span>
            <span className="text-gray-500 dark:text-gray-400">out of 5 (2,400+ reviews)</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-blue-100 dark:text-blue-900 absolute top-4 right-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-600"}`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                "{t.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}