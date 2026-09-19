import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarCheck2,
  CalendarClock,
  Plus,
} from "lucide-react";
import { eventService } from "@/lib/services/events";
import { requireAdminPage } from "@/lib/auth/session";
import { StatusBadge, EmptyState } from "@/components/events";
import { formatDate } from "@/lib/events";

export const metadata = { title: "Admin overview" };
export default async function Dashboard() {
  await requireAdminPage();
  const summary = await eventService.summary();
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>Overview</h1>
          <p>A snapshot of your IEEE ITB events.</p>
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
          },
          {
            label: "Upcoming & ongoing",
            value: summary.upcoming,
            icon: CalendarClock,
            className: "green",
            href: "/admin/events?status=upcoming",
          },
          {
            label: "Completed events",
            value: summary.completed,
            icon: CalendarCheck2,
            className: "gold",
            href: "/admin/events?status=past",
          },
        ].map(({ label, value, icon: Icon, className, href }) => (
          <Link key={label} href={href} className="stat">
            <div>
              <p>{label}</p>
              <strong>{value.toString().padStart(2, "0")}</strong>
            </div>
            <span className={`stat-icon ${className}`}>
              <Icon size={22} />
            </span>
          </Link>
        ))}
      </div>
      <section className="admin-section">
        <div className="section-heading compact">
          <div>
            <h2>Recently updated</h2>
            <p>The latest activity across your events.</p>
          </div>
          <Link href="/admin/events" className="text-link">
            Manage events <ArrowRight size={16} />
          </Link>
        </div>
        {summary.recent.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Open event</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.recent.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <Link
                        className="table-title"
                        href={`/admin/events/${event.id}/edit`}
                      >
                        {event.title}
                      </Link>
                      <small>{event.location}</small>
                    </td>
                    <td>{formatDate(event.date)}</td>
                    <td>
                      <StatusBadge status={event.status} />
                    </td>
                    <td>
                      <Link
                        className="icon-button"
                        href={`/admin/events/${event.id}/edit`}
                        title={`Edit ${event.title}`}
                        aria-label={`Edit ${event.title}`}
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </>
  );
}
