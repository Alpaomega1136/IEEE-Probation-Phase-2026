import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main-content" className="error-state">
      <p className="eyebrow">404 / Not found</p>
      <h1>This page is missing.</h1>
      <p>The event may have been removed, or the link is incorrect.</p>
      <Link href="/events" className="button button-primary">
        <ArrowLeft size={17} />
        Back to events
      </Link>
    </main>
  );
}
