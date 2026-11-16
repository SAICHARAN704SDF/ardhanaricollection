import { auth } from "@clerk/nextjs/server";
import { Checkout } from "@/components/checkout/checkout";
export const metadata = { title: "Demo checkout" };
export default async function Page() {
  await auth.protect();
  return <Checkout />;
}
