import { products, collections, getProduct } from "@/lib/mock-data/catalog";
import { useCatalog } from "@/stores/catalog";
import { totals } from "@/lib/utils/commerce";
import type {
  ProductService,
  CollectionService,
  CustomerService,
  OrderService,
  PaymentService,
} from "./contracts";
export const productService: ProductService = {
  list: async () => useCatalog.getState().products,
  find: async (slug) => useCatalog.getState().products.find(p=>p.slug===slug),
};
export const collectionService: CollectionService = {
  list: async () => useCatalog.getState().collections,
};
export const customerService: CustomerService = {
  current: async () => null,
  saveAddress: async () => ({ status: "unavailable" }),
};
export const orderService: OrderService = {
  createDemo: async (lines, coupon = "") => {
    const products = useCatalog.getState().products;
    if (!lines.length) throw new Error("Your bag is empty.");
    for (const line of lines) {
      const product = products.find((p) => p.id === line.productId);
      if (
        !product ||
        !product.variants.some((v) => v.id === line.variantId && v.available) ||
        !Number.isInteger(line.quantity) ||
        line.quantity < 1 ||
        line.quantity > 10
      )
        throw new Error("Please check your bag.");
    }
    return {
      id: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      lines: lines.map((l) => ({ ...l })),
      ...totals(lines, products, coupon),
      status: "demo-confirmed",
    };
  },
};
export const paymentService: PaymentService = {
  capabilities: async () => ({
    mode: "demo",
    methods: ["UPI", "Cards", "Net banking"],
    enabled: false,
  }),
};
