"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowRight, CheckCircle, Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

type Tab = "login" | "register";

const features = [
  "Access 5,000+ academic books",
  "Exclusive student discounts",
  "Fast delivery across Bangladesh",
  "Track your orders in real-time",
];

export default function AuthClient({ defaultTab }: { defaultTab: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setAuth({ id: "1", name: "Test User", email: loginForm.email, role: "CUSTOMER" }, "mock-token");
    toast.success("Welcome back! 👋");
    router.push("/");
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setAuth({ id: "2", name: registerForm.name, email: registerForm.email, role: "CUSTOMER" }, "mock-token");
    toast.success("Account created successfully! 🎉");
    router.push("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden flex-col justify-between p-12">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 left-1/4 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-amber-400 rounded-full opacity-80" />
          <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-white rounded-full opacity-60" />
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-300 rounded-full opacity-70" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
              KitabGhor
            </span>
          </Link>
        </div>

        {/* Middle Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Bangladesh's #1 Academic Store
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Your Learning
            <br />
            <span className="text-amber-300">Journey</span> Awaits
          </h2>

          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of students who trust KitabGhor for their academic needs.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: "5,000+", label: "Books" },
            { value: "10k+", label: "Students" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--background)]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
              KitabGhor
            </span>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-[var(--muted)] rounded-2xl p-1 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${tab === t ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Welcome back! 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Sign in to your KitabGhor account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <Link href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl font-semibold transition mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Don't have an account?{" "}
                <button onClick={() => setTab("register")} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Create Account 🎉
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Join thousands of students on KitabGhor
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerForm.confirm}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                      placeholder="Repeat your password"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl font-semibold transition mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Already have an account?{" "}
                <button onClick={() => setTab("login")} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}