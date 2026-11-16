export interface PolicySection {
  title: string;
  body?: string;
  bullets?: string[];
}
export interface BrandPolicy {
  title: string;
  eyebrow: string;
  intro: string;
  summary?: { label: string; value: string }[];
  sections: PolicySection[];
}
export const policyStatus =
  "Pre-launch policy draft · 7-day return window approved · Support channels and operational setup pending";
export const policies: Record<string, BrandPolicy> = {
  returns: {
    title: "Returns & exchanges",
    eyebrow: "A CONSIDERED PURCHASE. A CLEAR PROMISE.",
    intro:
      "We want your saree to feel right, from the first unfolding. Our return policy is designed to be clear, fair, and easy to understand.",
    summary: [
      { label: "Return request", value: "Within 7 calendar days" },
      { label: "Condition", value: "Unused & unaltered" },
      { label: "Restocking fee", value: "None" },
    ],
    sections: [
      {
        title: "Your 7-day return window",
        body: "Request a return within 7 calendar days of receiving your saree. The day after confirmed delivery is day one. This window applies to change-of-mind returns; it does not limit remedies for faulty, incorrect or misdescribed goods under applicable law.",
      },
      {
        title: "What is eligible",
        bullets: [
          "The saree must be unused, unwashed, unaltered and free of perfume, stains, makeup or damage caused after delivery. A careful indoor inspection is welcome.",
          "Keep the original tags attached and return the complete set, including the uncut blouse piece and any included accessories.",
          "Please keep the original protective packaging where reasonably possible. Missing outer courier packaging alone is not a reason to reject an otherwise eligible return.",
          "Do not cut the blouse piece, stitch a blouse, add a fall or pico, or alter the saree until you have decided to keep it.",
        ],
      },
      {
        title: "Customisation and exclusions",
        body: "Sarees cut, stitched, personalised or altered at your request are not eligible for change-of-mind returns once that work has begun. Any such restriction must be shown before purchase. Sale items remain eligible unless a specific change-of-mind exclusion is clearly disclosed before checkout. These exclusions do not remove rights relating to defects, wrong items or inaccurate descriptions.",
      },
      {
        title: "If something arrives wrong",
        body: "Please contact us as soon as you notice damage, a missing component, a wrong item or a material difference from the description. Share your order number and clear photographs where available. An unboxing video may help, but is not mandatory and its absence will not automatically invalidate a claim. We will assess the issue fairly and arrange the appropriate refund, replacement or other lawful remedy.",
      },
      {
        title: "How a return works",
        bullets: [
          "Contact the official support channel with your order number, item and reason. Support details will be published before live orders open.",
          "We will acknowledge the request, explain the next steps and provide an authorised return address or collection instructions. Please do not send items to an unconfirmed address.",
          "For a change-of-mind return, send the item within 7 calendar days of receiving return instructions. If our collection is delayed, your eligibility will not be reduced because of our delay.",
          "Pack the complete item securely and retain the tracking receipt. We will confirm receipt and share an inspection decision, normally within 3 business days.",
          "If we decline a request, we will explain the reason and any supporting findings. You may ask for a review through our customer-service process.",
        ],
      },
      {
        title: "Who pays for return delivery",
        body: "Ardhanari Collection covers reasonable return-shipping costs for faulty, damaged-on-arrival, incorrect or materially misdescribed items. For a change-of-mind return, the customer pays the actual return-delivery cost, disclosed before collection is booked. There is no restocking fee. Use our agreed shipping arrangement; contact us first before paying an unusually high courier charge.",
      },
      {
        title: "Refunds, clearly explained",
        body: "Once approved, we aim to initiate the refund within 5 business days, subject to any shorter applicable legal requirement. Refunds go to the original payment method wherever supported; store credit will not replace a refund without your agreement. Your bank or payment provider may take an additional 5–10 business days to show the credit. We will provide a refund reference where available and help investigate delays.",
      },
      {
        title: "What will be refunded",
        body: "An eligible refund covers the amount actually paid for the returned item, including applicable item taxes, after the discount allocated to it. For a full order returned because it was faulty, incorrect or materially misdescribed, the original delivery charge is also refunded. For a change-of-mind return, an original delivery service already completed is not refunded. Any applicable return-delivery deduction will be explained before you agree to it.",
      },
      {
        title: "Exchanges and cancellations",
        body: "Exchanges depend on verified availability. We will explain any price difference before you choose a replacement; if the replacement is unavailable, you may take the eligible refund instead. Request cancellation before dispatch or before agreed customisation begins. Where we can stop an unshipped, uncustomised order, we will refund it without a cancellation fee. If dispatch has already occurred, the applicable return process applies.",
      },
      {
        title: "Colour, texture and your rights",
        body: "Screens and lighting can affect colour appearance. Small, accurately disclosed variations in a verified woven textile may be part of its character, but “handmade variation” is not a blanket excuse for damage, undisclosed defects or material misdescription. Nothing in this policy excludes rights or remedies available under Indian consumer law.",
      },
    ],
  },
  care: {
    title: "The care of a beautiful drape",
    eyebrow: "CARE, BEYOND THE FIRST WEAR",
    intro:
      "A little attention helps preserve the colour, texture and fall you love. Always follow the care label supplied with your actual saree; the guidance below is general and never overrides garment-specific instructions.",
    summary: [
      { label: "Begin with", value: "The garment label" },
      { label: "Store with", value: "Space & protection" },
      { label: "When unsure", value: "Ask a textile specialist" },
    ],
    sections: [
      {
        title: "Before the first wear",
        bullets: [
          "Inspect the saree, border, pallu and blouse piece before cutting, stitching or adding a fall or pico.",
          "Keep the invoice and care label. Confirm the fabric composition and any special instructions for zari, embroidery, dyes or embellishments.",
          "Avoid testing an unfamiliar cleaning method on a valuable saree. If instructions are absent or unclear, ask us or a qualified textile cleaner first.",
        ],
      },
      {
        title: "Silk, brocade and zari",
        body: "For delicate silk or embellished sarees, consult a professional cleaner experienced with such textiles and follow the label’s permitted process. Do not assume that all silk is washable or that every metallic-looking thread is real zari. Avoid vigorous rubbing, twisting, bleach and improvised stain treatments. Tell the cleaner about contrast borders, trims and any known colour transfer.",
      },
      {
        title: "Organza, chiffon and georgette",
        body: "These names describe fabric structures, not a single fibre. Silk and synthetic versions can require different care. Follow the actual composition and care label. Handle sheer fabrics gently, keep sharp jewellery and rough bag straps away from the weave, and avoid pulling or trimming a snag yourself.",
      },
      {
        title: "Cotton and everyday drapes",
        body: "If the care label permits washing, use its specified temperature, detergent and cycle. Wash separately where advised, especially for deep colours or contrast borders. Do not assume colourfastness, shrink resistance or machine washability unless confirmed. Dry and press according to the label rather than treating every cotton saree the same way.",
      },
      {
        title: "Pressing and wearing",
        bullets: [
          "Use only the temperature and steam setting permitted by the garment label. If ironing is allowed, a suitable clean pressing cloth can help protect the surface.",
          "Do not press directly on embroidery, sequins, metallic thread or delicate trims. Avoid prolonged heat on one spot.",
          "Apply perfume and cosmetics before dressing and let them dry. Prevent direct contact with the saree.",
          "Use smooth, secure fastenings and keep pins away from delicate or heavily embellished areas.",
        ],
      },
      {
        title: "After an occasion",
        body: "Check for spills and stains before putting the saree away. Gently blot a fresh spill with a clean, dry white cloth without rubbing; do not add a cleaning chemical or water unless the care instructions permit it. Seek prompt specialist advice for persistent marks. Do not store a damp garment.",
      },
      {
        title: "Storing thoughtfully",
        body: "Keep the saree clean and fully dry in a cool, dry place away from direct sunlight. Use a clean, breathable protective cover suitable for the textile, avoid compressing heavy embellishments, and check stored pieces periodically for moisture or pests. Avoid direct contact with mothballs, perfume or harsh storage chemicals. Refold with care rather than leaving a delicate piece under prolonged pressure at the same crease.",
      },
      {
        title: "Care advice is not a warranty waiver",
        body: "We cannot promise that any fabric is stain-proof, fade-proof or damage-proof. Normal wear and accidental damage are different from a manufacturing defect, and each concern should be assessed on its facts. General care advice does not remove your rights where an item is defective or its supplied instructions are wrong.",
      },
    ],
  },
  service: {
    title: "At your service",
    eyebrow: "CONSIDERED HELP. HUMAN ATTENTION.",
    intro:
      "The experience should feel as thoughtful as the collection. These are the service standards we are preparing for live orders.",
    summary: [
      { label: "Proposed hours", value: "Mon–Sat · 10 am–6 pm IST" },
      { label: "Enquiries", value: "Within 2 business days" },
      { label: "Formal complaints", value: "Acknowledged within 48 hours" },
    ],
    sections: [
      {
        title: "A clear point of contact",
        body: "Before live ordering begins, this page will publish our verified customer-care email or WhatsApp number, business address and designated grievance officer’s name and contact details. These are not yet configured. The current contact form is a demonstration and does not send messages; please do not use it for an actual return request.",
      },
      {
        title: "Help choosing a saree",
        body: "We can explain verified fabric composition, dimensions, blouse-piece inclusions, available colours and published care instructions. We will distinguish a styling suggestion from a product fact and will tell you when information has not yet been verified. Personalised recommendations are guidance, not a guarantee of fit, colour match or suitability for every occasion.",
      },
      {
        title: "Response times",
        body: "Our proposed service hours are Monday to Saturday, 10:00 am to 6:00 pm Indian Standard Time, excluding published public holidays. We aim to answer ordinary enquiries within 2 business days. Formal consumer complaints are acknowledged within 48 hours and addressed within one month, in accordance with applicable requirements; service hours do not extend those complaint deadlines.",
      },
      {
        title: "Orders and delivery updates",
        body: "Once live services are connected, we will provide an order reference, an accurate payment status and available shipment tracking. Dispatch estimates and courier delivery estimates will be identified separately. We will communicate material delays and the available options, without promising a delivery date that has not been confirmed.",
      },
      {
        title: "If a concern needs a second look",
        bullets: [
          "Contact customer care with your order reference, a concise account of the issue and relevant photos or correspondence. Never send a password, OTP, CVV or full card number.",
          "We will record the complaint, provide a reference and a copy of the recorded concern, and explain the next step.",
          "If unresolved, request review by the designated grievance officer. Their verified details must appear here before launch.",
          "Our internal process does not prevent you from using the National Consumer Helpline or other remedies available under applicable law.",
        ],
      },
      {
        title: "Respect, privacy and accessibility",
        body: "We aim to offer courteous assistance without pressure or discrimination. We ask that conversations remain respectful; a difficult complaint will still be reviewed on its merits. We request only information relevant to the enquiry, do not ask for payment credentials, and will offer a reasonable alternative where a customer cannot use a particular form or provide a particular type of evidence.",
      },
      {
        title: "What is not yet offered",
        body: "The current storefront does not provide live customer accounts, payment collection, delivery, alterations, repairs, cleaning, gift wrapping or concierge appointments. Any future paid or complimentary service will be described separately with its scope, price and applicable terms before you choose it.",
      },
    ],
  },
  "brand-standards": {
    title: "The Ardhanari standard",
    eyebrow: "OUR PRINCIPLES, IN EVERY THREAD",
    intro:
      "Elegance is more than a visual language. It is the care we take with what we say, what we show, and how we treat the people who choose us.",
    sections: [
      {
        title: "An identity with intention",
        body: "Our name is ARDHANARI COLLECTION. Our signature is “Elegance, Woven Into Every Thread.” Our visual language draws on ivory, warm cream, antique gold and deep espresso, with quiet references to textile form and Indian architecture. We express heritage through design; we do not invent an establishment date, family lineage or royal association.",
      },
      {
        title: "Truth before storytelling",
        bullets: [
          "Claims such as pure silk, handwoven, handloom, real zari, geographical origin, artisan-made or certified must be supported by product-specific evidence.",
          "We do not imply an artisan partnership, environmental benefit or authenticity certification without verification and permission.",
          "Product descriptions must state known material, dimensions, blouse inclusions, care and relevant limitations in plain language. Unknown details remain unknown until checked.",
        ],
      },
      {
        title: "Photography that respects the product",
        body: "Live product images must faithfully show the item being sold. Styling pieces and accessories that are not included must be identified. Colour changes, AI-generated editorials, concept imagery and illustrative crops must never be passed off as exact inventory photography. The current demo uses clearly labeled sample images and specifications.",
      },
      {
        title: "Honest prices and considered choices",
        body: "Display the payable price, applicable delivery charges and any other compulsory charge before payment. Explain discount eligibility and reference prices. Do not invent low stock, countdowns, customer activity, reviews or demand. Optional services require a deliberate choice, and a customer should be able to leave checkout without pressure.",
      },
      {
        title: "Respect for every customer",
        body: "Our communication should be warm, clear and inclusive across age groups, backgrounds and personal styles. Avoid shaming, exaggerated promises and unexplained jargon. Treat accessibility, readable information and fair complaint handling as part of the brand experience.",
      },
      {
        title: "Careful handling and accountability",
        body: "Before live dispatch, the operating process must check the correct SKU and variant, visible condition, included components and protective packaging. Record and investigate complaints consistently. Correct verified mistakes in descriptions and service communications, and preserve the customer’s applicable rights.",
      },
      {
        title: "Responsible use of the brand",
        body: "Do not impersonate Ardhanari Collection, use its identity to solicit unauthorised payments, misrepresent a partnership or publish fabricated endorsements. Commercial use of brand-owned creative material requires permission from the rights holder. Nothing here claims ownership of third-party licensed material or restricts uses permitted by law.",
      },
      {
        title: "Policy changes",
        body: "Publish the effective date of an approved policy before it governs live orders. Keep a record of the terms shown at purchase and do not apply a later, less favourable change retrospectively to an existing order. This document is a pre-launch draft; the storefront currently accepts no real orders.",
      },
    ],
  },
  shipping: {
    title: "Shipping & delivery",
    eyebrow: "THE JOURNEY TO YOUR DOOR",
    intro: "Clear expectations, careful handling, and updates you can follow.",
    sections: [
      {
        title: "Current availability",
        body: "This storefront is a demo and does not dispatch goods. Delivery regions, couriers and serviceable PIN codes will be published when live shipping is ready.",
      },
      {
        title: "Before you pay",
        body: "Live checkout will show the delivery address, available method, applicable delivery fee and estimated timeframe before payment. An item’s preparation time will be stated separately from courier transit time. No express or occasion-specific delivery promise is made unless explicitly confirmed.",
      },
      {
        title: "Tracking and delays",
        body: "After dispatch, we will provide the available tracking reference. If an order is delayed, lost or marked delivered but not received, contact customer care so we can investigate with the courier and explain the appropriate next steps. This policy does not exclude applicable remedies for non-delivery or late delivery.",
      },
      {
        title: "Address changes",
        body: "Check your address and PIN code before confirming an order. Tell us promptly if a correction is needed. Changes may not be possible after dispatch; any additional delivery charge must be explained and agreed before it is incurred.",
      },
    ],
  },
  privacy: {
    title: "Your privacy",
    eyebrow: "INFORMATION, HANDLED WITH CARE",
    intro:
      "A clear account of what this demonstration does with your information.",
    sections: [
      {
        title: "What this demo stores",
        body: "Your bag, wishlist and simulated order summaries are stored in this browser under ardhanari-demo-v1. Checkout addresses, contact messages, newsletter emails and passwords are not stored by these demo forms or sent to a brand backend.",
      },
      {
        title: "Your control",
        body: "Clear this site’s browser storage to remove the local records. They do not sync between devices. No live account or payment-provider connection is present.",
      },
      {
        title: "Before live services begin",
        body: "A complete privacy notice must identify the business, processing purposes, service providers, retention, rights-request process, contact details and any applicable cookies or analytics. It must accurately reflect the implemented systems. This draft is not a statement that future systems are already configured or compliant.",
      },
    ],
  },
  terms: {
    title: "Terms of use",
    eyebrow: "A CLEAR FOUNDATION",
    intro: "Considered terms for exploring our collection.",
    sections: [
      {
        title: "Demonstration only",
        body: "This website is a frontend demonstration. Sample catalog entries are not current offers for sale. Simulated orders do not create a purchase contract, take payment or request shipment.",
      },
      {
        title: "Sample material",
        body: "Images, colour concepts, prices, specifications and testimonials are illustrative unless expressly verified. AI-generated campaign imagery is identified as concept editorial. No sample testimonial is represented as an actual customer review.",
      },
      {
        title: "Future purchases",
        body: "Before live orders are enabled, the business must publish its verified identity and contact details, approved purchase terms, total pricing, delivery conditions and accessible return and grievance procedures. Customers must expressly confirm a real purchase; no pre-ticked consent or demo action may be treated as payment authorisation.",
      },
      {
        title: "Your rights",
        body: "Nothing in these draft terms attempts to waive consumer rights or prevent access to remedies under applicable law. The approved policy version shown at the time of a future purchase should govern that order, subject to those rights.",
      },
    ],
  },
};
export const policyNavigation = [
  { slug: "returns", label: "Returns & exchanges" },
  { slug: "care", label: "Saree care" },
  { slug: "service", label: "Customer service" },
  { slug: "brand-standards", label: "Our standards" },
  { slug: "shipping", label: "Shipping" },
];
