import type { CartLine, Product } from '@/types/commerce';
export interface PurchaseIntent extends CartLine { checkout: boolean; createdAt: number }
export const pendingPurchaseKey = 'ardhanari-pending-purchase';
export function validIntent(value: unknown): value is PurchaseIntent {
  if(!value || typeof value !== 'object') return false;
  const p=value as PurchaseIntent;
  return typeof p.productId==='string' && typeof p.variantId==='string' && Number.isInteger(p.quantity) && p.quantity>=1 && p.quantity<=10 && typeof p.checkout==='boolean' && Number.isFinite(p.createdAt) && Date.now()-p.createdAt>=0 && Date.now()-p.createdAt<30*60*1000;
}
export function validateShoppingLine(line: CartLine, products: Product[]) {
  const product=products.find(p=>p.id===line.productId);
  if(!product || product.inventory!=='available' || !product.variants.some(v=>v.id===line.variantId && v.available) || !Number.isInteger(line.quantity) || line.quantity<1 || line.quantity>10) throw new Error('This selection is no longer available. Please choose your saree again.');
  return product;
}
