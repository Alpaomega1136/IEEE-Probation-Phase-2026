export default function Loading() {
  return (
    <main
      className="container page-content"
      aria-busy="true"
      aria-label="Loading events"
    >
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="event-grid skeleton-grid">
        {[1, 2, 3].map((item) => (
          <div className="skeleton skeleton-card" key={item} />
        ))}
      </div>
      <span className="sr-only" role="status">
        Loading events...
      </span>
    </main>
  );
}
