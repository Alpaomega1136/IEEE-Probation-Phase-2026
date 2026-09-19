"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="error-state">
      <TriangleAlert size={36} />
      <h1>Unable to load this page</h1>
      <p>Something went wrong. Please try again in a moment.</p>
      <button className="button button-primary" onClick={reset}>
        <RotateCcw size={17} />
        Try again
      </button>
    </main>
  );
}
