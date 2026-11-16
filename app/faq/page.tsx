export const metadata = { title: "Frequently asked questions" };
const faqs = [
  [
    "Can I place a real order?",
    "Not yet. This storefront is a demonstration. Checkout simulates an order without taking payment or requesting fulfillment.",
  ],
  [
    "Are these actual products?",
    "All catalog entries, prices, variants and fabric specifications are sample content. AI-generated images are editorial concepts, not real product photography, and may be reused across demo products.",
  ],
  [
    "What is included with a saree?",
    "Each sample detail page lists a proposed saree size and blouse-piece specification. Actual dimensions and inclusions must be verified before launch.",
  ],
  [
    "How do I care for my saree?",
    "Sample care guidance appears on each product page. Always follow the verified care label for your actual garment.",
  ],
  [
    "When will my order arrive?",
    "No deliveries occur in the demo. Shipping rates, serviceable PIN codes and dispatch timelines will be available after shipping is connected.",
  ],
  [
    "Can I return or exchange a saree?",
    "Our pre-launch policy provides 7-day returns for unused, unwashed, unaltered sarees with tags and the complete uncut blouse piece. Brand-paid returns apply to faulty, incorrect or materially misdescribed items. Customer-paid return delivery applies to a change of mind, with no restocking fee. Statutory rights are unaffected. No real returns are processed in the demo.",
  ],
  [
    "Where are my favourites saved?",
    "Your wishlist, bag and simulated order summaries are saved in this browser’s local storage. They do not sync between devices.",
  ],
  [
    "How do I contact you?",
    "The contact form previews validation and feedback only. Official contact details will be added before launch.",
  ],
];
export default function Page() {
  return (
    <section className="section policy-page">
      <p className="eyebrow">A LITTLE CLARITY</p>
      <h1>
        Thoughtfully <em>answered.</em>
      </h1>
      <p className="demo-banner">
        Draft FAQ · Business-specific information requires approval.
      </p>
      <div className="faq-list">
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
