import { useState, useEffect, type FormEvent } from "react";
import api from "../../lib/api";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("fb_newsletter_shown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem("fb_newsletter_shown", "true");
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.post("/inquiries/newsletter", { email, firstName, lastName, interests });
    } catch {
      // fail silently
    }
    setSubmitted(true);
    setTimeout(close, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" onClick={close}>
      <div className="relative w-full max-w-md bg-brand-bg p-8" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-brand-text/60 transition hover:bg-black/5 hover:text-brand-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-10 text-center">
            <p className="font-heading text-xl text-brand-text">Welcome to the atelier.</p>
            <p className="mt-2 text-sm text-brand-text/70">Check your inbox for your 10% off code.</p>
          </div>
        ) : (
          <>
            <h2 className="font-heading text-2xl leading-snug text-brand-text">10% off your first order</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-text/70">
              Sign up for the Favy Atelier newsletter and be the first to discover new
              collections, exclusive offers, and behind-the-scenes insights.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
              />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-brand-text/20 bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
              />

              <div className="pt-1">
                <p className="text-sm font-medium text-brand-text">
                  What are you most interested in?
                </p>
                <div className="mt-2 space-y-2">
                  {["Ready-to-Wear", "Bespoke & Bridals"].map((interest) => (
                    <label key={interest} className="flex items-center gap-2 text-sm text-brand-text/80">
                      <input
                        type="checkbox"
                        checked={interests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                        className="h-4 w-4 accent-brand-accent"
                      />
                      {interest}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}