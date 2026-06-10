import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import toast from "react-hot-toast";

export interface OrderNotification {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  itemCount: number;
  paymentMethod: string;
  createdAt: string;
  read: boolean;
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = connectSocket();

    // Admin room এ join করো
    socket.emit("join-admin");

    // নতুন order এলে
    socket.on("new-order", (order: Omit<OrderNotification, "read">) => {
      const notification: OrderNotification = { ...order, read: false };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Toast notification
      toast.custom((t) => (
        <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-sm w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-[var(--border)] p-4 flex items-start gap-3`}>
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            🛒
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-sm">New Order Received!</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              {order.customerName} — ৳{order.totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{order.itemCount} item(s) · {order.paymentMethod}</p>
          </div>
        </div>
      ), { duration: 6000, position: "top-right" });
    });

    return () => {
      socket.off("new-order");
      disconnectSocket();
    };
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markAllRead, markRead };
}