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
        className="relative p-2 rounded-xl border border-[var(--border)] bg-white dark:bg-slate-700 hover:bg-[var(--muted)] transition"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--border)] shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                Notifications {unreadCount > 0 && <span className="text-blue-600 dark:text-blue-400">({unreadCount})</span>}
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">New orders will appear here</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--muted)] transition ${!notif.read ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${!notif.read ? "bg-blue-100 dark:bg-blue-900/30" : "bg-[var(--muted)]"}`}>
                      🛒
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm font-semibold ${!notif.read ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`}>
                          New Order!
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{notif.customerName}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">৳{notif.totalAmount.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-[var(--border)] text-center">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
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