import { useState, type FormEvent } from "react";
import api from "../../lib/api";

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/inquiries/newsletter/unsubscribe", { email });
    } catch {
      // still show confirmation either way — don't leak whether an email was subscribed
    }
    setSubmitted(true);
    setSending(false);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="font-heading text-3xl text-brand-text">Unsubscribe</h1>

      {submitted ? (
        <p className="mt-6 text-sm text-brand-text/70">
          If that email was on our list, it has now been unsubscribed.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Submitting..." : "Unsubscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
