"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LoaderCircle,
  Save,
  MapPin,
  CalendarDays,
  ImageIcon,
  Upload,
  Link2,
  X,
} from "lucide-react";
import { EventImage } from "@/components/event-image";
import { ImageFilePicker } from "@/components/image-file-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
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
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string[] | undefined>>(
    {},
  );
  const [description, setDescription] = useState(event?.description ?? "");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [urlDraft, setUrlDraft] = useState("");
  const [pickerError, setPickerError] = useState("");
  const [preview, setPreview] = useState({
    title: event?.title ?? "",
    location: event?.location ?? "",
    date: event?.date ?? "",
    status: (event?.status ?? "UPCOMING") as EventStatus,
  });
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const previewDate = new Date(fromDateTimeInput(preview.date));
  const hasDate = !Number.isNaN(previewDate.getTime());
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
    const input = {
      ...raw,
      description,
      imageUrl: imageFile ? "" : imageUrl,
      date: fromDateTimeInput(String(raw.date)),
    };
    const parsed = eventInputSchema.safeParse(input);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFields(errors);
      const name = Object.keys(errors)[0];
      if (name === "description")
        document
          .querySelector<HTMLElement>(".rich-editor .ProseMirror")
          ?.focus();
      else if (name === "imageUrl")
        document.getElementById("cover-picker")?.focus();
      else
        (
          e.currentTarget.elements.namedItem(name) as HTMLElement | null
        )?.focus();
      return;
    }
    setPending(true);
    let uploadedUrl = "";
    try {
      if (imageFile) {
        const data = new FormData();
        data.set("image", imageFile);
        const upload = await fetch("/api/uploads", {
          method: "POST",
          body: data,
        });
        const result = await upload.json();
        if (!upload.ok)
          throw new Error(
            result.error?.message || "Could not upload the image.",
          );
        uploadedUrl = result.data.url;
      }
      const response = await fetch(
        event ? `/api/events/${event.id}` : "/api/events",
        {
          method: event ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsed.data,
            imageUrl: uploadedUrl || parsed.data.imageUrl,
          }),
        },
      );
      if (!response.ok) {
        const result = await response.json();
        setFields(result.error?.fields || {});
        throw new Error(result.error?.message || "Could not save this event.");
      }
      uploadedUrl = "";
      router.push(`/admin/events?notice=${event ? "updated" : "created"}`);
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to connect. Please try again.",
      );
      setPending(false);
      if (uploadedUrl)
        await fetch(uploadedUrl, { method: "DELETE" }).catch(() => {});
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
          target instanceof HTMLSelectElement
        ) {
          if (fields[target.name])
            setFields((current) => ({ ...current, [target.name]: undefined }));
        }
        setPreview({
          title: String(values.get("title") ?? ""),
          location: String(values.get("location") ?? ""),
          date: String(values.get("date") ?? ""),
          status: String(values.get("status") ?? "UPCOMING") as EventStatus,
        });
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
            <div className="field">
              <label>
                Description <span>*</span>
              </label>
              <RichTextEditor
                value={description}
                onChange={(value) => {
                  setDescription(value);
                  setFields((current) => ({
                    ...current,
                    description: undefined,
                  }));
                }}
                invalid={!!fields.description}
              />
              {fieldError("description")}
            </div>
            <div className="field">
              <span className="field-label">Cover image</span>
              <div className="cover-picker-row">
                <button
                  id="cover-picker"
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setUrlDraft(imageFile ? "" : imageUrl);
                    setPickerError("");
                    dialog.current?.showModal();
                  }}
                >
                  <ImageIcon size={16} />{" "}
                  {imageUrl || imageFile ? "Change image" : "Choose image"}
                </button>
                {(imageUrl || imageFile) && (
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Remove cover image"
                    title="Remove cover image"
                    onClick={() => {
                      setImageFile(null);
                      setLocalPreview("");
                      setImageUrl("");
                    }}
                  >
                    <X size={17} />
                  </button>
                )}
                <span>
                  {imageFile?.name ||
                    (imageUrl ? "Image selected" : "No image selected")}
                </span>
              </div>
              {fieldError("imageUrl")}
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
            key={localPreview || imageUrl}
            src={localPreview || imageUrl || null}
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
      </aside>
      <dialog
        ref={dialog}
        className="image-dialog"
        aria-labelledby="image-dialog-title"
        onClose={() => setPickerError("")}
      >
        <div className="image-dialog-header">
          <h2 id="image-dialog-title">Choose cover image</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close image dialog"
            onClick={() => dialog.current?.close()}
          >
            <X size={18} />
          </button>
        </div>
        <div className="image-mode" role="group" aria-label="Image source">
          <button
            type="button"
            className={imageMode === "upload" ? "active" : ""}
            aria-pressed={imageMode === "upload"}
            onClick={() => {
              setImageMode("upload");
              setPickerError("");
            }}
          >
            <Upload size={16} /> Upload photo
          </button>
          <button
            type="button"
            className={imageMode === "url" ? "active" : ""}
            aria-pressed={imageMode === "url"}
            onClick={() => {
              setImageMode("url");
              setPickerError("");
            }}
          >
            <Link2 size={16} /> Image URL
          </button>
        </div>
        {imageMode === "upload" ? (
          <div className="field" key="upload">
            <ImageFilePicker
              id="image-file"
              fileName={imageFile?.name}
              onChange={(file) => {
                if (!file) return;
                if (
                  file.size > 5 * 1024 * 1024 ||
                  !["image/jpeg", "image/png", "image/webp"].includes(file.type)
                ) {
                  setPickerError(
                    "Choose a JPEG, PNG, or WebP image smaller than 5 MB.",
                  );
                  return;
                }
                setImageFile(file);
                setLocalPreview(URL.createObjectURL(file));
                setImageUrl("");
                setPickerError("");
                dialog.current?.close();
              }}
            />
          </div>
        ) : (
          <div className="field" key="url">
            <label htmlFor="image-link">Image URL (HTTPS)</label>
            <input
              id="image-link"
              type="url"
              value={urlDraft}
              placeholder="https://example.com/event.jpg"
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("apply-image-url")?.click();
                }
              }}
            />
            <button
              id="apply-image-url"
              type="button"
              className="button button-primary"
              onClick={() => {
                const url = urlDraft.trim();
                if (
                  !url ||
                  !eventInputSchema.shape.imageUrl.safeParse(url).success
                ) {
                  setPickerError("Enter a valid HTTPS image URL.");
                  return;
                }
                setImageUrl(url);
                setImageFile(null);
                setLocalPreview("");
                setFields((current) => ({ ...current, imageUrl: undefined }));
                dialog.current?.close();
              }}
            >
              Use image
            </button>
          </div>
        )}
        {pickerError && (
          <p className="field-error" role="alert">
            {pickerError}
          </p>
        )}
      </dialog>
    </form>
  );
}
