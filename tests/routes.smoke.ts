import assert from "node:assert/strict";
import { products, collections } from "../lib/mock-data/catalog";
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const routes = [
  "/",
  "/shop",
  "/collections",
  "/wishlist",
  "/cart",
  "/checkout",
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
  "/admin",
  "/account",
  "/account/profile",
  "/account/addresses",
  "/account/orders",
  "/account/sign-in",
  "/account/sign-up",
  "/robots.txt",
  "/sitemap.xml",
  ...products.map((p) => `/products/${p.slug}`),
  ...collections.map((c) => `/collections/${c.slug}`),
  ...Array.from({ length: 5 }, (_, i) => `/images/heritage-saree-${i}.jpg`),
  "/images/silk-sculpture.svg",
  "/images/heritage-hero.jpg",
  "/images/heritage-textiles.jpg",
];
async function main() {
  for (let i = 0; i < routes.length; i += 6) {
    await Promise.all(
      routes.slice(i, i + 6).map(async (path) => {
        const response = await fetch(`${origin}${path}`);
        assert.equal(response.status, 200, `${path} should load`);
        if (path.startsWith("/products/")) {
          const html = await response.text();
          assert.ok(
            html.includes("application/ld+json"),
            `${path} needs product structured data`,
          );
          assert.ok(
            html.includes("Sample catalog."),
            `${path} needs server-rendered demo disclosure`,
          );
        }
      }),
    );
  }
  const missing = await fetch(`${origin}/products/not-a-real-product`);
  // App Router may have begun streaming the shared loading boundary before notFound().
  assert.ok([200,404].includes(missing.status));
  const missingHtml = await missing.text();
  assert.ok(missingHtml.includes('This page is not part of our collection.'));
  assert.ok(missingHtml.includes('noindex'));
  console.log(
    `Passed ${routes.length} route/asset checks and unknown-product not-found check.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
