import Image from "next/image";
import { notFound } from "next/navigation";
import { publicCatalog } from "@/lib/catalog/repository";
export const dynamic = "force-dynamic";
import { Catalog } from "@/components/products/catalog";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products, collections } = await publicCatalog();
  const c = collections.find((c) => c.slug === slug);
  return c ? pageMetadata(c.name, c.description, `/collections/${slug}`) : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products, collections } = await publicCatalog();
  const c = collections.find((c) => c.slug === slug);
  if (!c) notFound();
  return (
    <>
      <section className="collection-banner">
        <div>
          <p className="eyebrow">THE ARDHANARI EDIT</p>
          <h1>{c.name}</h1>
          <p>{c.description}</p>
          <span className="tiny">
            {c.sample ? "Sample collection · AI-generated editorial" : "The Ardhanari collection"}
          </span>
        </div>
        <div className="collection-banner-image">
          <Image
            src={c.image}
            alt={c.sample ? `AI-generated concept imagery for ${c.name}` : c.name}
            fill
            sizes="50vw"
            priority
          />
        </div>
      </section>
      <section className="section">
        <Catalog
          products={products.filter((p) => p.collections.includes(slug))}
        />
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Collections",
                item: `${siteUrl}/collections`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: c.name,
                item: `${siteUrl}/collections/${slug}`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
