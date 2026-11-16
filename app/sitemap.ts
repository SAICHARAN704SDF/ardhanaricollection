import type { MetadataRoute } from "next";
import { publicCatalog } from "@/lib/catalog/repository";
export const dynamic = "force-dynamic";
import { siteUrl } from "@/lib/seo";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, collections } = await publicCatalog();
  return [
    "/",
    "/shop",
    "/collections",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/care",
    "/service",
    "/brand-standards",
    "/privacy",
    "/terms",
    ...products.map((p) => `/products/${p.slug}`),
    ...collections.map((c) => `/collections/${c.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
