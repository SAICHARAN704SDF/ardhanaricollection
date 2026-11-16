import Link from "next/link";
import { ContactForm } from "@/components/layout/forms";
export const metadata = { title: "Contact the atelier" };
export default function Page() {
  return (
    <section className="section contact-page">
      <div>
        <p className="eyebrow">AT YOUR SERVICE</p>
        <h1>
          Let’s find your
          <br />
          <em>perfect thread.</em>
        </h1>
        <p>
          For a little guidance, a thoughtful question, or a conversation about
          your next drape.
        </p>
        <div className="contact-note">
          <h3>A personal touch.</h3>
          <p>
            Proposed service hours: Monday–Saturday, 10 am–6 pm IST. Verified
            contact details will be published before live enquiries open.
          </p>
          <span className="tiny">This is a frontend demonstration.</span>
          <Link href="/service" className="text-link">
            Our customer-service standard
          </Link>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
