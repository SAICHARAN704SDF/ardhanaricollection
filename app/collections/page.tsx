import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { publicCatalog } from "@/lib/catalog/repository";
export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "The collections",
  "Explore eight thoughtfully composed sample saree collections.",
  "/collections",
);
export default async function Page() {
  const { collections } = await publicCatalog();
  return (
    <section className="section page-section">
      <p className="eyebrow">EXPRESSIONS OF ELEGANCE</p>
      <h1>
        The <em>collections.</em>
      </h1>
      <p className="page-intro">
        A world of textures, colours and occasions, waiting to unfold.
      </p>
      <div className="all-collections">
        {collections.map((c, i) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="collection-card"
          >
            <Image
              src={c.image}
              alt={c.sample ? `AI-generated ${c.name} concept editorial` : c.name}
              fill
              sizes="(max-width:700px) 100vw, 50vw"
            />
            <div className="collection-card-copy">
              <span>{String(i + 1).padStart(2, "0")} / {c.sample ? "AI CONCEPT EDITORIAL" : "THE COLLECTION"}</span>
              <h2>{c.name}</h2>
              <p>{c.description}</p>
              <ArrowUpRight size={24} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
