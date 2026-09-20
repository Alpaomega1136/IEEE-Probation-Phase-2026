import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { eventService } from "@/lib/services/events";
import { EventImage } from "@/components/event-image";
import { StatusBadge } from "@/components/events";
import { formatDate, formatTime } from "@/lib/events";
import { cleanDescription, plainDescription } from "@/lib/description";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props) {
  const event = await eventService.getById((await params).id);
  return {
    title: event?.title ?? "Event not found",
    description: event
      ? plainDescription(event.description).slice(0, 160)
      : undefined,
  };
}

export default async function EventDetail({ params }: Props) {
  const event = await eventService.getById((await params).id);
  if (!event) notFound();
  return (
    <main id="main-content" className="container page-content">
      <Link href="/events" className="back-link">
        <ArrowLeft size={17} />
        Back to events
      </Link>
      <EventImage
        src={event.imageUrl}
        alt={event.title}
        priority
        className="detail-cover"
      />
      <div className="detail-heading">
        <StatusBadge status={event.status} />
        <h1>{event.title}</h1>
        <div className="detail-meta">
          <span>
            <CalendarDays size={18} />
            {formatDate(event.date)}
          </span>
          <span>
            <MapPin size={18} />
            {event.location}
          </span>
        </div>
      </div>
      <div className="detail-grid">
        <section>
          <p className="eyebrow">The experience</p>
          <h2>About this event</h2>
          <div
            className="event-description rich-text"
            dangerouslySetInnerHTML={{
              __html: cleanDescription(event.description),
            }}
          />
          {event.status === "CANCELLED" && (
            <p className="notice warning">This event has been cancelled.</p>
          )}
        </section>
        <aside className="event-info">
          <h2>Event information</h2>
          <dl>
            <div>
              <dt>
                <CalendarDays size={18} />
                Date
              </dt>
              <dd>{formatDate(event.date, { weekday: "long" })}</dd>
            </div>
            <div>
              <dt>
                <Clock3 size={18} />
                Time
              </dt>
              <dd>{formatTime(event.date)}</dd>
            </div>
            <div>
              <dt>
                <MapPin size={18} />
                Venue
              </dt>
              <dd>{event.location}</dd>
            </div>
          </dl>
          <p>Hosted by IEEE ITB Student Branch</p>
          <Link href="/events" className="text-link">
            Explore more events <ArrowUpRight size={16} />
          </Link>
        </aside>
      </div>
    </main>
  );
}
