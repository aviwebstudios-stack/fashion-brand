import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function CareInstructions() {
  return (
    <StaticPage title="Care Instructions">
      <p className={legalStyles.paragraph}>
        Proper care extends the life of your Favy piece, especially for hand-beaded and
        structured garments. General guidance below — always check the label sewn into your
        specific piece first.
      </p>
      <h2 className={legalStyles.heading}>Beaded & Embellished Pieces</h2>
      <p className={legalStyles.paragraph}>
        Dry clean only. Avoid folding along beaded seams — hang on a padded hanger to preserve
        shape.
      </p>
      <h2 className={legalStyles.heading}>Silk & Delicate Fabrics</h2>
      <p className={legalStyles.paragraph}>
        Hand wash cold or dry clean. Avoid direct sunlight when drying to prevent fading.
      </p>
      <h2 className={legalStyles.heading}>Structured & Corseted Pieces</h2>
      <p className={legalStyles.paragraph}>
        Store flat or on a wide hanger. Spot clean where possible; consult a professional cleaner
        for boning or structured panels.
      </p>
    </StaticPage>
  );
}