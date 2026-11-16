import type { Product, Collection, Fabric } from "@/types/commerce";
export const collections: Collection[] = [
  {
    slug: "kanjivaram-silk",
    name: "Kanjivaram Silk",
    description:
      "Sculptural drapes, luminous surfaces, and borders with a quiet grandeur.",
    image: "/images/heritage-saree-0.jpg",
  },
  {
    slug: "banarasi-silk",
    name: "Banarasi Silk",
    description:
      "A study in intricate motifs and beautifully considered detail.",
    image: "/images/heritage-saree-1.jpg",
  },
  {
    slug: "organza",
    name: "Organza",
    description:
      "Light through a petal. Airy, translucent drapes for modern celebrations.",
    image: "/images/heritage-saree-2.jpg",
  },
  {
    slug: "chiffon-georgette",
    name: "Chiffon & Georgette",
    description: "Soft movement and effortless lines, from day to evening.",
    image: "/images/heritage-saree-3.jpg",
  },
  {
    slug: "cotton-classics",
    name: "Cotton Classics",
    description:
      "An everyday ritual of comfort, texture, and understated beauty.",
    image: "/images/heritage-saree-4.jpg",
  },
  {
    slug: "wedding",
    name: "Wedding Collection",
    description:
      "For moments that become memories. Discover rich, ceremonial drapes.",
    image: "/images/heritage-saree-1.jpg",
  },
  {
    slug: "festive",
    name: "Festive Collection",
    description: "Colour, light, and the joy of coming together.",
    image: "/images/heritage-saree-0.jpg",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "A fresh chapter in our exploration of timeless drapes.",
    image: "/images/heritage-saree-2.jpg",
  },
];
const names = [
  "Neelambari",
  "Gulabi",
  "Sunehri",
  "Chandrika",
  "Prakriti",
  "Yamini",
  "Padma",
  "Kesar",
  "Mrinalini",
  "Vasanta",
  "Indira",
  "Mehr",
  "Tara",
  "Aabha",
  "Nila",
  "Kumud",
  "Ruhani",
  "Amara",
  "Ira",
  "Revati",
  "Sitara",
  "Ananya",
  "Mogra",
  "Sandhya",
];
const fabrics: Fabric[] = [
  "Kanjivaram Silk",
  "Banarasi Silk",
  "Organza",
  "Chiffon & Georgette",
  "Cotton Classics",
];
const colors = [
  { name: "Midnight blue", hex: "#283c58" },
  { name: "Rose", hex: "#c69193" },
  { name: "Marigold", hex: "#d4a644" },
  { name: "Plum", hex: "#6c3f61" },
  { name: "Crimson", hex: "#a12c32" },
];
export const products: Product[] = names.map((name, i) => {
  const f = i % 5;
  const fabric = fabrics[f];
  const color = colors[f];
  const price = [18900, 24900, 8900, 6900, 4200][f] + Math.floor(i / 5) * 1200;
  const slug = `${name.toLowerCase()}-${collections[f].slug}`;
  const image = {
    src: `/images/heritage-saree-${f}.jpg`,
    alt: `AI-generated sample saree editorial for ${name}; styling reference, not an actual inventory item`,
  };
  return {
    id: `AC-${String(i + 1).padStart(3, "0")}`,
    slug,
    name: `${name} ${f < 2 ? "Silk" : "Drape"}`,
    shortDescription: [
      "A luminous midnight drape with an understated gold-toned border.",
      "An ode to delicate motifs and the romance of rose.",
      "Airy layers with a softly luminous finish.",
      "A fluid silhouette, made for unhurried evenings.",
      "A gentle texture that brings beauty to the everyday.",
    ][f],
    story: `${name} is a sample exploration of ${f < 2 ? "ceremonial elegance" : "quiet everyday beauty"}. Thoughtful motifs and a ${f < 2 ? "rich, structured" : "soft, fluid"} drape come together in a design imagined for moments that matter.`,
    price,
    currency: "INR",
    collections: [
      collections[f].slug,
      ...(i % 3 === 0 ? ["wedding"] : ["festive"]),
      ...(i < 8 ? ["new-arrivals"] : []),
    ],
    category: "Sarees",
    fabric,
    composition: [
      "Silk with metallic decorative yarn (sample specification)",
      "Silk with metallic decorative yarn (sample specification)",
      "Organza blend (sample specification)",
      "Polyester georgette (sample specification)",
      "Cotton (sample specification)",
    ][f],
    feel: [
      "Smooth, lustrous, substantial",
      "Luminous with a textured motif",
      "Sheer and delicately crisp",
      "Soft, fluid, lightly textured",
      "Breathable and softly textured",
    ][f],
    weave:
      f < 2
        ? "Jacquard-inspired patterned weave; technique unverified"
        : "Plain-weave inspired textile; technique unverified",
    design: [
      "A deep indigo field with spaced decorative motifs",
      "Botanical motifs on a dusty rose field",
      "Sheer golden layers with delicate embroidered accents",
      "An unpatterned plum field with a restrained border",
      "A terracotta field with fine cream stripes",
    ][f],
    border: [
      "Narrow antique-gold decorative border",
      "Botanical border with metallic-look accents",
      "Light floral embroidery along the edge",
      "Slender metallic-look border",
      "Simple cream woven stripe border",
    ][f],
    pallu: "Patterned end panel, designed as the focal point of the drape",
    blouse:
      "0.8 m unstitched blouse piece in this sample specification; styling blouse not included",
    dimensions: "5.5 m × 1.12 m, plus blouse piece",
    weight: [780, 720, 330, 420, 480][f],
    care: [
      "Professional dry clean recommended for this sample design",
      "Store loosely folded in breathable cotton",
      "Avoid direct perfume and prolonged sunlight",
    ],
    occasions:
      i % 3 === 0
        ? ["Wedding", "Festive"]
        : ["Festive", "Evening", ...(f > 1 ? ["Everyday"] : [])],
    style: f < 2 ? "Traditional" : "Contemporary",
    drape: f < 2 ? "Structured" : "Lightweight",
    variants: [
      { id: "original", ...color, available: i !== 23 },
      {
        id: "champagne",
        name: "Champagne concept",
        hex: "#bfa57b",
        available: i !== 23,
      },
    ],
    images: [
      image,
      {
        ...image,
        alt: `Alternate crop of sample ${name} photograph`,
        position: "50% 30%",
      },
      {
        ...image,
        alt: `Drape crop of sample ${name} photograph`,
        position: "50% 75%",
      },
    ],
    macroImages: [
      "Body",
      "Border",
      "Pallu",
      "Embroidery",
      "Zari",
      "Texture",
    ].map((detail) => ({
      ...image,
      detail,
      alt: `Illustrative ${detail.toLowerCase()} crop; dedicated macro photography is not available`,
    })),
    videos: [],
    inventory: i === 23 ? "unavailable" : "available",
    featured: i < 4,
    newArrival: i < 8,
    sample: true,
    seo: {
      title: `${name} ${fabric}`,
      description: `Explore ${name}, a sample ${fabric.toLowerCase()} saree in the Ardhanari Collection demo.`,
    },
  };
});
export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
