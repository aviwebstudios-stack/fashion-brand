import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function About() {
  return (
    <StaticPage
      title="Our Story"
      description="Favy Atelier started as a small bespoke studio on Lagos Island. Today we make ready-to-wear, bridal and bespoke pieces for African women."
    >
      <p className={legalStyles.paragraph}>
        Favy Atelier started on Lagos Island with one idea: a garment should feel like it was made
        for one person, because it was. What began as a small bespoke studio is now a full
        atelier, and the work is still hands-on.
      </p>
      <p className={legalStyles.paragraph}>
        Today we make ready-to-wear collections, bridal gowns and fully bespoke pieces. Each one
        starts with careful tailoring and good fabric.
      </p>
      <h2 className={legalStyles.heading}>How We Design</h2>
      <p className={legalStyles.paragraph}>
        We design for real bodies and real occasions. Our collections mix West African textile
        traditions with modern shapes.
      </p>
    </StaticPage>
  );
}
