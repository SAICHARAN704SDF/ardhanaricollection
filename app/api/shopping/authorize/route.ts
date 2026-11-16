import { publicCatalog } from '@/lib/catalog/repository';
import { validateShoppingLine } from '@/lib/auth/shopping';
export async function POST(request:Request){
 try {const line=await request.json();const product=validateShoppingLine(line,(await publicCatalog()).products);return Response.json({product},{headers:{'Cache-Control':'no-store'}});}
 catch(e){return Response.json({error:e instanceof Error?e.message:'Invalid selection.'},{status:400});}
}
