import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { currentAdmin } from "@/lib/auth/session";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Admin login" };
export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <main id="main-content" className="login-page login-split-page">
      <section className="login-visual" aria-label="IEEE ITB community">
        <Image
          src="/images/collaboration.jpg"
          alt="Students collaborating around laptops"
          fill
          priority
          sizes="70vw"
          className="login-visual-image"
          unoptimized
        />
        <div className="login-visual-shade" />
      </section>
      <section className="login-side" aria-label="Admin sign in">
        <div className="login-side-top">
          <Brand />
          <Link href="/" className="back-link">
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
        <div className="login-panel">
          <p className="eyebrow">IEEE ITB / Admin</p>
          <h1>Welcome back.</h1>
          <p className="muted">Sign in to manage event data.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
