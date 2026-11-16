import type { Product, Collection } from "@/types/commerce";
export type Publication = "draft" | "published" | "archived";
export type ProductEntry = Product & { publication: Publication };
export type CollectionEntry = Collection & { publication: Publication };
export type CatalogData = {
  revision: number;
  products: ProductEntry[];
  collections: CollectionEntry[];
};
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function storefront(data: CatalogData) {
  const collections = data.collections.filter(
    (c) => c.publication === "published",
  );
  return {
    collections,
    products: data.products
      .filter((p) => p.publication === "published")
      .map((p) => ({
        ...p,
        collections: p.collections.filter((s) =>
          collections.some((c) => c.slug === s),
        ),
      })),
  };
}
export function validateEntry(
  kind: "product" | "collection",
  input: unknown,
): ProductEntry | CollectionEntry {
  if (!input || typeof input !== "object") throw new Error("Invalid entry.");
  const p = input as Record<string, unknown>;
  const text = (key: string, required = false, max = 3000) => {
    const value = p[key];
    if (
      typeof value !== "string" ||
      value.length > max ||
      (required && !value.trim())
    )
      throw new Error(`Please check ${key}.`);
    return value.trim();
  };
  const name = text("name", true, 120),
    slug = text("slug", true, 120);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error("Use letters, numbers and hyphens for the URL.");
  const publication = p.publication;
  if (!["draft", "published", "archived"].includes(String(publication)))
    throw new Error("Invalid visibility.");
  const strings = (key: string) => {
    const list = p[key];
    if (
      !Array.isArray(list) ||
      list.length > 30 ||
      list.some((v) => typeof v !== "string" || v.length > 300)
    )
      throw new Error(`Please check ${key}.`);
    return (list as string[]).map((v) => v.trim()).filter(Boolean);
  };
  const image = (src: unknown) => {
    if (
      typeof src !== "string" ||
      src.length > 1600000 ||
      !(
        /^\/(?:images|api/media)\/[a-zA-Z0-9/_.-]+$/.test(src) ||
        /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(src)
      )
    )
      throw new Error("Choose a JPG, PNG or WebP image.");
    return src;
  };
  if (kind === "collection")
    return {
      name,
      slug,
      description: text("description", publication === "published"),
      image:
        publication !== "published" && p.image === "" ? "" : image(p.image),
      publication: publication as Publication,
      sample: p.sample === true,
    };
  const price = Number(p.price);
  if (
    !Number.isFinite(price) ||
    price < 0 ||
    (publication === "published" && price === 0) ||
    price > 10000000
  )
    throw new Error("Enter a price between ₹0.01 and ₹1,00,00,000.");
  const fabrics = [
    "Kanjivaram Silk",
    "Banarasi Silk",
    "Organza",
    "Chiffon & Georgette",
    "Cotton Classics",
  ];
  if (!fabrics.includes(String(p.fabric))) throw new Error("Choose a fabric.");
  if (
    !Array.isArray(p.images) ||
    (publication === "published" && p.images.length < 1) ||
    p.images.length > 6
  )
    throw new Error("Add between one and six product photos.");
  const images = p.images.map((v: Record<string, unknown>) => ({
    src: image(v.src),
    alt: typeof v.alt === "string" ? v.alt.slice(0, 200) : name,
  }));
  if (
    !Array.isArray(p.variants) ||
    !p.variants.length ||
    p.variants.length > 12
  )
    throw new Error("Add at least one colour.");
  const variants = p.variants.map((v: Record<string, unknown>) => {
    if (
      typeof v.id !== "string" ||
      typeof v.name !== "string" ||
      (publication === "published" && !v.name.trim()) ||
      !/^#[a-fA-F0-9]{6}$/.test(String(v.hex))
    )
      throw new Error("Check colour names and swatches.");
    return {
      id: v.id.slice(0, 120),
      name: v.name.slice(0, 80),
      hex: String(v.hex),
      available: v.available === true,
      stock: Number.isInteger(v.stock) && Number(v.stock)>=0 ? Number(v.stock) : 0,
    };
  });
  const result: ProductEntry = {
    id: text("id", true, 120),
    name,
    slug,
    publication: publication as Publication,
    price,
    currency: "INR",
    collections: strings("collections"),
    category: text("category"),
    fabric: p.fabric as Product["fabric"],
    shortDescription: text("shortDescription", publication === "published"),
    story: text("story"),
    composition: text("composition"),
    feel: text("feel"),
    weave: text("weave"),
    design: text("design"),
    border: text("border"),
    pallu: text("pallu"),
    blouse: text("blouse"),
    dimensions: text("dimensions"),
    care: strings("care"),
    occasions: strings("occasions"),
    style: p.style === "Contemporary" ? "Contemporary" : "Traditional",
    drape: p.drape === "Structured" ? "Structured" : "Lightweight",
    variants,
    images,
    macroImages: [],
    videos: [],
    inventory: p.inventory === "unavailable" ? "unavailable" : "available",
    featured: p.featured === true,
    newArrival: p.newArrival === true,
    sample: p.sample === true,
    seo: { title: name, description: String(p.shortDescription).slice(0, 180) },
  };
  if (
    publication === "published" &&
    (!result.collections.length ||
      !result.composition ||
      !result.dimensions ||
      !result.care.length)
  )
    throw new Error(
      "To publish, add a collection, fabric composition, dimensions and care instructions.",
    );
  if (p.weight !== undefined && p.weight !== "") {
    const n = Number(p.weight);
    if (!Number.isFinite(n) || n <= 0)
      throw new Error("Weight must be positive.");
    result.weight = n;
  }
  return result;
}
