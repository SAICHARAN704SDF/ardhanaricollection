import { auth } from '@clerk/nextjs/server';
import { adminDatabase } from '@/lib/supabase/server';
import { Dashboard } from '@/components/admin/dashboard';
import { ContentEditor } from '@/components/admin/content-editor';
export const dynamic='force-dynamic';
export const metadata={title:'Manage your website'};
export default async function Page(){
 await auth.protect();
 try{await adminDatabase();}catch{return <section className="section page-section"><h1>Admin access required</h1><p>Your account has not been authorised to manage this store. Contact the owner.</p></section>;}
 return <><ContentEditor/><Dashboard/></>;
}
