import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function Atelier() {
  return (
    <StaticPage title="The Atelier">
      <p className={legalStyles.paragraph}>
        Our atelier on Lagos Island is where every Favy piece takes shape — from first sketch to
        final fitting. It houses our pattern room, our tailoring floor, and the small team of
        seamstresses and pattern cutters behind every collection.
      </p>
      <h2 className={legalStyles.heading}>Visit Us</h2>
      <p className={legalStyles.paragraph}>
        Bespoke and bridal clients are welcome to visit the atelier by appointment for fittings
        and consultations. Book a session through our{" "}
<a href="/consultations" className="text-brand-accent underline">          consultations page
        </a>{" "}
        to arrange a visit.
      </p>
      <h2 className={legalStyles.heading}>Craftsmanship</h2>
      <p className={legalStyles.paragraph}>
        Every garment passes through multiple hands before it reaches you — pattern drafting,
        cutting, construction, and a final quality check — ensuring the same standard whether
        you're ordering a ready-to-wear piece or a fully custom gown.
      </p>
    </StaticPage>
  );
}