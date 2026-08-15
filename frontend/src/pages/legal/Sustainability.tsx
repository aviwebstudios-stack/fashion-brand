import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function ShippingReturns() {
  return (
    <StaticPage title="Shipping & Returns">
      <h2 className={legalStyles.heading}>Shipping</h2>
      <p className={legalStyles.paragraph}>
        Orders within Lagos typically arrive within 2–4 business days. Orders to other states in
        Nigeria take 4–7 business days. Complimentary shipping applies to orders above ₦150,000.
      </p>
      <p className={legalStyles.paragraph}>
        Bespoke and bridal pieces follow a separate production timeline discussed during your
        consultation and are not covered by standard shipping estimates.
      </p>
      <h2 className={legalStyles.heading}>Returns</h2>
      <p className={legalStyles.paragraph}>
        Ready-to-wear items in original, unworn condition may be returned within 7 days of
        delivery. Bespoke, bridal, and made-to-order pieces are final sale, as they are
        constructed specifically for you.
      </p>
      <h2 className={legalStyles.heading}>How to Start a Return</h2>
      <p className={legalStyles.paragraph}>
        Contact{" "}
        <a href="mailto:orders@favyatelier.com" className="text-[#c9a227] underline">
          orders@favyatelier.com
        </a>{" "}
        with your order number and we'll walk you through the process.
      </p>
    </StaticPage>
  );
}