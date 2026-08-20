import { useState, type FormEvent } from "react";
import api from "../../lib/api";
import { useContent } from "../../lib/useContent";
import Reveal from "../../components/common/Reveal";

const WHATSAPP_NUMBER = "2348000000000";

export default function FashionAcademy() {
  const heroTitle = useContent("academy.hero.title", "Design Your Future in Fashion");
  const heroSubtitle = useContent("academy.hero.subtitle", "Learn from industry masters. Build your collection.");
  const heroCta1 = useContent("academy.hero.cta1", "Explore Programs");
  const heroCta2 = useContent("academy.hero.cta2", "Book a Tour");
  const heroVideo = useContent("academy.hero.video", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4");

  const stat1Number = useContent("academy.stats.stat1.number", "94%");
  const stat1Label = useContent("academy.stats.stat1.label", "Employment Rate");
  const stat2Number = useContent("academy.stats.stat2.number", "50+");
  const stat2Label = useContent("academy.stats.stat2.label", "Industry Partners");
  const stat3Number = useContent("academy.stats.stat3.number", "12");
  const stat3Label = useContent("academy.stats.stat3.label", "Runways");

  const program1 = {
    name: useContent("academy.program1.name", "Fashion Design & Masters"),
    duration: useContent("academy.program1.duration", "3 Years · Full Time"),
    price: useContent("academy.program1.price", "₦2,800,000"),
    description: useContent("academy.program1.description", "A comprehensive degree covering design theory, garment construction, and portfolio development."),
    category: useContent("academy.program1.category", "degree"),
    image: useContent("academy.program1.image", "https://picsum.photos/seed/academy-degree-1/500/400"),
  };
  const program2 = {
    name: useContent("academy.program2.name", "Fashion Marketing & Brand"),
    duration: useContent("academy.program2.duration", "2 Years · Full Time"),
    price: useContent("academy.program2.price", "₦1,900,000"),
    description: useContent("academy.program2.description", "Learn branding, retail strategy, and the business of building a fashion label."),
    category: useContent("academy.program2.category", "degree"),
    image: useContent("academy.program2.image", "https://picsum.photos/seed/academy-degree-2/500/400"),
  };
  const program3 = {
    name: useContent("academy.program3.name", "Pattern Cutting & Garment Construction"),
    duration: useContent("academy.program3.duration", "8 weeks"),
    price: useContent("academy.program3.price", "₦280,000"),
    description: useContent("academy.program3.description", "Master pattern drafting, fabric behavior, and precision construction from sketch to finished piece."),
    category: useContent("academy.program3.category", "short"),
    image: useContent("academy.program3.image", "https://picsum.photos/seed/academy-pattern/500/400"),
  };
  const program4 = {
    name: useContent("academy.program4.name", "Bridal Couture Techniques"),
    duration: useContent("academy.program4.duration", "6 weeks"),
    price: useContent("academy.program4.price", "₦350,000"),
    description: useContent("academy.program4.description", "A hands-on deep dive into corsetry, beading, and structured bridal silhouettes."),
    category: useContent("academy.program4.category", "short"),
    image: useContent("academy.program4.image", "https://picsum.photos/seed/academy-bridal/500/400"),
  };
  const program5 = {
    name: useContent("academy.program5.name", "Fashion Business & Entrepreneurship"),
    duration: useContent("academy.program5.duration", "4 weeks"),
    price: useContent("academy.program5.price", "₦150,000"),
    description: useContent("academy.program5.description", "Build the business behind the brand — pricing, sourcing, and scaling a label in Nigeria."),
    category: useContent("academy.program5.category", "short"),
    image: useContent("academy.program5.image", "https://picsum.photos/seed/academy-business/500/400"),
  };
  const PROGRAMS = [program1, program2, program3, program4, program5];

  const showcaseTitle = useContent("academy.showcase.title", "Student Showcase");
  const showcaseImage1 = useContent("academy.showcase.image1", "https://picsum.photos/seed/academy-show-1/500/650");
  const showcaseCaption1 = useContent("academy.showcase.caption1", "Collection 2026");
  const showcaseImage2 = useContent("academy.showcase.image2", "https://picsum.photos/seed/academy-show-2/500/650");
  const showcaseCaption2 = useContent("academy.showcase.caption2", "Concept Phase");
  const showcaseImage3 = useContent("academy.showcase.image3", "https://picsum.photos/seed/academy-show-3/500/650");
  const showcaseCaption3 = useContent("academy.showcase.caption3", "Final Runway Look");

  const facilitiesTitle = useContent("academy.facilities.title", "Campus & Facilities");
  const facilitiesIntro = useContent("academy.facilities.intro", "Industry-standard tools from day one.");
  const facilitiesImage = useContent("academy.facilities.image", "https://picsum.photos/seed/academy-lab/700/600");
  const facilitiesPoint1 = useContent("academy.facilities.point1", "Mac Labs with CLO 3D software");
  const facilitiesPoint2 = useContent("academy.facilities.point2", "Industrial sewing & pattern tables");
  const facilitiesPoint3 = useContent("academy.facilities.point3", "Fully equipped fabric library");

  const admissionsTitle = useContent("academy.admissions.title", "Admissions Process");
  const admissionsStep1 = useContent("academy.admissions.step1", "Choose Program");
  const admissionsStep2 = useContent("academy.admissions.step2", "Submit Portfolio");
  const admissionsStep3 = useContent("academy.admissions.step3", "Interview");
  const admissionsCta = useContent("academy.admissions.cta", "Download Admissions Guide");

  const testimonialQuote = useContent("academy.testimonial.quote", "The mentorship here helped me launch my label right away.");
  const testimonialAuthor = useContent("academy.testimonial.author", "Sarah J., Class of '25");
  const pressLabel1 = useContent("academy.press.label1", "VOGUE");
  const pressLabel2 = useContent("academy.press.label2", "BUSINESS OF FASHION");
  const pressLabel3 = useContent("academy.press.label3", "WWD MAGAZINE");

  const [categoryFilter, setCategoryFilter] = useState<"all" | "degree" | "short">("all");
  const filteredPrograms = PROGRAMS.filter((p) => categoryFilter === "all" || p.category === categoryFilter);

  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/inquiries/academy-interest", { name, email, phone, program: selectedProgram });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="relative flex h-[85vh] w-full items-center justify-center overflow-hidden bg-black text-center">
        <video src={heroVideo} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-6">
          <h1 className="font-heading text-3xl text-white sm:text-5xl">{heroTitle}</h1>
          <p className="mt-4 text-sm text-white/85 sm:text-base">{heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#programs" className="bg-brand-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-text transition hover:opacity-90">
              {heroCta1}
            </a>
            <a href="/contact" className="border border-white px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-brand-text">
              {heroCta2}
            </a>
          </div>
        </div>
      </div>

      <div className="bg-brand-primary py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-6 text-center">
          {[{ n: stat1Number, l: stat1Label }, { n: stat2Number, l: stat2Label }, { n: stat3Number, l: stat3Label }].map((s) => (
            <div key={s.l}>
              <p className="font-heading text-2xl text-[#f4f1e8] sm:text-3xl">{s.n}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-brand-accent">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="programs" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="font-heading text-2xl text-brand-text">Our Programs</h2>
            <div className="flex gap-2">
              {(["all", "degree", "short"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.08em] transition ${
                    categoryFilter === cat ? "border-brand-primary bg-brand-primary text-[#f4f1e8]" : "border-brand-text/20 text-brand-text"
                  }`}
                >
                  {cat === "all" ? "All Programs" : cat === "degree" ? "Degrees" : "Short Courses"}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program, i) => (
            <Reveal key={program.name} delay={i * 80}>
              <div className="border border-brand-text/10">
                <div className="aspect-[4/3] overflow-hidden bg-[#e5e1d8]">
                  <img src={program.image} alt={program.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg text-brand-text">{program.name}</h3>
                  <p className="mt-1 text-xs text-brand-text/60">{program.duration}</p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-text/70">{program.description}</p>
                  <button
                    onClick={() => { setSelectedProgram(program.name); setSubmitted(false); }}
                    className="mt-4 w-full bg-brand-primary py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="bg-brand-bg py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-heading text-2xl text-brand-text">{showcaseTitle}</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { img: showcaseImage1, cap: showcaseCaption1 },
              { img: showcaseImage2, cap: showcaseCaption2 },
              { img: showcaseImage3, cap: showcaseCaption3 },
            ].map((item, i) => (
              <Reveal key={item.cap} delay={i * 100}>
                <div className="aspect-[4/5] overflow-hidden bg-[#e5e1d8]">
                  <img src={item.img} alt={item.cap} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                </div>
                <p className="mt-3 text-sm text-brand-text">{item.cap}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-heading text-2xl text-brand-text">{facilitiesTitle}</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="aspect-[7/6] overflow-hidden bg-[#e5e1d8]">
              <img src={facilitiesImage} alt="Facilities" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-sm font-medium text-brand-text">{facilitiesIntro}</p>
            <ul className="mt-4 space-y-3 text-sm text-brand-text/70">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                {facilitiesPoint1}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                {facilitiesPoint2}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                {facilitiesPoint3}
              </li>
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="bg-brand-primary py-16 text-center">
        <Reveal>
          <h2 className="font-heading text-2xl text-[#f4f1e8]">{admissionsTitle}</h2>
        </Reveal>
        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-4 px-6 sm:flex-row">
          {[admissionsStep1, admissionsStep2, admissionsStep3].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-sm font-medium text-brand-text">
                  {i + 1}
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.08em] text-[#f4f1e8]">{step}</p>
              </div>
              {i < 2 && <span className="hidden text-[#f4f1e8]/50 sm:block">→</span>}
            </div>
          ))}
        </div>
        
         <a href="/contact"
          className="mt-10 inline-block bg-brand-accent px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-text transition hover:opacity-90"
        >
          {admissionsCta}
        </a>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <Reveal>
          <p className="font-heading text-xl italic text-brand-text sm:text-2xl">"{testimonialQuote}"</p>
          <p className="mt-3 text-sm text-brand-text/60">— {testimonialAuthor}</p>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-14 text-xs uppercase tracking-[0.15em] text-brand-text/50">As Seen In</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-8">
            <span className="font-heading text-lg text-brand-text/70">{pressLabel1}</span>
            <span className="font-heading text-lg text-brand-text/70">{pressLabel2}</span>
            <span className="font-heading text-lg text-brand-text/70">{pressLabel3}</span>
          </div>
        </Reveal>
      </div>

      {selectedProgram && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedProgram(null)}>
          <div className="relative w-full max-w-md bg-brand-bg p-8" onClick={(e) => e.stopPropagation()}>
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
                  Leave your details and our academy team will reach out with enrollment info, or message us directly on WhatsApp.
                </p>

                
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Favy Atelier, I'm interested in the "${selectedProgram}" program.`)}`}
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
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none" />
                  <button type="submit" disabled={sending} className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60">
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
