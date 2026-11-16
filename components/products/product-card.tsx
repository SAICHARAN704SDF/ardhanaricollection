"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Heart, Plus, ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/commerce";
import { useShoppingAuth } from "@/components/auth/shopping-auth";
import { useShop } from "@/stores/shop";
import { money } from "@/lib/utils/commerce";
export function ProductCard({
  product: p,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const saved = useShop((s) => s.wishlist.includes(p.id));
  const toggle = useShop((s) => s.toggleWish);
  const { add, pending, ready } = useShoppingAuth();
  return (
    <article className="product-card">
      <div className="product-visual">
        <Link
          href={`/products/${p.slug}`}
          scroll={false}
          className="product-image-link"
          aria-label={`Explore ${p.name}`}
        >
          <motion.div
            layoutId={`product-${p.id}`}
            transition={{ duration: 0.35 }}
            className="product-image-wrap"
          >
            <Image
              src={p.images[0].src}
              alt={p.images[0].alt}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
              className="product-image"
            />
          </motion.div>
          <span className="quick-view">
            Discover the drape <ArrowUpRight size={15} />
          </span>
        </Link>
        <span className="product-tag">
          {p.inventory === "unavailable"
            ? "Unavailable"
            : p.newArrival
              ? "THE NEW EDIT"
              : "SAMPLE CATALOG"}
        </span>
        <button
          className={`wish-button ${saved ? "saved" : ""}`}
          onClick={() => toggle(p.id)}
          aria-label={`${saved ? "Remove" : "Save"} ${p.name} ${saved ? "from" : "to"} wishlist`}
          aria-pressed={saved}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <span className="tiny uppercase">{p.fabric}</span>
          <Link href={`/products/${p.slug}`} scroll={false}>
            <h3>{p.name}</h3>
          </Link>
          <p>{money(p.price)}</p>
        </div>
        <button
          className="icon-button add-small"
          onClick={() => add(p.id, p.variants[0].id)}
          disabled={p.inventory === "unavailable" || pending || !ready}
          aria-label={`Add ${p.name} to bag`}
        >
          <Plus size={19} />
        </button>
      </div>
      <div className="product-swatches">
        {p.variants.map((v) => (
          <span key={v.id} title={v.name} style={{ background: v.hex }} />
        ))}
        <span className="sample-caption">{p.sample ? "AI concept" : "Ardhanari collection"}</span>
      </div>
    </article>
  );
}
