import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password, phone: phone || undefined });
      navigate("/verify-email", { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join Favy Atelier">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}

        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number (optional)"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <PasswordInput
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 6 characters)"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <PasswordInput
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-text/70">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}