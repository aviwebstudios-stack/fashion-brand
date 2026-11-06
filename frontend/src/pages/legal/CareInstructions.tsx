import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function CareInstructions() {
  return (
    <StaticPage
      title="Care Instructions"
      description="How to clean and store hand-beaded, silk and corseted Favy Atelier pieces so they keep their shape."
    >
      <p className={legalStyles.paragraph}>
        Good care keeps your Favy piece looking right for longer, especially hand-beaded and
        structured garments. Use the guidance below, but check the label sewn into your piece
        first.
      </p>
      <h2 className={legalStyles.heading}>Beaded & Embellished Pieces</h2>
      <p className={legalStyles.paragraph}>
        Dry clean only. Don't fold along beaded seams. Hang the piece on a padded hanger so it
        keeps its shape.
      </p>
      <h2 className={legalStyles.heading}>Silk & Delicate Fabrics</h2>
      <p className={legalStyles.paragraph}>
        Hand wash cold or dry clean. Dry out of direct sunlight to stop the colour fading.
      </p>
      <h2 className={legalStyles.heading}>Structured & Corseted Pieces</h2>
      <p className={legalStyles.paragraph}>
        Store flat or on a wide hanger. Spot clean where you can, and take boning or structured
        panels to a professional cleaner.
      </p>
    </StaticPage>
  );
}
