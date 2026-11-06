import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

// NOTE: this page currently repeats the Shipping & Returns text. It needs real
// sustainability content from the business before it goes live.
export default function Sustainability() {
  return (
    <StaticPage
      title="Shipping & Returns"
      description="Delivery times within Lagos and across Nigeria, free shipping over ₦150,000, and how to return an unworn ready-to-wear piece within 7 days."
    >
      <h2 className={legalStyles.heading}>Shipping</h2>
      <p className={legalStyles.paragraph}>
        Orders within Lagos usually arrive in 2 to 4 business days. Orders to other states in
        Nigeria take 4 to 7 business days. Shipping is free on orders above ₦150,000.
      </p>
      <p className={legalStyles.paragraph}>
        Bespoke and bridal pieces have their own production timeline, which we agree with you at
        your consultation. The delivery times above don't apply to them.
      </p>
      <h2 className={legalStyles.heading}>Returns</h2>
      <p className={legalStyles.paragraph}>
        You can return ready-to-wear items within 7 days of delivery if they are unworn and in
        their original condition. Bespoke, bridal and made-to-order pieces are made for you, so
        they can't be returned.
      </p>
      <h2 className={legalStyles.heading}>How to Start a Return</h2>
      <p className={legalStyles.paragraph}>
        Email{" "}
        <a href="mailto:orders@favyatelier.com" className="text-brand-gold underline">
          orders@favyatelier.com
        </a>{" "}
        with your order number and we'll take you through it.
      </p>
    </StaticPage>
  );
}
