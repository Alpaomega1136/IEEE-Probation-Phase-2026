import Link from "next/link";
import type { Event } from "@prisma/client";
import { Pencil, CalendarDays } from "lucide-react";
import { EventImage } from "@/components/event-image";
import { StatusBadge } from "@/components/events";
import { DeleteEvent } from "@/components/delete-event";
import { formatDate, formatTime } from "@/lib/events";

export function AdminEventList({ events }: { events: Event[] }) {
  return (
    <div className="admin-event-list">
      <div className="event-list-columns" aria-hidden="true">
        <span>Event</span>
        <span>Schedule</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="managed-event">
            <div className="managed-event-identity">
              <EventImage src={event.imageUrl} alt="" />
              <div>
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="table-title"
                >
                  {event.title}
                </Link>
                <p>{event.location}</p>
              </div>
            </div>
            <div className="managed-event-schedule">
              <CalendarDays size={14} />
              <div>
                <time dateTime={event.date.toISOString()}>
                  {formatDate(event.date)}
                </time>
                <small>{formatTime(event.date)}</small>
              </div>
            </div>
            <div className="managed-event-status">
              <StatusBadge status={event.status} />
            </div>
            <div className="table-actions">
              <Link
                href={`/admin/events/${event.id}/edit`}
                className="icon-button edit-icon"
                title={`Edit ${event.title}`}
                aria-label={`Edit ${event.title}`}
              >
                <Pencil size={16} />
              </Link>
              <DeleteEvent id={event.id} title={event.title} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
