import { PhoneSignIn } from '@/components/auth/phone-sign-in';
export const metadata = {title:'Continue with your phone'};
export default function Page(){return <section className="auth-section"><p className="eyebrow">YOUR PERSONAL ATELIER</p><h1>A little closer to yours.</h1><p>Browse, save and fill your bag freely. Verify your phone number when you’re ready to checkout.</p><PhoneSignIn/><p className="tiny">Secure verification by Clerk. Demo checkout — no payment is taken.</p></section>;}
