import Link from "next/link";
import { Plus, Pencil, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/session";
import { eventService } from "@/lib/services/events";
import { eventQuerySchema } from "@/lib/validations/event";
import { formatDate, formatTime } from "@/lib/events";
import { EventFilters } from "@/components/event-filters";
import { StatusBadge, EmptyState, Pagination } from "@/components/events";
import { DeleteEvent } from "@/components/delete-event";

export const metadata = { title: "Manage events" };
export default async function AdminEvents({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const parsed = eventQuerySchema.safeParse(params);
  const query = parsed.success ? parsed.data : eventQuerySchema.parse({});
  const { events, ...meta } = await eventService.list(query);
  const notice = new Map([
    ["created", "Event created successfully."],
    ["updated", "Event updated successfully."],
    ["deleted", "Event deleted successfully."],
  ]).get(String(params.notice));
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Event management</p>
          <h1>Events</h1>
          <p>Your community&apos;s next experience starts here.</p>
        </div>
        <Link className="button button-primary" href="/admin/events/new">
          <Plus size={18} />
          Add event
        </Link>
      </div>
      {notice && (
        <div className="notice success" role="status">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}
      <EventFilters {...query} base="/admin/events" admin />
      {events.length ? (
        <div className="table-scroll">
          <table className="management-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date & time</th>
                <th>Location</th>
                <th>Status</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>
                    <Link
                      className="table-title"
                      href={`/admin/events/${event.id}/edit`}
                    >
                      {event.title}
                    </Link>
                  </td>
                  <td>
                    {formatDate(event.date)}
                    <small>{formatTime(event.date)}</small>
                  </td>
                  <td className="table-location">{event.location}</td>
                  <td>
                    <StatusBadge status={event.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        href={`/events/${event.id}`}
                        className="icon-button"
                        title={`View ${event.title}`}
                        aria-label={`View ${event.title}`}
                      >
                        <ArrowUpRight size={17} />
                      </Link>
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="icon-button"
                        title={`Edit ${event.title}`}
                        aria-label={`Edit ${event.title}`}
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeleteEvent id={event.id} title={event.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState filtered={!!query.search || query.status !== "all"} />
      )}
      <Pagination {...meta} {...query} page={meta.page} base="/admin/events" />
    </>
  );
}
