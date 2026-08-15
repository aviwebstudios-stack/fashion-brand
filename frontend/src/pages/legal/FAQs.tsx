import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "How long does a bespoke order take?",
    a: "Bespoke pieces typically take 4–8 weeks depending on complexity, with bridal gowns often taking longer for hand-beaded detail. Your exact timeline is confirmed during your consultation.",
  },
  {
    q: "Do you ship outside Nigeria?",
    a: "Currently we ship within Nigeria only. International shipping is something we're working on — reach out to us directly if you have an international order in mind.",
  },
  {
    q: "Can I return a bespoke or bridal piece?",
    a: "Bespoke and bridal pieces are made specifically to your measurements and are final sale. Ready-to-wear items can be returned within 7 days in original condition.",
  },
  {
    q: "How do I book a consultation?",
    a: "Head to the Book a Consultation page, choose a service, pick an available date and time, and confirm with payment to secure your slot.",
  },
  {
    q: "What sizes do you carry?",
    a: "Our ready-to-wear pieces run from S to XL, with bespoke and bridal pieces made to your exact measurements. Check our Sizing Guide for detailed charts.",
  },
  {
    q: "How do I care for a hand-beaded piece?",
    a: "Hand-beaded and embellished garments should be dry cleaned only and stored on a padded hanger. See our full Care Instructions page for more.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-center font-heading text-3xl text-brand-text">
        Frequently Asked Questions
      </h1>

      <div className="mt-10 divide-y divide-brand-text/10 border-t border-brand-text/10">
        {" "}
        {FAQ_ITEMS.map((item, i) => (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="text-sm font-medium text-brand-text">
                {item.q}
              </span>
              <span className="ml-4 shrink-0 text-brand-text/50"></span>
            </button>
            {openIndex === i && (
              <p className="pb-5 text-sm leading-relaxed text-brand-text/70">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
