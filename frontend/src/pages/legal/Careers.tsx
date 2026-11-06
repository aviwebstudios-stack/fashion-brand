import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

const ROLES = [
  { title: "Senior Pattern Cutter", type: "Full-time · Lagos Island" },
  { title: "Bridal Consultant", type: "Full-time · Lagos Island" },
  { title: "Junior Seamstress", type: "Full-time · Lagos Island" },
];

export default function Careers() {
  return (
    <StaticPage
      title="Careers"
      description="Open roles at the Favy Atelier studio on Lagos Island, and where to send your portfolio."
    >
      <p className={legalStyles.paragraph}>
        We hire pattern cutters, seamstresses and consultants who care about the
        details. These are the roles open now.
      </p>
      <div className="mt-8 space-y-4">
        {ROLES.map((role) => (
          <div
            key={role.title}
            className="flex items-center justify-between gap-4 border border-[#2b2b26]/10 px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium text-[#2b2b26]">{role.title}</p>
              <p className="mt-1 text-xs text-[#2b2b26]/60">{role.type}</p>
            </div>

            <a
              href={`mailto:careers@favyatelier.com?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
              className="inline-flex min-h-11 shrink-0 items-center px-2 text-xs text-[#c9a227] underline"
            >
              Apply by Email
            </a>
          </div>
        ))}
      </div>
      <p className={legalStyles.paragraph}>
        If none of these fit, send your portfolio and CV to{" "}
        <a
          href="mailto:careers@favyatelier.com"
          className="text-brand-accent underline"
        >
          careers@favyatelier.com
        </a>
        . We keep every application on file.
      </p>
    </StaticPage>
  );
}
