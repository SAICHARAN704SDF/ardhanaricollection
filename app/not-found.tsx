import Link from "next/link";
export default function NotFound() {
  return (
    <section className="empty-state page-section">
      <p className="eyebrow">A THREAD OUT OF PLACE / 404</p>
      <h1>Let’s find your way back.</h1>
      <p>This page is not part of our collection.</p>
      <Link href="/shop" className="button primary">
        Explore the collection
      </Link>
    </section>
  );
}
