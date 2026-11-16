import { database, databaseEnabled, checkDatabaseError } from '@/lib/supabase/client';
import { adminDatabase } from '@/lib/supabase/server';
import { validateEntry, storefront, type CatalogData } from './model';
export async function readCatalog():Promise<CatalogData>{
 if(!databaseEnabled())return (await import('./local-repository')).readCatalog();
 const {db}=await adminDatabase();const {data,error}=await db.rpc('get_catalog');checkDatabaseError(error);return data as CatalogData;
}
export async function publicCatalog(){
 if(!databaseEnabled())return (await import('./local-repository')).publicCatalog();
 const {data,error}=await database().rpc('get_catalog');checkDatabaseError(error);return storefront(data as CatalogData);
}
export async function saveEntry(kind:'product'|'collection',input:unknown,revision:number,existing=true){
 if(!databaseEnabled())return (await import('./local-repository')).saveEntry(kind,input,revision,existing);
 const entry=validateEntry(kind,input);const {db}=await adminDatabase();
 const {error}=await db.rpc('save_catalog_entry',{kind,entry,expected_revision:revision,is_existing:existing});checkDatabaseError(error);
 return readCatalog();
}
