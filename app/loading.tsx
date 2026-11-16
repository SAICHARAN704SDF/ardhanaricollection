export default function Loading() {
  return (
    <section className="section" aria-label="Loading collection" role="status">
      <div className="skeleton skeleton-title" />
      <div className="product-grid">
        {[0, 1, 2, 3].map((i) => (
          <div className="skeleton skeleton-card" key={i} />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </section>
  );
}
