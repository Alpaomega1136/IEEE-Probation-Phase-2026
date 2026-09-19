import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { currentAdmin } from "@/lib/auth/session";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Admin login" };
export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <main id="main-content" className="login-page">
      <div className="login-top">
        <Brand />
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          Back to website
        </Link>
      </div>
      <section className="login-panel">
        <div className="login-icon">
          <LockKeyhole size={24} />
        </div>
        <p className="eyebrow">IEEE ITB / Admin</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to your event workspace.</p>
        <LoginForm />
        <p className="login-note">IEEE ITB Event Management</p>
      </section>
      <p className="login-footer">IEEE ITB Student Branch</p>
    </main>
  );
}
