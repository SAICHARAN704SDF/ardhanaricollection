"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, LockKeyhole } from "lucide-react";
import { useShop } from "@/stores/shop";
import { useCatalog, getCatalogProduct as getProductById } from "@/stores/catalog";
import { money, totals } from "@/lib/utils/commerce";
import { orderService } from "@/lib/services";
import type { DemoOrder } from "@/types/commerce";
export function Checkout() {
  const products = useCatalog(s=>s.products);
  const lines = useShop((s) => s.lines);
  const record = useShop((s) => s.recordOrder);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const amounts = totals(lines, products, applied);
  if (order)
    return (
      <section className="confirmation">
        <span className="confirmation-icon">
          <Check size={28} />
        </span>
        <p className="eyebrow">DEMO EXPERIENCE COMPLETE</p>
        <h1>
          A beautiful choice.
          <br />
          <em>A preview of what’s to come.</em>
        </h1>
        <p>
          Simulation {order.id} · {money(order.total)}
        </p>
        <p>
          No purchase was placed, no payment was processed, and nothing will be
          shipped.
          <br />
          Your address was not stored. This demo record is saved only on this
          device.
        </p>
        <div className="button-row">
          <Link className="button primary" href="/shop">
            Continue exploring <ArrowRight size={16} />
          </Link>
          <Link className="text-link" href="/account/orders">
            View demo orders
          </Link>
        </div>
      </section>
    );
  if (!lines.length)
    return (
      <section className="empty-state page-section">
        <h1>A fresh beginning.</h1>
        <p>Add a saree to your bag to explore demo checkout.</p>
        <Link href="/shop" className="button primary">
          Explore the collection
        </Link>
      </section>
    );
  return (
    <section className="section checkout-page">
      <p className="eyebrow">THE FINAL DETAILS</p>
      <h1>
        A little closer to <em>yours.</em>
      </h1>
      <div className="demo-banner">
        <LockKeyhole size={17} />
        <span>
          DEMO CHECKOUT — No real payment, purchase, or delivery. Use fictional
          details.
        </span>
      </div>
      <form
        className="checkout-layout"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setError("");
          try {
            const response = await fetch('/api/orders/demo', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lines,coupon:applied})});
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Please sign in again to continue.');
            record(result);
            setOrder(result);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Unable to complete demo.",
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <div>
          <fieldset>
            <legend>
              <span>01</span> Your details
            </legend>
            <div className="form-grid">
              <label>
                Full name
                <input
                  name="name"
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder="Sample customer"
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9+ ()-]{10,16}"
                  required
                  placeholder="10-digit mobile number"
                />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>02</span> The destination
            </legend>
            <div className="form-grid">
              <label className="full-width">
                Street address
                <input
                  name="street"
                  required
                  minLength={5}
                  autoComplete="street-address"
                />
              </label>
              <label>
                City
                <input name="city" autoComplete="address-level2" required />
              </label>
              <label>
                State
                <input name="state" autoComplete="address-level1" required />
              </label>
              <label>
                PIN code
                <input
                  name="postalCode"
                  inputMode="numeric"
                  pattern="[1-9][0-9]{5}"
                  maxLength={6}
                  autoComplete="postal-code"
                  required
                />
              </label>
              <label>
                Country
                <input value="India" readOnly />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>03</span> Delivery & payment preview
            </legend>
            <div className="preview-option">
              <span>Standard delivery</span>
              <span>Estimate unavailable in demo</span>
            </div>
            <p className="tiny">
              Delivery fees, tax treatment and serviceability will be confirmed
              after shipping integration.
            </p>
            <div className="payment-methods">
              <span>UPI</span>
              <span>Cards</span>
              <span>Net banking</span>
            </div>
            <p className="tiny">
              Payment methods are preview only. No card or bank details are
              collected.
            </p>
          </fieldset>
        </div>
        <aside className="order-summary">
          <h2>Your considered edit</h2>
          {lines.map((l) => {
            const p = getProductById(l.productId);
            return p ? (
              <div className="checkout-line" key={p.id + l.variantId}>
                <span>
                  {p.name} × {l.quantity}
                  <small>
                    {p.variants.find((v) => v.id === l.variantId)?.name}
                  </small>
                </span>
                <span>{money(p.price * l.quantity)}</span>
              </div>
            ) : null;
          })}
          <label className="coupon-label">
            Demo coupon · Try DRAPE10
            <div className="coupon-row">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter code"
              />
              <button
                type="button"
                onClick={() => {
                  const valid = coupon.trim().toUpperCase() === "DRAPE10";
                  setApplied(valid ? "DRAPE10" : "");
                  setCouponMessage(
                    valid
                      ? "Demo 10% discount applied."
                      : "Code not recognised. Try DRAPE10.",
                  );
                }}
              >
                Apply
              </button>
            </div>
          </label>
          <p className="tiny" role="status">
            {couponMessage}
          </p>
          <div>
            <span>Subtotal</span>
            <span>{money(amounts.subtotal)}</span>
          </div>
          {amounts.discount > 0 && (
            <div>
              <span>Demo discount</span>
              <span>−{money(amounts.discount)}</span>
            </div>
          )}
          <div>
            <span>Shipping</span>
            <span>Not calculated</span>
          </div>
          <div className="summary-total">
            <span>Demo total</span>
            <span>{money(amounts.total)}</span>
          </div>
          <label className="checkbox-label">
            <input type="checkbox" required /> I understand this is a
            simulation, not an actual order.
          </label>
          <button className="button primary" disabled={pending}>
            {pending ? "Preparing preview…" : "Complete demo order"}
            <ArrowRight size={16} />
          </button>
          <p role="alert">{error}</p>
          <Link href="/cart" className="text-link">
            Return to your bag
          </Link>
        </aside>
      </form>
    </section>
  );
}
