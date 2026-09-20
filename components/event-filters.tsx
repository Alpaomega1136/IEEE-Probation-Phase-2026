"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";

export function EventFilters({
  search,
  status,
  base,
  admin = false,
  view,
}: {
  search: string;
  status: string;
  base: string;
  admin?: boolean;
  view?: string;
}) {
  const clearHref =
    view && admin ? `${base}?${new URLSearchParams({ view })}` : base;
  return (
    <form action={base} className="filters" role="search">
      <div className="search-input">
        <Search size={18} />
        <label className="sr-only" htmlFor="event-search">
          Search events
        </label>
        <input
          key={search}
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
      {view && <input type="hidden" name="view" value={view} />}
      <label className="sr-only" htmlFor="event-status">
        Filter by status
      </label>
      <select
        id="event-status"
        name="status"
        defaultValue={status}
        aria-label="Filter by status"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="all">All events</option>
        <option value="upcoming">Upcoming & ongoing</option>
        {admin && <option value="ONGOING">Ongoing</option>}
        <option value="past">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      {(search || status !== "all") && (
        <Link
          href={clearHref}
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
