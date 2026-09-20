import Link from "next/link";
import { CheckCircle2, Grid3X3, List, Plus } from "lucide-react";
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
  const view = params.view === "grid" ? "grid" : "list";
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
          <h1>Events</h1>
        </div>
      </div>
      {notice && (
        <div className="notice success" role="status">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}
      <div className="admin-list-tools">
        <EventFilters {...query} base="/admin/events" admin view={view} />
        <Link href="/admin/events/new" className="button button-primary">
          <Plus size={18} />
          <span>Create event</span>
        </Link>
        <div className="view-toggle" aria-label="Event layout">
          <Link
            href={`/admin/events?${new URLSearchParams({ search: query.search, status: query.status, view: "list" })}`}
            aria-current={view === "list" ? "page" : undefined}
            aria-label="Show events as rows"
            title="Rows"
          >
            <List size={17} />
          </Link>
          <Link
            href={`/admin/events?${new URLSearchParams({ search: query.search, status: query.status, view: "grid" })}`}
            aria-current={view === "grid" ? "page" : undefined}
            aria-label="Show events as cards"
            title="Cards"
          >
            <Grid3X3 size={17} />
          </Link>
        </div>
      </div>
      {events.length ? (
        <AdminEventList events={events} view={view} />
      ) : (
        <EmptyState filtered={!!query.search || query.status !== "all"} />
      )}
      <Pagination
        {...meta}
        {...query}
        page={meta.page}
        base="/admin/events"
        view={view}
      />
    </>
  );
}
