"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, Crown, BookOpen, Diamond } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitted(true);
    toast.success("Successfully subscribed to newsletter!");
    setEmail("");
  };

  return (
    <section className="relative py-20 overflow-hidden bg-[#0a0a0a]">
      {/* Subtle gold glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-amber-500/30 bg-amber-500/10">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-medium tracking-wide">
                Exclusive for Book Lovers
              </span>
            </div>

            {/* Heading */}
            <h2 
              className="text-4xl sm:text-5xl font-bold text-amber-100 mb-5 leading-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Get Bookish Updates<br />
              <span className="text-amber-400">in Your Inbox</span>
            </h2>

            <p className="text-amber-100/70 text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Curated recommendations, rare finds, and stories from the world of fine books. For the discerning reader.
            </p>

            {/* Form */}
            {submitted ? (
              <div className="flex items-center justify-center lg:justify-start gap-3 bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm px-6 py-4 rounded-2xl max-w-md mx-auto lg:mx-0">
                <CheckCircle className="w-6 h-6 text-amber-400" />
                <span className="text-amber-100 font-medium">
                  You're subscribed! Thank you 🎉
                </span>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-11 pr-5 py-4 rounded-xl bg-[#141414] border border-amber-500/20 text-amber-50 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-[#0a0a0a] rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] text-sm tracking-wide"
                >
                  SUBSCRIBE
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Bottom tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-amber-200/50 text-xs">
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Curated Excellence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Rare & Refined</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Diamond className="w-3.5 h-3.5" />
                <span>For Discerning Readers</span>
              </div>
            </div>
          </div>

          {/* Right Side - Book Stack Visual */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative">
              {/* Soft glow behind books */}
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-75" />
              
              {/* Book stack */}
              <div className="relative space-y-[-8px]">
                {/* Book 1 */}
                <div className="w-64 h-14 bg-gradient-to-r from-amber-900 to-amber-800 rounded-sm shadow-lg border-l-4 border-amber-500/60 flex items-center px-5 transform rotate-1">
                  <span className="text-amber-200/90 text-xs font-medium tracking-widest uppercase">
                    The Great Gatsby
                  </span>
                </div>
                
                {/* Book 2 */}
                <div className="w-72 h-14 bg-gradient-to-r from-stone-900 to-stone-800 rounded-sm shadow-lg border-l-4 border-amber-600/50 flex items-center px-5 -ml-2">
                  <span className="text-amber-100/80 text-xs font-medium tracking-widest uppercase">
                    Moby Dick
                  </span>
                </div>
                
                {/* Book 3 */}
                <div className="w-68 h-14 bg-gradient-to-r from-red-950 to-red-900 rounded-sm shadow-lg border-l-4 border-amber-500/40 flex items-center px-5 ml-1 transform -rotate-1">
                  <span className="text-amber-100/80 text-xs font-medium tracking-widest uppercase">
                    Pride and Prejudice
                  </span>
                </div>
                
                {/* Book 4 */}
                <div className="w-64 h-14 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-sm shadow-xl border-l-4 border-amber-400/30 flex items-center px-5">
                  <span className="text-amber-200/70 text-xs font-medium tracking-widest uppercase">
                    The Picture of Dorian Gray
                  </span>
                </div>
              </div>

              {/* Floating gold particles effect */}
              <div className="absolute -top-6 -right-4 w-3 h-3 bg-amber-400 rounded-full opacity-60 animate-pulse" />
              <div className="absolute top-10 -right-8 w-2 h-2 bg-amber-300 rounded-full opacity-40" />
              <div className="absolute bottom-8 -left-6 w-2.5 h-2.5 bg-amber-500 rounded-full opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}