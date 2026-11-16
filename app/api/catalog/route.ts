import { publicCatalog } from '@/lib/catalog/repository';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await publicCatalog(),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'The collection is temporarily unavailable. Please try again.'},{status:503});}}
