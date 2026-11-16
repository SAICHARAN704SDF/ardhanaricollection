import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
export const metadata = {title:'Your account'};
export default async function Page(){await auth.protect();redirect('/account/profile');}
