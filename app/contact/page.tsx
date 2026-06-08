"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const contactInfo = [
  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "support@kitabghor.com", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+880 1700-000000", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  { icon: <MapPin className="w-5 h-5" />, label: "Address", value: "Mirpur, Dhaka, Bangladesh", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { icon: <Clock className="w-5 h-5" />, label: "Hours", value: "Sat–Thu: 9AM – 9PM", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Contact Us</h1>
          <p className="text-blue-100">We'd love to hear from you. Send us a message!</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-4">
                    <div className={`w-10 h-10 ${info.color} rounded-xl flex items-center justify-center`}>
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{info.label}</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help?"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your message..."
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl font-semibold transition"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}