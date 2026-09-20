"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { Brand } from "@/components/brand";

export function AdminNav({ name, email }: { name: string; email: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    setPending(true);
    setError("");
    try {
      await signOut({ callbackUrl: "/admin/login" });
    } catch {
      setError("Sign out failed. Please try again.");
      setPending(false);
    }
  }

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <Brand admin />
        <nav className="admin-topbar-actions" aria-label="Admin actions">
          <details
            className="account-menu"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                event.currentTarget.open = false;
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}
          >
            <summary
              aria-label={`Account menu for ${name}`}
              title="Account menu"
            >
              <span className="avatar">{name.slice(0, 1).toUpperCase()}</span>
            </summary>
            <div className="account-popover">
              <strong>{name}</strong>
              <small>{email}</small>
              <button type="button" disabled={pending} onClick={logout}>
                {pending ? (
                  <LoaderCircle size={17} className="spin" />
                ) : (
                  <LogOut size={17} />
                )}
                {pending ? "Signing out..." : "Sign out"}
              </button>
              {error && (
                <p className="field-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
