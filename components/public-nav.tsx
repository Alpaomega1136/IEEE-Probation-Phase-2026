"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="public-header">
      <div className="container nav-inner">
        <Brand />
        <button
          className="icon-button menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="public-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="public-menu"
          aria-label="Main navigation"
          className={open ? "public-nav is-open" : "public-nav"}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/events", label: "Events" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                (href === "/" ? pathname === href : pathname.startsWith(href))
                  ? "active"
                  : ""
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="nav-admin"
            onClick={() => setOpen(false)}
          >
            Admin Login <ArrowUpRight size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
