"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  ExternalLink,
  LogOut,
  Menu,
  X,
  LoaderCircle,
} from "lucide-react";
import { Brand } from "@/components/brand";

export function AdminNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);
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
    <>
      <div className="admin-mobile-bar">
        <Brand admin />
        <button
          ref={toggle}
          className="icon-button"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Close admin menu"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${open ? "is-open" : ""}`}
      >
        <Brand admin />
        <p className="sidebar-label">WORKSPACE</p>
        <nav aria-label="Admin navigation">
          <Link
            href="/admin"
            className={pathname === "/admin" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link
            href="/admin/events"
            className={pathname.startsWith("/admin/events") ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            <CalendarDays size={18} />
            Events
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <Link href="/" className="sidebar-public">
            <ExternalLink size={17} />
            View public site
          </Link>
          <div className="admin-profile">
            <span className="avatar">{name.slice(0, 1).toUpperCase()}</span>
            <span>
              <strong>{name}</strong>
              <small>{email}</small>
            </span>
          </div>
          <button className="logout-button" disabled={pending} onClick={logout}>
            {pending ? (
              <LoaderCircle size={17} className="spin" />
            ) : (
              <LogOut size={17} />
            )}
            Sign out
          </button>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
