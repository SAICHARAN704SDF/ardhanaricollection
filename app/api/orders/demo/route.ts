import { auth } from '@clerk/nextjs/server';
import { publicCatalog } from '@/lib/catalog/repository';
import { validateShoppingLine } from '@/lib/auth/shopping';
import { totals } from '@/lib/utils/commerce';
import type { CartLine } from '@/types/commerce';
export async function POST(request:Request){
 const {userId}=await auth();if(!userId)return Response.json({error:'Please sign in to continue to checkout.'},{status:401});
 try {const {lines,coupon}=await request.json();if(!Array.isArray(lines)||!lines.length||lines.length>100)throw new Error('Please check your bag.');
 const {products}=await publicCatalog();const seen=new Set<string>();
 for(const line of lines){validateShoppingLine(line,products);const key=`${line.productId}:${line.variantId}`;if(seen.has(key))throw new Error('Duplicate bag item. Please refresh your bag.');seen.add(key);}
 return Response.json({id:`DEMO-${crypto.randomUUID().slice(0,8).toUpperCase()}`,createdAt:new Date().toISOString(),lines:lines.map((l:CartLine)=>({productId:l.productId,variantId:l.variantId,quantity:l.quantity})),...totals(lines,products,typeof coupon==='string'?coupon:''),status:'demo-confirmed'},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Could not review your bag.'},{status:400});}
}
