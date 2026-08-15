import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../lib/adminApi";
import { useAdminAuthStore } from "../../store/adminAuthStore";
import PasswordInput from "../../components/common/PasswordInput";

export default function AdminLogin() {
  const navigate = useNavigate();
  const setAdminAuth = useAdminAuthStore((s) => s.setAdminAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminApi.post("/auth/login", { email, password });
      const { token, user } = res.data.data;

      if (user.role !== "ADMIN") {
        setError("This login is for administrators only.");
        return;
      }

      setAdminAuth(user, token);
      navigate("/admin");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2b2b26] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="font-serif text-2xl tracking-[0.1em] text-[#f4f1e8]">
            FAVY
          </span>
          <span className="ml-1 text-sm tracking-[0.3em] text-[#c9a227]">
            ADMIN
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-[#f4f1e8]/20 bg-transparent px-4 py-3 text-sm text-[#f4f1e8] placeholder:text-[#f4f1e8]/40 focus:border-[#c9a227] focus:outline-none"
          />

          <PasswordInput
            variant="dark"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-[#f4f1e8]/20 bg-transparent px-4 py-3 text-sm text-[#f4f1e8] placeholder:text-[#f4f1e8]/40 focus:border-[#c9a227] focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a227] py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#2b2b26] transition hover:bg-[#c9a227]/90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
