import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/event-form";
import { requireAdminPage } from "@/lib/auth/session";

export const metadata = { title: "Add event" };
export default async function NewEvent() {
  await requireAdminPage();
  return (
    <>
      <Link href="/admin/events" className="back-link">
        <ArrowLeft size={16} />
        Back to events
      </Link>
      <div className="admin-heading">
        <div>
          <h1>Add event</h1>
          <p>Create something for the community to look forward to.</p>
        </div>
      </div>
      <EventForm />
    </>
  );
}
