"use client";
import { useShop } from "@/stores/shop";
import type { CartService, WishlistService } from "./contracts";
export const cartService: CartService = {
  get: () => useShop.getState().lines,
  add: (...args) => useShop.getState().add(...args),
  update: (...args) => useShop.getState().update(...args),
  clear: () => useShop.getState().clear(),
};
export const wishlistService: WishlistService = {
  get: () => useShop.getState().wishlist,
  toggle: (id) => useShop.getState().toggleWish(id),
};
