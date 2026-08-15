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
    <StaticPage title="Press">
      <p className={legalStyles.paragraph}>
        A selection of features and mentions. For press inquiries, reach us at{" "}
        <a
          href="mailto:press@favyatelier.com"
          className="text-brand-accent underline"
        >
          {" "}
          press@favyatelier.com
        </a>
        .
      </p>
      <div className="mt-8 space-y-6">
        {PRESS_ITEMS.map((item) => (
          <div key={item.title} className="border-b border-[#2b2b26]/10 pb-6">
            <p className="text-xs uppercase tracking-[0.1em] text-[#c9a227]">
              {item.outlet}
            </p>
            <p className="mt-1 text-sm text-[#2b2b26]">{item.title}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
