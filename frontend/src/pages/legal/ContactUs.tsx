import { useState, type FormEvent } from "react";
import api from "../../lib/api";

// TODO: replace with your real WhatsApp business number
const WHATSAPP_NUMBER = "2348000000000";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/inquiries/contact", { name, email, message });
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Could not send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-center font-heading text-3xl text-brand-text">Contact Us</h1>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.15em] text-brand-accent">Get in Touch</h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-text/70">
            Have a question about an order, a bespoke piece, or anything else? Reach us directly:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-brand-text">
            <li>
              Email:{" "}
              <a href="mailto:hello@favyatelier.com" className="text-brand-accent underline">
                hello@favyatelier.com
              </a>
            </li>
            <li>Phone: +234 800 000 0000</li>
            <li>Atelier: Lagos Island, Nigeria</li>
          </ul>

          
           <a href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-fit items-center gap-2 border border-[#25D366] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[#128C7E] transition hover:bg-[#25D366]/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.05 2h-.01zm0 18.13h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 01-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.15.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.24-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43-.14 0-.31-.01-.47-.01-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.68 4.25 3.75.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.15em] text-brand-accent">Send a Message</h2>

          {submitted ? (
            <p className="mt-6 border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-text">
              Thank you — we've received your message and will respond soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
              />
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="How can we help?"
                className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}