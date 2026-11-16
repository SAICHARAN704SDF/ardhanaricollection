"use client";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useShop } from "@/stores/shop";
import { useCatalog, getCatalogProduct as getProductById } from "@/stores/catalog";
import { ProductCard } from "./product-card";
export function Wishlist() {
  const products = useCatalog(s=>s.products);
  const saved = useShop((s) => s.wishlist);
  const items = products.filter((p) => saved.includes(p.id));
  return (
    <section className="section page-section">
      <p className="eyebrow">BEAUTY WORTH COMING BACK TO</p>
      <h1>
        Your <em>wishlist.</em>
      </h1>
      <p className="page-intro">A personal edit, saved on this device.</p>
      {items.length ? (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={36} strokeWidth={1} />
          <h2>Leave a little room for love.</h2>
          <p>Tap the heart on any saree to save it here.</p>
          <Link href="/shop" className="button primary">
            Find your favourites <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
