import Link from "next/link";
import { Catalog } from "@/components/products/catalog";
import { publicCatalog } from "@/lib/catalog/repository";
export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "All sarees",
  "Explore and filter the Ardhanari sample saree catalog.",
  "/shop",
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const [{products, collections}, params] = await Promise.all([publicCatalog(), searchParams]);
  return (
    <section className="section page-section">
      <div className="shop-heading">
        <p className="eyebrow">THE ARDHANARI COLLECTION</p>
        <h1>
          A drape for <em>every chapter.</em>
        </h1>
        <p>
          Considered fabrics. Expressive details. A little of you in every fold.
        </p>
      </div>
      <nav className="collection-tabs">
        <Link href="/shop" className="active">
          All sarees
        </Link>
        {collections.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`}>
            {c.name}
          </Link>
        ))}
      </nav>
      <Catalog products={products} initialSearch={params.search ?? ""} />
    </section>
  );
}
