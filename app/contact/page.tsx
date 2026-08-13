"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    lines: ["support@kitabghor.com", "We'll respond as soon as possible."],
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Phone",
    lines: ["+880 1700-000000", "Sat – Thu: 9:00 AM – 9:00 PM"],
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Address",
    lines: ["Mirpur, Dhaka", "Bangladesh"],
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Hours",
    lines: ["Sat – Thu: 9:00 AM – 9:00 PM", "Friday: Closed"],
  },
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
      <main className="relative bg-[#0c0b09] overflow-hidden">
        {/* Decorative background line-art */}
        <svg
          className="absolute -left-10 top-0 w-72 h-72 opacity-[0.06] pointer-events-none select-none"
          viewBox="0 0 200 200"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1"
        >
          <path d="M100 20 C 60 40, 30 60, 20 100 C 30 140, 60 160, 100 180 C 100 120, 100 80, 100 20 Z" />
          <path d="M100 20 C 140 40, 170 60, 180 100 C 170 140, 140 160, 100 180" />
          <line x1="100" y1="20" x2="100" y2="180" />
        </svg>
        <svg
          className="absolute -right-16 top-10 w-96 h-96 opacity-[0.07] pointer-events-none select-none"
          viewBox="0 0 300 300"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1"
        >
          <path d="M150 20 Q 100 100 150 280" />
          <path d="M150 40 Q 200 60 230 90" />
          <path d="M150 80 Q 210 95 245 120" />
          <path d="M150 120 Q 215 130 250 155" />
          <path d="M150 160 Q 210 170 240 195" />
          <path d="M150 200 Q 195 210 220 230" />
        </svg>

        {/* Hero */}
        <section className="relative py-20 px-4 text-center">
          <h1
            className="text-5xl sm:text-6xl font-semibold text-[#f5f0e6] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Contact Us
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-16 bg-[#c9a227]/50" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#c9a227]" />
            <span className="h-px w-16 bg-[#c9a227]/50" />
          </div>
          <p className="text-[#a8a29a] text-sm sm:text-base">
            We&apos;d love to hear from you. Send us a message!
          </p>
        </section>

        <section className="relative pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div>
                <h2
                  className="text-sm font-semibold tracking-[0.15em] text-[#c9a227] uppercase mb-2"
                >
                  Get in Touch
                </h2>
                <div className="h-px w-10 bg-[#c9a227]/60 mb-6" />

                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <div
                      key={info.label}
                      className="flex items-start gap-4 bg-[#141210] rounded-2xl p-4 transition"
                    >
                      <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-[#e4c65e] to-[#c9a227] flex items-center justify-center text-[#0c0b09]">
                        {info.icon}
                      </div>
                      <div>
                        <p
                          className="text-[#f0e9d8] font-medium mb-1"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}
                        >
                          {info.label}
                        </p>
                        {info.lines.map((line) => (
                          <p key={line} className="text-xs text-[#a8a29a] leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 bg-[#141210] rounded-2xl p-6 sm:p-8">
                <h2
                  className="text-2xl text-[#f0e9d8] font-semibold mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Send a Message
                </h2>
                <div className="h-px w-10 bg-[#c9a227]/60 mb-6" />

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#a8a29a] mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your name"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#0c0b09] text-[#f0e9d8] placeholder:text-[#5c574d] focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-sm transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#a8a29a] mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#0c0b09] text-[#f0e9d8] placeholder:text-[#5c574d] focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a8a29a] mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Enter subject"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0b09] text-[#f0e9d8] placeholder:text-[#5c574d] focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a8a29a] mb-1.5">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Type your message here..."
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0b09] text-[#f0e9d8] placeholder:text-[#5c574d] focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-sm resize-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#e4c65e] to-[#c9a227] hover:from-[#eecf6c] hover:to-[#d4ac30] disabled:opacity-70 text-[#0c0b09] rounded-xl font-semibold transition"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#0c0b09] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
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