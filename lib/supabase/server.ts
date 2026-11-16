import { auth } from '@clerk/nextjs/server';
import { database, checkDatabaseError } from './client';
export async function customerDatabase(){
 const session=await auth();
 if(!session.userId)throw new Error('Sign in required.');
 const token=await session.getToken();
 if(!token)throw new Error('Your session expired. Please sign in again.');
 return {db:database(token),userId:session.userId};
}
export async function adminDatabase(permission='catalog'){
 const context=await customerDatabase();
 const {data,error}=await context.db.rpc('has_permission',{permission});checkDatabaseError(error);
 if(data!==true)throw new Error('Admin access has not been granted to this account.');
 return context;
}
