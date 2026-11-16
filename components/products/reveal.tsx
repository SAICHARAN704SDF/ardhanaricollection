"use client";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/commerce";
import { Modal } from "@/components/layout/primitives";
import { ProductDetails } from "./product-details";
export function Reveal({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <Modal
      open
      onClose={() => router.back()}
      title={`${product.name} — The Saree Reveal`}
      className="reveal-modal"
      description="Explore sample product photography, fabric information and demo purchase options."
    >
      <ProductDetails product={product} overlay />
    </Modal>
  );
}
