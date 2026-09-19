import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarCheck2,
  CalendarClock,
  Plus,
  Ban,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { eventService } from "@/lib/services/events";
import { requireAdminPage } from "@/lib/auth/session";
import { EmptyState } from "@/components/events";
import { AdminEventList } from "@/components/admin-event-list";
import { formatDate, formatTime } from "@/lib/events";

export const metadata = { title: "Admin overview" };
export default async function Dashboard() {
  const admin = await requireAdminPage();
  const summary = await eventService.summary();
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Hello, {admin.name}</p>
          <h1>Overview</h1>
          <p>Everything happening in your event community.</p>
        </div>
        <Link href="/admin/events/new" className="button button-primary">
          <Plus size={18} />
          Add event
        </Link>
      </div>
      <div className="stats-grid">
        {[
          {
            label: "Total events",
            value: summary.total,
            icon: CalendarDays,
            className: "blue",
            href: "/admin/events",
            note: "Across all statuses",
          },
          {
            label: "Upcoming & ongoing",
            value: summary.upcoming,
            icon: CalendarClock,
            className: "sky",
            href: "/admin/events?status=upcoming",
            note: "On the calendar",
          },
          {
            label: "Completed events",
            value: summary.completed,
            icon: CalendarCheck2,
            className: "gold",
            href: "/admin/events?status=past",
            note: "In the archive",
          },
          {
            label: "Cancelled events",
            value: summary.cancelled,
            icon: Ban,
            className: "rose",
            href: "/admin/events?status=CANCELLED",
            note: "No longer scheduled",
          },
        ].map(({ label, value, icon: Icon, className, href, note }) => (
          <Link key={label} href={href} className="stat">
            <div className="stat-top">
              <span className={`stat-icon ${className}`}>
                <Icon size={19} />
              </span>
              <ArrowUpRight size={16} />
            </div>
            <p>{label}</p>
            <strong>{value.toString().padStart(2, "0")}</strong>
            <small>{note}</small>
          </Link>
        ))}
      </div>
      <div className="dashboard-columns">
        <section className="admin-section">
          <div className="section-heading compact">
            <div>
              <h2>Recently updated</h2>
              <p>Your latest event records.</p>
            </div>
            <Link href="/admin/events" className="text-link">
              All events <ArrowRight size={16} />
            </Link>
          </div>
          {summary.recent.length ? (
            <AdminEventList events={summary.recent} />
          ) : (
            <EmptyState />
          )}
        </section>
        <aside className="up-next">
          <div className="section-heading compact">
            <div>
              <h2>Coming up</h2>
              <p>Next on your calendar.</p>
            </div>
            <CalendarClock size={20} />
          </div>
          {summary.next.length ? (
            <ul>
              {summary.next.map((event) => (
                <li key={event.id}>
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <time
                      className="agenda-date"
                      dateTime={event.date.toISOString()}
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
                    </time>
                    <div>
                      <small>{formatTime(event.date)}</small>
                      <h3>{event.title}</h3>
                      <p>
                        <MapPin size={12} />
                        {event.location}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="agenda-empty">No upcoming events scheduled.</p>
          )}
          <Link href="/admin/events?status=upcoming" className="text-link">
            View upcoming events <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </>
  );
}
