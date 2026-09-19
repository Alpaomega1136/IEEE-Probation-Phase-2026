import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { EventForm } from "@/components/event-form";
import { requireAdminPage } from "@/lib/auth/session";
import { eventService } from "@/lib/services/events";
import { toDateTimeInput } from "@/lib/events";

export const metadata = { title: "Edit event" };
export default async function EditEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const event = await eventService.getById((await params).id);
  if (!event) notFound();
  return (
    <>
      <Link href="/admin/events" className="back-link">
        <ArrowLeft size={16} />
        Back to events
      </Link>
      <div className="admin-heading">
        <div>
          <h1>Edit event</h1>
          <p>{event.title}</p>
        </div>
        <Link href={`/events/${event.id}`} className="button button-secondary">
          View event <ArrowUpRight size={17} />
        </Link>
      </div>
      <EventForm event={{ ...event, date: toDateTimeInput(event.date) }} />
    </>
  );
}
