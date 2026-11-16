import type {
  Product,
  Collection,
  CartLine,
  Customer,
  Address,
  DemoOrder,
} from "@/types/commerce";
export interface ProductService {
  list(): Promise<Product[]>;
  find(slug: string): Promise<Product | undefined>;
}
export interface CollectionService {
  list(): Promise<Collection[]>;
}
export interface CartService {
  get(): CartLine[];
  add(productId: string, variantId: string, quantity: number): void;
  update(productId: string, variantId: string, quantity: number): void;
  clear(): void;
}
export interface WishlistService {
  get(): string[];
  toggle(productId: string): void;
}
export interface CustomerService {
  current(): Promise<Customer | null>;
  saveAddress(address: Address): Promise<{ status: "unavailable" }>;
}
export interface OrderService {
  createDemo(lines: CartLine[], coupon?: string): Promise<DemoOrder>;
}
export interface PaymentService {
  capabilities(): Promise<{ mode: "demo"; methods: string[]; enabled: false }>;
}
