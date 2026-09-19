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
            <p>Connecting minds. Advancing technology.</p>
          </div>
          <nav aria-label="Footer navigation">
            <Link href="/events">Events</Link>
            <Link href="/about">About IEEE ITB</Link>
            <Link href="/admin/login">
              Admin <ArrowUpRight size={14} />
            </Link>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>IEEE ITB Student Branch</span>
          <span>Bandung, Indonesia</span>
          <span>Advancing Technology for Humanity</span>
        </div>
      </footer>
    </div>
  );
}
