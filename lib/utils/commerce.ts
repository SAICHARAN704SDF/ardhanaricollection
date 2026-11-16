import type { CartLine, Product } from "@/types/commerce";
export const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
export function totals(lines: CartLine[], catalog: Product[], coupon = "") {
  const subtotal = lines.reduce(
    (sum, line) =>
      sum +
      (catalog.find((p) => p.id === line.productId)?.price ?? 0) *
        line.quantity,
    0,
  );
  const discount =
    coupon.trim().toUpperCase() === "DRAPE10" ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, discount, total: subtotal - discount };
}
export interface ProductFilters {
  search: string;
  fabric: string;
  color: string;
  occasion: string;
  availability: string;
  maxPrice: number;
  sort: string;
}
export function filterProducts(catalog: Product[], f: ProductFilters) {
  return catalog
    .filter(
      (p) =>
        (!f.search ||
          `${p.name} ${p.fabric} ${p.shortDescription}`
            .toLowerCase()
            .includes(f.search.toLowerCase())) &&
        (!f.fabric || p.fabric === f.fabric) &&
        (!f.color || p.variants.some((v) => v.name === f.color)) &&
        (!f.occasion || p.occasions.includes(f.occasion)) &&
        (!f.availability || p.inventory === f.availability) &&
        p.price <= f.maxPrice,
    )
    .sort((a, b) =>
      f.sort === "price-asc"
        ? a.price - b.price
        : f.sort === "price-desc"
          ? b.price - a.price
          : f.sort === "name"
            ? a.name.localeCompare(b.name)
            : Number(b.newArrival) - Number(a.newArrival),
    );
}
export interface QuizAnswers {
  occasion: string;
  budget: number;
  fabric: string;
  color: string;
  style: string;
  drape: string;
}
export function recommend(catalog: Product[], a: QuizAnswers) {
  return catalog
    .filter((p) => p.inventory === "available" && p.price <= a.budget)
    .map((p) => ({
      product: p,
      score:
        Number(p.occasions.includes(a.occasion)) * 3 +
        Number(p.fabric === a.fabric) * 3 +
        Number(p.variants.some((v) => v.name === a.color)) * 2 +
        Number(p.style === a.style) * 2 +
        Number(p.drape === a.drape) * 2,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.product);
}
