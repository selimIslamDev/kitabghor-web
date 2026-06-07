import Link from "next/link";

const categories = [
  { name: "Class 8-9", icon: "📗", slug: "Class 8-9", color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800", iconBg: "bg-green-100 dark:bg-green-900/40" },
  { name: "SSC", icon: "📘", slug: "SSC", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", iconBg: "bg-blue-100 dark:bg-blue-900/40" },
  { name: "HSC", icon: "📙", slug: "HSC", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800", iconBg: "bg-amber-100 dark:bg-amber-900/40" },
  { name: "University", icon: "🎓", slug: "University", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800", iconBg: "bg-purple-100 dark:bg-purple-900/40" },
  { name: "Calculator", icon: "🔢", slug: "GADGET", color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", iconBg: "bg-red-100 dark:bg-red-900/40" },
  { name: "Geometry Box", icon: "📐", slug: "GADGET", color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800", iconBg: "bg-indigo-100 dark:bg-indigo-900/40" },
  { name: "Pen & Pencil", icon: "✏️", slug: "GADGET", color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800", iconBg: "bg-pink-100 dark:bg-pink-900/40" },
  { name: "Art Supplies", icon: "🎨", slug: "GADGET", color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800", iconBg: "bg-orange-100 dark:bg-orange-900/40" },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
          Browse by Category
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Find exactly what you need for your academic journey
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={
              cat.slug === "GADGET"
                ? `/products?type=GADGET`
                : `/products?classLevel=${cat.slug}`
            }
            className={`group flex flex-col items-center p-6 rounded-2xl border ${cat.color} hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
          >
            <div className={`w-14 h-14 ${cat.iconBg} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-200`}>
              {cat.icon}
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}