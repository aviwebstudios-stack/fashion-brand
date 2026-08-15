import StaticPage, { legalStyles } from "../../components/legal/StaticPage";

const ROLES = [
  { title: "Senior Pattern Cutter", type: "Full-time · Lagos Island" },
  { title: "Bridal Consultant", type: "Full-time · Lagos Island" },
  { title: "Junior Seamstress", type: "Full-time · Lagos Island" },
];

export default function Careers() {
  return (
    <StaticPage title="Careers">
      <p className={legalStyles.paragraph}>
        We're always looking for skilled, detail-obsessed people to join the
        atelier. Below are our current openings.
      </p>
      <div className="mt-8 space-y-4">
        {ROLES.map((role) => (
          <div
            key={role.title}
            className="flex items-center justify-between border border-[#2b2b26]/10 px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium text-[#2b2b26]">{role.title}</p>
              <p className="mt-1 text-xs text-[#2b2b26]/60">{role.type}</p>
            </div>

            <a
              href="mailto:careers@favyatelier.com"
              className="text-xs text-[#c9a227] underline"
            >
              Apply
            </a>
          </div>
        ))}
      </div>
      <p className={legalStyles.paragraph}>
        Don't see a fit? Send your portfolio and resume to{" "}
        <a
          href="mailto:careers@favyatelier.com"
          className="text-brand-accent underline"
        >
          careers@favyatelier.com
        </a>{" "}
        — we keep every submission on file.
      </p>
    </StaticPage>
  );
}
