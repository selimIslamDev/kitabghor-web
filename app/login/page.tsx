import AuthClient from "@/components/auth/AuthClient";

export const metadata = { title: "Login — KitabGhor" };

export default function LoginPage() {
  return <AuthClient defaultTab="login" />;
}