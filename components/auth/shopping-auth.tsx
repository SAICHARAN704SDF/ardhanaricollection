'use client';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/stores/shop';
import { useCatalog } from '@/stores/catalog';
import { validateShoppingLine } from '@/lib/auth/shopping';
export function CustomerSession() {
  const {isLoaded,userId}=useAuth();
  useEffect(()=>{if(isLoaded)useShop.getState().bindCustomer(userId??null);},[isLoaded,userId]);
  return null;
}
export function CustomerButton() {
  const {isLoaded,isSignedIn}=useAuth();
  if(!isLoaded)return <span className="customer-loading" aria-label="Loading account"/>;
  return isSignedIn ? <UserButton/> : <Link href="/sign-in" className="customer-signin">Sign in</Link>;
}
export function useShoppingAuth() {
  const router=useRouter();
  async function add(productId:string,variantId:string,quantity=1,checkout=false) {
    try {
      validateShoppingLine({productId,variantId,quantity},useCatalog.getState().products);
      useShop.getState().add(productId,variantId,quantity);
      if(checkout){useShop.getState().setBag(false);router.push('/checkout');}
    } catch(e) {useShop.getState().notify(e instanceof Error?e.message:'Could not add this saree.');}
  }
  return {add,pending:false,ready:true};
}
export function ContinuePurchase(){
 const router=useRouter();
 useEffect(()=>{sessionStorage.removeItem('ardhanari-pending-purchase');router.replace('/checkout');},[router]);
 return <section className="auth-section"><h1>Preparing your checkout…</h1><p role="status">Your bag is ready.</p></section>;
}
