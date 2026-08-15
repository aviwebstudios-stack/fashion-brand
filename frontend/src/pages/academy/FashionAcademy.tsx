import { useState, type FormEvent } from "react";
import api from "../../lib/api";
import { useContent } from "../../lib/useContent";

interface Program {
  name: string;
  duration: string;
  price: string;
  description: string;
  image: string;
}

const PROGRAMS: Program[] = [
  {
    name: "Pattern Cutting & Garment Construction",
    duration: "8 weeks",
    price: "₦280,000",
    description:
      "Master the fundamentals of pattern drafting, fabric behavior, and precision garment construction from first sketch to finished piece.",
    image: "https://picsum.photos/seed/academy-pattern/500/400",
  },
  {
    name: "Bridal Couture Techniques",
    duration: "6 weeks",
    price: "₦350,000",
    description:
      "A hands-on deep dive into corsetry, beading, and structured bridal silhouettes taught by our senior atelier team.",
    image: "https://picsum.photos/seed/academy-bridal/500/400",
  },
  {
    name: "Fashion Business & Entrepreneurship",
    duration: "4 weeks",
    price: "₦150,000",
    description:
      "Build the business behind the brand — pricing, sourcing, client relationships, and scaling a fashion label in Nigeria.",
    image: "https://picsum.photos/seed/academy-business/500/400",
  },
];

// TODO: replace with your real WhatsApp business number
const WHATSAPP_NUMBER = "2348000000000";

export default function FashionAcademy() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const heroTitle = useContent("academy.hero.title", "Favy Fashion Academy");
  const heroSubtitle = useContent(
    "academy.hero.subtitle",
    "Learn the craft behind Favy Atelier. Our academy offers hands-on, small-group programs for aspiring designers, tailors, and fashion entrepreneurs — taught by the same team that builds our collections."
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/inquiries/academy-interest", {
        name,
        email,
        phone,
        program: selectedProgram,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="font-heading text-3xl text-brand-text">{heroTitle}</h1>
        <p className="mt-4 text-sm leading-relaxed text-brand-text/70">{heroSubtitle}</p>
      </div>

      {/* Programs */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PROGRAMS.map((program) => (
            <div key={program.name} className="border border-brand-text/10">
              <div className="aspect-[4/3] overflow-hidden bg-[#e5e1d8]">
                <img
                  src={program.image}
                  alt={program.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg text-brand-text">{program.name}</h3>
                <p className="mt-1 text-xs text-brand-text/60">
                  {program.duration} · {program.price}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-text/70">
                  {program.description}
                </p>
                <button
                  onClick={() => {
                    setSelectedProgram(program.name);
                    setSubmitted(false);
                  }}
                  className="mt-4 w-full bg-brand-primary py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
                >
                  Express Interest
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interest form */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="relative w-full max-w-md bg-brand-bg p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProgram(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1 text-brand-text/60 transition hover:bg-black/5 hover:text-brand-text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="py-10 text-center">
                <p className="font-heading text-xl text-brand-text">Thank you!</p>
                <p className="mt-2 text-sm text-brand-text/70">
                  We've received your interest in {selectedProgram} and will be in touch soon.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-xl text-brand-text">{selectedProgram}</h2>
                <p className="mt-2 text-sm text-brand-text/70">
                  Leave your details and our academy team will reach out with enrollment info, or
                  message us directly on WhatsApp.
                </p>

                
                 <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hi Favy Atelier, I'm interested in the "${selectedProgram}" program.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 border border-[#25D366] py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#128C7E] transition hover:bg-[#25D366]/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.05 2h-.01zm0 18.13h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 01-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.15.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.24-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43-.14 0-.31-.01-.47-.01-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.68 4.25 3.75.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" />
                  </svg>
                  Chat on WhatsApp
                </a>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-brand-text/10" />
                  <span className="text-xs text-brand-text/50">or</span>
                  <span className="h-px flex-1 bg-brand-text/10" />
                </div>

                {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
                  >
                    {sending ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}