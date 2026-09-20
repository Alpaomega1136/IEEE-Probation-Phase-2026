import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { Brand } from "@/components/brand";
import "./public.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site">
      <PublicNav />
      {children}
      <footer className="public-footer">
        <div className="container footer-top">
          <div>
            <Brand />
          </div>
          <nav aria-label="Footer navigation">
            <Link href="/events">Events</Link>
            <Link href="/about">About IEEE ITB</Link>
            <Link href="/admin/login">
              Admin <ArrowUpRight size={14} />
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
