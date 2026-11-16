# Sample imagery

Photographs are local editorial placeholders downloaded from Unsplash. They are styling references, not photos of verified Ardhanari products. No product authenticity or fiber-content claim is inferred from photography. Replace them with brand-owned, product-specific images before commercial launch and review relevant image/likeness rights.

| Local file                  | Source                                                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `public/images/saree-0.jpg` | https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e                                                                        |
| `public/images/saree-1.jpg` | https://images.unsplash.com/photo-1610189338175-0782dfdb0c04                                                                        |
| `public/images/saree-2.jpg` | https://unsplash.com/photos/woman-in-yellow-and-brown-sari-standing-E9YfnPg63gU — Bulbul Ahmed; image ID 1609748341642-ae4c6562bf3d |
| `public/images/saree-3.jpg` | https://images.unsplash.com/photo-1610030469983-98e550d6193c                                                                        |
| `public/images/saree-4.jpg` | https://images.unsplash.com/photo-1610189337543-1c5d8e64f574                                                                        |

The static silk sculpture SVG was generated for this project from a parametric ribbon. The interactive sculpture uses a lightweight custom geometry, not a product-accurate saree model. There is no downloaded 3D model or real-time cloth simulation.

Fonts are locally bundled via @fontsource packages. Font licenses are included in their installed package distributions. Icons are from Lucide React.

## Heritage redesign — current active assets

The previous Unsplash sample imagery is retained locally as an earlier design asset set. The current storefront uses seven bespoke **AI-generated concept images**, made using the built-in image-generation tool and optimized to JPEG:

- `public/images/heritage-hero.jpg`: ivory/gold campaign editorial in a sandstone courtyard.
- `public/images/heritage-textiles.jpg`: textile still life in burgundy, rose and champagne.
- `public/images/heritage-saree-0.jpg`: midnight blue concept.
- `public/images/heritage-saree-1.jpg`: dusty rose concept.
- `public/images/heritage-saree-2.jpg`: marigold concept.
- `public/images/heritage-saree-3.jpg`: plum concept.
- `public/images/heritage-saree-4.jpg`: terracotta/crimson concept.

These are not photographs of real stock. The five catalog concepts are reused across the 24 demo entries. No material, origin, craft process or certification is verified by an image. Product cards, detail pages and editorials disclose their sample/concept nature. Replace with verified brand product photography before real commerce. No historical brand claim is implied by the architectural setting.

Full prompts and generation method: [image-prompts.md](./docs/image-prompts.md).

## Owner-approved logo (9 November 2026)
- Original inputs: `public/images/brand/ardhanari-original.png` and `ardhanari-wordmark-original.jpg` (provided by owner).
- Active transparent logo: `public/images/brand/ardhanari-logo-transparent.png`; lossless web derivative `.webp`. Emblem derivative: `ardhanari-emblem-transparent.png`, also used for browser/apple icons.
- Built-in image generation restored the approved artwork then extracted the burgundy background; no CSS filters or recolouring are applied. The owner confirmed the spelling ARDHANARI, ending in I.
- Non-generative 2× original export retained as `ardhanari-logo-high-resolution.png` (3156×1994); resampling adds pixels, not genuine new detail.
- Final background extraction prompt: “Background extraction only from supplied approved logo. Remove dark burgundy background everywhere including inside lotus mandala openings and letter counters to genuine transparent alpha. KEEP all foreground pixels/colors/design exactly unchanged: muted antique gold flat lettering and ornament (NOT yellow, no brightening, no metallic bevel), original blue and orange figure and its details. Text remains ARDHANARI ending in I. Do not redraw, sharpen, recolor, stylize, add shadows, or add outlines. Preserve composition and aspect ratio. Clean alpha edges without colored halos or scattered pixels. Full emblem above wordmark.”

## Shared website palette
Existing page backgrounds remain unchanged. Global heritage tokens in `styles/heritage.css` control ivory, cream, espresso, gold, muted text and borders. `--brand-accent-text` unifies readable gold-brown text and form accents throughout store, account, checkout, policies and admin. Tailwind colour tokens match the heritage palette. Semantic stock status colours and product colour swatches remain meaningful and distinct.

### Current identity (supersedes transparent AI derivative)
The active logo is now the exact owner-provided `ardhanari-original.png`, not the AI restoration. Header, menu and footer use that original; decorative and browser icons use crops of the same original. No colour filters are applied. Transparent AI derivatives are retained as unused alternatives.
