# ARDHANARI COLLECTION

A complete local Next.js App Router storefront for a luxury saree brand. This is an explicitly labeled **frontend demo**, with no real authentication, payment, fulfillment or database connections.

## Run locally

Requires Node.js 20.9 or newer (Node 22 LTS recommended).

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm run build
npm start
```

Validation:

```sh
npm run typecheck
npm test
npm run build
```

## Implemented experience

- Heritage fashion-house art direction: bespoke crest, cinematic campaign imagery, coordinated AI-generated catalog editorials, and locally bundled Cormorant Garamond and Manrope.
- Lazy-loaded R3F Living Silk sculpture in the draping story section, with a locally generated static fabric illustration on small screens, reduced-motion devices or unsupported WebGL.
- 24 typed demo products, eight collections, search, combinable filters, sorting and load more.
- Intercepted product routes for **The Saree Reveal** and independently rendered shareable product pages.
- Product photography, illustrative detail crops, zoom, swipe navigation, fabric accordions, colour concepts and quantity controls.
- Persistent device-local bag, wishlist and simulated order summaries using Zustand.
- Six-question attribute-based recommendation quiz.
- Validated demo checkout with DRAPE10 sample coupon; payment methods are previews only.
- About, contact, FAQ and draft policies; account, address and order preview screens.
- Catalog Studio: create/edit collections and sarees, upload and optimise photos, save drafts, publish into the storefront and archive entries. Catalog persists on the local server in `.local/catalog.json`. Editing is development-only until authenticated admin roles are integrated. See [owner guide](docs/catalog-studio.md).
- Metadata, canonical URLs, Open Graph, product/breadcrumb JSON-LD, sitemap and robots routes. Indexing is intentionally disabled for this sample catalog.

## Architecture

```text
app/                  Server-rendered routes, metadata, loading/error states
  @modal/             Intercepting product route and dismissing catch-all
components/
  3d/                 Lazy R3F sculpture and static fallback
  animations/         Reduced-motion-aware reveal wrapper
  layout/             Header, footer, Radix dialogs, providers, forms
  home/               Editorial homepage, recommendations, newsletter
  products/           Cards, catalog, product gallery, reveal, wishlist
  cart/               Shared bag page/drawer
  checkout/           Validated simulated checkout
  admin/              Persistent local catalog editor
lib/
  mock-data/          Single central catalog and collections
  services/           Provider-neutral interfaces and demo adapters
  utils/              Price formatting, filters, recommendations, totals
stores/               Local persistent commerce store
hooks/                Visibility helper for optional rendering
public/images/        Local sample photographs and static fabric SVG
public/models/        Reserved for licensed, product-accurate assets
styles/               Design tokens and responsive styling
 types/               Rich commerce models
 tests/               Catalog, filtering, totals, cart, quiz and order tests
```

## Data and honesty

All catalog names, prices, colour variants, weights, specifications and stories are sample content. Five AI-generated catalog editorials are reused across 24 demo items, and detail views are crops rather than real macro photography. Concept variants deliberately do not recolour photographs. Testimonials are explicitly illustrative. There are no artisan, authenticity or manufacturing-origin claims.

Checkout input stays in form memory and is not persisted. Only product lines, numeric totals and demo order IDs are saved. Newsletter/contact submissions are local confirmation states, not outbound messages. The account forms never store a password or claim a signed-in session.

The localStorage key is `ardhanari-demo-v1`. Clear this site's browser storage to reset the demo. The quantity cap of 10 is a demo UI limit, not a stock claim.

See [INTEGRATIONS.md](./INTEGRATIONS.md) for the provider boundaries, launch requirements and backend connection plan, and [ASSETS.md](./ASSETS.md) for photography sources.
