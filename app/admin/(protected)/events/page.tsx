import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/session";
import { eventService } from "@/lib/services/events";
import { eventQuerySchema } from "@/lib/validations/event";
import { EventFilters } from "@/components/event-filters";
import { EmptyState, Pagination } from "@/components/events";
import { AdminEventList } from "@/components/admin-event-list";

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
  const tabs = [
    { value: "all", label: "All events" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "past", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Event management</p>
          <h1>
            Events{" "}
            <span className="heading-count" aria-hidden="true">
              {meta.total}
            </span>
          </h1>
          <p>Great experiences start with the details.</p>
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
      <nav className="admin-status-tabs" aria-label="Event status">
        {tabs.map(({ value, label }) => (
          <Link
            key={value}
            href={`/admin/events?${new URLSearchParams({ status: value, search: query.search })}`}
            aria-current={
              query.status === value ||
              (value === "past" && query.status === "COMPLETED") ||
              (value === "upcoming" && query.status === "UPCOMING")
                ? "page"
                : undefined
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <EventFilters {...query} base="/admin/events" admin />
      {events.length ? (
        <AdminEventList events={events} />
      ) : (
        <EmptyState filtered={!!query.search || query.status !== "all"} />
      )}
      <Pagination {...meta} {...query} page={meta.page} base="/admin/events" />
    </>
  );
}
