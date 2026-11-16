"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/stores/shop";
import { useCatalog, getCatalogProduct as getProductById } from "@/stores/catalog";
import { money, totals } from "@/lib/utils/commerce";
import { Quantity } from "@/components/layout/primitives";
export function CartContents({ drawer = false }: { drawer?: boolean }) {
  const products = useCatalog(s=>s.products);
  const lines = useShop((s) => s.lines),
    update = useShop((s) => s.update),
    changeVariant = useShop((s) => s.changeVariant),
    setBag = useShop((s) => s.setBag);
  const total = totals(lines, products);
  return (
    <div className={drawer ? "drawer-content" : "cart-page"}>
      <p className="eyebrow">A LITTLE BEAUTY, SET ASIDE</p>
      <h1>
        Your bag <sup>{lines.reduce((s, l) => s + l.quantity, 0)}</sup>
      </h1>
      {!lines.length ? (
        <div className="empty-state">
          <ShoppingBag size={38} strokeWidth={1} />
          <h2>Your next favourite awaits.</h2>
          <p>Find a drape that feels like you.</p>
          <Link
            href="/shop"
            className="button primary"
            onClick={() => setBag(false)}
          >
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {lines.map((l) => {
              const p = getProductById(l.productId);
              if (!p) return null;
              return (
                <article
                  className="cart-line"
                  key={`${l.productId}-${l.variantId}`}
                >
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={() => setBag(false)}
                  >
                    <Image
                      src={p.images[0].src}
                      alt={p.name}
                      width={100}
                      height={135}
                    />
                  </Link>
                  <div>
                    <span className="tiny">{p.fabric}</span>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={() => setBag(false)}
                    >
                      <h3>{p.name}</h3>
                    </Link>
                    <select
                      aria-label={`Colour for ${p.name}`}
                      value={l.variantId}
                      onChange={(e) =>
                        changeVariant(p.id, l.variantId, e.target.value)
                      }
                    >
                      {p.variants.map((v) => (
                        <option key={v.id} value={v.id} disabled={!v.available}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                    <Quantity
                      value={l.quantity}
                      onChange={(q) => update(p.id, l.variantId, q)}
                    />
                  </div>
                  <div className="line-end">
                    <span>{money(p.price * l.quantity)}</span>
                    <button
                      className="icon-button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => update(p.id, l.variantId, 0)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="order-summary">
            <h2>A considered choice</h2>
            <div>
              <span>Subtotal</span>
              <span>{money(total.subtotal)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>Not calculated in demo</span>
            </div>
            <div className="summary-total">
              <span>Demo total</span>
              <span>{money(total.total)}</span>
            </div>
            <p className="tiny">
              No payment will be collected. Shipping and tax rules require
              business configuration before launch.
            </p>
            <Link
              href="/checkout"
              onClick={() => setBag(false)}
              className="button primary"
            >
              Continue to demo checkout <ArrowRight size={16} />
            </Link>
            {drawer && (
              <Link
                href="/cart"
                onClick={() => setBag(false)}
                className="button secondary"
              >
                View your bag
              </Link>
            )}
            <Link
              href="/shop"
              onClick={() => setBag(false)}
              className="text-link"
            >
              Continue exploring
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
