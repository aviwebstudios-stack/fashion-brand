import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy">
      <p className={legalStyles.paragraph}>
        <em>
          This is placeholder policy content for development purposes. Before
          taking this site live, have this reviewed and finalized by a qualified
          lawyer familiar with Nigerian data protection law (NDPR).
        </em>
      </p>
      <h2 className={legalStyles.heading}>Information We Collect</h2>
      <p className={legalStyles.paragraph}>
        We collect information you provide directly — name, email, phone number,
        delivery address, and measurements — when you create an account, place
        an order, or book a consultation.
      </p>
      <h2 className={legalStyles.heading}>How We Use Your Information</h2>
      <p className={legalStyles.paragraph}>
        We use your information to process orders and bookings, communicate with
        you about your account, and improve our services. We do not sell your
        personal information to third parties.
      </p>
      <h2 className={legalStyles.heading}>Payment Information</h2>
      <p className={legalStyles.paragraph}>
        Payments are processed securely through Paystack. We do not store your
        card details on our servers.
      </p>
      <h2 className={legalStyles.heading}>Contact</h2>
      <p className={legalStyles.paragraph}>
        Questions about this policy can be directed to{" "}
        <a
          href="mailto:privacy@favyatelier.com"
          className="text-brand-accent underline"
        >
          privacy@favyatelier.com
        </a>
        .
      </p>
    </StaticPage>
  );
}
