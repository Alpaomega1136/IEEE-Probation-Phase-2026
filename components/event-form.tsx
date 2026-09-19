"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LoaderCircle,
  Save,
  MapPin,
  CalendarDays,
  ImageIcon,
} from "lucide-react";
import { EventImage } from "@/components/event-image";
import { StatusBadge } from "@/components/events";
import { eventInputSchema } from "@/lib/validations/event";
import {
  fromDateTimeInput,
  statusLabels,
  formatDate,
  formatTime,
  type EventStatus,
} from "@/lib/events";

type InitialEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  imageUrl: string | null;
};

export function EventForm({ event }: { event?: InitialEvent }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState({
    title: event?.title ?? "",
    location: event?.location ?? "",
    date: event?.date ?? "",
    status: (event?.status ?? "UPCOMING") as EventStatus,
    imageUrl: event?.imageUrl ?? "",
  });
  const previewDate = new Date(fromDateTimeInput(preview.date));
  const hasDate = !Number.isNaN(previewDate.getTime());
  const validImage = eventInputSchema.shape.imageUrl.safeParse(
    preview.imageUrl,
  ).success;
  const [fields, setFields] = useState<Record<string, string[] | undefined>>(
    {},
  );
  const fieldError = (name: string) =>
    fields[name] ? (
      <p className="field-error" id={`${name}-error`}>
        {name === "date" ? "Enter a valid date and time." : fields[name]?.[0]}
      </p>
    ) : null;
  const invalid = (name: string) => ({
    "aria-invalid": !!fields[name],
    "aria-describedby": fields[name] ? `${name}-error` : undefined,
  });
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFields({});
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const input = { ...raw, date: fromDateTimeInput(String(raw.date)) };
    const parsed = eventInputSchema.safeParse(input);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFields(errors);
      const name = Object.keys(errors)[0];
      (e.currentTarget.elements.namedItem(name) as HTMLElement | null)?.focus();
      return;
    }
    setPending(true);
    try {
      const response = await fetch(
        event ? `/api/events/${event.id}` : "/api/events",
        {
          method: event ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        setError(result.error?.message || "Could not save this event.");
        setFields(result.error?.fields || {});
        setPending(false);
        return;
      }
      router.push(`/admin/events?notice=${event ? "updated" : "created"}`);
      router.refresh();
    } catch {
      setError(
        "Unable to connect. Your changes have not been saved. Please try again.",
      );
      setPending(false);
    }
  }
  return (
    <form
      className="event-form"
      onSubmit={submit}
      noValidate
      onChange={(e) => {
        const values = new FormData(e.currentTarget);
        const target = e.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          const name = target.name;
          if (fields[name])
            setFields((current) => ({ ...current, [name]: undefined }));
        }
        setPreview((current) => ({
          title: String(values.get("title") ?? ""),
          location: String(values.get("location") ?? ""),
          date: String(values.get("date") ?? ""),
          status: String(values.get("status") ?? "UPCOMING") as EventStatus,
          imageUrl: current.imageUrl,
        }));
      }}
    >
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <fieldset disabled={pending} className="editor-fields">
        <legend className="sr-only">Event details</legend>
        <div className="form-section">
          <div className="form-section-heading">
            <h2>Event details</h2>
            <p>The essentials for your event.</p>
          </div>
          <div className="form-fields">
            <div className="field">
              <label htmlFor="title">
                Event title <span>*</span>
              </label>
              <input
                id="title"
                name="title"
                defaultValue={event?.title}
                placeholder="e.g. IEEE Technology Conference"
                required
                maxLength={120}
                {...invalid("title")}
              />
              {fieldError("title")}
            </div>
            <div className="field">
              <label htmlFor="description">
                Description <span>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={event?.description}
                placeholder="What can attendees look forward to?"
                rows={7}
                required
                maxLength={10000}
                {...invalid("description")}
              />
              {fieldError("description")}
            </div>
            <div className="field">
              <label htmlFor="imageUrl">
                Cover image URL <span className="optional">Optional</span>
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                defaultValue={event?.imageUrl ?? ""}
                onBlur={(e) => {
                  const imageUrl = e.currentTarget.value.trim();
                  setPreview((current) => ({ ...current, imageUrl }));
                }}
                placeholder="https://example.com/event.jpg"
                maxLength={2048}
                {...invalid("imageUrl")}
              />
              {fieldError("imageUrl")}
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-section-heading">
            <h2>When & where</h2>
            <p>Schedule, venue, and event status.</p>
          </div>
          <div className="form-fields">
            <div className="form-row">
              <div className="field">
                <label htmlFor="date">
                  Date & time (WIB) <span>*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="datetime-local"
                  defaultValue={event?.date}
                  required
                  {...invalid("date")}
                />
                {fieldError("date")}
              </div>
              <div className="field">
                <label htmlFor="status">
                  Status <span>*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={event?.status ?? "UPCOMING"}
                  {...invalid("status")}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {fieldError("status")}
              </div>
            </div>
            <div className="field">
              <label htmlFor="location">
                Location <span>*</span>
              </label>
              <input
                id="location"
                name="location"
                defaultValue={event?.location}
                placeholder="e.g. Aula Barat, ITB"
                required
                maxLength={160}
                {...invalid("location")}
              />
              {fieldError("location")}
            </div>
          </div>
        </div>
      </fieldset>
      <aside className="editor-preview" aria-label="Event preview">
        <div className="preview-heading">
          <ImageIcon size={16} />
          <h2>Event preview</h2>
        </div>
        <div className="preview-event">
          <EventImage
            key={preview.imageUrl}
            src={validImage ? preview.imageUrl : null}
            alt="Event cover preview"
          />
          <div className="preview-event-body">
            <StatusBadge status={preview.status} />
            <h3>{preview.title || "Your next great event"}</h3>
            <p>
              <CalendarDays size={15} />
              {hasDate
                ? `${formatDate(previewDate)} / ${formatTime(previewDate)}`
                : "Date to be confirmed"}
            </p>
            <p>
              <MapPin size={15} />
              {preview.location || "Location to be confirmed"}
            </p>
          </div>
        </div>
        <dl className="preview-summary">
          <div>
            <dt>Organizer</dt>
            <dd>IEEE ITB Student Branch</dd>
          </div>
          <div>
            <dt>Time zone</dt>
            <dd>Asia/Jakarta (WIB)</dd>
          </div>
          {event && (
            <div>
              <dt>Visibility</dt>
              <dd>Public event</dd>
            </div>
          )}
        </dl>
      </aside>
      <div className="form-actions">
        <Link
          href="/admin/events"
          className="button button-secondary"
          aria-disabled={pending}
          onClick={(e) => {
            if (pending) e.preventDefault();
          }}
        >
          Cancel
        </Link>
        <button
          className="button button-primary"
          type="submit"
          disabled={pending}
        >
          {pending ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <Save size={17} />
          )}
          {pending ? "Saving..." : event ? "Save changes" : "Create event"}
        </button>
      </div>
    </form>
  );
}
