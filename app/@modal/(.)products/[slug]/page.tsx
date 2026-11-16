import { notFound } from "next/navigation";
import { publicCatalog } from "@/lib/catalog/repository";
export const dynamic = "force-dynamic";
import { Reveal } from "@/components/products/reveal";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (await publicCatalog()).products.find(p => p.slug === slug);
  if (!product) notFound();
  return <Reveal product={product} />;
}
