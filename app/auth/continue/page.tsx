import { auth } from '@clerk/nextjs/server';
import { ContinuePurchase } from '@/components/auth/shopping-auth';
export default async function Page(){await auth.protect();return <ContinuePurchase/>;}
