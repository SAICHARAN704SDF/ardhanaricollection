# Integration guide

The current application is a frontend demonstration. There are no API keys, database connections, payment intents or live customer records.

## Service boundaries

`types/commerce.ts` defines the catalog, collection, variant, cart-line, address and demo-order models. `lib/services/contracts.ts` defines ProductService, CollectionService, CartService, WishlistService, CustomerService, OrderService and PaymentService.

- `lib/services/index.ts`: mock catalog, collection, customer, order and disabled-payment adapters.
- `lib/services/local.ts`: local cart and wishlist adapters over `stores/shop.ts`.
- `stores/shop.ts`: persisted device-local UX state. Components currently subscribe directly to this store for reactive rendering; replace its mutations with adapter calls while keeping selectors and UI contracts stable.
- `lib/catalog/repository.ts`: authoritative catalog adapter. Seeds from `lib/mock-data/catalog.ts` only when no local saved catalog exists. Replace this adapter with database queries and hosted images; storefront pages and browser consumers already read its public projection.

The demo OrderService deliberately only exposes `createDemo`. Live order creation and payment settlement must be separate, server-only operations; do not rename this method and trust browser totals.

## Clerk (later)

1. Add the official provider at the root layout and implement actual sign-in/sign-up routes in `app/account/[section]`.
2. Replace `customerService.current()` with an identity adapter. Do not expose session secrets in client components.
3. Protect account routes and server handlers using server-verified Clerk sessions. Protect `/admin` and every admin API with verified roles; hiding navigation is not authorization.
4. Map the provider's subject ID to a customer row. Define account deletion, session expiry, and guest-to-customer bag/wishlist merge behavior.
5. Remove the explicit preview labels only after authentication and authorization are implemented and tested.

## Supabase PostgreSQL and Storage (later)

Suggested normalized tables: products, product_variants, product_images, collections, product_collections, inventory, customers, addresses, wishlists, wishlist_items, carts, cart_items, orders, order_items, payments, coupons, reviews.

- Implement ProductService and CollectionService as server adapters. Return serializable domain models to the existing client components.
- Store monetary amounts as integer paise in the live database and payment API. Current display samples are integer rupees. Convert explicitly at the adapter boundary, never through floating-point assumptions.
- Store verification status for material, origin, weaving technique, artisan claims and certifications. Only publish verified claims.
- Track stock by SKU/variant. Enforce reservations and quantity checks transactionally on the server.
- Apply RLS to all customer-owned rows; customers can only see their own records. Audit admin writes. Keep service-role credentials server-only.
- Replace local customer/order persistence with authorized server persistence. Do not use localStorage for PII or security decisions.
- Upload original images through an authenticated, validated server or signed-upload path. Validate type, size and ownership. Configure Next image remotePatterns for the exact Storage hostname; preserve dimensions, alt text and image provenance.
- Replace sample crops with actual body, border, pallu, embroidery and zari macro assets. Only enable product video/360/model controls for real assets.

## Cashfree / Razorpay (later)

1. Add a server-only checkout endpoint that accepts only product IDs, variant IDs, quantities, address reference and coupon code. Re-read catalog prices, inventory, taxes, discount eligibility and shipping fees on the server.
2. Create a pending order and gateway payment session using server-held secrets. Use idempotency keys and store the gateway IDs.
3. Return only the gateway's public checkout configuration. Client callbacks are provisional and must not mark an order paid.
4. Verify webhook signatures against the raw request body, reject stale/replayed events, and handle duplicate delivery idempotently. Verify amount, currency and order identity.
5. Settle inventory/order state transactionally after authoritative payment verification. Handle failures, abandoned checkout, expiry, partial refunds and full refunds.
6. Implement refunds as authorized server operations with a recorded state machine and audit log. Never expose gateway secrets or admin refund authority in the browser.
7. Replace `components/checkout/checkout.tsx`'s simulated order call only after these paths are tested.

## Shipping and email (later)

- Add server adapters for PIN-code serviceability, shipping rates, dispatch estimates, shipment creation and tracking. Include the final shipping/tax-inclusive payable amount before payment.
- Send transactional email from verified server events, not from browser confirmations. Make send operations idempotent and auditable.
- Connect newsletter/contact forms only after configuring consent, retention, rate limiting, spam controls and destination details.

## SEO and launch

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin. Current default is localhost. Metadata and JSON-LD are centralized in `lib/seo.ts` and route modules. Product JSON-LD intentionally omits Offer and review ratings for fictitious inventory.

Before launch: replace sample products/images/testimonials; approve founder copy and all policies; verify prices, tax treatment, dimensions, stock and origin; protect admin; implement secure checkout; add verified Offer data; change root robots metadata to index/follow and `app/robots.ts` to allow public pages while excluding private routes. Keep account, cart, checkout and admin explicitly noindex. Add consent-aware analytics and real performance monitoring only when chosen.

## Frontend QA

The test suite covers catalog integrity, combined filtering, numerical sorting, budget-constrained recommendations, totals/coupons, cart variant merging and limits, wishlist toggles, and rejection of invalid simulated orders.

Browser acceptance checks: product overlay and direct URL; nested inspection dialog; Escape and focus restoration; browser Back/Forward; image navigation; persisted bag/wishlist after reload; quantity/variant changes; checkout validation and confirmation; quiz results; mobile navigation and touch-sized controls; desktop WebGL/fallback; reduced motion and keyboard focus. No Lighthouse or physical-device Core Web Vitals guarantees are claimed.

## Catalog Studio update
The former session-only admin preview has been replaced by a working local catalog editor. See `docs/catalog-studio.md`. The local adapter in `lib/catalog/repository.ts` saves `.local/catalog.json`; published records feed all storefront surfaces. Replace this adapter with Supabase and image storage, then replace the development-only API guard with authenticated role checks before deployment. Never enable anonymous production writes. The catalog validation and public/draft projection live in `lib/catalog/model.ts`.
