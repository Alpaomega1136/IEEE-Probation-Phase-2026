import { Search, X } from "lucide-react";
import Link from "next/link";

export function EventFilters({
  search,
  status,
  base,
  admin = false,
}: {
  search: string;
  status: string;
  base: string;
  admin?: boolean;
}) {
  return (
    <form action={base} className="filters" role="search">
      <div className="search-input">
        <Search size={18} />
        <label className="sr-only" htmlFor="event-search">
          Search events
        </label>
        <input
          id="event-search"
          name="search"
          placeholder="Search events..."
          defaultValue={search}
          maxLength={120}
        />
        <button
          className="icon-button"
          aria-label="Search events"
          title="Search events"
          type="submit"
        >
          <Search size={17} />
        </button>
      </div>
      <label className="sr-only" htmlFor="event-status">
        Filter by status
      </label>
      <select
        id="event-status"
        name="status"
        defaultValue={status}
        aria-label="Filter by status"
      >
        <option value="all">All events</option>
        <option value="upcoming">Upcoming & ongoing</option>
        <option value="past">Past events</option>
        {admin && (
          <>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </>
        )}
        <option value="CANCELLED">Cancelled</option>
      </select>
      <button className="button button-secondary" type="submit">
        Apply
      </button>
      {(search || status !== "all") && (
        <Link
          href={base}
          className="icon-button"
          aria-label="Clear filters"
          title="Clear filters"
        >
          <X size={18} />
        </Link>
      )}
    </form>
  );
}
