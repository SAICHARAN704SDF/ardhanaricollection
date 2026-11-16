import { createClient } from '@supabase/supabase-js';
export const databaseEnabled = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export function database(token?: string | null) {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)throw new Error('Database connection is not configured.');
  return createClient(url,key,{
    auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
    accessToken:token?async()=>token:undefined,
    global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store'})},
  });
}
export function checkDatabaseError(error: {message:string}|null){
 if(error)throw new Error(error.message);
}
