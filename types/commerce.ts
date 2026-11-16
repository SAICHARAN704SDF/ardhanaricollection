export type Fabric =
  | "Kanjivaram Silk"
  | "Banarasi Silk"
  | "Organza"
  | "Chiffon & Georgette"
  | "Cotton Classics";
export type ProductImage = { src: string; alt: string; position?: string };
export type Variant = {
  id: string;
  name: string;
  hex: string;
  available: boolean;
  stock?: number;
  reserved?: number;
};
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  story: string;
  price: number;
  compareAtPrice?: number;
  currency: "INR";
  collections: string[];
  category: string;
  fabric: Fabric;
  composition: string;
  feel: string;
  weave: string;
  design: string;
  border: string;
  pallu: string;
  blouse: string;
  dimensions: string;
  weight?: number;
  care: string[];
  occasions: string[];
  style: "Traditional" | "Contemporary";
  drape: "Lightweight" | "Structured";
  variants: Variant[];
  images: ProductImage[];
  macroImages: (ProductImage & { detail: string })[];
  videos: string[];
  model?: string;
  inventory: "available" | "unavailable";
  featured: boolean;
  newArrival: boolean;
  sample: boolean;
  seo: { title: string; description: string };
}
export interface Collection {
  sample?: boolean;
  slug: string;
  name: string;
  description: string;
  image: string;
}
export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}
export interface Address {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}
export interface DemoOrder {
  id: string;
  createdAt: string;
  lines: CartLine[];
  subtotal: number;
  discount: number;
  total: number;
  status: "demo-confirmed";
}
export interface Customer {
  id: string;
  displayName: string;
}
