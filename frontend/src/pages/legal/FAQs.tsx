import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { usePageMeta } from "../../lib/usePageMeta";

const FAQ_ITEMS = [
  {
    q: "How long does a bespoke order take?",
    a: "Bespoke pieces usually take 4 to 8 weeks, depending on the design. Bridal gowns with hand beading can take longer. We confirm your exact timeline at your consultation.",
  },
  {
    q: "Do you ship outside Nigeria?",
    a: "Not yet. We only ship within Nigeria for now. If you want to order from abroad, contact us and we'll see what we can do.",
  },
  {
    q: "Can I return a bespoke or bridal piece?",
    a: "Bespoke and bridal pieces are made specifically to your measurements and are final sale. Ready-to-wear items can be returned within 7 days in original condition.",
  },
  {
    q: "How do I book a consultation?",
    a: "Go to the Book a Consultation page, choose a service, pick a date and time, then pay to confirm your slot.",
  },
  {
    q: "What sizes do you carry?",
    a: "Ready-to-wear runs from S to XL. Bespoke and bridal pieces are made to your measurements. The Sizing Guide has the full charts.",
  },
  {
    q: "How do I care for a hand-beaded piece?",
    a: "Dry clean it only and store it on a padded hanger. The Care Instructions page has more detail.",
  },
];

export default function FAQs() {
  usePageMeta({
    title: "FAQs",
    description: "Answers on bespoke timelines, shipping within Nigeria, returns, sizes, booking a consultation and caring for beaded pieces.",
  });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl text-brand-text">
        Frequently Asked Questions
      </h1>

      <div className="mt-10 divide-y divide-brand-text/10 border-t border-brand-text/10">
        {FAQ_ITEMS.map((item, i) => (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="text-sm font-medium text-brand-text">
                {item.q}
              </span>
              <span className="ml-4 shrink-0 text-brand-text/70" aria-hidden="true">
                {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
              </span>
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
