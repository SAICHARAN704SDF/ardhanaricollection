"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, DemoOrder } from "@/types/commerce";
import { getCatalogProduct as getProductById } from "@/stores/catalog";
interface ShopState {
  customerId: string | null;
  bindCustomer: (id:string|null)=>void;
  lines: CartLine[];
  wishlist: string[];
  orders: DemoOrder[];
  bagOpen: boolean;
  notice: string;
  add: (id: string, variant: string, quantity?: number) => void;
  update: (id: string, variant: string, quantity: number) => void;
  changeVariant: (id: string, from: string, to: string) => void;
  toggleWish: (id: string) => void;
  clear: () => void;
  setBag: (open: boolean) => void;
  notify: (message: string) => void;
  recordOrder: (order: DemoOrder) => void;
}
export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      customerId:null,
      bindCustomer:(id)=>set(s=>s.customerId===id?{}:s.customerId?{customerId:id,lines:[],orders:[],wishlist:[],bagOpen:false}:{customerId:id}),
      lines: [],
      wishlist: [],
      orders: [],
      bagOpen: false,
      notice: "",
      add: (id, variant, quantity = 1) => {
        const p = getProductById(id);
        if (!p?.variants.some((v) => v.id === variant && v.available)) return;
        set((s) => {
          const line = s.lines.find(
            (l) => l.productId === id && l.variantId === variant,
          );
          return {
            lines: line
              ? s.lines.map((l) =>
                  l === line
                    ? { ...l, quantity: Math.min(10, l.quantity + quantity) }
                    : l,
                )
              : [
                  ...s.lines,
                  {
                    productId: id,
                    variantId: variant,
                    quantity: Math.min(10, Math.max(1, quantity)),
                  },
                ],
            notice: `${p.name} added to your bag`,
          };
        });
      },
      update: (id, variant, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter(
                  (l) => !(l.productId === id && l.variantId === variant),
                )
              : s.lines.map((l) =>
                  l.productId === id && l.variantId === variant
                    ? { ...l, quantity: Math.min(10, Math.max(1, quantity)) }
                    : l,
                ),
        })),
      changeVariant: (id, from, to) => {
        if (from === to) return;
        const p = getProductById(id);
        if (!p?.variants.some((v) => v.id === to && v.available)) return;
        const old = get().lines.find(
          (l) => l.productId === id && l.variantId === from,
        );
        if (old) {
          get().update(id, from, 0);
          get().add(id, to, old.quantity);
        }
      },
      toggleWish: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((v) => v !== id)
            : [...s.wishlist, id],
        })),
      clear: () => set({ lines: [] }),
      setBag: (bagOpen) => set({ bagOpen }),
      notify: (notice) => set({ notice }),
      recordOrder: (order) =>
        set((s) => ({ orders: [order, ...s.orders], lines: [] })),
    }),
    {
      name: "ardhanari-demo-v1",
      partialize: (s) => ({
        customerId:s.customerId,
        lines: s.lines,
        wishlist: s.wishlist,
        orders: s.orders,
      }),
      skipHydration: true,
    },
  ),
);
