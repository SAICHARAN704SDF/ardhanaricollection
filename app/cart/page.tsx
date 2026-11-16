import { CartContents } from "@/components/cart/cart";
export const metadata = { title: "Your bag" };
export default function Page() {
  return (
    <section className="section page-section">
      <CartContents />
    </section>
  );
}
