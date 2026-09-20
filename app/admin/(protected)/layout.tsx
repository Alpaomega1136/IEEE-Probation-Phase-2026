import { requireAdminPage } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminPage();
  return (
    <div className="admin-shell">
      <AdminNav name={admin.name} email={admin.email} />
      <main id="main-content" className="admin-content">
        {children}
      </main>
    </div>
  );
}
