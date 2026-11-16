# Catalog Studio — owner guide

Open http://localhost:3000/admin while `npm run dev` is running.

1. Select **Collections → Add collection**. Enter a name and story, upload a cover, then publish. Save draft lets you return later; only name and URL are needed to start a draft.
2. Select **Sarees → Add saree**. Add name, price, description and up to six photos. Choose a collection, add fabric composition, dimensions, care and colours. Use **Make cover** to choose the first photo. Images are optimised locally to a maximum 1400px edge.
3. Check the preview. Use **Save draft** for unfinished work or **Publish to storefront** when ready. Publish the collection before its products.
4. Use **View storefront** or the eye icon to review the actual page. Published entries appear in the shop and their collection, direct product URLs, cart and wishlist. Homepage features can be selected in the editor.
5. **Edit** updates an entry. URLs stay stable. **Archive** hides the entry without deleting it; edit and publish again to restore it. Archiving a collection hides its collection page, while independently published products remain in All Sarees.

Search and visibility filters help locate drafts, published items and archived entries. Editing another tab's stale catalog is rejected rather than overwriting newer work; return to the list and reload before trying again. Unsaved edits prompt before closing or cancelling.

## Where your work is stored

`.local/catalog.json` contains the saved catalog and optimised images. It persists through browser reloads and server restarts, is excluded from Git, and should be backed up. Original uploaded files are not modified. It is one shared catalog for this running server, not browser-only storage. Browser cart and wishlist remain local demo state.

## Deployment boundary

This is a local catalog authoring adapter, not production authentication or a production database. Admin read/write APIs require development mode, a localhost Host header and a matching Origin when supplied. This is a development guard, not user authentication. Production admin access is disabled. Never expose the development server publicly or through a proxy.

Before customer launch, replace `lib/catalog/repository.ts` with a database/storage adapter and secure `/api/admin/catalog` with Clerk/server-side roles. Keep validation in `lib/catalog/model.ts`; preserve stable IDs and slugs; migrate image data to hosted storage and retain image descriptions. Use transactional updates/revision checks, backups and file-size limits at the hosting layer. Current JSON writes are atomic and serialised within a single server process; not intended for multiple instances.

Public server-rendered pages and `/api/catalog` use the same repository and omit drafts/archives. Browser consumers refresh on focus and periodically; refresh an already-open listing to see its latest server-rendered content. Payment processing, real inventory reservation, shipping and real order management remain unconnected.
