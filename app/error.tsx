"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="empty-state page-section">
      <h1>A moment to reweave.</h1>
      <p>We couldn’t load this view. Please try again.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
