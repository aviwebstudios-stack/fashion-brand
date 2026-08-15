import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function TermsOfService() {
  return (
    <StaticPage title="Terms of Service">
      <p className={legalStyles.paragraph}>
        <em>
          This is placeholder terms content for development purposes. Before taking this site
          live, have this reviewed and finalized by a qualified lawyer.
        </em>
      </p>
      <h2 className={legalStyles.heading}>Orders & Payment</h2>
      <p className={legalStyles.paragraph}>
        All prices are listed in Nigerian Naira (₦). Orders are confirmed only once payment has
        been successfully processed.
      </p>
      <h2 className={legalStyles.heading}>Bespoke & Bridal Work</h2>
      <p className={legalStyles.paragraph}>
        Bespoke and bridal commissions require a consultation and are produced to the
        measurements and specifications agreed upon during that consultation. These pieces are
        final sale.
      </p>
      <h2 className={legalStyles.heading}>Account Responsibility</h2>
      <p className={legalStyles.paragraph}>
        You are responsible for maintaining the confidentiality of your account credentials and
        for all activity under your account.
      </p>
    </StaticPage>
  );
}