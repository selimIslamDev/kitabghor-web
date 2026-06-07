import AuthClient from "@/components/auth/AuthClient";

export const metadata = { title: "Register — KitabGhor" };

export default function RegisterPage() {
  return <AuthClient defaultTab="register" />;
}