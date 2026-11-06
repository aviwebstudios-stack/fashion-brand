import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

const PRESS_ITEMS = [
  {
    outlet: "Lagos Fashion Weekly",
    title: "Favy Atelier's Quiet Rise in Nigerian Bridal Wear",
  },
  {
    outlet: "Style Africa Magazine",
    title: "Ten Designers Redefining Ready-to-Wear in West Africa",
  },
  {
    outlet: "The Culture Desk",
    title: "Inside the Atelier Bringing Bespoke Tailoring Back",
  },
];

export default function Press() {
  return (
    <StaticPage
      title="Press"
      description="Press features on Favy Atelier and the email for press enquiries."
    >
      <p className={legalStyles.paragraph}>
        Some of the places Favy Atelier has been featured. For press enquiries, email{" "}
        <a
          href="mailto:press@favyatelier.com"
          className="text-brand-gold underline"
        >
          press@favyatelier.com
        </a>
        .
      </p>
      <div className="mt-8 space-y-6">
        {PRESS_ITEMS.map((item) => (
          <div key={item.title} className="border-b border-brand-text/10 pb-6">
            <p className="text-xs uppercase tracking-[0.1em] text-brand-gold">
              {item.outlet}
            </p>
            <p className="mt-1 text-sm text-brand-text">{item.title}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
