import type { Metadata } from "next";
import { EventGrid, Pagination } from "@/components/events";
import { EventFilters } from "@/components/event-filters";
import { eventService } from "@/lib/services/events";
import { eventQuerySchema } from "@/lib/validations/event";

export const metadata: Metadata = { title: "Events" };
export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsed = eventQuerySchema.safeParse(await searchParams);
  const query = parsed.success ? parsed.data : eventQuerySchema.parse({});
  const { events, ...meta } = await eventService.list(query);
  return (
    <main id="main-content" className="container page-content">
      <div className="page-heading">
        <p className="eyebrow">IEEE ITB Student Branch</p>
        <h1>Events & experiences</h1>
        <p>Come with curiosity. Leave with something new.</p>
      </div>
      <EventFilters {...query} base="/events" />
      <EventGrid
        events={events}
        filtered={!!query.search || query.status !== "all"}
      />
      <Pagination {...meta} {...query} page={meta.page} base="/events" />
    </main>
  );
}
