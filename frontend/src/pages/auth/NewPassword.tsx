import { useState, type FormEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";

export default function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; code?: string } | null;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.email || !state?.code) {
    return (
      <AuthLayout title="Session Expired" subtitle="Please start the password reset process again">
        <p className="text-center">
          <Link to="/forgot-password" className="text-brand-accent hover:underline">
            Start over
          </Link>
        </p>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: state.email,
        code: state.code,
        newPassword,
        confirmPassword,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set New Password" subtitle="Choose a new password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}

        <PasswordInput
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (min. 6 characters)"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <PasswordInput
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}