import { useState, type FormEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import AuthLayout from "../../components/auth/AuthLayout";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      await api.post("/auth/verify-email", { email, code });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setResending(true);

    try {
      await api.post("/auth/resend-code", { email });
      setInfo("A new code has been sent to your email.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Verify Your Email" subtitle="Enter the 6-digit code we sent to your inbox">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}
        {info && (
          <p className="border border-brand-accent/40 bg-brand-accent/10 px-4 py-2.5 text-sm text-brand-text">
            {info}
          </p>
        )}

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <input
          type="text"
          required
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="6-digit code"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-center text-lg tracking-[0.5em] text-brand-text placeholder:text-brand-text/50 placeholder:tracking-normal focus:border-brand-accent focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-brand-text/70">
        <button
          onClick={handleResend}
          disabled={resending || !email}
          className="text-brand-accent hover:underline disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend code"}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-brand-text/70">
        <Link to="/login" className="text-brand-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}