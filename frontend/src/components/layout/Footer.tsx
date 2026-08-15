import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { useContent } from "../../lib/useContent";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Ready-to-Wear", to: "/shop/rtw" },
      { label: "Bridals", to: "/shop/bridals" },
      { label: "Bespoke", to: "/shop/bespoke" },
      { label: "Accessories", to: "/shop/accessories" },
      { label: "Sale", to: "/shop/sales" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Atelier", to: "/atelier" },
      { label: "Press", to: "/press" },
      { label: "Careers", to: "/careers" },
      { label: "Sustainability", to: "/sustainability" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { label: "Sizing Guide", to: "/sizing-guide" },
      { label: "Shipping & Returns", to: "/shipping-returns" },
      { label: "Care Instructions", to: "/care-instructions" },
      { label: "FAQs", to: "/faqs" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const tagline = useContent(
    "footer.tagline",
    "Haute couture and ready-to-wear for the contemporary African woman. Made with love on Lagos Island."
  );

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.post("/inquiries/newsletter", { email });
    } catch {
      // fail silently
    }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-brand-primary text-[#f4f1e8]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.3fr] md:gap-10">
        <div>
          <Link to="/" className="inline-block leading-none">
            <span className="font-heading text-xl tracking-[0.1em] text-[#f4f1e8]">FAVY</span>{" "}
            <span className="font-heading text-xl tracking-[0.1em] text-brand-accent">ATELIER</span>
          </Link>
          <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-[#f4f1e8]/75">{tagline}</p>
          <div className="mt-5 flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-brand-accent transition hover:text-[#f4f1e8]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76c-.5.5-1.1.9-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.76-1.15 4.9 4.9 0 01-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76a4.9 4.9 0 011.76-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.4a1.17 1.17 0 100-2.33 1.17 1.17 0 000 2.33z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-brand-accent transition hover:text-[#f4f1e8]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-brand-accent transition hover:text-[#f4f1e8]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5L6.1 22H3l8.1-9.3L2.6 2h6.6l4.5 6L18.9 2zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20z"/></svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:contents">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[10px] uppercase tracking-[0.1em] text-brand-accent sm:text-xs sm:tracking-[0.15em]">
                {col.heading}
              </h4>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-[#f4f1e8]/85 transition hover:text-[#f4f1e8] sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.15em] text-brand-accent">Stay Connected</h4>
          <p className="mt-4 text-sm leading-relaxed text-[#f4f1e8]/75">
            First access to new arrivals, exclusive events, and atelier news.
          </p>

          {subscribed ? (
            <p className="mt-4 text-sm text-brand-accent">You're on the list — thank you!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full border border-[#f4f1e8]/25 bg-transparent px-3 py-2.5 text-sm text-[#f4f1e8] placeholder:text-[#f4f1e8]/50 focus:border-brand-accent focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-brand-accent px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-text transition hover:opacity-90"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-[#f4f1e8]/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-[#f4f1e8]/60 md:flex-row">
          <p>© {new Date().getFullYear()} Favy Atelier. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/privacy-policy" className="transition hover:text-[#f4f1e8]">Privacy Policy</Link>
            <Link to="/terms-of-service" className="transition hover:text-[#f4f1e8]">Terms of Service</Link>
            <Link to="/cookie-preferences" className="transition hover:text-[#f4f1e8]">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
