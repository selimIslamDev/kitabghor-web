import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
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

    socket.emit("join-admin");

    socket.on("new-order", (order: Omit<OrderNotification, "read">) => {
      const notification: OrderNotification = { ...order, read: false };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast.success(
        `🛒 New Order! ${order.customerName} — ৳${order.totalAmount.toLocaleString()}`,
        {
          duration: 6000,
          position: "top-right",
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "12px 16px",
          },
        }
      );
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
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markAllRead, markRead };
}