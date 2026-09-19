"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, LoaderCircle, TriangleAlert } from "lucide-react";

export function DeleteEvent({ id, title }: { id: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error?.message || "Could not delete this event.");
        return;
      }
      dialog.current?.close();
      router.push("/admin/events?notice=deleted");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <button
        className="icon-button danger-icon"
        title={`Delete ${title}`}
        aria-label={`Delete ${title}`}
        onClick={() => {
          setError("");
          dialog.current?.showModal();
        }}
      >
        <Trash2 size={17} />
      </button>
      <dialog
        ref={dialog}
        className="delete-dialog"
        aria-labelledby={`delete-heading-${id}`}
        aria-describedby={`delete-description-${id}`}
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <div className="delete-icon">
          <TriangleAlert size={24} />
        </div>
        <h2 id={`delete-heading-${id}`}>Delete event?</h2>
        <p id={`delete-description-${id}`}>
          Are you sure you want to delete <strong>{title}</strong>? This action
          cannot be undone.
        </p>
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            autoFocus
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            Cancel
          </button>
          <button
            className="button button-danger"
            disabled={pending}
            onClick={remove}
          >
            {pending ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Trash2 size={17} />
            )}
            {pending ? "Deleting..." : "Delete event"}
          </button>
        </div>
      </dialog>
    </>
  );
}
