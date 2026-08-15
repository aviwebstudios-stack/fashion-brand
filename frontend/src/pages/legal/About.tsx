import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

export default function About() {
  return (
    <StaticPage title="Our Story">
      <p className={legalStyles.paragraph}>
        Favy Atelier was founded on Lagos Island with a simple belief: that every garment should
        feel like it was made for exactly one person — because it was. What began as a small
        bespoke studio has grown into a full atelier serving the contemporary African woman,
        without ever losing the hands-on craftsmanship that started it all.
      </p>
      <p className={legalStyles.paragraph}>
        Today, Favy Atelier designs ready-to-wear collections, bridal couture, and fully bespoke
        pieces — each one built on the same foundation of precise tailoring, quality fabric
        sourcing, and genuine care for the woman wearing it.
      </p>
      <h2 className={legalStyles.heading}>Our Philosophy</h2>
      <p className={legalStyles.paragraph}>
        We design for real bodies, real occasions, and real life. Every collection blends
        traditional West African textile artistry with modern silhouettes, so our pieces feel
        both rooted and current.
      </p>
    </StaticPage>
  );
}