"use client";

import { useState } from "react";
import { Bell, X, ShoppingBag, Check } from "lucide-react";
import { useAdminNotifications } from "@/lib/hooks";

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, markRead } = useAdminNotifications();

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-sm
          hover:bg-white hover:shadow transition"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-12 w-[320px] sm:w-80 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/60">
              <h3 className="font-semibold text-slate-800 text-sm">
                Notifications{" "}
                {unreadCount > 0 && (
                  <span className="text-sky-600 font-medium">({unreadCount})</span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 transition"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No notifications yet</p>
                  <p className="text-xs text-slate-400 mt-1">New orders will appear here</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-100/80 cursor-pointer
                      hover:bg-slate-50/80 transition
                      ${!notif.read ? "bg-sky-50/50" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                        ${!notif.read ? "bg-sky-100" : "bg-slate-100"}`}
                    >
                      🛒
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p
                          className={`text-sm font-semibold ${
                            !notif.read ? "text-sky-700" : "text-slate-800"
                          }`}
                        >
                          New Order!
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-sky-500 rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate">{notif.customerName}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-bold text-sky-600">
                          ৳{notif.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-200/60 text-center">
                <button className="text-xs text-sky-600 hover:text-sky-700 font-semibold transition">
                  View All Orders →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}