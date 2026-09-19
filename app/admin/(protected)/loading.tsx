export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading workspace">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-table" />
      <span className="sr-only" role="status">
        Loading workspace...
      </span>
    </div>
  );
}
