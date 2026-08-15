import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      setAuth(user, token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue to Favy Atelier">
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

        <PasswordInput
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-brand-accent hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-text/70">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-accent hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}