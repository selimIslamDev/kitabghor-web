"use client";

import { useState } from "react";
import { useUpdateProfile } from "@/lib/hooks";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  Mail,
  LockKeyhole,
  Info,
  Save,
  Settings2,
} from "lucide-react";

export default function ProfileTab({ user }: { user: any }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const updateProfile = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Name is required!");
      return;
    }

    updateProfile.mutate(form);
  };

  return (
    <div className="min-h-full text-white">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
            <Settings2 className="w-5 h-5 text-blue-400" />
          </div>

          <div>
            <h1
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Profile Settings
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Manage your personal information and account details.
            </p>
          </div>
        </div>
      </div>

      {/* Main Glass Card */}
      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-blue-500/30
          bg-slate-900/50
          backdrop-blur-2xl
          shadow-[0_0_50px_rgba(15,23,42,0.45)]
        "
      >
        {/* Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-5 sm:p-7 md:p-9">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-7 border-b border-white/10">
            {/* Avatar */}
            <div
              className="
                w-20 h-20 md:w-24 md:h-24
                shrink-0
                rounded-2xl
                flex items-center justify-center
                text-white text-3xl md:text-4xl font-bold
                bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600
                shadow-[0_0_35px_rgba(59,130,246,0.35)]
              "
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            {/* User info */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {user?.name || "User"}
              </h2>

              <p className="text-sm md:text-base text-slate-400 mt-1">
                {user?.email}
              </p>

              <span
                className="
                  inline-flex items-center gap-1.5
                  mt-3
                  px-3 py-1
                  rounded-full
                  text-xs font-semibold
                  text-blue-300
                  bg-blue-500/10
                  border border-blue-500/20
                "
              >
                {user?.role === "ADMIN" ? "👑 Admin" : "🎓 Student"}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="pt-7">
            <div className="flex items-center gap-4 mb-7">
              <div
                className="
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  bg-blue-500/10
                  border border-blue-500/20
                "
              >
                <User className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Personal Information
                </h3>

                <p className="text-sm text-slate-400 mt-0.5">
                  Update your personal details below.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>

                  <div className="relative group">
                    <User
                      className="
                        absolute left-4 top-1/2 -translate-y-1/2
                        w-5 h-5
                        text-slate-500
                        group-focus-within:text-blue-400
                        transition
                      "
                    />

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      placeholder="Your name"
                      required
                      className="
                        w-full
                        h-14
                        pl-12 pr-4
                        rounded-xl
                        border border-white/10
                        bg-slate-950/40
                        text-white
                        placeholder:text-slate-600
                        outline-none
                        transition-all
                        focus:border-blue-500/60
                        focus:bg-slate-950/60
                        focus:shadow-[0_0_25px_rgba(59,130,246,0.12)]
                      "
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>

                  <div className="relative group">
                    <Phone
                      className="
                        absolute left-4 top-1/2 -translate-y-1/2
                        w-5 h-5
                        text-slate-500
                        group-focus-within:text-blue-400
                        transition
                      "
                    />

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      placeholder="01XXXXXXXXX"
                      className="
                        w-full
                        h-14
                        pl-12 pr-4
                        rounded-xl
                        border border-white/10
                        bg-slate-950/40
                        text-white
                        placeholder:text-slate-600
                        outline-none
                        transition-all
                        focus:border-blue-500/60
                        focus:bg-slate-950/60
                        focus:shadow-[0_0_25px_rgba(59,130,246,0.12)]
                      "
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email <span className="text-slate-500">(cannot change)</span>
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />

                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="
                        w-full
                        h-14
                        pl-12 pr-12
                        rounded-xl
                        border border-white/10
                        bg-slate-950/30
                        text-slate-500
                        outline-none
                        cursor-not-allowed
                      "
                    />

                    <LockKeyhole className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </div>

              {/* Email Notice */}
              <div
                className="
                  mt-6
                  flex items-start gap-3
                  p-4
                  rounded-xl
                  border border-blue-500/20
                  bg-blue-500/[0.06]
                "
              >
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />

                <p className="text-sm text-slate-400 leading-relaxed">
                  Your email address cannot be changed. Please contact support
                  if you need to update it.
                </p>
              </div>

              {/* Save Button */}
              <div className="mt-7">
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2.5
                    min-w-[180px]
                    h-13
                    px-7
                    rounded-xl
                    font-semibold
                    text-white
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    shadow-[0_0_25px_rgba(59,130,246,0.25)]
                    hover:from-blue-500
                    hover:to-purple-600
                    hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]
                    active:scale-[0.98]
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition-all duration-300
                  "
                >
                  {updateProfile.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}