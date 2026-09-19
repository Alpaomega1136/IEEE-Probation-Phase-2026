import { requireAdminPage } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin-nav";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminPage();
  return (
    <div className="admin-shell">
      <AdminNav name={admin.name} email={admin.email} />
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="workspace-path">
            Workspace <span>/</span>
            <strong>IEEE ITB</strong>
          </span>
          <div className="topbar-account">
            <Link href="/" className="topbar-site">
              Public site <ArrowUpRight size={15} />
            </Link>
            <span className="admin-role">
              <ShieldCheck size={14} />
              Administrator
            </span>
            <span className="avatar" aria-label={admin.name}>
              {admin.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <main id="main-content" className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
