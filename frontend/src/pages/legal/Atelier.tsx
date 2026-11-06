import { Link } from "react-router-dom";
import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function Atelier() {
  return (
    <StaticPage
      title="The Atelier"
      description="Our Lagos Island atelier holds the pattern room and tailoring floor where every Favy piece is made. Bespoke and bridal clients can visit by appointment."
    >
      <p className={legalStyles.paragraph}>
        Every Favy piece is made in our atelier on Lagos Island, from the first sketch to the final
        fitting. It holds our pattern room, our tailoring floor and the small team of seamstresses
        and pattern cutters behind each collection.
      </p>
      <h2 className={legalStyles.heading}>Visit Us</h2>
      <p className={legalStyles.paragraph}>
        Bespoke and bridal clients can visit the atelier by appointment for fittings and
        consultations. To arrange a visit, book a session on our{" "}
        <Link to="/consultations" className="text-brand-gold underline">
          consultations page
        </Link>
        .
      </p>
      <h2 className={legalStyles.heading}>How a Piece Is Made</h2>
      <p className={legalStyles.paragraph}>
        Every garment goes through pattern drafting, cutting, construction and a final quality
        check before it reaches you. Ready-to-wear and fully custom gowns get the same checks.
      </p>
    </StaticPage>
  );
}
