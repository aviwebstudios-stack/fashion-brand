import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import AuthLayout from "../../components/auth/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      navigate("/verify-reset-code", { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset code"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-text/70">
        <Link to="/login" className="text-brand-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}