import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion | PediaGo",
  description: "Connexion sécurisée à PediaGo.",
};

export default function LoginPage() {
  return (
    <main className="bg-white">
      <LoginForm />
    </main>
  );
}
