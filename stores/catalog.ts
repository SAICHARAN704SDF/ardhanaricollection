"use client";
import { create } from "zustand";
import { products, collections } from "@/lib/mock-data/catalog";
import type { Product, Collection } from "@/types/commerce";
export const useCatalog = create<{
  products: Product[];
  collections: Collection[];
  error: string;
  loaded: boolean;
  refresh: () => Promise<void>;
}>((set) => ({
  products: process.env.NEXT_PUBLIC_SUPABASE_URL ? [] : products,
  collections: process.env.NEXT_PUBLIC_SUPABASE_URL ? [] : collections,
  error: "", loaded:false,
  refresh: async () => {
    const response = await fetch("/api/catalog", { cache: "no-store" });
    if (response.ok) set({...await response.json(),error:"",loaded:true});
    else set({error:"The collection could not be refreshed. Please try again.",loaded:true});
  },
}));
export const getCatalogProduct = (id: string) =>
  useCatalog.getState().products.find((p) => p.id === id);
