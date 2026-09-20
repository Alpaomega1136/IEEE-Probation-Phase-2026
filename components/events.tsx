import Link from "next/link";
import type { Event } from "@prisma/client";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  SearchX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EventImage } from "@/components/event-image";
import { formatDate, statusLabels, type EventStatus } from "@/lib/events";

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      <span />
      {statusLabels[status]}
    </span>
  );
}

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="event-card">
      <Link href={`/events/${event.id}`} className="event-card-link">
        <EventImage src={event.imageUrl} alt={event.title} />
        <time
          className="event-date-stamp"
          dateTime={event.date.toISOString()}
          aria-label={formatDate(event.date)}
        >
          <strong>
            {formatDate(event.date, {
              day: "2-digit",
              month: undefined,
              year: undefined,
            })}
          </strong>
          <span>
            {formatDate(event.date, {
              day: undefined,
              month: "short",
              year: undefined,
            })}
          </span>
          <small>
            {formatDate(event.date, {
              day: undefined,
              month: undefined,
              year: "numeric",
            })}
          </small>
        </time>
        <div className="event-card-body">
          <div className="event-card-meta">
            <StatusBadge status={event.status} />
          </div>
          <h3>{event.title}</h3>
          <p className="event-location">
            <MapPin size={15} />
            {event.location}
          </p>
          <div className="event-card-bottom">
            View event <ArrowRight size={17} />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function EventGrid({
  events,
  filtered = false,
}: {
  events: Event[];
  filtered?: boolean;
}) {
  if (!events.length) return <EmptyState filtered={filtered} />;
  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export function EmptyState({ filtered = false }: { filtered?: boolean }) {
  return (
    <div className="empty-state">
      {filtered ? <SearchX size={32} /> : <CalendarDays size={32} />}
      <h2>{filtered ? "No matching events" : "No events just yet"}</h2>
      <p>
        {filtered
          ? "Try a different search or filter."
          : "No events are available at the moment. Check back soon."}
      </p>
    </div>
  );
}

export function Pagination({
  page,
  pages,
  total,
  base,
  search,
  status,
  showTotal = true,
}: {
  page: number;
  pages: number;
  total: number;
  base: string;
  search: string;
  status: string;
  showTotal?: boolean;
}) {
  if (!showTotal && pages <= 1) return null;
  const href = (value: number) =>
    `${base}?${new URLSearchParams({ search, status, page: String(value) })}`;
  return (
    <div className="pagination">
      {showTotal && (
        <span>
          {total} {total === 1 ? "event" : "events"}
        </span>
      )}
      {pages > 1 && (
        <nav aria-label="Pagination">
          {page > 1 ? (
            <Link
              className="icon-button"
              href={href(page - 1)}
              aria-label="Previous page"
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </Link>
          ) : (
            <button className="icon-button" disabled aria-label="Previous page">
              <ChevronLeft size={18} />
            </button>
          )}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              className="icon-button"
              href={href(page + 1)}
              aria-label="Next page"
              title="Next page"
            >
              <ChevronRight size={18} />
            </Link>
          ) : (
            <button className="icon-button" disabled aria-label="Next page">
              <ChevronRight size={18} />
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
