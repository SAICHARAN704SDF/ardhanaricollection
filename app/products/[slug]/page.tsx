import Link from "next/link";
import { notFound } from "next/navigation";
import { publicCatalog } from "@/lib/catalog/repository";
export const dynamic = "force-dynamic";
import { ProductDetails } from "@/components/products/product-details";
import { ProductCard } from "@/components/products/product-card";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products, collections } = await publicCatalog();
  const p = products.find(p => p.slug === slug);
  return p
    ? pageMetadata(p.seo.title, p.seo.description, `/products/${slug}`)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products, collections } = await publicCatalog();
  const p = products.find(p => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Sarees</Link>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <ProductDetails product={p} />
      <section className="section">
        <p className="eyebrow">ANOTHER THREAD TO FOLLOW</p>
        <h2>
          You may also <em>love.</em>
        </h2>
        <div className="product-grid">
          {products
            .filter((x) => x.id !== p.id && x.fabric === p.fabric)
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: p.sample ? `${p.name} (sample catalog)` : p.name,
              description: p.seo.description,
              image: p.images[0].src.startsWith("/") ? `${siteUrl}${p.images[0].src}` : undefined,
              sku: p.id,
              brand: { "@type": "Brand", name: "Ardhanari Collection" },
              material: p.composition,
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Sarees",
                  item: `${siteUrl}/shop`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: p.name,
                  item: `${siteUrl}/products/${p.slug}`,
                },
              ],
            },
          ]),
        }}
      />
    </>
  );
}
